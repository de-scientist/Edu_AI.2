"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Book, Users, Brain, ChartBar, Award, ArrowRight } from "lucide-react";
import Hero from "@components/Hero";
import FeatureGrid from "@components/FeatureGrid";
import ChartSection from "@components/ChartSection";
import StatsSection from "@components/StatsSection";
import AboutUs from "@components/AboutUs";
import ActionButtons from "@components/Buttons";
import { useSession } from "next-auth/react";
import { useDataFetching } from "./hooks/useDataFetching";

const features = [
  {
    title: "AI-Driven Learning",
    description:
      "Personalized learning paths powered by artificial intelligence to adapt to your learning style and pace.",
    icon: Brain,
    href: "/courses",
  },
  {
    title: "Interactive Resources",
    description:
      "Access a vast library of educational resources, including videos, articles, and interactive exercises.",
    icon: Book,
    href: "/resources",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your learning progress with detailed analytics and performance insights.",
    icon: ChartBar,
    href: "/student/progress",
  },
  {
    title: "Community Learning",
    description:
      "Connect with fellow students and instructors in a collaborative learning environment.",
    icon: Users,
    href: "/community",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  // Use the custom hook for data fetching
  const { 
    data: stats,
    loading: statsLoading,
    error: statsError
  } = useDataFetching({
    url: "http://localhost:5000/eduai/stats",
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const { 
    data: userData,
    loading: usersLoading,
    error: usersError
  } = useDataFetching({
    url: "http://localhost:5000/eduai/users",
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDashboardLink = () => {
    if (!session?.user?.role) return "/dashboard";
    return `/${session.user.role.toLowerCase()}/dashboard`;
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" suppressHydrationWarning>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" suppressHydrationWarning>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20" suppressHydrationWarning />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{" "}
              <span className="text-blue-600 dark:text-blue-400">Edu_AI</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your AI-powered learning platform for personalized education and skill development.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              {status === "unauthenticated" ? (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  href={getDashboardLink()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Go to {session?.user?.role ? `${session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}` : ''} Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20" suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Edu_AI?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Discover the features that make our platform unique
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" suppressHydrationWarning>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="relative group"
              >
                <Link href={feature.href}>
                  <div className="h-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Only show chart section if user is authenticated */}
      {status === "authenticated" && (
        <section className="mt-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-4"
          >
            Analytics Dashboard
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-gray-600 dark:text-gray-300 mb-8"
          >
            Track your learning progress and performance metrics
          </motion.p>
          
          {statsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : statsError ? (
            <div className="text-center text-red-500 py-8">
              <p>Error loading data: {statsError.message}</p>
              <p className="text-sm mt-2">Please try again later or contact support.</p>
            </div>
          ) : (
            <ChartSection data={stats} />
          )}
        </section>
      )}
      
      <AboutUs />
      <ActionButtons />
    </div>
  );
}
