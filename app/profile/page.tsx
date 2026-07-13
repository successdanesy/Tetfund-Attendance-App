"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CameraBadge } from "@/components/PhotoBadge";
import { useSession } from "@/lib/session";
import { useRequireStaff } from "@/lib/guards";
import { api } from "@/lib/api";

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-line py-4">
      {icon && (
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-surface">
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-[16px] font-bold text-ink-soft">{label}</p>
        <p className="mt-1 text-[18px] text-ink">{value}</p>
      </div>
    </div>
  );
}

// Simple line icons for the profile detail rows.
const buildingIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 21V5a1 1 0 011-1h10a1 1 0 011 1v16M4 21h16M9 8h1M9 12h1M14 8h1M14 12h1M9 21v-4h6v4"
      stroke="var(--color-brand)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const envelopeIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 6h16v12H4z"
      stroke="var(--color-brand)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M4 7l8 6 8-6"
      stroke="var(--color-brand)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ProfilePage() {
  const router = useRouter();
  const staff = useRequireStaff();
  const { signOutStaff } = useSession();
  const [department, setDepartment] = useState("…");
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  useEffect(() => {
    if (!staff) return;
    let active = true;
    api
      .getDepartments()
      .then((list) => {
        if (!active) return;
        setDepartment(
          list.find((d) => d.id === staff.departmentId)?.name ?? "—",
        );
      })
      .catch(() => active && setDepartment("—"));
    return () => {
      active = false;
    };
  }, [staff?.id, staff?.departmentId]);

  if (!staff) return null;

  function signOut() {
    signOutStaff();
    router.replace("/");
  }

  const statusTone =
    staff.status === "approved"
      ? "success"
      : staff.status === "rejected"
        ? "error"
        : "pending";
  const statusLabel =
    staff.status === "approved"
      ? "Approved"
      : staff.status === "rejected"
        ? "Not approved"
        : "Awaiting approval";

  return (
    <>
      <Screen title="Profile" hasBottomNav>
        <div className="flex flex-col items-center text-center">
          <div className="relative h-28 w-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={staff.referencePhotoUrl}
              alt="Your reference photo"
              className="h-28 w-28 rounded-full border border-line object-cover"
            />
            <CameraBadge />
          </div>
          <h2 className="mt-4 text-[26px] font-bold text-ink">
            {staff.firstName} {staff.lastName}
          </h2>
          <div className="mt-2">
            <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
          </div>
        </div>

        <div className="mt-6">
          <Row label="First name" value={staff.firstName} />
          <Row label="Last name" value={staff.lastName} />
          <Row label="Department" value={department} icon={buildingIcon} />
          <Row label="Work email" value={staff.email} icon={envelopeIcon} />
        </div>

        <div className="mt-7">
          <Button variant="danger" onClick={() => setConfirmSignOut(true)}>
            Sign out
          </Button>
        </div>
      </Screen>
      <BottomNav />

      <ConfirmDialog
        open={confirmSignOut}
        title="Sign out?"
        message="You'll need to sign in again to clock in."
        confirmLabel="Sign out"
        confirmVariant="danger"
        onConfirm={signOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    </>
  );
}
