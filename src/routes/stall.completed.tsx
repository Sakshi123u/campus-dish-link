import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StallOrders } from "@/components/StallOrders";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/stall/completed")({
  head: () => ({
    meta: [
      { title: "Completed Orders — Smart Food Court" },
      { name: "description", content: "Orders this food stall has completed and handed over to students." },
      { property: "og:title", content: "Completed Orders — Smart Food Court" },
      { property: "og:description", content: "Orders completed and handed over by this stall." },
    ],
  }),
  component: CompletedOrders,
});

function CompletedOrders() {
  const { user } = useApp();
  return (
    <AppLayout role="staff" title="Completed Orders">
      <div className="mx-auto max-w-4xl">
        <StallOrders stall={user?.stall} statuses={["completed"]} emptyText="No completed orders yet." />
      </div>
    </AppLayout>
  );
}
