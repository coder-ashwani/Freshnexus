import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";
import CommandMenu from "@/components/CommandMenu";

export const metadata: Metadata = {
  title: {
    default: "FreshNexus — Grocery Intelligence Platform",
    template: "%s | FreshNexus",
  },
  description:
    "A global, open-source platform exploring grocery products, nutritional data, environmental impact, and world commodities.",
  keywords: ["grocery", "open food facts", "nutrition", "eco-score", "food insights"],
  openGraph: {
    title: "FreshNexus — Grocery Intelligence Platform",
    description: "Explore comprehensive global grocery data, nutritional insights, and market trends.",
    type: "website",
    siteName: "FreshNexus",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshNexus",
    description: "Your open directory of the world's groceries.",
  },
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <CartProvider>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
            <CommandMenu />
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
