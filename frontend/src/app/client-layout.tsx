"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <SessionProvider>
      <AnimatePresence mode="wait">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-1 pt-16">
            {!isHomePage && <Sidebar />}
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </AnimatePresence>
    </SessionProvider>
  );
} 