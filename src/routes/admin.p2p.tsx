import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/admin/p2p")({
  head: () => ({
    meta: [
      { title: "P2P Communication — Smart Food Court" },
      { name: "description", content: "Simple peer-to-peer chat between the Pizza Stall and Burger Stall for stock coordination." },
      { property: "og:title", content: "P2P Communication — Smart Food Court" },
      { property: "og:description", content: "Simple peer-to-peer chat between two food stalls." },
    ],
  }),
  component: P2PPage,
});

type Message = { from: "Pizza Stall" | "Burger Stall"; text: string };

const INITIAL: Message[] = [
  { from: "Pizza Stall", text: "Do you have 5 burger buns available?" },
  { from: "Burger Stall", text: "Yes, 5 are available." },
];

function P2PPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [text, setText] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "Pizza Stall", text: text.trim() }]);
    setText("");
  };

  return (
    <AppLayout role="admin" title="P2P Communication">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-sm font-medium">Pizza Stall ←→ Burger Stall</p>
          <StatusBadge label="Connected" tone="green" />
        </div>

        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.from === "Pizza Stall"
                  ? "bg-muted"
                  : "ml-auto bg-success-soft text-success"
              }`}
            >
              <p className="text-xs font-medium opacity-80">{m.from}</p>
              <p>{m.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={send} className="flex gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type message..." />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </AppLayout>
  );
}
