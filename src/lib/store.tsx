import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DEMO_ACCOUNTS, MENU, type FoodItem, type StallId, type User } from "./data";
import { drainQueue, dsLog, publishSubOrder } from "./ds";
import { readShared, subscribeShared, writeShared } from "./sync";

export type SubStatus = "pending" | "new" | "accepted" | "preparing" | "ready" | "completed";
export type OverallStatus = "Order Placed" | "Confirmed" | "Preparing" | "Ready" | "Collected";

export type CartItem = { itemId: string; name: string; stall: StallId; price: number; qty: number };

export type SubOrder = {
  id: string;
  stall: StallId;
  items: CartItem[];
  status: SubStatus;
  /** Version stamp used to resolve cross-window merge conflicts. */
  updatedAt: number;
};

export type Order = {
  id: string;
  student: string;
  time: string;
  total: number;
  subOrders: SubOrder[];
  updatedAt: number;
};

const STORAGE_KEY = "sfc-state-v1";

type State = { user: User | null; cart: CartItem[]; orders: Order[]; counter: number };

const initialState: State = { user: null, cart: [], orders: [], counter: 1001 };

type Ctx = State & {
  login: (u: string, p: string) => User | null;
  logout: () => void;
  addToCart: (item: FoodItem) => void;
  setQty: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  checkout: () => Order | null;
  updateSubOrder: (orderId: string, subId: string, status: SubStatus) => void;
  cartCount: number;
  cartTotal: number;
};

const AppContext = createContext<Ctx | null>(null);

export function overallStatus(order: Order): OverallStatus {
  const s = order.subOrders.map((x) => x.status);
  if (s.every((x) => x === "completed")) return "Collected";
  if (s.every((x) => x === "ready" || x === "completed")) return "Ready";
  if (s.some((x) => x === "preparing")) return "Preparing";
  if (s.some((x) => x !== "new" && x !== "pending")) return "Confirmed";
  return "Order Placed";
}

export const STATUS_STEPS: OverallStatus[] = [
  "Order Placed",
  "Confirmed",
  "Preparing",
  "Ready",
  "Collected",
];

/**
 * Merge incoming (remote) orders into the local list without ever letting an
 * older version overwrite a newer one. Matching is by order.id / subOrder.id.
 */
export function mergeOrders(local: Order[], incoming: Order[]): Order[] {
  const byId = new Map<string, Order>();
  for (const o of local) byId.set(o.id, o);

  for (const remote of incoming) {
    const mine = byId.get(remote.id);
    if (!mine) {
      byId.set(remote.id, remote);
      continue;
    }
    const subs = new Map<string, SubOrder>();
    for (const s of mine.subOrders) subs.set(s.id, s);
    for (const rs of remote.subOrders) {
      const ms = subs.get(rs.id);
      if (!ms || (rs.updatedAt ?? 0) > (ms.updatedAt ?? 0)) subs.set(rs.id, rs);
    }
    const merged: Order[] = [];
    void merged;
    byId.set(remote.id, {
      ...((remote.updatedAt ?? 0) > (mine.updatedAt ?? 0) ? remote : mine),
      subOrders: [...subs.values()],
      updatedAt: Math.max(mine.updatedAt ?? 0, remote.updatedAt ?? 0),
    });
  }

  // Keep newest-first ordering by creation/update stamp, falling back to local order.
  const order = [...byId.values()];
  order.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  return order;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [loaded, setLoaded] = useState(false);
  const lastShared = useRef<string>("");

  useEffect(() => {
    let next: State = { ...initialState };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) next = { ...next, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
    // Shared orders (written by any window) win over the per-window snapshot.
    const shared = readShared<Order>();
    if (shared) {
      next = {
        ...next,
        orders: mergeOrders(next.orders ?? [], shared.orders),
        counter: Math.max(next.counter ?? 1001, shared.counter),
      };
    }
    setState(next);
    setLoaded(true);
  }, []);

  // Persist per-window state (user + cart stay local to this window).
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  // Publish shared orders to other windows whenever they change locally.
  useEffect(() => {
    if (!loaded) return;
    const snapshot = JSON.stringify({ orders: state.orders, counter: state.counter });
    if (snapshot === lastShared.current) return;
    lastShared.current = snapshot;
    writeShared(state.orders, state.counter);
  }, [state.orders, state.counter, loaded]);

  // Receive shared orders from other windows and merge them in.
  useEffect(() => {
    if (!loaded) return;
    const unsubscribe = subscribeShared<Order>(({ orders, counter }) => {
      setState((s) => {
        const merged = mergeOrders(s.orders, orders);
        const snapshot = JSON.stringify({ orders: merged, counter: Math.max(s.counter, counter) });
        // Mark as already-shared so receiving does not echo back a broadcast.
        lastShared.current = snapshot;
        return { ...s, orders: merged, counter: Math.max(s.counter, counter) };
      });
    });
    return unsubscribe;
  }, [loaded]);

  // Coordinator dispatcher: drains the message queue via RPC, retries failed
  // deliveries and moves delivered sub-orders from "pending" to "new".
  useEffect(() => {
    if (!loaded) return;
    let running = false;
    const tick = async () => {
      if (running) return;
      running = true;
      try {
        const { delivered } = await drainQueue();
        if (delivered.length > 0) {
          setState((s) => ({
            ...s,
            orders: s.orders.map((o) => ({
              ...o,
              subOrders: o.subOrders.map((sub) =>
                delivered.includes(sub.id) && sub.status === "pending"
                  ? { ...sub, status: "new" as SubStatus, updatedAt: Date.now() }
                  : sub,
              ),
            })),
          }));
        }
      } catch {
        /* never crash the app on a delivery failure */
      } finally {
        running = false;
      }
    };
    void tick();
    const t = window.setInterval(() => void tick(), 3000);
    return () => window.clearInterval(t);
  }, [loaded]);

  const value: Ctx = useMemo(() => {
    const cartTotal = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    return {
      ...state,
      cartCount: state.cart.reduce((n, i) => n + i.qty, 0),
      cartTotal,
      login: (username, password) => {
        const found = DEMO_ACCOUNTS.find(
          (a) => a.username === username.trim() && a.password === password,
        );
        if (!found) return null;
        setState((s) => ({ ...s, user: found.user }));
        return found.user;
      },
      logout: () => setState((s) => ({ ...s, user: null, cart: [] })),
      addToCart: (item) =>
        setState((s) => {
          const existing = s.cart.find((c) => c.itemId === item.id);
          const cart = existing
            ? s.cart.map((c) => (c.itemId === item.id ? { ...c, qty: c.qty + 1 } : c))
            : [...s.cart, { itemId: item.id, name: item.name, stall: item.stall, price: item.price, qty: 1 }];
          return { ...s, cart };
        }),
      setQty: (itemId, qty) =>
        setState((s) => ({
          ...s,
          cart: s.cart
            .map((c) => (c.itemId === itemId ? { ...c, qty: Math.max(0, qty) } : c))
            .filter((c) => c.qty > 0),
        })),
      removeFromCart: (itemId) =>
        setState((s) => ({ ...s, cart: s.cart.filter((c) => c.itemId !== itemId) })),
      clearCart: () => setState((s) => ({ ...s, cart: [] })),
      checkout: () => {
        if (state.cart.length === 0) return null;
        const id = `ORD-${state.counter}`;
        const now = Date.now();
        // Split one order into sub-orders, one per stall (order distribution).
        const stalls = Array.from(new Set(state.cart.map((c) => c.stall)));
        const subOrders: SubOrder[] = stalls.map((stall) => ({
          id: `${id}-${stall.toUpperCase()}`,
          stall,
          items: state.cart.filter((c) => c.stall === stall),
          // Delivery is asynchronous: the sub-order stays PENDING until the
          // message queue + RPC hand-off to the stall service succeeds.
          status: "pending",
          updatedAt: now,
        }));
        const order: Order = {
          id,
          student: state.user?.name ?? "Student",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          total: cartTotal,
          subOrders,
          updatedAt: now,
        };
        setState((s) => ({ ...s, orders: [order, ...s.orders], cart: [], counter: s.counter + 1 }));
        dsLog("MOC", `Order Coordinator split ${id} into ${subOrders.length} sub-order(s)`);
        for (const sub of subOrders) {
          publishSubOrder({
            orderId: id,
            subId: sub.id,
            stall: sub.stall,
            items: sub.items.map((i) => ({ name: i.name, quantity: i.qty })),
          });
        }
        return order;
      },
      updateSubOrder: (orderId, subId, status) =>
        setState((s) => {
          const now = Date.now();
          return {
            ...s,
            orders: s.orders.map((o) =>
              o.id === orderId
                ? {
                    ...o,
                    updatedAt: now,
                    subOrders: o.subOrders.map((sub) =>
                      sub.id === subId ? { ...sub, status, updatedAt: now } : sub,
                    ),
                  }
                : o,
            ),
          };
        }),
    };
  }, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function itemLabel(items: CartItem[]) {
  return items.map((i) => `${i.name} x${i.qty}`).join(", ");
}

export const menuById = (id: string) => MENU.find((m) => m.id === id);
