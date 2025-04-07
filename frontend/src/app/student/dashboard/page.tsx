"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Book,
  Users,
  Award,
  ChartBar,
  Video,
  MessageCircle,
  FileText,
  Smile,
  Settings,
  LogOut,
  RefreshCw
} from "lucide-react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ProgressCard from '../../components/dashboard/ProgressCard';
import LearningPathCard from '../../components/dashboard/LearningPathCard';
import ChatPanel from '../../components/dashboard/ChatPanel';
import { useStudentDashboard } from '../../contexts/StudentDashboardContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StudentDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [feedback, setFeedback] = useState('');
  
  // Use our context
  const { 
    progress, 
    weeklyProgress, 
    learningPath, 
    chatHistory, 
    quizzes, 
    achievements, 
    studyPlan, 
    gamificationStats, 
    analytics, 
    loading, 
    error, 
    sendMessage, 
    refreshData 
  } = useStudentDashboard();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/auth/signin");
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role !== "STUDENT") {
        router.push("/");
        return;
      }
      setUserData(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/signin");
    }
  }, [router]);

  const handleModuleClick = async (moduleId: string) => {
    if (!userData) return;
    
    try {
      // Navigate to module page
      router.push(`/student/module/${moduleId}`);
    } catch (error) {
      console.error("Error navigating to module:", error);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!userData || !feedback.trim()) return;
    
    try {
      // Submit feedback
      // This would be implemented in the service
      setFeedback('');
      // Show success message
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/signin");
  };

  // Prepare chart data for weekly progress
  const chartData = {
    labels: weeklyProgress?.map((item: any) => item.week) || [],
    datasets: [
      {
        label: 'Weekly Progress',
        data: weeklyProgress?.map((item: any) => item.progress) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Learning Progress',
      },
    },
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-300">
              Welcome, {userData?.name || 'Student'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {['overview', 'learning', 'progress', 'resources', 'chat', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Enrolled</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {progress?.length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Study Groups</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {studyPlan?.groups?.length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Achievements</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {achievements?.length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                    <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </motion.div>

              {/* Progress Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2 lg:col-span-3"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Learning Progress</h2>
                <div className="h-64">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </motion.div>
            </div>
          )}

          {/* Learning Tab */}
          {activeTab === 'learning' && (
            <div className="space-y-6">
              {learningPath && (
                <LearningPathCard 
                  learningPath={learningPath} 
                  onModuleClick={handleModuleClick} 
                />
              )}
              
              {/* Upcoming Quizzes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upcoming Quizzes</h2>
                <div className="space-y-4">
                  {quizzes?.filter((quiz: any) => !quiz.completed).slice(0, 3).map((quiz: any) => (
                    <div 
                      key={quiz.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{quiz.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {quiz.module?.name || 'Unknown Module'}
                        </p>
                      </div>
                      <button 
                        onClick={() => router.push(`/student/quiz/${quiz.id}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Take Quiz
                      </button>
                    </div>
                  ))}
                  
                  {(!quizzes || quizzes.filter((q: any) => !q.completed).length === 0) && (
                    <p className="text-gray-500 dark:text-gray-400">No upcoming quizzes</p>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Course Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Course Progress</h2>
                <div className="space-y-4">
                  {progress?.map((item: any) => (
                    <ProgressCard 
                      key={item.id}
                      progress={item}
                      title={item.course?.name || 'Unknown Course'}
                      description={`Module: ${item.module?.name || 'Not started'}`}
                      icon={<Book className="h-5 w-5" />}
                    />
                  ))}
                  
                  {(!progress || progress.length === 0) && (
                    <p className="text-gray-500 dark:text-gray-400">No progress data available</p>
                  )}
                </div>
              </motion.div>
              
              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements?.map((achievement: any) => (
                    <div 
                      key={achievement.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center gap-3"
                    >
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                        <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {(!achievements || achievements.length === 0) && (
                    <p className="text-gray-500 dark:text-gray-400 col-span-full">No achievements yet</p>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              {/* Learning Resources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recommended Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {learningPath?.resources?.map((resource: any) => (
                    <div 
                      key={resource.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{resource.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{resource.description}</p>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Resource
                      </a>
                    </div>
                  ))}
                  
                  {(!learningPath?.resources || learningPath.resources.length === 0) && (
                    <p className="text-gray-500 dark:text-gray-400 col-span-full">No resources available</p>
                  )}
                </div>
              </motion.div>
              
              {/* Sentiment Feedback */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Feedback</h2>
                <div className="space-y-4">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts on the learning content..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={4}
                  />
                  <button
                    onClick={handleFeedbackSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Submit Feedback
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Learning Assistant</h2>
                {userData && <ChatPanel userId={userData.id} />}
              </motion.div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {userData?.avatar ? (
                        <img 
                          src={userData.avatar} 
                          alt={userData.name} 
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                          {userData?.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white">{userData?.name}</h3>
                      <p className="text-gray-500 dark:text-gray-400">{userData?.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Learning Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Courses Enrolled</span>
                          <span className="font-medium text-gray-900 dark:text-white">{progress?.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Completed Modules</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {progress?.filter((p: any) => p.progress === 100).length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Achievements</span>
                          <span className="font-medium text-gray-900 dark:text-white">{achievements?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Study Plan</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Current Focus</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {studyPlan?.currentFocus || 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Study Hours This Week</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {studyPlan?.weeklyHours || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Next Milestone</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {studyPlan?.nextMilestone || 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 