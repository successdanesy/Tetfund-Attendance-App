"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/Field";
import { Button } from "@/components/Button";
import { Note } from "@/components/Note";
import { Logo } from "@/components/Logo";
import { useSession } from "@/lib/session";
import { api, ApiError } from "@/lib/api";

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
        {/* TETFUND emblem in a soft green glow - grounds the sign-in screen. */}
        <div className="flex justify-center">
          <div
            className="flex h-[88px] w-[88px] items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(20,107,69,0.1), rgba(20,107,69,0) 70%)",
            }}
          >
            <Logo compact size={60} />
          </div>
        </div>
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
        />
        {error && <Note tone="error">{error}</Note>}
        <Button type="submit" loading={busy} loadingLabel="Signing in…">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-[16px] text-ink-soft">
        New here?{" "}
        <Link href="/signup" className="font-bold text-brand underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </Screen>
  );
}
