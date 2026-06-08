import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Wedify - The Royal Invite",
    template: "%s | Wedify",
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Wedify - The Royal Invite",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Wedify",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",
        width: 1600,
        height: 900,
        alt: "Luxury wedding invitation website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedify - The Royal Invite",
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full bg-[#050505] text-white">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Wedify",
              url: siteConfig.url,
              sameAs: [siteConfig.instagram],
              description: siteConfig.description,
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
