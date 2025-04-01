"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StudentInput from "@/app/components/StudentInput";
import StudyPlanner from "@/app/components/StudyPlanner";
import LearningPath from "@/app/components/LearningPath";
import ProgressPrediction from "@/app/components/progressPrediction";
import Quiz from "@/app/components/Quiz";
import StudyRecommendations from "@/app/components/StudyRecommendations";
import NotesSummarizer from "@/app/components/NotesSummarizer";

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [week, setWeek] = useState(null);
  const [pastProgress, setPastProgress] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      axios.get(`/api/student-progress/${session.user.id}`)
        .then(res => {
          setWeek(res.data.week);
          setPastProgress(res.data.pastProgress);
        })
        .catch(err => console.error("Error fetching progress:", err));
    }
  }, [session?.user?.id]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session?.user?.id) {
    return <p className="text-red-500">Error: No student ID found. Please log in.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <StudentInput />
      <StudyPlanner />
      <LearningPath studentId={session.user.id} />
      {/* ✅ Pass `week` and `pastProgress` safely */}
      <ProgressPrediction week={week} pastProgress={pastProgress} />
      <Quiz />
      <StudyRecommendations />
      <NotesSummarizer />
      <p>View courses, profile, and academic progress.</p>
    </div>
  );
}
