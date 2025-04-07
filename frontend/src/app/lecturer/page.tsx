"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import DashboardCard from "@/app/components/DashboardCard";
import WeeklyProgressChart from "@/app/components/ProgressChart";
import LecturerSidebar from "@/app/components/lecturer/LecturerSidebar";
import CourseManagement from "@/app/components/lecturer/CourseManagement";
import StudentAnalytics from "@/app/components/lecturer/StudentAnalytics";
import LiveInteraction from "@/app/components/lecturer/LiveInteraction";
import AssessmentTools from "@/app/components/lecturer/AssessmentTools";
import FeedbackSystem from "@/app/components/lecturer/FeedbackSystem";
import Communication from "@/app/components/lecturer/Communication";
import AIAssistant from "@/app/components/lecturer/AIAssistant";
import { LecturerDashboardProvider } from "../contexts/LecturerDashboardContext";
import LoadingSpinner from "@/app/components/LoadingSpinner";

const LecturerDashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && session?.user?.role?.toLowerCase() !== "lecturer") {
      router.push("/unauthorized");
    }
  }, [status, session, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Courses">
              <div className="text-3xl font-bold text-blue-600">12</div>
            </DashboardCard>
            <DashboardCard title="Students">
              <div className="text-3xl font-bold text-green-600">245</div>
            </DashboardCard>
            <DashboardCard title="Sessions">
              <div className="text-3xl font-bold text-purple-600">48</div>
            </DashboardCard>
            <div className="col-span-full">
              <WeeklyProgressChart id="lecturer-1" />
            </div>
          </div>
        );
      case "courses":
        return <CourseManagement />;
      case "analytics":
        return <StudentAnalytics />;
      case "interaction":
        return <LiveInteraction />;
      case "assessment":
        return <AssessmentTools />;
      case "feedback":
        return <FeedbackSystem />;
      case "communication":
        return <Communication />;
      case "ai-assistant":
        return <AIAssistant />;
      default:
        return null;
    }
  };

  return (
    <LecturerDashboardProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <LecturerSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {renderContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </LecturerDashboardProvider>
  );
};

export default LecturerDashboard;
