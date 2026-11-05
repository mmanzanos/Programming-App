export type LanguageId = 'python' | 'javascript' | 'typescript' | 'html_css' | 'sql' | 'rust';

export interface ExerciseTestCase {
  id: string;
  description: string;
  input?: string;
  expectedOutput: string;
  testFn: (code: string, logs: string[]) => { passed: boolean; message?: string };
}

export interface Exercise {
  id: string;
  lessonId: string;
  languageId: LanguageId;
  levelNumber: number;
  chapterTitle?: string;
  title: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  xpReward: number;
  instructions: string;
  explanation: string;
  marcTip: string;
  starterCode: string;
  solutionCode: string;
  mobileTokens: string[]; // Touch-friendly token chips for mobile coding
  testCases: ExerciseTestCase[];
  hints: string[];
}

export interface Lesson {
  id: string;
  courseId: LanguageId;
  title: string;
  summary: string;
  estimatedMinutes: number;
  exercises: Exercise[];
}

export interface Course {
  id: LanguageId;
  name: string;
  shortName: string;
  tagline: string;
  iconName: string;
  badgeColor: string;
  accentColor: string;
  level: string;
  description: string;
  lessons: Lesson[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'streak' | 'social' | 'night';
  icon: string;
  xpBonus: number;
  unlockedAt: string | null;
  progress: number;
  maxProgress: number;
}

export interface SocialComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  isMarc?: boolean;
  content: string;
  languageId?: LanguageId;
  codeSnippet?: string;
  achievementTitle?: string;
  likes: number;
  hasLiked?: boolean;
  comments: SocialComment[];
  createdAt: string;
  pendingSync?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  isRegistered?: boolean;
  handle: string;
  avatarUrl: string;
  bio: string;
  level: number;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  completedExerciseIds: string[];
  solvedCodeMap: Record<string, string>; // exerciseId -> user solution
  notificationSettings: {
    enabled: boolean;
    reminderTime: string; // "20:00"
    daysOfWeek: number[]; // [1,2,3,4,5,6,0]
    soundEnabled: boolean;
  };
}

export interface LeaderboardUser {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  xp: number;
  streakDays: number;
  rank: number;
  isCurrentUser?: boolean;
  isMarc?: boolean;
  badge: string;
}

export interface PendingSyncItem {
  id: string;
  type: 'COMPLETE_EXERCISE' | 'CREATE_POST' | 'LIKE_POST' | 'UNLOCK_ACHIEVEMENT' | 'UPDATE_PROFILE';
  payload: any;
  timestamp: number;
}
