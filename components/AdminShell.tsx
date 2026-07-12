"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ConfirmDialog } from "./ConfirmDialog";
import { useStore } from "@/lib/store";

// Shared admin frame: green header with sign-out, a two-item tab row, and a
// centred content column. Same visual language as the staff side.
export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { pendingStaff, logoutAdmin } = useStore();
  const [confirmOut, setConfirmOut] = useState(false);
  const pendingCount = pendingStaff().length;

  const tabs = [
    { href: "/admin/approvals", label: "Approvals", count: pendingCount },
    { href: "/admin/attendance", label: "Today", count: 0 },
  ];

  function signOut() {
    logoutAdmin();
    router.replace("/admin");
  }

  return (
    <div className="min-h-dvh bg-white">
      <header className="bg-brand text-white">
        <div className="mx-auto flex min-h-[64px] w-full max-w-[760px] items-center justify-between px-5">
          <span className="text-[20px] font-bold">TETFUND Admin</span>
          <button
            onClick={() => setConfirmOut(true)}
            className="flex min-h-[48px] items-center rounded-lg px-3 text-[18px] font-bold text-white hover:bg-brand-dark"
          >
            Sign out
          </button>
        </div>
        <div className="mx-auto flex w-full max-w-[760px] gap-1 px-3">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[52px] items-center gap-2 rounded-t-lg px-4 text-[18px] font-bold ${
                  active
                    ? "bg-white text-brand"
                    : "text-white/90 hover:bg-brand-dark"
                }`}
              >
                {t.label}
                {t.count > 0 && (
                  <span
                    className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 text-[16px] ${
                      active ? "bg-brand text-white" : "bg-white text-brand"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-5 py-7">
        <h1 className="mb-5 text-[28px] font-bold leading-tight text-ink">
          {title}
        </h1>
        {children}
      </main>

      <ConfirmDialog
        open={confirmOut}
        title="Sign out?"
        message="You'll need to sign in again to manage attendance."
        confirmLabel="Sign out"
        confirmVariant="danger"
        onConfirm={signOut}
        onCancel={() => setConfirmOut(false)}
      />
    </div>
  );
}
