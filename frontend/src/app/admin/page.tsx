import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AdminDashboard from "@/app/components/AdminDashboard";
import LeaderBoard from "@/app/components/Leaderboard";
import PerformanceDashboard from "@/app/components/PerformanceDashboard";
import ProgressChart from "@/app/components/ProgressChart";
import Recommendation from "@/app/components/Recommendation";

export default function AdminPage() {

  const user = await getSessionUser();

  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/unauthorized");

  return (
    <div>
      <h1 className="text-2x1 font-bold">Admin Dashboard</h1>
      <Navbar />
      <Sidebar />
      <AdminDashboard />
      <LeaderBoard />
      <PerformanceDashboard />
      <Recommendation />
      <h1>Welcome to Admin Dashboard</h1>
    </div>
  );
}
