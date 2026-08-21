import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEMO_ACCOUNTS, MENU, type FoodItem, type StallId, type User } from "./data";

export type SubStatus = "new" | "accepted" | "preparing" | "ready" | "completed";
export type OverallStatus = "Order Placed" | "Confirmed" | "Preparing" | "Ready" | "Collected";

export type CartItem = { itemId: string; name: string; stall: StallId; price: number; qty: number };

export type SubOrder = {
  id: string;
  stall: StallId;
  items: CartItem[];
  status: SubStatus;
};

export type Order = {
  id: string;
  student: string;
  time: string;
  total: number;
  subOrders: SubOrder[];
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
  if (s.some((x) => x !== "new")) return "Confirmed";
  return "Order Placed";
}

export const STATUS_STEPS: OverallStatus[] = [
  "Order Placed",
  "Confirmed",
  "Preparing",
  "Ready",
  "Collected",
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

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
        // Split one order into sub-orders, one per stall (order distribution).
        const stalls = Array.from(new Set(state.cart.map((c) => c.stall)));
        const subOrders: SubOrder[] = stalls.map((stall) => ({
          id: `${id}-${stall.toUpperCase()}`,
          stall,
          items: state.cart.filter((c) => c.stall === stall),
          status: "new",
        }));
        const order: Order = {
          id,
          student: state.user?.name ?? "Student",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          total: cartTotal,
          subOrders,
        };
        setState((s) => ({ ...s, orders: [order, ...s.orders], cart: [], counter: s.counter + 1 }));
        return order;
      },
      updateSubOrder: (orderId, subId, status) =>
        setState((s) => ({
          ...s,
          orders: s.orders.map((o) =>
            o.id === orderId
              ? { ...o, subOrders: o.subOrders.map((sub) => (sub.id === subId ? { ...sub, status } : sub)) }
              : o,
          ),
        })),
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
