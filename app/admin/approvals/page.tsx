"use client";

import { useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/Button";
import { Note } from "@/components/Note";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useStore } from "@/lib/store";
import { useRequireAdmin } from "@/lib/guards";
import { formatDateShort } from "@/lib/format";

type PendingAction = {
  staffId: string;
  name: string;
  action: "approve" | "reject";
};

export default function ApprovalsPage() {
  const admin = useRequireAdmin();
  const { pendingStaff, departmentName, approveStaff, rejectStaff } = useStore();

  const [pending, setPending] = useState<PendingAction | null>(null);
  const [result, setResult] = useState<string>("");

  if (!admin) return null;

  const list = pendingStaff();

  function confirmAction() {
    if (!pending) return;
    if (pending.action === "approve") {
      approveStaff(pending.staffId);
      setResult(`Approved ${pending.name}. They can now clock in.`);
    } else {
      rejectStaff(pending.staffId);
      setResult(`Rejected ${pending.name}'s account.`);
    }
    setPending(null);
  }

  return (
    <AdminShell title="Pending approvals">
      {result && (
        <div className="mb-5">
          <Note tone="success">{result}</Note>
        </div>
      )}

      {list.length === 0 ? (
        <Note>
          No accounts are waiting for approval right now. New sign-ups will
          appear here.
        </Note>
      ) : (
        <ul className="flex flex-col gap-4">
          {list.map((s) => (
            <li
              key={s.id}
              className="rounded-2xl border border-line bg-surface p-4"
            >
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.referencePhotoUrl}
                  alt={`Reference photo of ${s.firstName} ${s.lastName}`}
                  className="h-20 w-20 shrink-0 rounded-lg border border-line object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[20px] font-bold text-ink">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="text-ink-soft">
                    {departmentName(s.departmentId)}
                  </p>
                  <p className="truncate text-[16px] text-ink-soft">{s.email}</p>
                  <p className="text-[16px] text-ink-soft">
                    Signed up {formatDateShort(s.createdAt)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() =>
                    setPending({
                      staffId: s.id,
                      name: `${s.firstName} ${s.lastName}`,
                      action: "approve",
                    })
                  }
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={() =>
                    setPending({
                      staffId: s.id,
                      name: `${s.firstName} ${s.lastName}`,
                      action: "reject",
                    })
                  }
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={
          pending?.action === "approve" ? "Approve this account?" : "Reject this account?"
        }
        message={
          pending?.action === "approve"
            ? `${pending?.name} will be able to sign in and clock in from now on.`
            : `${pending?.name} won't be able to clock in. You can't undo this in the demo.`
        }
        confirmLabel={pending?.action === "approve" ? "Approve" : "Reject"}
        confirmVariant={pending?.action === "approve" ? "primary" : "danger"}
        onConfirm={confirmAction}
        onCancel={() => setPending(null)}
      />
    </AdminShell>
  );
}
