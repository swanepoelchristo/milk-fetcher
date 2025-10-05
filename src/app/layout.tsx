import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Milk Fetcher",
  description: "XGRC-style factory OS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-screen">
            <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="font-medium">Dashboard</div>
                <div className="space-x-2">
                  <Link href="#" className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">History</Link>
                  <Link href="#" className="rounded-md bg-gray-900 text-white px-3 py-1.5 text-sm hover:bg-gray-800">Reports</Link>
                </div>
              </div>
            </header>
            <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
