"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useDataFetching } from '../hooks/useDataFetching';

// Define the context type
interface StudentDashboardContextType {
  progress: any[];
  weeklyProgress: any[];
  learningPath: any;
  chatHistory: any[];
  quizzes: any[];
  achievements: any[];
  studyPlan: any;
  gamificationStats: any;
  analytics: any;
  loading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

// Create the context
const StudentDashboardContext = createContext<StudentDashboardContextType | undefined>(undefined);

// Provider component
export function StudentDashboardProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  // Fetch progress data
  const { 
    data: progress = [], 
    loading: progressLoading, 
    error: progressError,
    refetch: refetchProgress 
  } = useDataFetching<any[]>({
    url: `http://localhost:5000/api/student/progress/${session?.user?.id}`,
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Fetch weekly progress
  const { 
    data: weeklyProgress = [], 
    loading: weeklyProgressLoading, 
    error: weeklyProgressError,
    refetch: refetchWeeklyProgress 
  } = useDataFetching<any[]>({
    url: `http://localhost:5000/api/student/weekly-progress/${session?.user?.id}`,
    cacheTime: 5 * 60 * 1000,
  });

  // Fetch learning path
  const { 
    data: learningPath = null, 
    loading: learningPathLoading, 
    error: learningPathError,
    refetch: refetchLearningPath 
  } = useDataFetching<any>({
    url: `http://localhost:5000/api/student/learning-path/${session?.user?.id}`,
    cacheTime: 10 * 60 * 1000, // 10 minutes cache
  });

  // Fetch chat history
  const { 
    data: chatHistory = [], 
    loading: chatHistoryLoading, 
    error: chatHistoryError,
    refetch: refetchChatHistory 
  } = useDataFetching<any[]>({
    url: `http://localhost:5000/api/student/chat-history/${session?.user?.id}`,
    cacheTime: 1 * 60 * 1000, // 1 minute cache for chat
  });

  // Fetch quizzes
  const { 
    data: quizzes = [], 
    loading: quizzesLoading, 
    error: quizzesError,
    refetch: refetchQuizzes 
  } = useDataFetching<any[]>({
    url: `http://localhost:5000/api/student/quizzes/${session?.user?.id}`,
    cacheTime: 5 * 60 * 1000,
  });

  // Fetch achievements
  const { 
    data: achievements = [], 
    loading: achievementsLoading, 
    error: achievementsError,
    refetch: refetchAchievements 
  } = useDataFetching<any[]>({
    url: `http://localhost:5000/api/student/achievements/${session?.user?.id}`,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch study plan
  const { 
    data: studyPlan = null, 
    loading: studyPlanLoading, 
    error: studyPlanError,
    refetch: refetchStudyPlan 
  } = useDataFetching<any>({
    url: `http://localhost:5000/api/student/study-plan/${session?.user?.id}`,
    cacheTime: 10 * 60 * 1000,
  });

  // Fetch gamification stats
  const { 
    data: gamificationStats = null, 
    loading: gamificationStatsLoading, 
    error: gamificationStatsError,
    refetch: refetchGamificationStats 
  } = useDataFetching<any>({
    url: `http://localhost:5000/api/student/gamification/${session?.user?.id}`,
    cacheTime: 5 * 60 * 1000,
  });

  // Fetch analytics
  const { 
    data: analytics = null, 
    loading: analyticsLoading, 
    error: analyticsError,
    refetch: refetchAnalytics 
  } = useDataFetching<any>({
    url: `http://localhost:5000/api/student/analytics/${session?.user?.id}`,
    cacheTime: 5 * 60 * 1000,
  });

  // Send a chat message
  const sendMessage = useCallback(async (message: string) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('http://localhost:5000/api/student/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          userId: session.user.id,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Refresh chat history
      await refetchChatHistory();
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, [session, refetchChatHistory]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      refetchProgress(),
      refetchWeeklyProgress(),
      refetchLearningPath(),
      refetchChatHistory(),
      refetchQuizzes(),
      refetchAchievements(),
      refetchStudyPlan(),
      refetchGamificationStats(),
      refetchAnalytics(),
    ]);
  }, [
    refetchProgress,
    refetchWeeklyProgress,
    refetchLearningPath,
    refetchChatHistory,
    refetchQuizzes,
    refetchAchievements,
    refetchStudyPlan,
    refetchGamificationStats,
    refetchAnalytics,
  ]);

  // Context value
  const value = {
    progress,
    weeklyProgress,
    learningPath,
    chatHistory,
    quizzes,
    achievements,
    studyPlan,
    gamificationStats,
    analytics,
    loading: progressLoading || weeklyProgressLoading || learningPathLoading || 
             chatHistoryLoading || quizzesLoading || achievementsLoading || 
             studyPlanLoading || gamificationStatsLoading || analyticsLoading,
    error: progressError || weeklyProgressError || learningPathError || 
           chatHistoryError || quizzesError || achievementsError || 
           studyPlanError || gamificationStatsError || analyticsError,
    sendMessage,
    refreshData,
  };

  return (
    <StudentDashboardContext.Provider value={value}>
      {children}
    </StudentDashboardContext.Provider>
  );
}

// Custom hook to use the context
export function useStudentDashboard() {
  const context = useContext(StudentDashboardContext);
  if (context === undefined) {
    throw new Error('useStudentDashboard must be used within a StudentDashboardProvider');
  }
  return context;
} 