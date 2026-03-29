import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Image Background Remover - Free AI Background Removal Tool",
  description:
    "Remove image backgrounds instantly with AI. Free, fast, and accurate. No registration required. Perfect for product photos, portraits, and more.",
  keywords:
    "image background remover, remove background free, background eraser, AI background removal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-purple-600">
              ✂️ BGRemover
            </Link>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/pricing" className="hover:text-purple-600 transition-colors">
                Pricing
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-gray-100 mt-20 py-8 text-center text-sm text-gray-400">
          © 2026 BGRemover · Powered by Remove.bg API
        </footer>
      </body>
    </html>
  );
}
