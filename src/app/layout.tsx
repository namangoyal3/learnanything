import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://duolingo-for-pms.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PM Streak | Daily Product Management Lessons",
    template: "%s | PM Streak",
  },
  description:
    "Build product intuition with daily PM micro-lessons from podcast insights. Keep your streak, earn XP, and level up in minutes.",
  applicationName: "PM Streak",
  keywords: [
    "product management",
    "PM lessons",
    "PM interview prep",
    "product strategy",
    "daily learning",
    "Lenny podcast",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "PM Streak | Daily Product Management Lessons",
    description:
      "Build product intuition with daily PM micro-lessons from podcast insights. Keep your streak, earn XP, and level up in minutes.",
    siteName: "PM Streak",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Streak | Daily Product Management Lessons",
    description:
      "Build product intuition with daily PM micro-lessons from podcast insights. Keep your streak, earn XP, and level up in minutes.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <PostHogProvider>
          {children}
        </PostHogProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
