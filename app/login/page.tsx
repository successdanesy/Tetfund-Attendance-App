"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/Field";
import { Button } from "@/components/Button";
import { useSession } from "@/lib/session";
import { api, ApiError } from "@/lib/api";

// Staff sign-in - validates the password against the database.
export default function LoginPage() {
  const router = useRouter();
  const { setStaff } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const staff = await api.login(email, password);
      setStaff(staff);
      router.push("/home");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setBusy(false);
    }
  }

  return (
    <Screen title="Sign in" onBack="history">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <TextField
          label="Work email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="you@tetfund.gov.ng"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        />
        <Button type="submit" loading={busy} loadingLabel="Signing in…">
          Sign in
        </Button>
      </form>
    </Screen>
  );
}
