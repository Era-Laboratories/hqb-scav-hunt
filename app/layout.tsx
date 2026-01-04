import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UP! - HQB Scavenger Hunt",
  description: "HQB Scalable HCI 2025 Scavenger Hunt - Huaqiangbei Edition",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Scanline overlay effect */}
        <div className="scanlines" />
        {children}
      </body>
    </html>
  );
}
