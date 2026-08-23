import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { SERVICES_DS, useDsMonitor } from "@/lib/ds";

export const Route = createFileRoute("/admin/monitor")({
  head: () => ({
    meta: [
      { title: "System Monitor — Smart Food Court" },
      { name: "description", content: "System monitor showing each distributed service, its address, status and latency, with failure simulation and recovery." },
      { property: "og:title", content: "System Monitor — Smart Food Court" },
      { property: "og:description", content: "Distributed services, status, latency, failure simulation and retry logs." },
    ],
  }),
  component: SystemMonitor,
});

const KIND_TONE: Record<string, "green" | "blue" | "orange" | "red" | "gray"> = {
  RPC: "blue",
  MOC: "green",
  FAULT: "red",
  RETRY: "orange",
  RECOVERY: "green",
};

function SystemMonitor() {
  const { services, logs, queue, toggle } = useDsMonitor();
  const heartbeat = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const pending = queue.filter((m) => m.status !== "delivered");

  return (
    <AppLayout role="admin" title="System Monitor">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h2 className="mb-3 text-base font-semibold">System Status</h2>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Latency</th>
                  <th className="px-4 py-3 font-medium">Last Heartbeat</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {SERVICES_DS.map((s) => {
                  const online = services[s.id] !== false;
                  return (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.address}</td>
                      <td className="px-4 py-3">
                        <StatusBadge label={online ? "Online" : "OFFLINE"} tone={online ? "green" : "red"} />
                      </td>
                      <td className="px-4 py-3">{online ? `${s.latency} ms` : "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{online ? heartbeat : "—"}</td>
                      <td className="px-4 py-3">
                        {s.toggleable ? (
                          <Button
                            size="sm"
                            variant={online ? "outline" : "default"}
                            onClick={() => toggle(s.id, !online)}
                          >
                            {online ? "Simulate Failure" : "Recover"}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-base font-semibold">
            Message Queue{" "}
            <span className="text-sm font-normal text-muted-foreground">
              ({pending.length} pending, {queue.length} total)
            </span>
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Sub-Order</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Retries</th>
                  <th className="px-4 py-3 font-medium">State</th>
                </tr>
              </thead>
              <tbody>
                {queue.slice(-8).reverse().map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{m.subId}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.type}</td>
                    <td className="px-4 py-3">{m.retryCount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={m.status}
                        tone={m.status === "delivered" ? "green" : m.status === "failed" ? "red" : "orange"}
                      />
                    </td>
                  </tr>
                ))}
                {queue.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No messages published yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-base font-semibold">Communication Log</h2>
          <div className="max-h-80 overflow-y-auto rounded-lg border border-border bg-card p-4">
            <ul className="space-y-2 font-mono text-xs">
              {logs.slice(-40).reverse().map((l) => (
                <li key={l.id} className="flex items-center gap-2">
                  <span className="text-muted-foreground">{l.time}</span>
                  <StatusBadge label={l.kind} tone={KIND_TONE[l.kind] ?? "gray"} />
                  <span>{l.text}</span>
                </li>
              ))}
              {logs.length === 0 && (
                <li className="text-muted-foreground">
                  No activity yet — place an order to see RPC and queue traffic.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
