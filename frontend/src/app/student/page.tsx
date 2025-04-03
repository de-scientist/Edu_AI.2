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
  const [week, setWeek] = useState<number | null>(null); // `week` can still be null initially
  const [pastProgress, setPastProgress] = useState<any>(null);
  const [id, setId] = useState<string | null>(null); // Store ID as string

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      axios.get(`/api/student-profile?email=${session.user.email}`)
        .then(res => {
          if (res.data?.id) {
            const studentId = String(res.data.id); // Convert ID to string
            setId(studentId); // Set the ID
            return axios.get(`/api/student-progress/${studentId}`);
          }
        })
        .then(res => {
          if (res) {
            setWeek(res.data.week); // Set week
            setPastProgress(res.data.pastProgress); // Set progress
          }
        })
        .catch(err => console.error("Error fetching data:", err));
    }
  }, [status, session?.user?.email]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session?.user?.email) {
    return <p className="text-red-500">Error: No email found. Please log in.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <StudentInput />
      {id && <StudyPlanner id={id} />}  {/* Pass id to StudyPlanner */}
      {id && <LearningPath id={id} />}  {/* Pass id to LearningPath */}
      <ProgressPrediction week={week ?? 0} pastProgress={pastProgress} /> 
      {/* Pass 0 if week is null */}
      <Quiz />
      {id && <StudyRecommendations id={id} />}  {/* Pass id to StudyRecommendations */}
      <NotesSummarizer />
      <p>View courses, profile, and academic progress.</p>
    </div>
  );
}
