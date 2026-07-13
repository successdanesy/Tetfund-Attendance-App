"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/Button";
import { Note } from "@/components/Note";
import { Spinner } from "@/components/Spinner";
import { PendingBadge } from "@/components/PhotoBadge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useRequireAdmin } from "@/lib/guards";
import { api } from "@/lib/api";
import { formatDateShort } from "@/lib/format";
import type { Department, Staff } from "@/lib/types";

type PendingAction = {
  staffId: string;
  name: string;
  action: "approve" | "reject";
};

export default function ApprovalsPage() {
  const admin = useRequireAdmin();

  const [list, setList] = useState<Staff[] | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadError, setLoadError] = useState("");

  const [pending, setPending] = useState<PendingAction | null>(null);
  const [acting, setActing] = useState(false);
  const [result, setResult] = useState("");

  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function load() {
    setLoadError("");
    try {
      const [staff, depts] = await Promise.all([
        api.getPending(),
        api.getDepartments(),
      ]);
      setList(staff);
      setDepartments(depts);
    } catch {
      setLoadError("We couldn't load pending accounts. Please try again.");
    }
  }

  useEffect(() => {
    if (admin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin?.id]);

  if (!admin) return null;

  const departmentName = (id: string) =>
    departments.find((d) => d.id === id)?.name ?? "—";

  async function confirmAction() {
    if (!pending) return;
    setActing(true);
    try {
      await api.setStaffStatus(pending.staffId, pending.action);
      setList((prev) => prev?.filter((s) => s.id !== pending.staffId) ?? null);
      setResult(
        pending.action === "approve"
          ? `Approved ${pending.name}. They can now clock in.`
          : `Rejected ${pending.name}'s account.`,
      );
    } catch {
      setResult("That didn't work. Please try again.");
    } finally {
      setActing(false);
      setPending(null);
    }
  }

  async function doReset() {
    setResetting(true);
    try {
      await api.resetDemo();
      setResult("Demo data cleared. Ready for a fresh run.");
      await load();
    } catch {
      setResult("Reset failed. Please try again.");
    } finally {
      setResetting(false);
      setConfirmReset(false);
    }
  }

  return (
    <AdminShell title="Pending approvals" pendingCount={list?.length ?? 0}>
      {result && (
        <div className="mb-5">
          <Note tone="success">{result}</Note>
        </div>
      )}

      {loadError ? (
        <Note tone="error">{loadError}</Note>
      ) : !list ? (
        <div className="flex items-center gap-3 text-ink-soft">
          <span className="text-brand">
            <Spinner />
          </span>
          Loading pending accounts…
        </div>
      ) : list.length === 0 ? (
        <Note>
          No accounts are waiting for approval right now. New sign-ups will
          appear here.
        </Note>
      ) : (
        <ul className="flex flex-col gap-4">
          {list.map((s) => (
            <li
              key={s.id}
              className="rounded-[18px] border border-line bg-surface p-4 elevation-card"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.referencePhotoUrl}
                    alt={`Reference photo of ${s.firstName} ${s.lastName}`}
                    className="h-20 w-20 rounded-lg border border-line object-cover"
                  />
                  <PendingBadge size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[20px] font-bold text-ink">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="text-ink-soft">{departmentName(s.departmentId)}</p>
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

      {/* Reset control for starting a pitch from a clean slate. */}
      <div className="mt-10 border-t border-line pt-6">
        <p className="mb-3 text-[16px] text-ink-soft">
          Clears every staff account and attendance record, then re-seeds the
          departments and this admin. Use it to start a demo fresh.
        </p>
        <Button variant="danger" onClick={() => setConfirmReset(true)}>
          Reset demo data
        </Button>
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={
          pending?.action === "approve"
            ? "Approve this account?"
            : "Reject this account?"
        }
        message={
          pending?.action === "approve"
            ? `${pending?.name} will be able to sign in and clock in from now on.`
            : `${pending?.name} won't be able to clock in. You can't undo this in the demo.`
        }
        confirmLabel={pending?.action === "approve" ? "Approve" : "Reject"}
        confirmVariant={pending?.action === "approve" ? "primary" : "danger"}
        confirmLoading={acting}
        onConfirm={confirmAction}
        onCancel={() => setPending(null)}
      />

      <ConfirmDialog
        open={confirmReset}
        title="Reset all demo data?"
        message="This permanently deletes every staff account and attendance record. This can't be undone."
        confirmLabel="Reset everything"
        confirmVariant="danger"
        confirmLoading={resetting}
        onConfirm={doReset}
        onCancel={() => setConfirmReset(false)}
      />
    </AdminShell>
  );
}
