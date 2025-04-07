import { User, Module, Lecture, Quiz, Resource, Feedback, ChatMessage } from './student';

export interface LecturerProfile extends User {
  department: string;
  expertise: string[];
  courses: Course[];
  bio: string;
  officeHours: OfficeHour[];
  contactInfo: ContactInfo;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  semester: string;
  modules: Module[];
  students: User[];
  schedule: Session[];
  materials: Resource[];
  announcements: Announcement[];
  analytics: CourseAnalytics;
}

export interface Session {
  id: string;
  courseId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'live' | 'recorded' | 'assignment';
  recordingUrl?: string;
  meetingLink?: string;
  materials: Resource[];
  attendance: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
  joinTime?: string;
  leaveTime?: string;
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  expiresAt?: string;
  readBy: string[];
}

export interface CourseAnalytics {
  courseId: string;
  averageAttendance: number;
  averageQuizScore: number;
  completionRate: number;
  engagementScore: number;
  studentProgress: StudentProgress[];
  modulePerformance: ModulePerformance[];
  sentimentAnalysis: SentimentAnalysis;
}

export interface StudentProgress {
  studentId: string;
  name: string;
  attendance: number;
  quizScores: number[];
  assignmentScores: number[];
  participationScore: number;
  lastActive: string;
  status: 'on-track' | 'at-risk' | 'struggling';
}

export interface ModulePerformance {
  moduleId: string;
  title: string;
  averageScore: number;
  completionRate: number;
  timeSpent: number;
  difficultyRating: number;
}

export interface SentimentAnalysis {
  overall: number;
  byModule: { [moduleId: string]: number };
  bySession: { [sessionId: string]: number };
  trends: { date: string; score: number }[];
}

export interface OfficeHour {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
}

export interface ContactInfo {
  office: string;
  phone: string;
  email: string;
  website?: string;
}

export interface StudentFeedback {
  id: string;
  studentId: string;
  courseId: string;
  sessionId?: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: 'lecture' | 'quiz' | 'resource' | 'general';
  createdAt: string;
  status: 'unread' | 'read' | 'addressed';
}

export interface LecturerChatMessage extends ChatMessage {
  recipientId: string;
  courseId?: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface AIInsight {
  id: string;
  courseId: string;
  type: 'engagement' | 'performance' | 'content' | 'schedule';
  title: string;
  description: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'new' | 'reviewed' | 'implemented';
}

export interface ContentSuggestion {
  id: string;
  courseId: string;
  moduleId: string;
  type: 'lecture' | 'quiz' | 'resource' | 'assignment';
  title: string;
  description: string;
  rationale: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
} 