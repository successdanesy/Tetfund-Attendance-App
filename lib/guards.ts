"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "./store";

// Redirect to the welcome screen if no staff is signed in this session.
export function useRequireStaff() {
  const router = useRouter();
  const { currentStaff } = useStore();
  useEffect(() => {
    if (!currentStaff) router.replace("/");
  }, [currentStaff, router]);
  return currentStaff;
}

// Redirect to the admin login if no admin is signed in this session.
export function useRequireAdmin() {
  const router = useRouter();
  const { currentAdmin } = useStore();
  useEffect(() => {
    if (!currentAdmin) router.replace("/admin");
  }, [currentAdmin, router]);
  return currentAdmin;
}
