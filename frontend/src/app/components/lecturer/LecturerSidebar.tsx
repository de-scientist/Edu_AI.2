"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  BarChart2,
  Video,
  FileText,
  MessageSquare,
  Bell,
  Bot
} from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface LecturerSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const LecturerSidebar = ({ activeTab, onTabChange }: LecturerSidebarProps) => {
  const tabs: Tab[] = [
    { id: "overview", label: "Overview", icon: <Home size={20} /> },
    { id: "courses", label: "Courses", icon: <BookOpen size={20} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
    { id: "interaction", label: "Live Interaction", icon: <Video size={20} /> },
    { id: "assessment", label: "Assessment", icon: <FileText size={20} /> },
    { id: "feedback", label: "Feedback", icon: <MessageSquare size={20} /> },
    { id: "communication", label: "Communication", icon: <Bell size={20} /> },
    { id: "ai-assistant", label: "AI Assistant", icon: <Bot size={20} /> }
  ];

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
    >
      <nav className="p-2">
        <div className="space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </motion.aside>
  );
};

export default LecturerSidebar; 