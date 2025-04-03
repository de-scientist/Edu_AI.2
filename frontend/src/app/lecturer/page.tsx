"use client";

import { useEffect, useState } from "react";  // ✅ Import useEffect and useState
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ReminderScheduler from "@/app/components/ReminderScheduler";
import ProgressChart from "@/app/components/ProgressChart";
import GoalTracker from "@/app/components/GoalTracker";
import { Quiz } from "@/app/components/Quiz"; // Correct import for named export
import Recommendation from "@/app/components/Recommendations";
import PerformanceDashboard from "@/app/components/PerformanceDashboard";

export default function LecturerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);  // ✅ Track id state

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/login");
    } else if (session.user.role !== "lecturer") {
      router.push("/unauthorized");
    } else {
      // Assuming you fetch the id from an API or from the session data
      // Set the id after the session is authenticated
      setId(session.user?.id || null);  // Adjust based on how the id is stored in session
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session?.user) return <p className="text-red-500">Error: Please log in.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Lecturer Dashboard</h1>
      <Navbar />  {/* ✅ Added Navbar */}
      <Sidebar />  {/* ✅ Added Sidebar */}
      {id && <ReminderScheduler id={id} />} {/* Pass id to ReminderScheduler */}
      {id && <ProgressChart id={id} />} {/* Pass id to ProgressChart */}
      {id && <GoalTracker id={id} />} {/* Pass id to GoalTracker */}
      {id && <Quiz id={id} />} {/* Pass id to Quiz */}
      {id && <Recommendation id={id} />} {/* Pass id to Recommendation */}
      {id && <PerformanceDashboard id={id} />} {/* Pass id to PerformanceDashboard */}
      <p>Manage subjects and schedules.</p>
    </div>
  );
}
