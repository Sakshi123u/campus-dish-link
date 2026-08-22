import { useCallback, useEffect, useState } from "react";
import { STALLS, type StallId } from "./data";

export type P2PMessage = {
  id: string;
  from: StallId;
  to: StallId;
  text: string;
  time: string;
};

const KEY = "sfc-p2p-v1";

export const STALL_IDS = STALLS.map((s) => s.id) as StallId[];

function read(): P2PMessage[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as P2PMessage[]) : [];
  } catch {
    return [];
  }
}

/**
 * Shared inter-stall message log. Each stall node reads/writes the same
 * channel, so a message sent from one stall's session appears in the other
 * stall's session (and in the admin monitor) without any local auto-replies.
 */
export function useP2P() {
  const [messages, setMessages] = useState<P2PMessage[]>([]);

  useEffect(() => {
    setMessages(read());
    const sync = () => setMessages(read());
    window.addEventListener("storage", sync);
    const t = window.setInterval(sync, 1000);
    return () => {
      window.removeEventListener("storage", sync);
      window.clearInterval(t);
    };
  }, []);

  const send = useCallback((from: StallId, to: StallId, text: string) => {
    const msg: P2PMessage = {
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      from,
      to,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const next = [...read(), msg];
    localStorage.setItem(KEY, JSON.stringify(next));
    setMessages(next);
  }, []);

  return { messages, send };
}
