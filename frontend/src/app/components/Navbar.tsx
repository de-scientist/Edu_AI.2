"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Link from "next/link";

const socket = io("http://localhost:5000");

export default function Navbar() {
  const { data: session } = useSession();
  const [notification, setNotification] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => setNotification(`New Message: ${msg}`));

    return () => {
      socket.off("receiveMessage"); // ✅ Proper cleanup
    };
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("userOnline", userId);
    }

    socket.on("updateUsers", (users) => setOnlineUsers(users));

    return () => {
      socket.off("updateUsers"); // ✅ Proper cleanup
    };
  }, []);

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Edu_AI Dashboard</h1>

      {notification && <span className="bg-yellow-300 px-2 py-1 rounded">{notification}</span>}
      <p>Online Users: {onlineUsers.length}</p>

      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/student">Student</Link>
        <Link href="/lecturer">Lecturer</Link>
      </div>

      <ul className="flex space-x-4">
        {session?.user ? (
          <>
            <li>Welcome, {session.user.email}</li>
            <li>
              <button onClick={() => signOut()} className="bg-red-500 px-4 py-2 rounded">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
