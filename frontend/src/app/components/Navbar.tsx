"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Navbar() {
  const { data: session } = useSession();
  const [notification, setNotification] = useState("");
  const [ onlineUsers, setOnlineUsers] = useState([]);


  useEffect(() => {

    socket.on("receiveMessage", (msg) => setNotification(`New Message: ${msg}`));
  }, []);

  //Track and Display Online Users
  useEffect(() => {

    const userId = localStorage.getItem("userId");
    socket.emit("userOnline", userId);

    socket.on("updateUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <nav className = "bg-blue-500 p-4 text-white flex justify-between" >
      <h1 className="text-x1 font-bold">Edu_AI Dashboard</h1>
      {notification && <span className="bg-yellow-300 px-2 py-1">{notification}</span>}
      <p>Online Users: {onlineUsers.length}</p>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/student">Student</Link>
        <Link href="/lecturer">Lecturer</Link>
      </div>
      <ul>
        <li><a href="/">Home</a></li>
        {session?.user ? (
          <>
            <li>Welcome, {session.user.email}</li>
            <li><button onClick={() => signOut()} className="bg-red-500 px-4 py-2 rounded">Logout</button></li>
          </>
        ) : (
          <li><a href="/login">Login</a></li>
        )}
      </ul>
    </nav>
  );
}
