import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

// One typeface throughout - Public Sans, the USWDS face, chosen for
// legibility in official digital services.
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TETFUND Attendance",
  description: "Daily staff attendance for TETFUND - clock in with photo and location.",
};

export const viewport: Viewport = {
  themeColor: "#1b5e3f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={publicSans.variable}>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
