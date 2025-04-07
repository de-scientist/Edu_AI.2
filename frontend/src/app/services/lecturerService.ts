import axios from 'axios';
import {
  LecturerProfile,
  Course,
  Session,
  Resource,
  Announcement,
  CourseAnalytics,
  StudentFeedback,
  LecturerChatMessage,
  AIInsight,
  ContentSuggestion
} from '../types/lecturer';

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

// Profile
export const getLecturerProfile = async (lecturerId: string): Promise<LecturerProfile> => {
  const response = await axios.get(`${API_URL}/api/lecturer/profile/${lecturerId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateLecturerProfile = async (lecturerId: string, profile: Partial<LecturerProfile>): Promise<LecturerProfile> => {
  const response = await axios.put(`${API_URL}/api/lecturer/profile/${lecturerId}`, profile, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Courses
export const getLecturerCourses = async (lecturerId: string): Promise<Course[]> => {
  const response = await axios.get(`${API_URL}/api/lecturer/courses`, {
    headers: getAuthHeaders(),
    params: { lecturerId }
  });
  return response.data;
};

export const getCourseDetails = async (courseId: string): Promise<Course> => {
  const response = await axios.get(`${API_URL}/api/lecturer/courses/${courseId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createCourse = async (course: Omit<Course, 'id' | 'analytics'>): Promise<Course> => {
  const response = await axios.post(`${API_URL}/api/lecturer/courses`, course, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateCourse = async (courseId: string, course: Partial<Course>): Promise<Course> => {
  const response = await axios.put(`${API_URL}/api/lecturer/courses/${courseId}`, course, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/lecturer/courses/${courseId}`, {
    headers: getAuthHeaders()
  });
};

// Sessions
export const getCourseSessions = async (courseId: string): Promise<Session[]> => {
  const response = await axios.get(`${API_URL}/api/lecturer/courses/${courseId}/sessions`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createSession = async (session: Omit<Session, 'id' | 'attendance'>): Promise<Session> => {
  const response = await axios.post(`${API_URL}/api/lecturer/sessions`, session, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateSession = async (sessionId: string, session: Partial<Session>): Promise<Session> => {
  const response = await axios.put(`${API_URL}/api/lecturer/sessions/${sessionId}`, session, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/lecturer/sessions/${sessionId}`, {
    headers: getAuthHeaders()
  });
};

// Resources
export const uploadResource = async (resource: FormData): Promise<Resource> => {
  const response = await axios.post(`${API_URL}/api/lecturer/resources`, resource, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateResource = async (resourceId: string, resource: Partial<Resource>): Promise<Resource> => {
  const response = await axios.put(`${API_URL}/api/lecturer/resources/${resourceId}`, resource, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteResource = async (resourceId: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/lecturer/resources/${resourceId}`, {
    headers: getAuthHeaders()
  });
};

// Announcements
export const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt' | 'readBy'>): Promise<Announcement> => {
  const response = await axios.post(`${API_URL}/api/lecturer/announcements`, announcement, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateAnnouncement = async (announcementId: string, announcement: Partial<Announcement>): Promise<Announcement> => {
  const response = await axios.put(`${API_URL}/api/lecturer/announcements/${announcementId}`, announcement, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteAnnouncement = async (announcementId: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/lecturer/announcements/${announcementId}`, {
    headers: getAuthHeaders()
  });
};

// Analytics
export const getCourseAnalytics = async (courseId: string): Promise<CourseAnalytics> => {
  const response = await axios.get(`${API_URL}/api/lecturer/courses/${courseId}/analytics`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Student Feedback
export const getStudentFeedback = async (courseId: string): Promise<StudentFeedback[]> => {
  const response = await axios.get(`${API_URL}/api/lecturer/courses/${courseId}/feedback`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateFeedbackStatus = async (feedbackId: string, status: 'unread' | 'read' | 'addressed'): Promise<StudentFeedback> => {
  const response = await axios.put(`${API_URL}/api/lecturer/feedback/${feedbackId}`, { status }, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Messaging
export const sendMessage = async (message: Omit<LecturerChatMessage, 'id' | 'timestamp' | 'status'>): Promise<LecturerChatMessage> => {
  const response = await axios.post(`${API_URL}/api/lecturer/messages`, message, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getMessages = async (recipientId: string): Promise<LecturerChatMessage[]> => {
  const response = await axios.get(`${API_URL}/api/lecturer/messages`, {
    headers: getAuthHeaders(),
    params: { recipientId }
  });
  return response.data;
};

// AI Insights
export const getAIInsights = async (courseId: string): Promise<AIInsight[]> => {
  const response = await axios.get(`${API_URL}/api/lecturer/courses/${courseId}/insights`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateInsightStatus = async (insightId: string, status: 'new' | 'reviewed' | 'implemented'): Promise<AIInsight> => {
  const response = await axios.put(`${API_URL}/api/lecturer/insights/${insightId}`, { status }, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Content Suggestions
export const getContentSuggestions = async (courseId: string): Promise<ContentSuggestion[]> => {
  const response = await axios.get(`${API_URL}/api/lecturer/courses/${courseId}/suggestions`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateSuggestionStatus = async (suggestionId: string, status: 'pending' | 'approved' | 'rejected'): Promise<ContentSuggestion> => {
  const response = await axios.put(`${API_URL}/api/lecturer/suggestions/${suggestionId}`, { status }, {
    headers: getAuthHeaders()
  });
  return response.data;
}; 