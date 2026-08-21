import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StatCard } from "@/components/StatCard";
import { StallOrders, useStallSubOrders } from "@/components/StallOrders";
import { StatusBadge } from "@/components/StatusBadge";
import { stallName } from "@/lib/data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/stall/")({
  head: () => ({
    meta: [
      { title: "Stall Dashboard — Smart Food Court" },
      { name: "description", content: "Food stall staff dashboard showing new, preparing, ready and completed sub-orders." },
      { property: "og:title", content: "Stall Dashboard — Smart Food Court" },
      { property: "og:description", content: "Stall staff dashboard for handling incoming sub-orders." },
    ],
  }),
  component: StallDashboard,
});

function StallDashboard() {
  const { user } = useApp();
  const stall = user?.stall;
  const newOrders = useStallSubOrders(stall, ["new"]).length;
  const preparing = useStallSubOrders(stall, ["preparing", "accepted"]).length;
  const ready = useStallSubOrders(stall, ["ready"]).length;
  const completed = useStallSubOrders(stall, ["completed"]).length;

  return (
    <AppLayout role="staff" title="Dashboard">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{stall ? stallName(stall) : "Stall"} Dashboard</h2>
          <StatusBadge label="Online" tone="green" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="New Orders" value={newOrders} tone="blue" />
          <StatCard label="Preparing" value={preparing} tone="orange" />
          <StatCard label="Ready" value={ready} tone="green" />
          <StatCard label="Completed Today" value={completed} />
        </div>

        <div>
          <h3 className="mb-3 text-base font-semibold">New Orders</h3>
          <StallOrders stall={stall} statuses={["new"]} emptyText="No new orders." />
        </div>
      </div>
    </AppLayout>
  );
}
