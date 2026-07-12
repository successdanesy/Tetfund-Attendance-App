"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/Field";
import { Button } from "@/components/Button";
import { Note } from "@/components/Note";
import { Spinner } from "@/components/Spinner";
import { useSession } from "@/lib/session";
import { api, ApiError } from "@/lib/api";
import type { Department, Staff } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { setStaff } = useSession();

  const [demoAccounts, setDemoAccounts] = useState<Staff[] | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [tappingId, setTappingId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([api.getDemoAccounts(), api.getDepartments()])
      .then(([staff, depts]) => {
        if (!active) return;
        setDemoAccounts(staff);
        setDepartments(depts);
      })
      .catch(() => active && setDemoAccounts([]));
    return () => {
      active = false;
    };
  }, []);

  const departmentName = (id: string) =>
    departments.find((d) => d.id === id)?.name ?? "";

  async function tapEnter(staff: Staff) {
    setTappingId(staff.id);
    setError("");
    try {
      const entered = await api.demoLogin(staff.id);
      setStaff(entered);
      router.push("/home");
    } catch {
      setError("We couldn't enter that account. Please try again.");
      setTappingId(null);
    }
  }

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
      {demoAccounts === null ? (
        <div className="flex items-center gap-3 text-ink-soft">
          <span className="text-brand">
            <Spinner />
          </span>
          Loading…
        </div>
      ) : (
        <>
          {demoAccounts.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-1 text-[22px] font-bold text-ink">
                Tap to enter a demo account
              </h2>
              <p className="mb-4 text-[16px] text-ink-soft">
                No sign-up needed - tap a person to try the app as them.
              </p>
              <ul className="flex flex-col gap-3">
                {demoAccounts.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => tapEnter(s)}
                      disabled={tappingId !== null}
                      aria-busy={tappingId === s.id || undefined}
                      className="flex min-h-[72px] w-full items-center gap-4 rounded-xl border border-line bg-surface px-4 text-left hover:bg-white disabled:opacity-60"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.referencePhotoUrl}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[18px] font-bold text-ink">
                          {s.firstName} {s.lastName}
                        </span>
                        <span className="block text-[16px] text-ink-soft">
                          {departmentName(s.departmentId)}
                        </span>
                      </span>
                      {tappingId === s.id ? (
                        <span className="text-brand">
                          <Spinner />
                        </span>
                      ) : (
                        <span className="text-[16px] font-bold text-brand">
                          Enter
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center gap-3 text-[16px] text-ink-soft">
                <span className="h-px flex-1 bg-line" />
                or sign in with your account
                <span className="h-px flex-1 bg-line" />
              </div>
            </section>
          )}

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
            />
            {error && <Note tone="error">{error}</Note>}
            <Button type="submit" loading={busy} loadingLabel="Signing in…">
              Sign in
            </Button>
          </form>
        </>
      )}
    </Screen>
  );
}
