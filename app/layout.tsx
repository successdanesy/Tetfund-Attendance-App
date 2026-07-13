import type { Metadata, Viewport } from "next";
import { Public_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/lib/session";

// Public Sans, the USWDS face, carries body copy - chosen for legibility in
// official digital services.
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

// Manrope is the display face for headings and nav/button labels.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TETFUND Attendance",
  description: "Daily staff attendance for TETFUND - clock in with photo and location.",
};

export const viewport: Viewport = {
  themeColor: "#146b45",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${publicSans.variable} ${manrope.variable}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
