"use client";  // Ensure this file is treated as a client component in Next.js

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";  // Import redirect for Next.js
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AdminDashboard from "@/app/components/AdminDashboard";
import LeaderBoard from "@/app/components/Leaderboard";
import PerformanceDashboard from "@/app/components/PerformanceDashboard";
import Recommendation from "@/app/components/Recommendations";
import { getSessionUser } from "your-session-utils";  // Replace with your actual session logic

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use useEffect to load the user asynchronously
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getSessionUser(); // Assume getSessionUser is a function that fetches the user session
        setUser(userData);
        setLoading(false);

        if (!userData) {
          redirect("/login");  // Redirect to login if no user
        }

        if (userData.role !== "admin") {
          redirect("/unauthorized");  // Redirect to unauthorized if user is not admin
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;  // Optionally show a loading state
  }

  if (!user) {
    return <p>Error: No user found. Please log in.</p>;  // In case of error fetching user
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <Navbar />
      <Sidebar />
      <AdminDashboard />
      <LeaderBoard />
      <PerformanceDashboard />
      <Recommendation />
      <h1>Welcome to the Admin Dashboard</h1>
    </div>
  );
}
