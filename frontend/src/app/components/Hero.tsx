"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Enable client-side rendering after mount
  }, []);

  if (!isClient) return null; // Prevent rendering during SSR

  return (
    <motion.div
      className="text-center mt-10"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className="text-4xl font-bold text-shadow">
        Welcome to the Edu_AI Dashboard
      </h1>
    </motion.div>
  );
}
