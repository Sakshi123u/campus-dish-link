// Cross-window synchronization for the shared orders state.
//
// BroadcastChannel is the real-time transport; localStorage is persistence and
// a fallback for browsers without BroadcastChannel (the `storage` event fires
// in every OTHER window of the same origin).

export const SHARED_KEY = "sfc-shared-orders-v1";
const CHANNEL_NAME = "sfc-orders";

export type SharedPayload<T> = { orders: T[]; counter: number; from: string };

export const WINDOW_ID =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function readShared<T>(): { orders: T[]; counter: number } | null {
  try {
    const raw = localStorage.getItem(SHARED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SharedPayload<T>;
    if (!Array.isArray(parsed.orders)) return null;
    return { orders: parsed.orders, counter: parsed.counter ?? 1001 };
  } catch {
    return null;
  }
}

export function writeShared<T>(orders: T[], counter: number) {
  const payload: SharedPayload<T> = { orders, counter, from: WINDOW_ID };
  try {
    localStorage.setItem(SHARED_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota errors */
  }
  try {
    getChannel()?.postMessage({ type: "ORDERS_UPDATED", ...payload });
  } catch {
    /* ignore */
  }
}

let channel: BroadcastChannel | null = null;
function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === "undefined") return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
}

/** Subscribe to remote order updates. Returns an unsubscribe cleanup fn. */
export function subscribeShared<T>(
  onRemote: (payload: { orders: T[]; counter: number }) => void,
): () => void {
  const bc = getChannel();
  const onMessage = (e: MessageEvent) => {
    const data = e.data as (SharedPayload<T> & { type?: string }) | null;
    if (!data || data.type !== "ORDERS_UPDATED") return;
    if (data.from === WINDOW_ID) return;
    onRemote({ orders: data.orders, counter: data.counter });
  };
  bc?.addEventListener("message", onMessage);

  // Fallback: storage events fire in other windows even without BroadcastChannel.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== SHARED_KEY || !e.newValue) return;
    try {
      const data = JSON.parse(e.newValue) as SharedPayload<T>;
      if (data.from === WINDOW_ID) return;
      onRemote({ orders: data.orders, counter: data.counter });
    } catch {
      /* ignore */
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    bc?.removeEventListener("message", onMessage);
    window.removeEventListener("storage", onStorage);
  };
}
