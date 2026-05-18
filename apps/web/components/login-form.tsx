"use client";

import { type CSSProperties, FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { getClientAuth } = await import("@/lib/firebase-client");
      const credential = await signInWithEmailAndPassword(getClientAuth(), email, password);
      const idToken = await credential.user.getIdToken(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Login failed");
      }

      router.push(searchParams.get("next") ?? "/admin");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel" style={{ padding: 28, display: "grid", gap: 16 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 34 }}>MISconnect</h1>
        <p style={{ margin: "8px 0 0", color: "#bfdbfe" }}>
          Secure sign-in backed by Next.js sessions and server-enforced RBAC.
        </p>
      </div>
      <label style={{ display: "grid", gap: 8 }}>
        <span>Email</span>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required style={inputStyle} />
      </label>
      <label style={{ display: "grid", gap: 8 }}>
        <span>Password</span>
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required style={inputStyle} />
      </label>
      {error ? <p style={{ margin: 0, color: "#fca5a5" }}>{error}</p> : null}
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(148, 163, 184, 0.25)",
  background: "rgba(15, 23, 42, 0.8)",
  color: "#eff6ff",
  padding: "12px 14px",
};

const buttonStyle: CSSProperties = {
  border: 0,
  borderRadius: 12,
  background: "linear-gradient(135deg, #2563eb, #059669)",
  color: "white",
  padding: "12px 14px",
  cursor: "pointer",
  fontWeight: 700,
};
