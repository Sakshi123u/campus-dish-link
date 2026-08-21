import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge, statusLabel, statusTone } from "@/components/StatusBadge";
import { stallName } from "@/lib/data";
import { STATUS_STEPS, itemLabel, overallStatus, useApp } from "@/lib/store";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Order — Smart Food Court" },
      { name: "description", content: "Track your food court order step by step and see each stall's preparation status." },
      { property: "og:title", content: "Track Order — Smart Food Court" },
      { property: "og:description", content: "Track your order and each stall's preparation status." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { orders } = useApp();
  const order = orders[0];

  if (!order) {
    return (
      <AppLayout role="student" title="Track Order">
        <p className="text-sm text-muted-foreground">No active order to track.</p>
      </AppLayout>
    );
  }

  const status = overallStatus(order);
  const currentIndex = STATUS_STEPS.indexOf(status);

  return (
    <AppLayout role="student" title="Track Order">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Track Order</h2>
          <span className="rounded-md bg-success-soft px-2 py-0.5 text-xs text-success">
            Order ID: {order.id}
          </span>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <p className="mb-6 text-sm font-medium">Overall Status</p>
          <div className="flex items-start justify-between">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentIndex;
              return (
                <div key={step} className="flex flex-1 flex-col items-center text-center">
                  <div className="flex w-full items-center">
                    <span className={`h-0.5 flex-1 ${i === 0 ? "bg-transparent" : done ? "bg-primary" : "bg-border"}`} />
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                      }`}
                    >
                      {done && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span
                      className={`h-0.5 flex-1 ${
                        i === STATUS_STEPS.length - 1 ? "bg-transparent" : i < currentIndex ? "bg-primary" : "bg-border"
                      }`}
                    />
                  </div>
                  <span className="mt-2 text-xs text-muted-foreground">{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm font-medium">Order Progress</p>
            <ul className="space-y-3">
              {order.subOrders.map((sub) => (
                <li key={sub.id} className="flex items-center justify-between gap-3">
                  <span className="text-sm">
                    {stallName(sub.stall)}{" "}
                    <span className="text-muted-foreground">({itemLabel(sub.items)})</span>
                  </span>
                  <StatusBadge label={statusLabel(sub.status)} tone={statusTone(sub.status)} />
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm font-medium">Order Details</p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Order ID</dt>
                <dd>{order.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Order Time</dt>
                <dd>{order.time}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Items</dt>
                <dd>{order.subOrders.reduce((n, s) => n + s.items.reduce((m, i) => m + i.qty, 0), 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Amount</dt>
                <dd>₹{order.total}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
