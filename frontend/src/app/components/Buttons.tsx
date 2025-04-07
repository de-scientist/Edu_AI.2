"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function ActionButtons() {
  const router = useRouter();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    if (session) {
      // Redirect to role-specific dashboard
      switch (session.user.role) {
        case "admin":
          router.push("/admin");
          break;
        case "lecturer":
          router.push("/lecturer");
          break;
        case "student":
          router.push("/student");
          break;
        default:
          router.push("/dashboard");
      }
    } else {
      router.push("/login");
    }
  };

  const handleLearnMore = () => {
    router.push("/resources");
  };

  if (!mounted) return null;

  return (
    <motion.div 
      className="mt-8 flex justify-center space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      suppressHydrationWarning
    >
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-primary"
        onClick={handleGetStarted}
        suppressHydrationWarning
      >
        {session ? "Go to Dashboard" : "Get Started"}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-secondary"
        onClick={handleLearnMore}
        suppressHydrationWarning
      >
        Learn More
      </motion.button>
    </motion.div>
  );
}
