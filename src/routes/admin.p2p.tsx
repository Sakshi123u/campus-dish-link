import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";

export const Route = createFileRoute("/admin/p2p")({
  head: () => ({
    meta: [
      { title: "P2P Communication — Smart Food Court" },
      { name: "description", content: "Peer-to-peer chat between all food court stalls for stock coordination." },
      { property: "og:title", content: "P2P Communication — Smart Food Court" },
      { property: "og:description", content: "Peer-to-peer chat between all food court stalls." },
    ],
  }),
  component: P2PPage,
});

const STALL_NAMES = [
  "Pizza Stall",
  "Burger Stall",
  "Beverage Stall",
  "Snack Corner",
  "Dessert House",
] as const;

type StallName = (typeof STALL_NAMES)[number];

type Message = { from: StallName; to: StallName; text: string };

const INITIAL: Message[] = [
  { from: "Pizza Stall", to: "Burger Stall", text: "Do you have 5 burger buns available?" },
  { from: "Burger Stall", to: "Pizza Stall", text: "Yes, 5 are available." },
  { from: "Snack Corner", to: "Beverage Stall", text: "Sending samosa platter, need 2 cold coffees to pair." },
  { from: "Beverage Stall", to: "Snack Corner", text: "Got it, 2 cold coffees ready in 5 min." },
];

function P2PPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [text, setText] = useState("");
  const [from, setFrom] = useState<StallName>("Pizza Stall");
  const [to, setTo] = useState<StallName>("Burger Stall");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || from === to) return;
    const sender = from;
    const peer = to;
    const body = text.trim();
    setMessages((m) => [...m, { from: sender, to: peer, text: body }]);
    setText("");
    // peer node acknowledges automatically (simulated remote stall response)
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: peer,
          to: sender,
          text: `ACK from ${peer}: received "${body}" — will confirm shortly.`,
        },
      ]);
    }, 1200);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };


  // conversation filter: show messages between the selected pair (either direction)
  const thread = messages.filter(
    (m) =>
      (m.from === from && m.to === to) || (m.from === to && m.to === from),
  );

  return (
    <AppLayout role="admin" title="P2P Communication">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-sm font-medium">Inter-Stall Coordination Channel</p>
          <StatusBadge label="Connected" tone="green" />
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-card p-4">
          <div className="space-y-1.5">
            <Label className="text-xs">From</Label>
            <Select value={from} onValueChange={(v) => setFrom(v as StallName)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STALL_NAMES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">To</Label>
            <Select value={to} onValueChange={(v) => setTo(v as StallName)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STALL_NAMES.map((s) => (
                  <SelectItem key={s} value={s} disabled={s === from}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2">
          <p className="text-xs text-muted-foreground">
            {from} ←→ {to}
          </p>
          {from === to ? (
            <span className="text-xs text-destructive">Select two different stalls</span>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={swap}>
              Reply as {to}
            </Button>
          )}
        </div>


        <div className="space-y-3 rounded-lg border border-border bg-card p-4 min-h-[200px]">
          {thread.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages in this channel yet.
            </p>
          )}
          {thread.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.from === from
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
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message from ${from} to ${to}...`}
            disabled={from === to}
          />
          <Button type="submit" disabled={from === to}>
            Send
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
