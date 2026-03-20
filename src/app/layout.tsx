import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PM Streak - Duolingo for Product Managers",
  description: "Daily product wisdom with streaks, XP, and leaderboards. Learn PM skills in 2-3 minutes a day.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
