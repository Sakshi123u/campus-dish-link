import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Smart Food Court" },
      { name: "description", content: "Your Smart Food Court student profile details and order summary." },
      { property: "og:title", content: "Profile — Smart Food Court" },
      { property: "og:description", content: "Your student profile details and order summary." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, orders } = useApp();

  return (
    <AppLayout role="student" title="Profile">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6">
        <h2 className="text-base font-semibold">{user?.name}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Username</dt>
            <dd>{user?.username}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Role</dt>
            <dd className="capitalize">{user?.role}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Total Orders</dt>
            <dd>{orders.length}</dd>
          </div>
        </dl>
      </div>
    </AppLayout>
  );
}
