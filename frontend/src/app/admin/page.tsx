"use client"; // Ensure this file is treated as a client component in Next.js

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for Next.js navigation
import { motion, AnimatePresence } from "framer-motion"; // Import motion for animations

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AdminDashboard from "@/app/components/AdminDashboard";
import LeaderBoard from "@/app/components/Leaderboard";
import PerformanceDashboard from "@/app/components/PerformanceDashboard";
import Recommendation from "@/app/components/Recommendations";

// Define a type for the user state
interface User {
  id: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulate user data (You can replace this with real authentication logic)
  const users = [
    { email: "admin@example.com", password: "admin123", id: "1", role: "admin" },
    { email: "lecturer@example.com", password: "lecturer123", id: "2", role: "lecturer" },
    { email: "student@example.com", password: "student123", id: "3", role: "student" }
  ];

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      setError("Invalid email or password.");
      return;
    }
    if (user.role !== "admin") {
      setError("You do not have permission to access the admin dashboard.");
      return;
    }

    setUser(user); // Set the logged-in user
  };

  useEffect(() => {
    if (user) {
      setLoading(true); // Set loading to true when the user is logged in
    }
  }, [user]);

  // If user is logged in, render the dashboard
  if (loading && user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="admin-page-container"
      >
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <Navbar />
        <Sidebar />
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 25 }}
          className="dashboard-content"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <AdminDashboard />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="card">
            <LeaderBoard />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 1 } },
            }}
          >
            <PerformanceDashboard id={user.id} />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="card"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 1 } },
            }}
          >
            <Recommendation id={user.id} />
          </motion.div>
        </motion.div>
        <h1>Welcome to the Admin Dashboard</h1>
      </motion.div>
    );
  }

  // Render login form if the user is not logged in
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.h1
          className="text-4xl font-extrabold text-indigo-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎓 Admin Login
        </motion.h1>
        <motion.p
          className="text-indigo-500 text-sm tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Access the admin dashboard.
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key="login"
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto mt-10 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-indigo-700">Login to Continue</h2>

            <input
              type="email"
              className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <input
              type="password"
              className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-all"
            >
              Login
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
