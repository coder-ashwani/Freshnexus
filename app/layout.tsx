import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "FreshNexus — Grocery Intelligence Platform",
    template: "%s | FreshNexus",
  },
  description:
    "Discover, explore, and understand grocery products from around the world. Powered by Open Food Facts data and live market insights.",
  keywords: ["grocery", "food", "nutrition", "products", "market insights", "Open Food Facts"],
  authors: [{ name: "FreshNexus Team" }],
  creator: "FreshNexus",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FreshNexus",
    title: "FreshNexus — Grocery Intelligence Platform",
    description:
      "Discover, explore, and understand grocery products from around the world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshNexus — Grocery Intelligence Platform",
    description: "Discover, explore, and understand grocery products from around the world.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
