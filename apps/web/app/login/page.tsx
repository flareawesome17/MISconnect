import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="shell" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px 0" }}>
      <div style={{ width: "min(460px, 100%)" }}>
        <Suspense fallback={<div className="panel" style={{ padding: 28 }}>Loading login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
