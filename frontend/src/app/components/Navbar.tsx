"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = typeof window !== "undefined" ? io("http://localhost:5000") : null;

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (msg: string) => {
      setNotification(`🔔 ${msg}`);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md py-3 px-6 flex justify-between items-center z-50">
      <h1 className="text-xl font-bold">Edu_AI Dashboard</h1>

      <div className="hidden md:flex space-x-6 text-lg">
        <Link href="/" className={`hover:underline ${pathname === "/" && "font-bold"}`}>Home</Link>
        {session?.user?.role === "admin" && (
          <Link href="/admin" className={`hover:underline ${pathname === "/admin" && "font-bold"}`}>Admin Panel</Link>
        )}
        {session?.user?.role === "student" && (
          <Link href="/student" className={`hover:underline ${pathname === "/student" && "font-bold"}`}>Dashboard</Link>
        )}
        {session?.user?.role === "lecturer" && (
          <Link href="/lecturer" className={`hover:underline ${pathname === "/lecturer" && "font-bold"}`}>Manage Courses</Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {notification && <span className="bg-yellow-300 text-black px-3 py-1 rounded text-sm">{notification}</span>}
        
        {session?.user ? (
          <>
            <span className="hidden md:block">Welcome, {session.user.email}</span>
            <button 
              onClick={() => signOut()} 
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">Login</Link>
        )}
      </div>
    </nav>
  );
}
