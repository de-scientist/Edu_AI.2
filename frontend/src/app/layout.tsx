"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import "@/app/globals.css"; // Ensure global styles are applied
import "@/app/output.css"; // Import output.css to apply TailwindCSS styles globally
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {/* ✅ Ensure space for fixed navbar & footer */}
          <div className="min-h-screen flex flex-col pt-20 pb-16">
            <Navbar />
            {!isHomePage && <Sidebar />}
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
