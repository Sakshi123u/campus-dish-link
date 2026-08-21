import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { StallOrders } from "@/components/StallOrders";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/stall/preparing")({
  head: () => ({
    meta: [
      { title: "Preparing Orders — Smart Food Court" },
      { name: "description", content: "Orders currently being prepared at this food stall, ready to be marked ready." },
      { property: "og:title", content: "Preparing Orders — Smart Food Court" },
      { property: "og:description", content: "Orders currently being prepared at this stall." },
    ],
  }),
  component: PreparingOrders,
});

function PreparingOrders() {
  const { user } = useApp();
  return (
    <AppLayout role="staff" title="Preparing Orders">
      <div className="mx-auto max-w-4xl space-y-4">
        <StallOrders
          stall={user?.stall}
          statuses={["accepted", "preparing"]}
          emptyText="Nothing is being prepared."
        />
      </div>
    </AppLayout>
  );
}
