import { Button } from "@/components/ui/button";
import { useApp, itemLabel, type SubStatus } from "@/lib/store";
import type { StallId } from "@/lib/data";

const NEXT: Record<SubStatus, { label: string; next: SubStatus } | null> = {
  new: { label: "Accept", next: "accepted" },
  accepted: { label: "Start Preparing", next: "preparing" },
  preparing: { label: "Mark Ready", next: "ready" },
  ready: { label: "Complete", next: "completed" },
  completed: null,
};

export function useStallSubOrders(stall: StallId | undefined, statuses: SubStatus[]) {
  const { orders } = useApp();
  return orders.flatMap((o) =>
    o.subOrders
      .filter((s) => s.stall === stall && statuses.includes(s.status))
      .map((s) => ({ order: o, sub: s })),
  );
}

export function StallOrders({
  stall,
  statuses,
  emptyText,
}: {
  stall: StallId | undefined;
  statuses: SubStatus[];
  emptyText: string;
}) {
  const rows = useStallSubOrders(stall, statuses);
  const { updateSubOrder } = useApp();

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Order ID</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Time</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ order, sub }) => {
            const action = NEXT[sub.status];
            return (
              <tr key={sub.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{sub.id}</td>
                <td className="px-4 py-3 text-muted-foreground">{itemLabel(sub.items)}</td>
                <td className="px-4 py-3">{order.time}</td>
                <td className="px-4 py-3">
                  {action ? (
                    <Button size="sm" onClick={() => updateSubOrder(order.id, sub.id, action.next)}>
                      {action.label}
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
