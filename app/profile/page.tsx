"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useSession } from "@/lib/session";
import { useRequireStaff } from "@/lib/guards";
import { api } from "@/lib/api";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-line py-4">
      <p className="text-[16px] font-bold text-ink-soft">{label}</p>
      <p className="mt-1 text-[18px] text-ink">{value}</p>
    </div>
  );
}

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={staff.referencePhotoUrl}
            alt="Your reference photo"
            className="h-28 w-28 rounded-full border border-line object-cover"
          />
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
          <Row label="Department" value={department} />
          <Row label="Work email" value={staff.email} />
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
