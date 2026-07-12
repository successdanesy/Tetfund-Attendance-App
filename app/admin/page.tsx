"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/Field";
import { Button } from "@/components/Button";
import { Note } from "@/components/Note";
import { useSession } from "@/lib/session";
import { api, ApiError } from "@/lib/api";
import { SEED_ADMIN, ADMIN_PASSWORD } from "@/lib/seed";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdmin } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const admin = await api.adminLogin(email, password);
      setAdmin(admin);
      router.push("/admin/approvals");
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
    <Screen title="Administrator sign in" onBack="history">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <TextField
          label="Admin email"
          name="email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder={SEED_ADMIN.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        />
        <Button type="submit" loading={busy} loadingLabel="Signing in…">
          Sign in
        </Button>
        <Note>
          Demo login - email <b>{SEED_ADMIN.email}</b>, password{" "}
          <b>{ADMIN_PASSWORD}</b>.
        </Note>
      </form>
    </Screen>
  );
}
