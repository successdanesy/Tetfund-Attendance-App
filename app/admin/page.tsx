"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/Field";
import { Button } from "@/components/Button";
import { Note } from "@/components/Note";
import { useStore } from "@/lib/store";
import { SEED_ADMIN, ADMIN_PASSWORD } from "@/lib/seed";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok =
      email.trim().toLowerCase() === SEED_ADMIN.email.toLowerCase() &&
      password === ADMIN_PASSWORD;
    if (!ok) {
      setError("That email or password isn't correct.");
      return;
    }
    loginAdmin();
    startTransition(() => {
      router.push("/admin/approvals");
    });
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
        <Button type="submit" loading={isPending} loadingLabel="Signing in…">
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
