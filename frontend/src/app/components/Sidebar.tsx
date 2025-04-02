"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const { data: session } = useSession();
  const [isSidebarVisible, setSidebarVisible] = useState(true); // Toggle sidebar visibility for mobile responsiveness

  if (!session?.user) return null; // Return nothing if user is not logged in

  const handleLogout = () => {
    signOut(); // Log the user out
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`w-64 h-screen bg-gray-800 text-white p-4 ${isSidebarVisible ? 'block' : 'hidden'}`}>
        <h2 className="text-lg font-bold mb-4">Menu</h2>
        <ul className="mt-4 space-y-2">
          <li>
            <Link href="/dashboard" className="hover:text-gray-400">Dashboard</Link>
          </li>
          <li>
            <Link href="/settings" className="hover:text-gray-400">Settings</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="w-full text-left hover:text-gray-400">
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Sidebar Toggle Button (for mobile view) */}
      <button 
        className="fixed top-4 left-4 text-white p-3 bg-gray-800 rounded-full md:hidden" 
        onClick={() => setSidebarVisible(!isSidebarVisible)}>
        ☰
      </button>
    </>
  );
}
