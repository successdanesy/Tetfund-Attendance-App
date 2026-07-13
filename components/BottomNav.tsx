"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Staff bottom nav: exactly 3 items, every icon paired with a text label.
const items: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: "/home",
    label: "Home",
    icon: (
      <path
        d="M4 11l8-7 8 7M6 10v9h12v-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/history",
    label: "History",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 7.5V12l3 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M5 19a7 7 0 0114 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-white">
      <div className="mx-auto grid w-full max-w-[560px] grid-cols-3">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-h-[64px] flex-col items-center justify-center gap-1 py-2 ${
                active ? "text-brand" : "text-ink-soft"
              }`}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute top-0 h-1 w-1 rounded-full bg-[color:var(--color-accent)]"
                />
              )}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                {item.icon}
              </svg>
              <span className="font-[family-name:var(--font-heading)] text-[16px] font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
