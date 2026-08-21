import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge, statusTone } from "@/components/StatusBadge";
import { itemLabel, overallStatus, useApp } from "@/lib/store";

export const Route = createFileRoute("/my-orders")({
  head: () => ({
    meta: [
      { title: "My Orders — Smart Food Court" },
      { name: "description", content: "See all your past and current food court orders with their combined status." },
      { property: "og:title", content: "My Orders — Smart Food Court" },
      { property: "og:description", content: "All your food court orders and their current status." },
    ],
  }),
  component: MyOrdersPage,
});

function MyOrdersPage() {
  const { orders } = useApp();

  return (
    <AppLayout role="student" title="My Orders">
      <div className="mx-auto max-w-4xl overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const status = overallStatus(o);
              return (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{o.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {o.subOrders.map((s) => itemLabel(s.items)).join(", ")}
                  </td>
                  <td className="px-4 py-3">{o.time}</td>
                  <td className="px-4 py-3">₹{o.total}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={status} tone={statusTone(status)} />
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
