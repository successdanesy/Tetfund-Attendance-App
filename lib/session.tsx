"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AdminUser, Staff } from "./types";
import { api } from "./api";

// Lightweight session held on the client and persisted to localStorage so a
// refresh doesn't sign you out. Auth itself (password check) happens on the
// server; this just remembers who's signed in.

const STAFF_KEY = "tf.staff";
const ADMIN_KEY = "tf.admin";

type SessionValue = {
  ready: boolean;
  currentStaff: Staff | null;
  currentAdmin: AdminUser | null;
  setStaff: (staff: Staff | null) => void;
  setAdmin: (admin: AdminUser | null) => void;
  signOutStaff: () => void;
  signOutAdmin: () => void;
  // Re-fetch the signed-in staff so a freshly-approved status shows up.
  refreshStaff: () => Promise<Staff | null>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STAFF_KEY);
      const a = localStorage.getItem(ADMIN_KEY);
      if (s) setCurrentStaff(JSON.parse(s));
      if (a) setCurrentAdmin(JSON.parse(a));
    } catch {
      // Ignore corrupt storage.
    }
    setReady(true);
  }, []);

  const setStaff = useCallback((staff: Staff | null) => {
    setCurrentStaff(staff);
    try {
      if (staff) localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
      else localStorage.removeItem(STAFF_KEY);
    } catch {
      // Ignore storage failures.
    }
  }, []);

  const setAdmin = useCallback((admin: AdminUser | null) => {
    setCurrentAdmin(admin);
    try {
      if (admin) localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
      else localStorage.removeItem(ADMIN_KEY);
    } catch {
      // Ignore storage failures.
    }
  }, []);

  const refreshStaff = useCallback(async () => {
    if (!currentStaff) return null;
    try {
      const fresh = await api.getStaff(currentStaff.id);
      setStaff(fresh);
      return fresh;
    } catch {
      return currentStaff;
    }
  }, [currentStaff, setStaff]);

  const value: SessionValue = {
    ready,
    currentStaff,
    currentAdmin,
    setStaff,
    setAdmin,
    signOutStaff: () => setStaff(null),
    signOutAdmin: () => setAdmin(null),
    refreshStaff,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
