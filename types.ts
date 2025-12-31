export interface User {
  uid: string;
  email: string;
  displayName: string;
  studentCode?: string;
  role: 'student' | 'admin';
  photoURL?: string;
}

export interface Subject {
  id: string;
  name: string;
  profName: string;
  icon: string;
  color: string; // Tailwind color class e.g., 'bg-blue-500'
  orderIndex: number;
}

export interface Resource {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'video' | 'link';
  thumbnail?: string;
  orderIndex: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export enum AnalyticsMetric {
  VIEWS = 'views',
  DOWNLOADS = 'downloads',
  activeUsers = 'activeUsers'
}

export interface LogEntry {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: number;
}