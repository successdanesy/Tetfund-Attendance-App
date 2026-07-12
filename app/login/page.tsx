"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/Field";
import { Button } from "@/components/Button";
import { useStore } from "@/lib/store";

// Staff sign-in - mock: we match on email only. One action on the screen.
export default function LoginPage() {
  const router = useRouter();
  const { loginStaff } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // isPending stays true from the tap until the Home screen has loaded.
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const staff = loginStaff(email);
    if (!staff) {
      setError(
        "We couldn't find an account with that email. Please check it, or create a new account.",
      );
      return;
    }
    startTransition(() => {
      router.push("/home");
    });
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
        <Button type="submit" loading={isPending} loadingLabel="Signing in…">
          Sign in
        </Button>
      </form>
    </Screen>
  );
}
