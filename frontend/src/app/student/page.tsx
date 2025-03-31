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
    return (
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <StudentInput />
      <StudyPlanner />
      <LearningPath studentId={studentId} />
      <ProgressPrediction />
      <Quiz />
      <StudyRecommendations />
      <NotesSummarizer />
        <p>View courses, profile, and academic progress.</p>
      </div>
    );
  }
  