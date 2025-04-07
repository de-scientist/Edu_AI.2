"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Book, Clock, Award, TrendingUp } from "lucide-react";

interface Progress {
  courseId: string;
  courseName: string;
  completedLessons: number;
  totalLessons: number;
  lastActivity: string;
  grade: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function StudentProgress() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth/signin");
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role !== "STUDENT") {
        router.push("/auth/signin");
        return;
      }

      // Fetch progress from API
      fetch("http://localhost:5000/api/student/progress", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // Ensure data is an array
          const progressData = Array.isArray(data) ? data : [];
          setProgress(progressData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching progress:", error);
          setProgress([]); // Set empty array on error
          setLoading(false);
        });
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/signin");
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no progress data, show a message
  if (progress.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Learning Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your academic progress and achievements
          </p>
        </motion.div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            No Progress Data Available
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't enrolled in any courses yet or there's no progress data to display.
          </p>
          <button 
            onClick={() => router.push('/student/courses')}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Learning Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your academic progress and achievements
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {progress.map((item, index) => (
          <motion.div
            key={item.courseId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {item.courseName}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Book className="w-4 h-4 mr-2" />
                    <span>Lessons</span>
                  </div>
                  <span className="text-gray-900 dark:text-white">
                    {item.completedLessons}/{item.totalLessons}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Last Activity</span>
                  </div>
                  <span className="text-gray-900 dark:text-white">
                    {item.lastActivity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Award className="w-4 h-4 mr-2" />
                    <span>Grade</span>
                  </div>
                  <span className="text-gray-900 dark:text-white">
                    {item.grade}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${(item.completedLessons / item.totalLessons) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {Math.round((item.completedLessons / item.totalLessons) * 100)}%
                  complete
                </p>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 