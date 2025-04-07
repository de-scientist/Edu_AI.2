export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  progress: number;
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lectures: Lecture[];
  quizzes: Quiz[];
  resources: Resource[];
  progress: number;
  completed: boolean;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  transcript?: string;
  resources: Resource[];
  completed: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  passingScore: number;
  attempts: number;
  completed: boolean;
  score?: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'document';
  url: string;
  description: string;
  size?: string;
  duration?: string;
}

export interface Progress {
  id: string;
  userId: string;
  moduleId: string;
  completed: boolean;
  score: number;
  timeSpent: number;
  lastAccessed: string;
}

export interface Feedback {
  id: string;
  userId: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: 'lecture' | 'quiz' | 'resource' | 'general';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: string;
  sender: 'user' | 'ai';
}

export interface Profile {
  id: string;
  userId: string;
  bio: string;
  interests: string[];
  learningGoals: string[];
  preferredLanguage: string;
  timeZone: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  reminders: boolean;
  updates: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  progress: number;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: User[];
  schedule: StudySession[];
  resources: Resource[];
}

export interface StudySession {
  id: string;
  groupId: string;
  topic: string;
  startTime: string;
  duration: number;
  participants: User[];
  notes: string;
} 