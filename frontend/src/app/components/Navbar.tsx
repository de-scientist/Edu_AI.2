"use client"; // ✅ client-side component

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track if it's client-side rendering

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR
  if (!isClient) return null;

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full backdrop-blur bg-white/70 shadow-md py-3 px-6 flex justify-between items-center z-50 border-b border-blue-200"
      initial={{ opacity: 0 }} // Start with opacity 0
      animate={{ opacity: 1 }} // Animate to opacity 1
      transition={{ duration: 1 }} // Smooth transition for the navbar
    >
      {/* Logo and Title */}
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-extrabold text-indigo-700">Edu_AI</h1>
        <span className="text-xs text-indigo-400 tracking-widest">Learn. Adapt. Evolve.</span>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex space-x-4 text-sm font-medium">
        <Link href="/" className={`px-3 py-1 rounded-full hover:bg-indigo-100 text-indigo-700 ${pathname === "/" && "font-bold"}`}>Home</Link>
        <Link href="/admin" className={`px-3 py-1 rounded-full hover:bg-indigo-100 text-indigo-700 ${pathname === "/admin" && "font-bold"}`}>Admin</Link>
        <Link href="/lecturer" className={`px-3 py-1 rounded-full hover:bg-indigo-100 text-indigo-700 ${pathname === "/lecturer" && "font-bold"}`}>Lecturer</Link>
        <Link href="/student" className={`px-3 py-1 rounded-full hover:bg-indigo-100 text-indigo-700 ${pathname === "/student" && "font-bold"}`}>Student</Link>
      </div>

      {/* Right Section: Auth + Mobile Menu Toggle */}
      <div className="flex items-center space-x-4">
        {session?.user ? ( // Render only when session is available
          <>
            <span className="hidden md:block text-sm text-indigo-500">Hi, {session.user.email}</span>
            <button 
              onClick={() => signOut()} 
              className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-700 text-sm transition duration-200">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 text-sm transition duration-200">
            Login
          </Link>
        )}

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={toggleMenu}>
          {menuOpen ? <X className="text-indigo-700" /> : <Menu className="text-indigo-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 md:hidden z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4 text-sm font-medium text-indigo-700">
            <Link href="/" className="hover:underline" onClick={toggleMenu}>Home</Link>
            <Link href="/admin" className="hover:underline" onClick={toggleMenu}>Admin</Link>
            <Link href="/lecturer" className="hover:underline" onClick={toggleMenu}>Lecturer</Link>
            <Link href="/student" className="hover:underline" onClick={toggleMenu}>Student</Link>
            {session?.user ? (
              <button onClick={() => { signOut(); toggleMenu(); }} className="text-red-600 hover:underline text-left">Logout</button>
            ) : (
              <Link href="/login" className="text-green-600 hover:underline" onClick={toggleMenu}>Login</Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
