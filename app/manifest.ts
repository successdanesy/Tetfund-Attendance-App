import type { MetadataRoute } from "next";

// Minimal PWA manifest so the app is installable to a phone home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TETFUND Staff Attendance",
    short_name: "TETFUND",
    description: "Daily staff attendance with photo and location.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1b5e3f",
    icons: [],
  };
}
