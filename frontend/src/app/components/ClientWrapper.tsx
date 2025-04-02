"use client"; // Ensure this is a client-side component
import { usePathname } from "next/navigation";
import Sidebar from "@components/Sidebar";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {!isHomePage && <Sidebar />} {/* Sidebar will only show if not on the home page */}
      {children}
    </>
  );
}
