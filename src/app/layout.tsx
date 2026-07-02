import type { Metadata, Viewport } from "next";
import GoogleAnalyticsInit from "@/components/GoogleAnalyticsInit";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import GoogleAnalyticsTracker from "@/components/GoogleAnalyticsTracker";
import CampaignTracker from "@/components/CampaignTracker";
import { MarketingHeader, MarketingFooter } from "@/components/MarketingChrome";
import MotionProvider from "@/components/MotionProvider";
import { Suspense } from "react";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://learnanything.pro";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "PM Streak — Duolingo for Product Managers",
    template: "%s | PM Streak",
  },
  description:
    "PM Streak delivers daily 2-minute product management lessons from 300+ expert PM interviews. Build your PM intuition with streak tracking, XP, leaderboards, AI-powered lessons, interview prep, and a curated jobs board.",
  keywords: [
    "product management", "PM lessons", "product manager training",
    "PM interview prep", "product sense", "PM streak", "daily PM practice",
    "product management course", "PM frameworks", "duolingo for PMs",
    "learn product management", "PM career", "product manager skills",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", rel: "shortcut icon", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  verification: {
    google: "85fab4e21763c3a7",
  },
  openGraph: {
    title: "PM Streak — Duolingo for Product Managers",
    description:
      "Daily 2-minute PM lessons from 300+ expert interviews with streaks, XP, and leaderboards.",
    siteName: "PM Streak",
    url: APP_URL,
    images: [{ url: "/api/og?title=PM+Streak", width: 1200, height: 630, alt: "PM Streak — Daily PM Lessons" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM Streak — Duolingo for Product Managers",
    description:
      "Daily 2-min PM lessons from top PM leaders. Streaks, XP, leaderboards. The fastest way to get sharper as a PM.",
    images: ["/api/og?title=PM+Streak"],
    creator: "@pmstreak",
    site: "@pmstreak",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "article:modified_time": new Date().toISOString(),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Global WebSite JSON-LD with Sitelinks Searchbox — renders on every page
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PM Streak",
  alternateName: "learnanything.pro",
  url: APP_URL,
  description:
    "PM Streak is a daily product management learning platform that delivers 2-minute micro-lessons from 300+ expert PM interviews with streak tracking, XP, leaderboards, and AI-powered content.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${APP_URL}/learn?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// Global Organization JSON-LD
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${APP_URL}/#organization`,
  name: "PM Streak",
  alternateName: "Duolingo for Product Managers",
  url: APP_URL,
  logo: {
    "@type": "ImageObject",
    url: `${APP_URL}/icon.svg`,
    width: 512,
    height: 512,
  },
  description:
    "PM Streak delivers daily 2-minute product management lessons from 300+ expert PM interviews with streak tracking, XP, leaderboards, and AI-powered content generation.",
  foundingDate: "2024",
  sameAs: [
    "https://www.producthunt.com/products/pm-streak",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: APP_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const gaDebug = process.env.NEXT_PUBLIC_GA_DEBUG === "true";

  return (
    <html lang="en">
      <head>
        {/* Performance: preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://app.posthog.com" />
        {/* WebSite + Organization structured data on every page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <PostHogProvider>
          <MotionProvider>
            <CampaignTracker />
            <Suspense fallback={null}>
              <MarketingHeader />
            </Suspense>
            {children}
            <Suspense fallback={null}>
              <MarketingFooter />
            </Suspense>
          </MotionProvider>
        </PostHogProvider>
        {gaId && (
          <>
            <GoogleAnalyticsInit gaId={gaId} debugMode={gaDebug} />
            <Suspense fallback={null}>
              <GoogleAnalyticsTracker gaId={gaId} />
            </Suspense>
          </>
        )}
      </body>
    </html>
  );
}
// Deployment marker: 20260411-021110 - A/B Experiment System
