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
import { STALLS, stallName, type StallId } from "@/lib/data";
import { useP2P } from "@/lib/p2p";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/stall/p2p")({
  head: () => ({
    meta: [
      { title: "Stall Messages — Smart Food Court" },
      { name: "description", content: "Send and receive coordination messages with other food court stalls." },
      { property: "og:title", content: "Stall Messages — Smart Food Court" },
      { property: "og:description", content: "Peer-to-peer coordination between food court stalls." },
    ],
  }),
  component: StallP2P,
});

function StallP2P() {
  const { user } = useApp();
  const me = (user?.stall ?? "pizza") as StallId;
  const others = STALLS.filter((s) => s.id !== me);
  const [peer, setPeer] = useState<StallId>(others[0].id);
  const [text, setText] = useState("");
  const { messages, send } = useP2P();

  const thread = messages.filter(
    (m) => (m.from === me && m.to === peer) || (m.from === peer && m.to === me),
  );
  const unreadFrom = STALLS.filter(
    (s) => s.id !== me && messages.some((m) => m.from === s.id && m.to === me),
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    send(me, peer, text.trim());
    setText("");
  };

  return (
    <AppLayout role="staff" title="Stall Messages">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <p className="text-sm font-medium">You are {stallName(me)}</p>
          <StatusBadge label="Connected" tone="green" />
        </div>

        {unreadFrom.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Messages received from: {unreadFrom.map((s) => s.name).join(", ")}
          </p>
        )}

        <div className="space-y-1.5 rounded-lg border border-border bg-card p-4">
          <Label className="text-xs">Chat with</Label>
          <Select value={peer} onValueChange={(v) => setPeer(v as StallId)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {others.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-h-[220px] space-y-3 rounded-lg border border-border bg-card p-4">
          {thread.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No messages yet. Send one — {stallName(peer)} will see it when they log in.
            </p>
          )}
          {thread.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.from === me ? "ml-auto bg-success-soft text-success" : "bg-muted"
              }`}
            >
              <p className="text-xs font-medium opacity-80">
                {stallName(m.from)} · {m.time}
              </p>
              <p>{m.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${stallName(peer)}...`}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </AppLayout>
  );
}
