import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { STALLS } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/admin/stalls")({
  head: () => ({
    meta: [
      { title: "Stalls — Smart Food Court" },
      { name: "description", content: "List of food court stalls, their service addresses and how many sub-orders each handled." },
      { property: "og:title", content: "Stalls — Smart Food Court" },
      { property: "og:description", content: "Food court stalls, addresses and sub-order counts." },
    ],
  }),
  component: AdminStalls,
});

function AdminStalls() {
  const { orders } = useApp();

  return (
    <AppLayout role="admin" title="Stalls">
      <div className="mx-auto max-w-3xl overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Stall</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Sub-Orders</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {STALLS.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.address}</td>
                <td className="px-4 py-3">
                  {orders.reduce((n, o) => n + o.subOrders.filter((x) => x.stall === s.id).length, 0)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge label="Online" tone="green" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
