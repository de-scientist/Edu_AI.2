"use client";
import { motion } from "framer-motion";

export default function ActionButtons() {
  return (
    <div className="mt-8 flex justify-center space-x-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-primary"
      >
        Get Started
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-secondary"
      >
        Learn More
      </motion.button>
    </div>
  );
}
