"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useDataFetching } from '../hooks/useDataFetching';
import {
  LecturerProfile,
  Course,
  Session,
  CourseAnalytics,
  StudentFeedback,
  LecturerChatMessage,
  AIInsight,
  ContentSuggestion
} from '../types/lecturer';

// Define the context type
interface LecturerDashboardContextType {
  profile: LecturerProfile | null;
  courses: Course[];
  selectedCourse: Course | null;
  sessions: Session[];
  analytics: CourseAnalytics | null;
  studentFeedback: StudentFeedback[];
  chatMessages: LecturerChatMessage[];
  aiInsights: AIInsight[];
  contentSuggestions: ContentSuggestion[];
  loading: boolean;
  error: string | null;
  selectCourse: (courseId: string) => Promise<void>;
  sendMessage: (recipientId: string, content: string, courseId?: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

// Create the context
const LecturerDashboardContext = createContext<LecturerDashboardContextType | undefined>(undefined);

// Provider component
export function LecturerDashboardProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Only render after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch profile data
  const { 
    data: profile, 
    loading: profileLoading, 
    error: profileError,
    refetch: refetchProfile 
  } = useDataFetching<LecturerProfile>({
    url: `http://localhost:5000/api/lecturer/profile/${session?.user?.id}`,
    cacheTime: 10 * 60 * 1000, // 10 minutes cache
  });

  // Fetch courses data
  const { 
    data: courses = [], 
    loading: coursesLoading, 
    error: coursesError,
    refetch: refetchCourses 
  } = useDataFetching<Course[]>({
    url: 'http://localhost:5000/api/lecturer/courses',
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Fetch selected course data
  const { 
    data: selectedCourse, 
    loading: selectedCourseLoading, 
    error: selectedCourseError,
    refetch: refetchSelectedCourse 
  } = useDataFetching<Course>({
    url: selectedCourseId ? `http://localhost:5000/api/lecturer/courses/${selectedCourseId}` : '',
    cacheTime: 5 * 60 * 1000,
  });

  // Fetch course sessions
  const { 
    data: sessions = [], 
    loading: sessionsLoading, 
    error: sessionsError,
    refetch: refetchSessions 
  } = useDataFetching<Session[]>({
    url: selectedCourseId ? `http://localhost:5000/api/lecturer/courses/${selectedCourseId}/sessions` : '',
    cacheTime: 5 * 60 * 1000,
  });

  // Fetch course analytics
  const { 
    data: analytics, 
    loading: analyticsLoading, 
    error: analyticsError,
    refetch: refetchAnalytics 
  } = useDataFetching<CourseAnalytics>({
    url: selectedCourseId ? `http://localhost:5000/api/lecturer/courses/${selectedCourseId}/analytics` : '',
    cacheTime: 5 * 60 * 1000,
  });

  // Fetch student feedback
  const { 
    data: studentFeedback = [], 
    loading: feedbackLoading, 
    error: feedbackError,
    refetch: refetchFeedback 
  } = useDataFetching<StudentFeedback[]>({
    url: selectedCourseId ? `http://localhost:5000/api/lecturer/courses/${selectedCourseId}/feedback` : '',
    cacheTime: 5 * 60 * 1000,
  });

  // Fetch AI insights
  const { 
    data: aiInsights = [], 
    loading: insightsLoading, 
    error: insightsError,
    refetch: refetchInsights 
  } = useDataFetching<AIInsight[]>({
    url: selectedCourseId ? `http://localhost:5000/api/lecturer/courses/${selectedCourseId}/insights` : '',
    cacheTime: 5 * 60 * 1000,
  });

  // Fetch content suggestions
  const { 
    data: contentSuggestions = [], 
    loading: suggestionsLoading, 
    error: suggestionsError,
    refetch: refetchSuggestions 
  } = useDataFetching<ContentSuggestion[]>({
    url: selectedCourseId ? `http://localhost:5000/api/lecturer/courses/${selectedCourseId}/suggestions` : '',
    cacheTime: 5 * 60 * 1000,
  });

  // Calculate overall loading and error states
  const loading = 
    profileLoading || 
    coursesLoading || 
    selectedCourseLoading || 
    sessionsLoading || 
    analyticsLoading || 
    feedbackLoading || 
    insightsLoading || 
    suggestionsLoading;

  const error = 
    profileError || 
    coursesError || 
    selectedCourseError || 
    sessionsError || 
    analyticsError || 
    feedbackError || 
    insightsError || 
    suggestionsError;

  // Select a course
  const selectCourse = useCallback(async (courseId: string) => {
    setSelectedCourseId(courseId);
  }, []);

  // Send a chat message
  const sendMessage = useCallback(async (recipientId: string, content: string, courseId?: string) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('http://localhost:5000/api/lecturer/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          senderId: session.user.id,
          recipientId,
          content,
          courseId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Refresh chat messages
      // You might want to implement a more efficient way to update chat messages
      // For now, we'll just refetch all data
      await refreshData();
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, [session]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      refetchProfile(),
      refetchCourses(),
      refetchSelectedCourse(),
      refetchSessions(),
      refetchAnalytics(),
      refetchFeedback(),
      refetchInsights(),
      refetchSuggestions(),
    ]);
  }, [
    refetchProfile,
    refetchCourses,
    refetchSelectedCourse,
    refetchSessions,
    refetchAnalytics,
    refetchFeedback,
    refetchInsights,
    refetchSuggestions,
  ]);

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  // Context value
  const value: LecturerDashboardContextType = {
    profile,
    courses,
    selectedCourse,
    sessions,
    analytics,
    studentFeedback,
    chatMessages: [], // Implement chat messages separately if needed
    aiInsights,
    contentSuggestions,
    loading,
    error: error as string | null,
    selectCourse,
    sendMessage,
    refreshData,
  };

  return (
    <LecturerDashboardContext.Provider value={value}>
      {children}
    </LecturerDashboardContext.Provider>
  );
}

// Custom hook to use the context
export function useLecturerDashboard() {
  const context = useContext(LecturerDashboardContext);
  if (context === undefined) {
    throw new Error('useLecturerDashboard must be used within a LecturerDashboardProvider');
  }
  return context;
} 