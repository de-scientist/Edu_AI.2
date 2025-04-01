"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import io from "socket.io-client"; // Default import for socket.io-client
import Link from "next/link";

type User = { id: string; name: string }; 
type Message = string; 

// ✅ Prevent SSR issues
const socket = typeof window !== "undefined" ? io("http://localhost:5000") : null;

export default function Navbar() {
  const { data: session } = useSession();
  const [notification, setNotification] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!socket) return; // ✅ Prevent errors in SSR

    socket.on("receiveMessage", (msg: Message) => {
      setNotification(`New Message: ${msg}`);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (!socket) return; // ✅ Prevent errors in SSR

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    if (userId) {
      socket.emit("userOnline", userId);
    }

    socket.on("updateUsers", (users: User[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("updateUsers");
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md py-4 px-6 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold">Edu_AI Dashboard</h1>
        {notification && <span className="bg-yellow-300 text-black px-2 py-1 rounded">{notification}</span>}
        <p className="hidden md:block">Online Users: {onlineUsers.length}</p>
        <div className="space-x-4 text-lg font-medium">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/admin" className="hover:text-gray-300">Admin</Link>
          <Link href="/student" className="hover:text-gray-300">Student</Link>
          <Link href="/lecturer" className="hover:text-gray-300">Lecturer</Link>
        </div>
        <ul className="flex space-x-4">
          {session?.user ? (
            <>
              <li className="hidden md:block">Welcome, {session.user.email}</li>
              <li>
                <button onClick={() => signOut()} className="bg-red-500 px-4 py-2 rounded hover:bg-red-700">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="hover:text-gray-300">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="pt-20"></div>
    </>
  );
}
