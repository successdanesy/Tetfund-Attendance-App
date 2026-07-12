"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./session";

// Redirect to the welcome screen if no staff is signed in - but only after the
// session has rehydrated from localStorage, so a refresh doesn't bounce a
// signed-in user out.
export function useRequireStaff() {
  const router = useRouter();
  const { ready, currentStaff } = useSession();
  useEffect(() => {
    if (ready && !currentStaff) router.replace("/");
  }, [ready, currentStaff, router]);
  return currentStaff;
}

export function useRequireAdmin() {
  const router = useRouter();
  const { ready, currentAdmin } = useSession();
  useEffect(() => {
    if (ready && !currentAdmin) router.replace("/admin");
  }, [ready, currentAdmin, router]);
  return currentAdmin;
}
