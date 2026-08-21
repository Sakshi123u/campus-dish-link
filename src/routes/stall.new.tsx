import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StallOrders } from "@/components/StallOrders";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/stall/new")({
  head: () => ({
    meta: [
      { title: "New Orders — Smart Food Court" },
      { name: "description", content: "Incoming sub-orders waiting to be accepted by this food stall." },
      { property: "og:title", content: "New Orders — Smart Food Court" },
      { property: "og:description", content: "Incoming sub-orders waiting for stall acceptance." },
    ],
  }),
  component: NewOrders,
});

function NewOrders() {
  const { user } = useApp();
  return (
    <AppLayout role="staff" title="New Orders">
      <div className="mx-auto max-w-4xl">
        <StallOrders stall={user?.stall} statuses={["new"]} emptyText="No new orders." />
      </div>
    </AppLayout>
  );
}
