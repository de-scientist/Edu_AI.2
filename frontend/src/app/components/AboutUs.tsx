"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AboutUs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.section 
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      suppressHydrationWarning
    >
      <h2 className="text-3xl font-semibold text-shadow text-center" suppressHydrationWarning>
        About Us
      </h2>
      <p className="text-lg mt-2 leading-relaxed text-center text-gray-600 dark:text-gray-300" suppressHydrationWarning>
        Edu_AI is built by a passionate team of educators and developers, aiming to revolutionize education through AI-driven learning.
      </p>
    </motion.section>
  );
}
  