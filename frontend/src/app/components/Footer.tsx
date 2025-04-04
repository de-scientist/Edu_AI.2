"use client"; // ✅ client-side component

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Adding framer-motion for animations

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false); // New state to track if it's mounted on client

  // Ensure year is set after the component is mounted (client-side only)
  useEffect(() => {
    setIsClient(true); // Mark as client-side after mount
    setYear(new Date().getFullYear()); // ✅ Set the current year on mount
  }, []);

  // Add a fade-in animation using framer-motion
  return (
    <motion.footer
      className="text-center py-4 bg-gray-100 dark:bg-gray-800"
      initial={{ opacity: 0 }} // Start with opacity 0
      animate={{ opacity: 1 }} // Animate to opacity 1
      transition={{ duration: 1.5 }} // 1.5 second fade-in
    >
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © {isClient ? year || "Loading..." : "Loading..."} Edu_AI. All rights reserved.
      </p>

      {/* Contact Us Button with Animation */}
      <motion.button
        whileHover={{ scale: 1.1 }} // Scale up on hover
        whileTap={{ scale: 0.95 }}  // Slightly shrink on click
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition duration-200"
      >
        Contact Us
      </motion.button>
    </motion.footer>
  );
}
