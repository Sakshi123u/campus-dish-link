import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { SERVICES } from "@/lib/data";

export const Route = createFileRoute("/admin/monitor")({
  head: () => ({
    meta: [
      { title: "System Monitor — Smart Food Court" },
      { name: "description", content: "System monitor showing each distributed service, its address, status and latency." },
      { property: "og:title", content: "System Monitor — Smart Food Court" },
      { property: "og:description", content: "Distributed services, addresses, status and latency." },
    ],
  }),
  component: SystemMonitor,
});

function SystemMonitor() {
  const heartbeat = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <AppLayout role="admin" title="System Monitor">
      <div className="mx-auto max-w-4xl space-y-4">
        <h2 className="text-base font-semibold">System Status</h2>
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
              </tr>
            </thead>
            <tbody>
              {SERVICES.map((s) => (
                <tr key={s.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.address}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label="Online" tone="green" />
                  </td>
                  <td className="px-4 py-3">{s.latency} ms</td>
                  <td className="px-4 py-3 text-muted-foreground">{heartbeat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
