export type AcademicLevel = 
  | 'ncert_class_9_10'
  | 'ncert_class_11_12_science'
  | 'ncert_class_11_12_commerce'
  | 'ncert_class_11_12_humanities'
  | 'ncert_class_6_8'
  | 'competitive_jee_neet'
  | 'grade_6_10'
  | 'high_school_11_12'
  | 'undergraduate'
  | 'competitive_exam';

export type FieldOfStudy =
  | 'ncert_physics'
  | 'ncert_chemistry'
  | 'ncert_mathematics'
  | 'ncert_biology'
  | 'ncert_science_9_10'
  | 'ncert_social_science'
  | 'ncert_commerce_acc'
  | 'computer_science'
  | 'stem_engineering'
  | 'medical_biology'
  | 'business_economics'
  | 'humanities_social'
  | 'foundational_math_sci';

export type LearningLanguage = 'hindi' | 'hinglish' | 'english' | 'bilingual' | 'spanish';

export interface UserProfile {
  academicLevel: AcademicLevel;
  fieldOfStudy: FieldOfStudy;
  targetSubject: string;
  language: LearningLanguage;
  targetHoursPerDay: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalStudyMinutes: number;
  totalXp: number;
  level: number;
  onboarded: boolean;
}

export type ResourceCategory = 'video' | 'notes' | 'cheatsheet' | 'interactive';

export interface Resource {
  id: string;
  title: string;
  channelOrAuthor: string;
  isVerified: boolean;
  viewCount: number;
  viewCountText: string;
  duration?: string;
  academicLevels: AcademicLevel[];
  fieldsOfStudy: FieldOfStudy[];
  languages: LearningLanguage[];
  topic: string;
  category: ResourceCategory;
  youtubeId?: string;
  externalUrl?: string;
  description: string;
  contentMarkdown?: string;
  rating?: number;
  isCustom?: boolean;
  readingTime?: string;
  keyPoints?: string[];
  createdAt?: string;
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'lecture' | 'reading' | 'practice' | 'revision';

export interface StudyTask {
  id: string;
  title: string;
  priority: TaskPriority;
  category: TaskCategory;
  estimatedMinutes: number;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
}

export type BlockType = 'deep_work' | 'lecture' | 'practice' | 'break' | 'revision';

export interface ScheduleBlock {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  title: string;
  subject: string;
  type: BlockType;
  completed?: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  subject: string;
  updatedAt: string;
  tags: string[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'streak' | 'focus' | 'tasks' | 'knowledge' | 'xp';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface StudySessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  durationMinutes: number;
  subject: string;
  taskTitle: string;
  category: TaskCategory | 'deep_work' | 'mock_test' | 'revision';
  xpEarned: number;
}
