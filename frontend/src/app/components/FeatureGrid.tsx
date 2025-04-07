"use client";
import React, { useState, useEffect } from "react";  // Ensure React is imported for JSX
import { motion } from "framer-motion";

// Define the features
const features = [
  {
    title: "What is Edu_AI?",
    content: "Edu_AI is an AI-powered educational system designed to enhance student-teacher interactions and create personalized learning experiences.",
  },
  {
    title: "Core Features",
    content: (
      <ul className="list-disc pl-6 text-left space-y-2">
        <li><b>Personalized Learning Paths:</b> Tailored educational journeys.</li>
        <li><b>AI-Powered Q&A:</b> Real-time AI-generated answers.</li>
        <li><b>Progress Tracking:</b> Track and improve learning.</li>
        <li><b>Feedback & Adaptation:</b> Dynamic learning adjustment.</li>
        <li><b>Gamification:</b> Interactive learning coming soon.</li>
      </ul>
    ),
  },
  {
    title: "How Does Edu_AI Work?",
    content: "It uses AI to predict optimal learning paths and NLP for real-time Q&A. Content refines based on student performance.",
  },
];

export default function FeatureGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mt-10" suppressHydrationWarning>
      {features.map((feature, i) => (
        <motion.div
          key={i}
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.3, duration: 0.6 }}
          suppressHydrationWarning
        >
          <h2 className="text-2xl font-semibold text-shadow text-center" suppressHydrationWarning>{feature.title}</h2>
          <div className="mt-4 text-lg text-center" suppressHydrationWarning>
            {/* Render content conditionally */}
            {typeof feature.content === "string" ? (
              feature.content // Render plain text content
            ) : (
              <>{feature.content}</>  // Use React.Fragment to safely render JSX
            )}
          </div>
        </motion.div>
      ))}
    </section>
  );
}
