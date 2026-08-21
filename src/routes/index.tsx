import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/store";
import banner from "@/assets/banner.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login — Smart Food Court" },
      { name: "description", content: "Login to Smart Food Court, a college food court ordering system. Order Smart. Eat Fast." },
      { property: "og:title", content: "Login — Smart Food Court" },
      { property: "og:description", content: "Login to Smart Food Court, a college food court ordering system." },
    ],
  }),
  component: LoginPage,
});

const DEMO = [
  ["Student", "student / student123"],
  ["Pizza Staff", "pizza / pizza123"],
  ["Burger Staff", "burger / burger123"],
  ["Admin", "admin / admin123"],
];

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(username, password);
    if (!user) {
      setError("Invalid username or password");
      return;
    }
    if (user.role === "student") navigate({ to: "/home" });
    else if (user.role === "staff") navigate({ to: "/stall" });
    else navigate({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-card md:grid-cols-2">
        <div className="relative hidden md:block">
          <img src={banner} alt="College food court" width={1536} height={512} className="h-full w-full object-cover" />
          <div className="absolute left-6 top-6 rounded-lg bg-card/90 p-3">
            <Brand withTagline />
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6 md:hidden">
            <Brand withTagline />
          </div>
          <h1 className="text-center text-xl font-semibold">Welcome Back!</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Login to continue</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Toggle password visibility"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Demo Accounts</p>
            <ul className="mt-2 space-y-1.5">
              {DEMO.map(([role, creds]) => (
                <li key={role} className="flex justify-between text-xs">
                  <span className="font-medium">{role}</span>
                  <span className="text-muted-foreground">{creds}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
