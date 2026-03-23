import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PM Streak",
    short_name: "PM Streak",
    description:
      "Daily product management micro-lessons with streaks, XP, and rankings.",
    start_url: "/",
    display: "standalone",
    background_color: "#09141c",
    theme_color: "#0a66c2",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  };
}
