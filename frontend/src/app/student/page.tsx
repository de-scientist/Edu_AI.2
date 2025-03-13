import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StudentInput from "@/app/components/StudentInput";
import StudyPlanner from "@/app/components/StudyPlanner";
import LearningPath from "@/app/components/LearningPath";
import ProgressPrediction from "@/app/components/ProgressPrediction";
import Quiz from "@/app/components/Quiz";
import StudyRecommendation from "@/app/components/StudyRecommendation";
import NotesSummarizer from "@/app/components/NotesSummarizer";

export default function StudentDashboard() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <StudentInput />
      <StudyPlanner />
      <LearningPath />
      <ProgressPrediction />
      <Quiz />
      <StudyRecommendation />
      <NotesSummarizer />
        <p>View courses, profile, and academic progress.</p>
      </div>
    );
  }
  