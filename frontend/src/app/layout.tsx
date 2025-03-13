import { ReactNode } from "react";
import "../styles/globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import Footer from "./components/Footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto px-4">{children}</main>
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
