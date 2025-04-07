"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface StatsData {
  totalStudents: number;
  totalQuestions: number;
  avgCompletionRate: number;
  totalCourses: number;
  completedCourses: number;
}

export default function StatsSection({ statsData }: { statsData: StatsData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!statsData) return null;

  const stats = [
    {
      label: "Total Active Students",
      value: statsData.totalStudents,
      icon: "👥"
    },
    {
      label: "Questions Answered",
      value: statsData.totalQuestions,
      icon: "❓"
    },
    {
      label: "Course Completion Rate",
      value: `${statsData.avgCompletionRate}%`,
      icon: "📈"
    },
    {
      label: "Completed Courses",
      value: `${statsData.completedCourses}/${statsData.totalCourses}`,
      icon: "🎓"
    }
  ];

  return (
    <motion.section
      className="mt-8 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      suppressHydrationWarning
    >
      <h2 className="text-3xl font-semibold text-shadow mb-8" suppressHydrationWarning>Edu_AI Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" suppressHydrationWarning>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            suppressHydrationWarning
          >
            <div className="text-4xl mb-2" suppressHydrationWarning>{stat.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white" suppressHydrationWarning>{stat.label}</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2" suppressHydrationWarning>{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
