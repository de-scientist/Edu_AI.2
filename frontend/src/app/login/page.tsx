"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Reset error state on each attempt

    try {
      // Send login request to backend
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Invalid email or password");

      // Store JWT token in localStorage
      localStorage.setItem("accessToken", data.token);

      // Define roleRedirects mapping for easy redirection
      const roleRedirects: Record<string, string> = {
        admin: "/admin",
        student: "/student",
        lecturer: "/lecturer",
      };

      // Redirect user based on their role
      const role = data.user.role.toLowerCase();
      if (role in roleRedirects) {
        console.log("🚀 Redirecting to:", roleRedirects[role]);
        setTimeout(() => router.push(roleRedirects[role]), 300);
      } else {
        setError("Invalid role detected, please contact support.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong, please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-lg w-96" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error} <br />
            {error.toLowerCase().includes("invalid email or password") && (
              <>
                <span className="text-sm">Try one of the following:</span>
                <ul className="list-disc pl-5 text-sm">
                  <li>Student: student@example.com / student123</li>
                  <li>Lecturer: lecturer@example.com / lecturer123</li>
                  <li>Admin: admin@example.com / admin123</li>
                </ul>
              </>
            )}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded my-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded my-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>

        <p className="text-sm text-center mt-2">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 underline">Sign up</a>
        </p>
      </form>
    </div>
  );
}
