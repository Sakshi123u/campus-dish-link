import { createFileRoute } from "@tanstack/react-router";

/**
 * Stall Service RPC endpoint.
 * Exposes the remote procedures the Order Coordinator invokes:
 *   - assignSubOrder({ orderId, subId, stall, items })
 *   - getSubOrderStatus({ subId })
 */
export const Route = createFileRoute("/api/public/stall-rpc")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: {
          procedure?: string;
          stall?: string;
          orderId?: string;
          subId?: string;
          items?: { name: string; quantity: number }[];
        };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return Response.json({ status: "REJECTED", error: "Invalid JSON" }, { status: 400 });
        }

        const { procedure, stall, subId } = body;
        if (!procedure || !stall || !subId) {
          return Response.json({ status: "REJECTED", error: "Missing arguments" }, { status: 400 });
        }

        if (procedure === "assignSubOrder") {
          console.log(`[RPC] ${stall} Service: assignSubOrder(${subId}) -> ACCEPTED`);
          return Response.json({ status: "ACCEPTED", stall, subId, acceptedAt: new Date().toISOString() });
        }

        if (procedure === "getSubOrderStatus") {
          return Response.json({ status: "OK", stall, subId });
        }

        return Response.json({ status: "REJECTED", error: "Unknown procedure" }, { status: 404 });
      },
    },
  },
});
