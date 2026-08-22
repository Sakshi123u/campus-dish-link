import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { stallName } from "@/lib/data";
import { useP2P } from "@/lib/p2p";

export const Route = createFileRoute("/admin/p2p")({
  head: () => ({
    meta: [
      { title: "P2P Communication — Smart Food Court" },
      { name: "description", content: "Monitor peer-to-peer messages exchanged between food court stalls." },
      { property: "og:title", content: "P2P Communication — Smart Food Court" },
      { property: "og:description", content: "Live log of inter-stall coordination messages." },
    ],
  }),
  component: P2PPage,
});

function P2PPage() {
  const { messages } = useP2P();

  return (
    <AppLayout role="admin" title="P2P Communication">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm font-medium">Inter-Stall Coordination Channel</p>
            <p className="text-xs text-muted-foreground">
              Live log of messages sent between stall nodes
            </p>
          </div>
          <StatusBadge label="Connected" tone="green" />
        </div>

        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">To</th>
                <th className="px-4 py-3 font-medium">Message</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No messages exchanged yet. Stalls send messages from their own logins.
                  </td>
                </tr>
              )}
              {[...messages].reverse().map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{m.time}</td>
                  <td className="px-4 py-3 font-medium">{stallName(m.from)}</td>
                  <td className="px-4 py-3">{stallName(m.to)}</td>
                  <td className="px-4 py-3">{m.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
