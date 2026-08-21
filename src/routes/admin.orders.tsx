import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge, statusLabel, statusTone } from "@/components/StatusBadge";
import { stallName } from "@/lib/data";
import { itemLabel, overallStatus, useApp } from "@/lib/store";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "All Orders — Smart Food Court" },
      { name: "description", content: "Admin view of every order and the sub-orders sent to each food stall." },
      { property: "og:title", content: "All Orders — Smart Food Court" },
      { property: "og:description", content: "Every order and its stall sub-orders." },
    ],
  }),
  component: AdminOrders,
});

function AdminOrders() {
  const { orders } = useApp();

  return (
    <AppLayout role="admin" title="Orders">
      <div className="mx-auto max-w-4xl space-y-4">
        {orders.map((o) => {
          const status = overallStatus(o);
          return (
            <div key={o.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{o.id}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{o.time}</span>
                  <span>₹{o.total}</span>
                  <StatusBadge label={status} tone={statusTone(status)} />
                </div>
              </div>
              <ul className="mt-3 space-y-2">
                {o.subOrders.map((sub) => (
                  <li key={sub.id} className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2 text-sm">
                    <span>
                      <span className="font-medium">{sub.id}</span>{" "}
                      <span className="text-muted-foreground">
                        {stallName(sub.stall)} — {itemLabel(sub.items)}
                      </span>
                    </span>
                    <StatusBadge label={statusLabel(sub.status)} tone={statusTone(sub.status)} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
      </div>
    </AppLayout>
  );
}
