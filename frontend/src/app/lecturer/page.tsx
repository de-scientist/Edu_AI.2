"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ReminderScheduler from "@/app/components/ReminderScheduler";
import ProgressChart from "@/app/components/ProgressChart";
import GoalTracker from "@/app/components/GoalTracker";
import { Quiz } from "@/app/components/Quiz";
import Recommendation from "@/app/components/Recommendations";
import PerformanceDashboard from "@/app/components/PerformanceDashboard";

export default function LecturerDashboard() {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const users = [
    { email: "student@example.com", password: "student123", id: "1", role: "student" },
    { email: "lecturer@example.com", password: "lecturer123", id: "2", role: "lecturer" },
    { email: "admin@example.com", password: "admin123", id: "3", role: "admin" }
  ];

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return setError("Invalid email or password.");
    if (user.role !== "lecturer") return setError("You do not have permission to access the lecturer dashboard.");

    setId(user.id);
  };

  useEffect(() => {
    if (id) {
      // Could set additional state like teaching subjects, etc.
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.h1
          className="text-4xl font-extrabold text-blue-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🧑‍🏫 Lecturer Dashboard
        </motion.h1>
        <motion.p
          className="text-blue-500 text-sm tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Teach. Guide. Evaluate.
        </motion.p>

        <AnimatePresence mode="wait">
          {!id && (
            <motion.div
              key="login"
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto mt-10 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-blue-700">Login to Continue</h2>

              <input
                type="email"
                className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />

              <input
                type="password"
                className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all"
              >
                Login
              </button>
            </motion.div>
          )}

          {id && (
            <motion.div
              key="dashboard"
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex gap-4">
                <Navbar />
                <Sidebar />
              </div>

              {[
                { component: <ReminderScheduler id={id} />, key: "reminder" },
                { component: <ProgressChart id={id} />, key: "chart" },
                { component: <GoalTracker id={id} />, key: "goals" },
                { component: <Quiz id={id} />, key: "quiz" },
                { component: <Recommendation id={id} />, key: "recommendation" },
                { component: <PerformanceDashboard id={id} />, key: "performance" },
              ].map(({ component, key }, index) => (
                <motion.div
                  key={key}
                  className="bg-white p-6 rounded-2xl shadow-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                >
                  {component}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
