"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import "@styles/globals.css";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>
    <SessionProvider>  {/* ✅ Wrap everything in SessionProvider */}
      <div className="app-container">
        <Navbar />
        <Sidebar />
        <main>{children}</main>
        <Footer />
      </div>
    </SessionProvider>
    </body>
    </html>
  );
}
