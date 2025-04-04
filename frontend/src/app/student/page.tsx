"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import StudentInput from "@/app/components/StudentInput";
import StudyPlanner from "@/app/components/StudyPlanner";
import LearningPath from "@/app/components/LearningPath";
import ProgressPrediction from "@/app/components/progressPrediction";
import { Quiz } from "@/app/components/Quiz";
import StudyRecommendations from "@/app/components/StudyRecommendations";
import NotesSummarizer from "@/app/components/NotesSummarizer";

export default function StudentDashboard() {
  const router = useRouter();
  const [week, setWeek] = useState<number | null>(null);
  const [pastProgress, setPastProgress] = useState<any>(null);
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const users = [
    { email: "student@example.com", password: "student123", id: "1", role: "student" },
    { email: "lecturer@example.com", password: "lecturer123", id: "2", role: "lecturer" },
    { email: "admin@example.com", password: "admin123", id: "3", role: "admin" }
  ];

  const handleLogin = () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return setError("Invalid email or password.");
    if (user.role !== "student") return setError("You do not have permission to access the student dashboard.");

    setId(user.id);
    setWeek(1);
    setPastProgress("50% completed");
  };

  useEffect(() => {
    if (id) {
      setWeek(1);
      setPastProgress("50% completed");
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.h1
          className="text-4xl font-extrabold text-indigo-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎓 Student Dashboard
        </motion.h1>
        <motion.p
          className="text-indigo-500 text-sm tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Learn. Reflect. Progress.
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
          )}

          {id && (
            <motion.div
              key="dashboard"
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                { component: <StudentInput />, key: "input", span: 2 },
                { component: <StudyPlanner id={id} />, key: "planner" },
                { component: <LearningPath id={id} />, key: "path" },
                { component: <ProgressPrediction week={week ?? 0} pastProgress={pastProgress} />, key: "progress" },
                { component: <Quiz id={id} />, key: "quiz" },
                { component: <StudyRecommendations id={id} />, key: "recommendations" },
                { component: <NotesSummarizer />, key: "notes", span: 2 },
              ].map(({ component, key, span = 1 }, index) => (
                <motion.div
                  key={key}
                  className={`bg-white p-6 rounded-2xl shadow-lg ${span === 2 ? "col-span-2" : ""}`}
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
