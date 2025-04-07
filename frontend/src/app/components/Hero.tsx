"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="text-center mt-10"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      suppressHydrationWarning
    >
      <h1 className="text-4xl font-bold text-shadow" suppressHydrationWarning>
        Welcome to the Edu_AI Dashboard
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300" suppressHydrationWarning>
        Your personalized learning journey starts here
      </p>
    </motion.div>
  );
}
