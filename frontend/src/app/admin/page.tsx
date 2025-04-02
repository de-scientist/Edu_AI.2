"use client";  // Ensure this file is treated as a client component in Next.js

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";  // Import redirect for Next.js
import { getSession } from "next-auth/react";  // Import getSession from next-auth
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import styles from "../styles/admin.module.css";
import AdminDashboard from "@/app/components/AdminDashboard";
import LeaderBoard from "@/app/components/Leaderboard";
import PerformanceDashboard from "@/app/components/PerformanceDashboard";
import Recommendation from "@/app/components/Recommendations";

// Define a type for the user state
interface User {
  id: string;
  email: string;
  role: string;
}


export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
 // return <div className={styles.adminPage}>Admin Dashboard</div>;
  
  // Use useEffect to load the user asynchronously
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        setUser(session?.user || null);
        setLoading(false);
  
        if (!session?.user) {
          router.push("/login");
        } else if (session.user.role !== "admin") {
          router.push("/unauthorized");
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
