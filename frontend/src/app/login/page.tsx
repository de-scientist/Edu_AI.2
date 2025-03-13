"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) setError("Invalid email or password");
    else window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-lg w-96" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="email" placeholder="Email" className="w-full p-2 border rounded my-2"
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded my-2"
          onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
