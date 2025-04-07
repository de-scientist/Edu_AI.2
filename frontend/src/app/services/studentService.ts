import axios from 'axios';
import {
  LearningPath,
  Module,
  Lecture,
  Quiz,
  Resource,
  Progress,
  Feedback,
  ChatMessage,
  Profile,
  Achievement,
  StudyGroup,
  StudySession
} from '../types/student';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// Learning Path
export const getLearningPath = async (studentId: string): Promise<LearningPath> => {
  const response = await axios.get(`${API_URL}/api/student/learning-path`, {
    headers: getAuthHeaders(),
    params: { studentId }
  });
  return response.data;
};

// Modules
export const getModules = async (learningPathId: string): Promise<Module[]> => {
  const response = await axios.get(`${API_URL}/api/student/modules/${learningPathId}`, getAuthHeaders());
  return response.data;
};

// Lectures
export const getLectures = async (moduleId: string): Promise<Lecture[]> => {
  const response = await axios.get(`${API_URL}/api/student/lectures/${moduleId}`, getAuthHeaders());
  return response.data;
};

export const markLectureComplete = async (lectureId: string, userId: string): Promise<void> => {
  await axios.post(`${API_URL}/api/student/lectures/${lectureId}/complete`, { userId }, getAuthHeaders());
};

// Quizzes
export const getQuizzes = async (studentId: string): Promise<Quiz[]> => {
  const response = await axios.get(`${API_URL}/api/student/quizzes`, {
    headers: getAuthHeaders(),
    params: { studentId }
  });
  return response.data;
};

export const submitQuiz = async (data: {
  studentId: string;
  quizId: string;
  answers: any[];
}): Promise<{ score: number; feedback: string }> => {
  const response = await axios.post(`${API_URL}/api/student/quizzes/submit`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Resources
export const getResources = async (moduleId: string): Promise<Resource[]> => {
  const response = await axios.get(`${API_URL}/api/student/resources/${moduleId}`, getAuthHeaders());
  return response.data;
};

// Progress
export const getStudentProgress = async (studentId: string) => {
  const response = await axios.get(`${API_URL}/api/student/progress`, {
    headers: getAuthHeaders(),
    params: { studentId }
  });
  return response.data;
};

export const getWeeklyProgress = async (studentId: string) => {
  const response = await axios.get(`${API_URL}/api/student/progress/weekly`, {
    headers: getAuthHeaders(),
    params: { studentId }
  });
  return response.data;
};

export const updateProgress = async (data: {
  studentId: string;
  moduleId: string;
  progress: number;
  quizId?: string;
}) => {
  const response = await axios.post(`${API_URL}/api/student/progress`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getModuleProgress = async (studentId: string, moduleId: string) => {
  const response = await axios.get(`${API_URL}/api/student/progress/module`, {
    headers: getAuthHeaders(),
    params: { studentId, moduleId }
  });
  return response.data;
};

// Feedback
export const submitFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> => {
  const response = await axios.post(`${API_URL}/api/student/feedback`, feedback, getAuthHeaders());
  return response.data;
};

// Chat
export const sendChatMessage = async (userId: string, message: string) => {
  const response = await axios.post(`${API_URL}/api/student/chat`, {
    userId,
    message
  }, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getChatHistory = async (userId: string) => {
  const response = await axios.get(`${API_URL}/api/student/chat/history`, {
    headers: getAuthHeaders(),
    params: { userId }
  });
  return response.data;
};

export const clearChatHistory = async (userId: string) => {
  const response = await axios.delete(`${API_URL}/api/student/chat/history`, {
    headers: getAuthHeaders(),
    params: { userId }
  });
  return response.data;
};

// Profile
export const getProfile = async (userId: string): Promise<Profile> => {
  const response = await axios.get(`${API_URL}/api/student/profile/${userId}`, getAuthHeaders());
  return response.data;
};

export const updateProfile = async (userId: string, profile: Partial<Profile>): Promise<Profile> => {
  const response = await axios.put(`${API_URL}/api/student/profile/${userId}`, profile, getAuthHeaders());
  return response.data;
};

// Achievements
export const getAchievements = async (studentId: string): Promise<Achievement[]> => {
  const response = await axios.get(`${API_URL}/api/student/achievements`, {
    headers: getAuthHeaders(),
    params: { studentId }
  });
  return response.data;
};

// Study Groups
export const getStudyGroups = async (userId: string): Promise<StudyGroup[]> => {
  const response = await axios.get(`${API_URL}/api/student/study-groups/${userId}`, getAuthHeaders());
  return response.data;
};

export const createStudyGroup = async (group: Omit<StudyGroup, 'id'>): Promise<StudyGroup> => {
  const response = await axios.post(`${API_URL}/api/student/study-groups`, group, getAuthHeaders());
  return response.data;
};

// Study Sessions
export const getStudySessions = async (groupId: string): Promise<StudySession[]> => {
  const response = await axios.get(`${API_URL}/api/student/study-sessions/${groupId}`, getAuthHeaders());
  return response.data;
};

export const createStudySession = async (session: Omit<StudySession, 'id'>): Promise<StudySession> => {
  const response = await axios.post(`${API_URL}/api/student/study-sessions`, session, getAuthHeaders());
  return response.data;
};

// Gamification API calls
export const getGamificationStats = async (studentId: string) => {
  const response = await axios.get(`${API_URL}/api/student/gamification/stats`, {
    headers: getAuthHeaders(),
    params: { studentId }
  });
  return response.data;
};

// Analytics API calls
export const getAnalytics = async (studentId: string) => {
  const response = await axios.get(`${API_URL}/api/student/analytics`, {
    headers: getAuthHeaders(),
    params: { studentId }
  });
  return response.data;
};

export const updateLearningPathProgress = async (data: {
  studentId: string;
  moduleId: string;
  progress: number;
}) => {
  const response = await axios.post(`${API_URL}/api/student/learning-path/progress`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getStudyPlan = async (studentId: string) => {
  const response = await axios.get(`${API_URL}/api/student/study-plan`, {
    headers: getAuthHeaders(),
    params: { studentId }
  });
  return response.data;
};

export const updateStudyPlan = async (data: {
  studentId: string;
  weeklyHours: number;
  currentFocus: string;
  nextMilestone: string;
}) => {
  const response = await axios.post(`${API_URL}/api/student/study-plan`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
}; 