"use client";

import { useEffect } from "react";  // ✅ Import useEffect
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ReminderScheduler from "@/app/components/ReminderScheduler";
import ProgressChart from "@/app/components/ProgressChart";
import GoalTracker from "@/app/components/GoalTracker";
import Quiz from "@/app/components/Quiz";
import Recommendation from "@/app/components/Recommendations";
import PerformanceDashboard from "@/app/components/PerformanceDashboard";

export default function LecturerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) router.push("/login");
    else if (session.user.role !== "lecturer") router.push("/unauthorized");
  }, [session, status, router]);  // ✅ Added `router` as a dependency

  if (status === "loading") return <p>Loading...</p>;
  if (!session?.user) return <p className="text-red-500">Error: Please log in.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Lecturer Dashboard</h1>
      <Navbar />  {/* ✅ Added Navbar */}
      <Sidebar />  {/* ✅ Added Sidebar */}
      <ReminderScheduler />
      <ProgressChart />
      <GoalTracker />
      <Quiz />
      <Recommendation />
      <PerformanceDashboard />
      <p>Manage subjects and schedules.</p>
    </div>
  );
}
