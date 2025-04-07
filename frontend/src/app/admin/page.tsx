"use client"; // Ensure this file is treated as a client component in Next.js

import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import motion for animations

import Navbar from "../components/Navbar";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import UserManagement from "@/app/components/admin/UserManagement";
import CurriculumOversight from "@/app/components/admin/CurriculumOversight";
import AnalyticsReporting from "@/app/components/admin/AnalyticsReporting";
import ContentModeration from "@/app/components/admin/ContentModeration";
import FeedbackAggregation from "@/app/components/admin/FeedbackAggregation";
import AISystemTuning from "@/app/components/admin/AISystemTuning";
import PlatformSettings from "@/app/components/admin/PlatformSettings";
import LoadingSpinner from "@/app/components/LoadingSpinner";

// Define a type for the user state
interface User {
  id: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until after hydration
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">User Statistics</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">1,234</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Course Statistics</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">42</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Courses</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Engagement Rate</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">78%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Engagement</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case "users":
        return <UserManagement />;
      case "curriculum":
        return <CurriculumOversight />;
      case "analytics":
        return <AnalyticsReporting />;
      case "moderation":
        return <ContentModeration />;
      case "feedback":
        return <FeedbackAggregation />;
      case "ai-tuning":
        return <AISystemTuning />;
      case "settings":
        return <PlatformSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
