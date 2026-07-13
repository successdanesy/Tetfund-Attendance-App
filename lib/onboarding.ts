// One-time onboarding flags, kept in localStorage. The intro carousel is shown
// once per device; the guided setup is shown once per account (keyed by staff
// id). All reads default to "already seen" on error so a storage failure never
// traps the user in a redirect loop.

const ONBOARDING_KEY = "tf.onboarding_seen";
const setupKey = (staffId: string) => `tf.setup_seen.${staffId}`;

export function hasSeenOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "1";
  } catch {
    return true;
  }
}

export function markOnboardingSeen(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, "1");
  } catch {
    // Ignore storage failures.
  }
}

export function hasSeenSetup(staffId: string): boolean {
  try {
    return localStorage.getItem(setupKey(staffId)) === "1";
  } catch {
    return true;
  }
}

export function markSetupSeen(staffId: string): void {
  try {
    localStorage.setItem(setupKey(staffId), "1");
  } catch {
    // Ignore storage failures.
  }
}
