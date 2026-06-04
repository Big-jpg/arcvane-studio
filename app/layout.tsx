// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/cart-drawer";
import { SessionProvider } from "@/components/session-provider";
import { TimeStateProvider } from "@/components/time-state-provider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arcvane-studio.com";
const siteDescription =
  "A Western Australian lighting atelier creating small-run decorative shades, lighting forms, translucent PLA diffusers, stands, and modular accessories for customer-supplied E27 components.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ArcVane Studio",
    template: "%s | ArcVane Studio",
  },
  description: siteDescription,
  applicationName: "ArcVane Studio",
  authors: [{ name: "ArcVane Studio" }],
  creator: "ArcVane Studio",
  publisher: "ArcVane Studio",
  category: "lighting design",
  keywords: [
    "Western Australian lighting atelier",
    "coastal lighting design",
    "E27-compatible shade system",
    "PLA diffusion",
    "modular lighting components",
    "small-run decorative lighting forms",
    "domestic decorative lighting objects",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "/",
    siteName: "ArcVane Studio",
    title: "ArcVane Studio",
    description: siteDescription,
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "ArcVane Studio warm ivory Open Graph placeholder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArcVane Studio",
    description: siteDescription,
    images: ["/og-default.svg"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <TimeStateProvider>
          <SessionProvider>
            <CartProvider>
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
              <CartDrawer />
            </CartProvider>
          </SessionProvider>
        </TimeStateProvider>
      </body>
      <Analytics />
    </html>
  );
}
