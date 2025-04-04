"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Define the prop types for LoginForm
interface LoginFormProps {
  onSubmit: (email: string, password: string) => void; // Expecting email and password as arguments
}

// Simple Loader for Shimmer effect
const ShimmerLoader = () => (
  <motion.div
    animate={{ x: ["-100%", "100%"] }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    className="w-full h-24 bg-gray-300 rounded-md overflow-hidden relative"
  >
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-50"></div>
  </motion.div>
);

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mock login logic
    if (email === "lecturer@example.com" && password === "password123") {
      // Redirect to the lecturer page
      router.push("/lecturer");
    } else if (email === "admin@example.com" && password === "password123") {
      // Redirect to the admin page
      router.push("/admin");
    } else {
      // Handle invalid login attempt
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 mt-4 rounded-md text-white font-bold ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} transition-colors duration-200`}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
