import type { Metadata } from "next";
import { Bebas_Neue, Playfair_Display, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Full-Stack Developer · AI Builder · Co-Founder — Shivam Sharma",
  description:
    "Full-stack developer and co-founder of EcoInsight.AI. Building AI-powered products at the intersection of finance and technology.",
  metadataBase: new URL("https://shivam.dev"),
  openGraph: {
    title: "Shivam Sharma — Portfolio",
    description: "Full-stack developer · AI Builder · Co-Founder",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/monogram.svg?v=2", type: "image/svg+xml" },
    ],
    shortcut: "/monogram.svg?v=2",
    apple: [
      { url: "/monogram.svg?v=2", type: "image/svg+xml" },
    ],
  },
  themeColor: "#050505",
};

import CommandCenter from "@/components/CommandCenter";
import SystemHUD from "@/components/SystemHUD";

import { UIProvider } from "@/components/UIContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${playfair.variable} ${jetbrains.variable} ${dmSans.variable}`}
    >
      <body className="bg-ink text-paper antialiased relative">
        <UIProvider>
          {/* Global noise texture */}
          <div className="noise pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]" />
          
          {/* Global scanline overlay */}
          <div 
            className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.02]" 
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
              backgroundSize: '100% 2px, 3px 100%'
            }}
          />

          <CommandCenter />
          <SystemHUD />
          {children}
        </UIProvider>
      </body>
    </html>
  );
}
