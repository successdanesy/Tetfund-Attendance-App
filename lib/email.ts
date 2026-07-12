// Personal email providers are rejected - staff must use an official work
// address. Kept as a plain list so it's obvious what's blocked and why.
export const BLOCKED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
];

export function isValidWorkEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return !BLOCKED_DOMAINS.includes(domain);
}

// A single plain-language message shared by every screen that validates email.
export const WORK_EMAIL_ERROR =
  "Please use your official work email address - personal email providers like Gmail and Yahoo aren't accepted.";
