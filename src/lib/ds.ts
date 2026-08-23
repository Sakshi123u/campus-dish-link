import { useCallback, useEffect, useState } from "react";
import { STALLS, type StallId } from "./data";

/**
 * Distributed-systems layer for Smart Food Court.
 *
 *  RPC  -> real HTTP call from the Order Coordinator to a Stall Service
 *          endpoint (/api/public/stall-rpc) exposing assignSubOrder /
 *          getSubOrderStatus.
 *  MOC  -> durable message queue (broker) the Coordinator publishes
 *          sub-order messages to; stall services consume from it.
 *  FAULT TOLERANCE -> per-service ONLINE/OFFLINE state, pending messages,
 *          bounded retries and automatic retry on recovery.
 */

export type ServiceId = "coordinator" | StallId | "queue" | "database" | "stream";

export type ServiceInfo = {
  id: ServiceId;
  name: string;
  type: string;
  address: string;
  latency: number;
  toggleable: boolean;
};

export const SERVICES_DS: ServiceInfo[] = [
  { id: "coordinator", name: "Order Coordinator", type: "Service", address: "localhost:8000", latency: 28, toggleable: true },
  ...STALLS.map((s, i) => ({
    id: s.id as ServiceId,
    name: `${s.name} Service`,
    type: "Service",
    address: s.address,
    latency: 30 + i * 2,
    toggleable: true,
  })),
  { id: "queue", name: "Message Queue", type: "MQ", address: "localhost:6379", latency: 10, toggleable: false },
  { id: "database", name: "Database", type: "Database", address: "localhost:5432", latency: 12, toggleable: false },
  { id: "stream", name: "WebSocket Server", type: "Stream", address: "localhost:7000", latency: 22, toggleable: false },
];

const SERVICES_KEY = "sfc-services-v1";
const QUEUE_KEY = "sfc-mq-v1";
const LOG_KEY = "sfc-ds-log-v1";

export type LogKind = "RPC" | "MOC" | "FAULT" | "RETRY" | "RECOVERY";
export type DsLog = { id: string; kind: LogKind; text: string; time: string };

export type QueueMessage = {
  id: string;
  type: "NEW_SUB_ORDER";
  orderId: string;
  subId: string;
  stall: StallId;
  items: { name: string; quantity: number }[];
  timestamp: string;
  retryCount: number;
  status: "queued" | "delivered" | "failed";
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------------------------------- logs --------------------------------- */

export function readLogs(): DsLog[] {
  return readJson<DsLog[]>(LOG_KEY, []);
}

export function dsLog(kind: LogKind, text: string) {
  const entry: DsLog = {
    id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    kind,
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
  // eslint-disable-next-line no-console
  console.log(`[${kind}] ${text}`);
  writeJson(LOG_KEY, [...readLogs(), entry].slice(-100));
}

/* ------------------------------ service state ---------------------------- */

export type ServiceState = Record<string, boolean>; // id -> online

export function readServices(): ServiceState {
  const stored = readJson<ServiceState>(SERVICES_KEY, {});
  const state: ServiceState = {};
  for (const s of SERVICES_DS) state[s.id] = stored[s.id] ?? true;
  return state;
}

export function isOnline(id: ServiceId): boolean {
  return readServices()[id] !== false;
}

export function setServiceOnline(id: ServiceId, online: boolean) {
  const next = { ...readServices(), [id]: online };
  writeJson(SERVICES_KEY, next);
  const name = SERVICES_DS.find((s) => s.id === id)?.name ?? id;
  if (online) {
    dsLog("RECOVERY", `${name} is back ONLINE`);
    // Recovery resets retry budgets so pending work is retried immediately.
    writeJson(
      QUEUE_KEY,
      readQueue().map((m) =>
        m.stall === (id as StallId) && m.status !== "delivered"
          ? { ...m, retryCount: 0, status: "queued" as const }
          : m,
      ),
    );
  } else {
    dsLog("FAULT", `${name} is unavailable`);
  }
}

/* ----------------------------- message queue ----------------------------- */

export const MAX_RETRIES = 3;

export function readQueue(): QueueMessage[] {
  return readJson<QueueMessage[]>(QUEUE_KEY, []);
}

function writeQueue(msgs: QueueMessage[]) {
  writeJson(QUEUE_KEY, msgs);
}

/** MOC: Order Coordinator publishes a sub-order message to the broker. */
export function publishSubOrder(msg: Omit<QueueMessage, "id" | "retryCount" | "status" | "type" | "timestamp">) {
  const message: QueueMessage = {
    ...msg,
    id: `${Date.now()}-${msg.subId}`,
    type: "NEW_SUB_ORDER",
    timestamp: new Date().toISOString(),
    retryCount: 0,
    status: "queued",
  };
  dsLog("MOC", `Order Coordinator → Message Queue`);
  dsLog("MOC", `Published: ${message.subId}`);
  writeQueue([...readQueue(), message]);
}

/* ---------------------------------- RPC ---------------------------------- */

type RpcResult = { ok: boolean; status?: string; error?: string };

/** RPC: remote procedure invoked on a Stall Service over HTTP. */
export async function rpcCall(
  procedure: "assignSubOrder" | "getSubOrderStatus",
  payload: { stall: StallId; orderId: string; subId: string; items?: { name: string; quantity: number }[] },
): Promise<RpcResult> {
  const name = SERVICES_DS.find((s) => s.id === payload.stall)?.name ?? payload.stall;
  dsLog("RPC", `Order Coordinator → ${name}`);
  dsLog("RPC", `${procedure}(${payload.subId})`);

  if (!isOnline("coordinator")) return { ok: false, error: "Coordinator offline" };
  if (!isOnline(payload.stall)) {
    dsLog("RPC", `${name} → Coordinator: UNAVAILABLE`);
    return { ok: false, error: "Service unavailable" };
  }

  try {
    const res = await fetch("/api/public/stall-rpc", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ procedure, ...payload }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { status: string };
    dsLog("RPC", `${name} → Coordinator: ${data.status}`);
    return { ok: true, status: data.status };
  } catch (e) {
    dsLog("RPC", `${name} → Coordinator: FAILED (${(e as Error).message})`);
    return { ok: false, error: (e as Error).message };
  }
}

/* ------------------------- dispatcher / retries -------------------------- */

/**
 * Drains the queue: for each undelivered message the Coordinator performs an
 * RPC to the stall service. Failures are preserved and retried (max 3), and a
 * recovered service resets the retry budget so pending work resumes.
 * Returns the sub-order ids that were successfully delivered.
 */
export async function drainQueue(): Promise<{ delivered: string[]; pending: string[] }> {
  const queue = readQueue();
  const delivered: string[] = [];
  const pending: string[] = [];

  for (const msg of queue) {
    if (msg.status === "delivered") continue;
    if (msg.status === "failed" && msg.retryCount >= MAX_RETRIES) {
      pending.push(msg.subId);
      continue;
    }
    if (msg.retryCount > 0) dsLog("RETRY", `Retrying ${msg.subId} (attempt ${msg.retryCount + 1})`);

    const result = await rpcCall("assignSubOrder", {
      stall: msg.stall,
      orderId: msg.orderId,
      subId: msg.subId,
      items: msg.items,
    });

    const current = readQueue();
    if (result.ok) {
      dsLog("MOC", `${SERVICES_DS.find((s) => s.id === msg.stall)?.name} consumed: ${msg.subId}`);
      if (msg.retryCount > 0) dsLog("RETRY", `${msg.subId} successfully delivered`);
      delivered.push(msg.subId);
      writeQueue(current.map((m) => (m.id === msg.id ? { ...m, status: "delivered" as const } : m)));
    } else {
      const retryCount = msg.retryCount + 1;
      const status = retryCount >= MAX_RETRIES ? ("failed" as const) : ("queued" as const);
      if (retryCount === 1) dsLog("FAULT", `${msg.subId} moved to PENDING`);
      pending.push(msg.subId);
      writeQueue(current.map((m) => (m.id === msg.id ? { ...m, retryCount, status } : m)));
    }
  }

  return { delivered, pending };
}

/* ------------------------------- react hooks ----------------------------- */

export function useDsMonitor() {
  const [services, setServices] = useState<ServiceState>({});
  const [logs, setLogs] = useState<DsLog[]>([]);
  const [queue, setQueue] = useState<QueueMessage[]>([]);

  useEffect(() => {
    const sync = () => {
      setServices(readServices());
      setLogs(readLogs());
      setQueue(readQueue());
    };
    sync();
    window.addEventListener("storage", sync);
    const t = window.setInterval(sync, 1000);
    return () => {
      window.removeEventListener("storage", sync);
      window.clearInterval(t);
    };
  }, []);

  const toggle = useCallback((id: ServiceId, online: boolean) => {
    setServiceOnline(id, online);
    setServices(readServices());
    setLogs(readLogs());
  }, []);

  return { services, logs, queue, toggle };
}
