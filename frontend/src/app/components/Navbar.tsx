"use client";

import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className = "bg-blue-500 p-4 text-white flex justify-between" >
      <h1 className="text-x1 font-bold">Edu_AI Dashboard</h1>
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
