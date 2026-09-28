import { AchievementBadge } from '../types';

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first study task in the daily checklist.',
    iconName: 'CheckCircle2',
    category: 'tasks',
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'consistent-studier',
    title: 'Consistent Studier',
    description: 'Maintain a 3-day daily study streak.',
    iconName: 'Flame',
    category: 'streak',
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'deep-diver',
    title: 'Deep Diver',
    description: 'Complete 5 focused Pomodoro study blocks.',
    iconName: 'Target',
    category: 'focus',
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'mastered-subject',
    title: 'Mastered a Subject',
    description: 'Complete 10 high-priority study tasks.',
    iconName: 'Award',
    category: 'tasks',
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'knowledge-vault',
    title: 'Knowledge Vault',
    description: 'Create and save 3 markdown revision notes.',
    iconName: 'FileText',
    category: 'knowledge',
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'resource-explorer',
    title: 'Resource Explorer',
    description: 'Open and inspect 5 verified study materials or videos.',
    iconName: 'Compass',
    category: 'knowledge',
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Earn 500 total XP from focused study sessions.',
    iconName: 'Zap',
    category: 'xp',
    progress: 0,
    maxProgress: 500
  },
  {
    id: 'marathon-scholar',
    title: 'Marathon Scholar',
    description: 'Accumulate 5 hours (300 minutes) of total logged focus time.',
    iconName: 'Clock',
    category: 'focus',
    progress: 0,
    maxProgress: 300
  }
];

export const XP_TABLE = {
  TASK_COMPLETED: 25,
  POMODORO_SESSION: 50,
  NOTE_CREATED: 15,
  RESOURCE_VIEWED: 10,
  ROUTINE_GENERATED: 20
};

export function calculateLevel(totalXp: number): { level: number; title: string; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  const levels = [
    { level: 1, title: 'Novice Scholar', minXp: 0, maxXp: 100 },
    { level: 2, title: 'Apprentice Learner', minXp: 100, maxXp: 250 },
    { level: 3, title: 'Dedicated Studier', minXp: 250, maxXp: 500 },
    { level: 4, title: 'Focus Master', minXp: 500, maxXp: 900 },
    { level: 5, title: 'Academic Prodigy', minXp: 900, maxXp: 1500 },
    { level: 6, title: 'Knowledge Archon', minXp: 1500, maxXp: 99999 }
  ];

  const current = levels.find((l, idx) => {
    const isLast = idx === levels.length - 1;
    return (totalXp >= l.minXp && totalXp < l.maxXp) || isLast;
  }) || levels[0];

  const span = current.maxXp - current.minXp;
  const progressInLevel = Math.max(0, totalXp - current.minXp);
  const progressPercent = Math.min(100, Math.round((progressInLevel / (span || 1)) * 100));

  return {
    level: current.level,
    title: current.title,
    currentLevelXp: totalXp - current.minXp,
    nextLevelXp: span,
    progressPercent
  };
}
