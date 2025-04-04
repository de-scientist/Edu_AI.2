"use client";
import { motion } from "framer-motion";

export default function StatsSection({ statsData }: { statsData: any }) {
  if (!statsData) return null;

  return (
    <motion.section
      className="mt-8 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-semibold text-shadow">Edu_AI Statistics</h2>
      <motion.div
        className="mt-4 bg-gray-100 p-6 rounded-lg shadow-md inline-block"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg font-semibold">📚 Total Active Students: {statsData.totalStudents}</p>
        <p className="text-lg font-semibold">📝 Questions Answered: {statsData.totalQuestions}</p>
        <p className="text-lg font-semibold">📈 Completion Rate: {statsData.avgCompletionRate}%</p>
      </motion.div>
    </motion.section>
  );
}
