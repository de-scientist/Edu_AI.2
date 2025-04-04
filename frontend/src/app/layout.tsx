"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import "@/app/globals.css"; // Global styles
import "@/app/output.css"; // TailwindCSS output styles
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // Ensure usePathname is used correctly
  const isHomePage = pathname === "/"; // Check if it's the homepage

  return (
    // Manually include <html> and <body> tags
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="min-h-screen flex flex-col pt-20 pb-16">
            <Navbar />
            {/* Only render Sidebar if it's not the home page */}
            {!isHomePage && <Sidebar />}
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
