import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ReminderScheduler from "@/app/components/ReminderScheduler";
import ProgressChart from "@/app/components/ProgressChart";
import GoalTracker from "@/app/components/GoalTracker";
import Quiz from "@/app/components/Quiz";
import Recommendation from "@/app/components/Recommendation";
import PerformanceDashboard from "@/app/components/PerformanceDashboard";
import PerformanceDashboard from "../components/PerformanceDashboard";

export default function LecturerDashboard() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Lecturer Dashboard</h1>
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
  