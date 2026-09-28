import { UserProfile, StudyTask, ScheduleBlock, NoteItem, AchievementBadge, Resource, StudySessionLog } from '../types';
import { Flashcard, TestResult } from '../types/testAndFlashcards';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { INITIAL_FLASHCARDS } from '../data/mockFlashcards';

const STORAGE_KEYS = {
  PROFILE: 'studypulse_profile_v1',
  TASKS: 'studypulse_tasks_v1',
  SCHEDULE: 'studypulse_schedule_v1',
  NOTES: 'studypulse_notes_v1',
  ACHIEVEMENTS: 'studypulse_achievements_v1',
  THEME: 'studypulse_theme_v1',
  BOOKMARKS: 'studypulse_bookmarks_v1',
  STATS: 'studypulse_stats_v1',
  CUSTOM_RESOURCES: 'studypulse_custom_resources_v1',
  FLASHCARDS: 'studypulse_flashcards_v1',
  TEST_RESULTS: 'studypulse_test_results_v1',
  SESSION_LOGS: 'studypulse_session_logs_v1'
};

const DEFAULT_PROFILE: UserProfile = {
  academicLevel: 'ncert_class_11_12_science',
  fieldOfStudy: 'ncert_physics',
  targetSubject: 'NCERT Class 12 Physics & Chemistry',
  language: 'hinglish',
  targetHoursPerDay: 4,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalStudyMinutes: 45,
  totalXp: 125,
  level: 1,
  onboarded: false
};

const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'NCERT Chapter 1: Electric Charges & Coulomb Law (Physics Wallah)',
    priority: 'high',
    category: 'lecture',
    estimatedMinutes: 45,
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Solve 10 Practice Problems (Work & Kinetic Energy)',
    priority: 'high',
    category: 'practice',
    estimatedMinutes: 40,
    completed: true,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Summarize Key Formulas in Markdown Notebook',
    priority: 'medium',
    category: 'revision',
    estimatedMinutes: 20,
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'Active Recall Session on Organic Chemistry reactions',
    priority: 'low',
    category: 'reading',
    estimatedMinutes: 30,
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SCHEDULE: ScheduleBlock[] = [
  { id: 'sb-1', dayOfWeek: 1, startTime: '08:30', endTime: '10:00', title: 'Deep Work: Core Theory', subject: 'Math & Physics', type: 'deep_work' },
  { id: 'sb-2', dayOfWeek: 1, startTime: '10:15', endTime: '11:15', title: 'Problem Solving & Drills', subject: 'Calculus', type: 'practice' },
  { id: 'sb-3', dayOfWeek: 1, startTime: '11:15', endTime: '11:45', title: 'Hydration & Mind Reset', subject: 'Rest', type: 'break' },
  { id: 'sb-4', dayOfWeek: 1, startTime: '14:00', endTime: '15:30', title: 'Lecture Analysis & Notes', subject: 'Mechanics', type: 'lecture' },
  
  { id: 'sb-5', dayOfWeek: 2, startTime: '09:00', endTime: '10:30', title: 'Algorithmic Problem Set', subject: 'Computer Science', type: 'deep_work' },
  { id: 'sb-6', dayOfWeek: 2, startTime: '11:00', endTime: '12:00', title: 'Formula Review & Flashcards', subject: 'Math', type: 'revision' },
  
  { id: 'sb-7', dayOfWeek: 3, startTime: '08:30', endTime: '10:00', title: 'Deep Work: Thermodynamics', subject: 'Physics', type: 'deep_work' },
  { id: 'sb-8', dayOfWeek: 3, startTime: '10:15', endTime: '11:30', title: 'Past Exam Paper Sprint', subject: 'Exam Prep', type: 'practice' },

  { id: 'sb-9', dayOfWeek: 4, startTime: '09:00', endTime: '10:30', title: 'Biochemistry / Chemistry Notes', subject: 'Chemistry', type: 'lecture' },
  { id: 'sb-10', dayOfWeek: 4, startTime: '14:00', endTime: '15:30', title: 'Coding Exercises / Math Proofs', subject: 'STEM Drills', type: 'practice' },

  { id: 'sb-11', dayOfWeek: 5, startTime: '08:30', endTime: '10:30', title: 'Weekly Consolidation & Summary', subject: 'Consolidation', type: 'revision' },
  { id: 'sb-12', dayOfWeek: 5, startTime: '11:00', endTime: '12:00', title: 'Spaced Repetition Review', subject: 'Active Recall', type: 'revision' },

  { id: 'sb-13', dayOfWeek: 6, startTime: '10:00', endTime: '12:00', title: 'Mock Test / Timed Practice', subject: 'Timed Test', type: 'practice' },
  { id: 'sb-14', dayOfWeek: 0, startTime: '10:00', endTime: '11:30', title: 'Weekly Planning & Resource Queue', subject: 'Planning', type: 'revision' }
];

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Active Recall Framework & Formula Rules',
    subject: 'Study Strategy',
    updatedAt: new Date().toISOString(),
    tags: ['Technique', 'High-Yield'],
    content: `# Active Recall & Spaced Repetition Rules

## The 3-Pass Study System
1. **First Pass (Intuition)**: Watch a high-clarity visual breakdown (e.g. 3Blue1Brown or Khan Academy) without taking notes. Understand *why* it works before writing.
2. **Second Pass (Formula Extraction)**: Write core principles into this markdown sheet in your own words.
3. **Third Pass (Feynman Technique)**: Teach the concept out loud to an imaginary 10-year-old. Wherever you stumble, return to the source text.

---

## Today's Key Formulas
- Work-Energy Theorem: $W_{\\text{net}} = \\Delta K = \\frac{1}{2} m v_f^2 - \\frac{1}{2} m v_i^2$
- Derivative of $\\sin(x) = \\cos(x)$
- Chain Rule: $\\frac{d}{dx} [f(g(x))] = f'(g(x)) \\cdot g'(x)$
`
  },
  {
    id: 'note-2',
    title: 'Exam Strategy & Time Management Tips',
    subject: 'Strategy',
    updatedAt: new Date().toISOString(),
    tags: ['Mindset', 'Productivity'],
    content: `# Timed Exam Strategy

- **First 5 Minutes**: Scan the entire paper. Mark Easy (1), Medium (2), and Lengthy (3).
- **First Sprint**: Clear all Level 1 questions rapidly. Bank guaranteed points.
- **Pomodoro Rule in Revision**: 25 minutes uninterrupted focus followed by 5 minutes eyes-off-screen rest.
`
  }
];

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    
    // Update streak based on current date
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastActiveDate !== today) {
      const lastDate = new Date(parsed.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Logged in next consecutive day!
        parsed.streakDays = (parsed.streakDays || 0) + 1;
      } else if (diffDays > 1) {
        // Missed one or more days
        parsed.streakDays = 1;
      }
      parsed.lastActiveDate = today;
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredTasks(): StudyTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : DEFAULT_TASKS;
  } catch {
    return DEFAULT_TASKS;
  }
}

export function saveTasks(tasks: StudyTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}

export function getStoredSchedule(): ScheduleBlock[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return raw ? JSON.parse(raw) : DEFAULT_SCHEDULE;
  } catch {
    return DEFAULT_SCHEDULE;
  }
}

export function saveSchedule(schedule: ScheduleBlock[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  } catch (e) {
    console.error('Failed to save schedule', e);
  }
}

export function getStoredNotes(): NoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    return raw ? JSON.parse(raw) : DEFAULT_NOTES;
  } catch {
    return DEFAULT_NOTES;
  }
}

export function saveNotes(notes: NoteItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes', e);
  }
}

export function getStoredAchievements(): AchievementBadge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return raw ? JSON.parse(raw) : INITIAL_ACHIEVEMENTS;
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: AchievementBadge[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed to save achievements', e);
  }
}

export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : ['res-3b1b-calc', 'res-fcc-dsa-cheatsheet'];
  } catch {
    return ['res-3b1b-calc', 'res-fcc-dsa-cheatsheet'];
  }
}

export function saveBookmarks(bookmarks: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }
}

export function getInitialTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}

export function getStoredCustomResources(): Resource[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_RESOURCES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomResources(resources: Resource[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_RESOURCES, JSON.stringify(resources));
  } catch (e) {
    console.error('Failed to save custom resources', e);
  }
}

export function getStoredFlashcards(): Flashcard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    return raw ? JSON.parse(raw) : INITIAL_FLASHCARDS;
  } catch {
    return INITIAL_FLASHCARDS;
  }
}

export function saveFlashcards(cards: Flashcard[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save flashcards', e);
  }
}

export function getStoredTestResults(): TestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTestResults(results: TestResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(results));
  } catch (e) {
    console.error('Failed to save test results', e);
  }
}

export function generateDefaultSessionLogs(): StudySessionLog[] {
  const logs: StudySessionLog[] = [];
  const subjects = ['Physics', 'Mathematics', 'Chemistry', 'Computer Science', 'Biology'];
  const categories: ('deep_work' | 'lecture' | 'practice' | 'revision' | 'mock_test')[] = [
    'deep_work', 'lecture', 'practice', 'revision', 'mock_test'
  ];

  // Generate for the last 14 days
  const now = new Date();
  const dayPatterns = [
    // [dayOffset, sessions: [{subject, duration, category, title, time}]]
    { offset: 0, sessions: [
      { subject: 'Physics', duration: 45, category: 'deep_work', title: 'Electrostatics & Gauss Law Problem Set', time: '09:00' },
      { subject: 'Mathematics', duration: 30, category: 'practice', title: 'Integration by Parts Drills', time: '11:15' },
      { subject: 'Chemistry', duration: 25, category: 'revision', title: 'Coordination Compounds Formula Review', time: '14:30' }
    ]},
    { offset: 1, sessions: [
      { subject: 'Physics', duration: 50, category: 'lecture', title: 'Coulomb Law & Field Vector Video Analysis', time: '08:30' },
      { subject: 'Computer Science', duration: 45, category: 'deep_work', title: 'Binary Search & Recursion Problems', time: '10:45' },
      { subject: 'Physics', duration: 35, category: 'mock_test', title: 'Class 12 Physics Sectional CBT Mock 1', time: '16:00' },
      { subject: 'Mathematics', duration: 25, category: 'revision', title: 'Matrices & Determinants Speed Recall', time: '19:00' }
    ]},
    { offset: 2, sessions: [
      { subject: 'Chemistry', duration: 60, category: 'deep_work', title: 'Chemical Kinetics & Rate Laws Derivations', time: '09:00' },
      { subject: 'Chemistry', duration: 30, category: 'practice', title: 'Arrhenius Equation Numerical Questions', time: '11:00' },
      { subject: 'Mathematics', duration: 45, category: 'lecture', title: 'Calculus Continuity & Differentiability', time: '15:30' }
    ]},
    { offset: 3, sessions: [
      { subject: 'Physics', duration: 45, category: 'deep_work', title: 'Capacitance & Dielectric Constant Proofs', time: '08:45' },
      { subject: 'Computer Science', duration: 40, category: 'practice', title: 'Stack & Queue Implementation in Python', time: '11:00' },
      { subject: 'Mathematics', duration: 50, category: 'deep_work', title: 'Definite Integrals Properties & Solved Examples', time: '14:00' }
    ]},
    { offset: 4, sessions: [
      { subject: 'Physics', duration: 30, category: 'revision', title: 'Electric Dipole in Uniform Field Review', time: '09:30' },
      { subject: 'Chemistry', duration: 45, category: 'practice', title: 'Electrochemistry Nernst Equation Numericals', time: '11:30' }
    ]},
    { offset: 5, sessions: [
      { subject: 'Mathematics', duration: 60, category: 'deep_work', title: 'Differential Equations General & Particular Solutions', time: '08:30' },
      { subject: 'Physics', duration: 45, category: 'practice', title: 'Current Electricity Kirchhoff Laws Sprint', time: '10:45' },
      { subject: 'Biology', duration: 30, category: 'reading', title: 'Molecular Basis of Inheritance DNA Replication', time: '14:30' },
      { subject: 'Chemistry', duration: 25, category: 'revision', title: 'Solutions Raoult Law & Colligative Properties', time: '17:00' }
    ]},
    { offset: 6, sessions: [
      { subject: 'Physics', duration: 90, category: 'mock_test', title: 'Full Length NCERT Science CBT Simulator', time: '10:00' },
      { subject: 'Mathematics', duration: 40, category: 'practice', title: 'Mock Test Error Analysis & Weak Topic Drill', time: '15:00' }
    ]},
    { offset: 7, sessions: [
      { subject: 'Computer Science', duration: 45, category: 'deep_work', title: 'SQL Joins & Table Aggregation Queries', time: '09:00' },
      { subject: 'Chemistry', duration: 35, category: 'lecture', title: 'Biomolecules Peptide Bonds & Carbohydrates', time: '11:15' },
      { subject: 'Physics', duration: 30, category: 'revision', title: 'Formula Flashcards Review - Mechanics', time: '16:00' }
    ]},
    { offset: 8, sessions: [
      { subject: 'Mathematics', duration: 50, category: 'deep_work', title: 'Vectors & 3D Geometry Direction Cosines', time: '09:15' },
      { subject: 'Physics', duration: 40, category: 'practice', title: 'Potentiometer & Wheatstone Bridge Lab Problems', time: '11:30' }
    ]},
    { offset: 9, sessions: [
      { subject: 'Chemistry', duration: 55, category: 'deep_work', title: 'Haloalkanes & Haloarenes SN1/SN2 Mechanisms', time: '08:45' },
      { subject: 'Mathematics', duration: 35, category: 'practice', title: 'Linear Programming Graphical Solutions', time: '11:00' },
      { subject: 'Physics', duration: 25, category: 'revision', title: 'Electric Flux Summary Sheet Creation', time: '15:00' }
    ]},
    { offset: 10, sessions: [
      { subject: 'Physics', duration: 60, category: 'deep_work', title: 'Magnetic Effects of Current Biot-Savart Law', time: '09:00' },
      { subject: 'Computer Science', duration: 40, category: 'practice', title: 'File Handling in Python (CSV & Binary)', time: '11:30' },
      { subject: 'Chemistry', duration: 30, category: 'revision', title: 'p-Block Elements Nitrogen Family Recap', time: '16:30' }
    ]},
    { offset: 11, sessions: [
      { subject: 'Mathematics', duration: 45, category: 'practice', title: 'Probability Bayes Theorem & Conditional Drills', time: '10:00' },
      { subject: 'Physics', duration: 35, category: 'lecture', title: 'Ampere Circuital Law & Solenoid Derivation', time: '14:00' }
    ]},
    { offset: 12, sessions: [
      { subject: 'Chemistry', duration: 50, category: 'deep_work', title: 'Alcohols, Phenols and Ethers Reaction Chart', time: '09:00' },
      { subject: 'Mathematics', duration: 45, category: 'deep_work', title: 'Application of Derivatives Tangents & Normals', time: '11:15' },
      { subject: 'Physics', duration: 30, category: 'revision', title: 'Formula Flashcards Review - Electricity', time: '16:00' }
    ]},
    { offset: 13, sessions: [
      { subject: 'Physics', duration: 75, category: 'mock_test', title: 'Diagnostic Benchmark Test - Physics & Math', time: '10:00' },
      { subject: 'Chemistry', duration: 30, category: 'revision', title: 'Solid State Unit Cell Density Calculation Review', time: '14:30' }
    ]}
  ];

  let logIdCounter = 1;
  for (const day of dayPatterns) {
    const d = new Date(now);
    d.setDate(d.getDate() - day.offset);
    const dateStr = d.toISOString().split('T')[0];

    for (const s of day.sessions) {
      logs.push({
        id: `sess-${logIdCounter++}`,
        date: dateStr,
        startTime: s.time,
        durationMinutes: s.duration,
        subject: s.subject,
        taskTitle: s.title,
        category: s.category as any,
        xpEarned: Math.round(s.duration * 1.5)
      });
    }
  }

  return logs;
}

export function getStoredSessionLogs(): StudySessionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION_LOGS);
    if (!raw) {
      const initial = generateDefaultSessionLogs();
      saveSessionLogs(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return generateDefaultSessionLogs();
  }
}

export function saveSessionLogs(logs: StudySessionLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save session logs', e);
  }
}

export function exportAllStudyData(): string {
  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    profile: getStoredProfile(),
    tasks: getStoredTasks(),
    schedule: getStoredSchedule(),
    notes: getStoredNotes(),
    achievements: getStoredAchievements(),
    bookmarks: getStoredBookmarks(),
    customResources: getStoredCustomResources(),
    flashcards: getStoredFlashcards(),
    testResults: getStoredTestResults(),
    sessionLogs: getStoredSessionLogs()
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function importAllStudyData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') return false;

    if (parsed.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed.profile));
    if (parsed.tasks) localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(parsed.tasks));
    if (parsed.schedule) localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(parsed.schedule));
    if (parsed.notes) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(parsed.notes));
    if (parsed.achievements) localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(parsed.achievements));
    if (parsed.bookmarks) localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(parsed.bookmarks));
    if (parsed.customResources) localStorage.setItem(STORAGE_KEYS.CUSTOM_RESOURCES, JSON.stringify(parsed.customResources));
    if (parsed.flashcards) localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(parsed.flashcards));
    if (parsed.testResults) localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(parsed.testResults));
    if (parsed.sessionLogs) localStorage.setItem(STORAGE_KEYS.SESSION_LOGS, JSON.stringify(parsed.sessionLogs));

    return true;
  } catch (err) {
    console.error('Failed to import study data', err);
    return false;
  }
}

