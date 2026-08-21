import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StallOrders } from "@/components/StallOrders";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/stall/ready")({
  head: () => ({
    meta: [
      { title: "Ready Orders — Smart Food Court" },
      { name: "description", content: "Prepared orders waiting to be collected by students at this stall." },
      { property: "og:title", content: "Ready Orders — Smart Food Court" },
      { property: "og:description", content: "Prepared orders waiting for student collection." },
    ],
  }),
  component: ReadyOrders,
});

function ReadyOrders() {
  const { user } = useApp();
  return (
    <AppLayout role="staff" title="Ready Orders">
      <div className="mx-auto max-w-4xl">
        <StallOrders stall={user?.stall} statuses={["ready"]} emptyText="No ready orders." />
      </div>
    </AppLayout>
  );
}
