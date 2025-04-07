"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  BarChart2,
  Award,
  Bookmark,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Performance", href: "/performance", icon: BarChart2 },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Settings", href: "/settings", icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen fixed left-0 top-16 overflow-y-auto"
    >
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
