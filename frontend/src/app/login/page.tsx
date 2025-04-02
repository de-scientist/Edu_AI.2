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
    setError(""); // Reset error on new attempt

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid email or password");
      }

      const { token, role } = await res.json(); // Assuming the response includes role information
      localStorage.setItem("token", token); // Save token in local storage

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin"); // Redirect to admin dashboard
      } else if (role === "student") {
        router.push("/student"); // Redirect to student dashboard
      } else if (role === "lecturer") {
        router.push("/lecturer"); // Redirect to lecturer dashboard
      } else {
        // Fallback if role is not recognized
        setError("Invalid role, please contact support.");
      }
    } catch (err) {
      // Handle login errors
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong, please try again.");
      }

      // Optionally, show an error and redirect to signup after a delay
      setTimeout(() => {
        router.push("/signup");
      }, 3000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-lg w-96" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error} <br />
            Redirecting to{" "}
            <a href="/signup" className="text-blue-500 underline">
              Sign up
            </a>{" "}
            in 3 seconds...
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
