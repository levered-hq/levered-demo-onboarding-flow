/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hay Onboarding Funnel - Corporate Card & Spend Management",
  description:
    "Discover smarter spend management for your business with Hay. Answer a few questions to see how corporate cards can help your team.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
