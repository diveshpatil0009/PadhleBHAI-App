import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Flame, 
  Target, 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Timer,
  Zap,
  BarChart3,
  Lightbulb,
  X,
  PieChart as PieIcon,
  HelpCircle,
  FileText
} from 'lucide-react';
import { UserProfile, StudyTask, StudySessionLog, TaskCategory } from '../types';
import { TestResult, Flashcard } from '../types/testAndFlashcards';
import { SUBJECT_OPTIONS } from '../data/mockResources';

interface StudyInsightsViewProps {
  profile: UserProfile;
  sessionLogs: StudySessionLog[];
  tasks: StudyTask[];
  testResults: TestResult[];
  flashcards: Flashcard[];
  onAddSessionLog: (log: Omit<StudySessionLog, 'id'>) => void;
  onOpenFocusMode: (customTitle?: string) => void;
  onOpenMockTest?: () => void;
}

type TimeRangeOption = '7d' | '14d' | '30d';

const SUBJECT_COLORS: Record<string, string> = {
  Physics: '#6366f1',       // Indigo
  Mathematics: '#0ea5e9',   // Sky
  Chemistry: '#10b981',     // Emerald
  'Computer Science': '#f59e0b', // Amber
  Biology: '#ec4899',       // Pink
  Other: '#8b5cf6'          // Violet
};

export const StudyInsightsView: React.FC<StudyInsightsViewProps> = ({
  profile,
  sessionLogs,
  tasks,
  testResults,
  flashcards,
  onAddSessionLog,
  onOpenFocusMode,
  onOpenMockTest
}) => {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('7d');
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);

  // Manual Session Log form state
  const [manualSubject, setManualSubject] = useState<string>('Physics');
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualDurationMinutes, setManualDurationMinutes] = useState<number>(45);
  const [manualCategory, setManualCategory] = useState<'deep_work' | 'practice' | 'revision' | 'lecture' | 'mock_test'>('deep_work');
  const [manualDate, setManualDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Determine number of days in range
  const daysCount = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;

  // Filter logs within range
  const filteredLogs = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysCount + 1);
    cutoffDate.setHours(0, 0, 0, 0);

    return sessionLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= cutoffDate;
    });
  }, [sessionLogs, daysCount]);

  // Generate continuous daily date series for chart (even if 0 minutes on some days)
  const dailyTrendsData = useMemo(() => {
    const result = [];
    const today = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      // Formatted label (e.g. "Mon 22" or "22 Sep")
      const dayLabel = d.toLocaleDateString('en-US', {
        weekday: daysCount <= 14 ? 'short' : undefined,
        day: 'numeric',
        month: daysCount > 14 ? 'short' : undefined
      });

      const dayLogs = filteredLogs.filter((l) => l.date === dateStr);
      const totalMinutes = dayLogs.reduce((acc, cur) => acc + cur.durationMinutes, 0);
      const studyHours = Number((totalMinutes / 60).toFixed(1));
      const sessionCount = dayLogs.length;

      // Group subjects for tooltip breakdown
      const subjectMins: Record<string, number> = {};
      dayLogs.forEach((l) => {
        subjectMins[l.subject] = (subjectMins[l.subject] || 0) + l.durationMinutes;
      });

      result.push({
        date: dateStr,
        dayLabel,
        studyHours,
        totalMinutes,
        sessionCount,
        targetHours: profile.targetHoursPerDay || 4,
        subjects: subjectMins
      });
    }
    return result;
  }, [filteredLogs, daysCount, profile.targetHoursPerDay]);

  // Aggregate KPI Calculations
  const totalStudyMinutes = useMemo(() => {
    return filteredLogs.reduce((acc, cur) => acc + cur.durationMinutes, 0);
  }, [filteredLogs]);

  const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(1));

  // Days with at least 1 session
  const activeDaysCount = useMemo(() => {
    const uniqueDates = new Set(filteredLogs.map((l) => l.date));
    return uniqueDates.size;
  }, [filteredLogs]);

  // Average focus sessions per day over the selected range
  const avgSessionsPerDay = useMemo(() => {
    return Number((filteredLogs.length / daysCount).toFixed(1));
  }, [filteredLogs, daysCount]);

  // Average study hours per day
  const avgHoursPerDay = useMemo(() => {
    return Number((totalStudyHours / daysCount).toFixed(1));
  }, [totalStudyHours, daysCount]);

  // Goal compliance percentage
  const totalTargetHours = daysCount * (profile.targetHoursPerDay || 4);
  const goalAchievementRate = Math.min(
    100,
    Math.round((totalStudyHours / Math.max(1, totalTargetHours)) * 100)
  );

  // Subject allocation data for Donut chart
  const subjectAllocationData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredLogs.forEach((l) => {
      const subj = l.subject || 'Other';
      map[subj] = (map[subj] || 0) + l.durationMinutes;
    });

    const list = Object.keys(map).map((subj) => ({
      name: subj,
      minutes: map[subj],
      hours: Number((map[subj] / 60).toFixed(1)),
      color: SUBJECT_COLORS[subj] || '#a855f7'
    }));

    // Sort descending
    list.sort((a, b) => b.minutes - a.minutes);
    return list;
  }, [filteredLogs]);

  // Time-of-day distribution (Morning, Afternoon, Evening, Night)
  const timeOfDayData = useMemo(() => {
    const slots = [
      { name: 'Morning (6am-12pm)', hours: 0, sessions: 0, color: '#0ea5e9' },
      { name: 'Afternoon (12pm-5pm)', hours: 0, sessions: 0, color: '#6366f1' },
      { name: 'Evening (5pm-9pm)', hours: 0, sessions: 0, color: '#f59e0b' },
      { name: 'Night (9pm-2am)', hours: 0, sessions: 0, color: '#8b5cf6' }
    ];

    filteredLogs.forEach((l) => {
      const time = l.startTime || '10:00';
      const hour = parseInt(time.split(':')[0], 10) || 10;
      let slotIndex = 0;
      if (hour >= 6 && hour < 12) slotIndex = 0;
      else if (hour >= 12 && hour < 17) slotIndex = 1;
      else if (hour >= 17 && hour < 21) slotIndex = 2;
      else slotIndex = 3;

      slots[slotIndex].hours += l.durationMinutes / 60;
      slots[slotIndex].sessions += 1;
    });

    return slots.map((s) => ({
      ...s,
      hours: Number(s.hours.toFixed(1))
    }));
  }, [filteredLogs]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const catMap: Record<string, number> = {
      deep_work: 0,
      practice: 0,
      revision: 0,
      lecture: 0,
      mock_test: 0
    };

    filteredLogs.forEach((l) => {
      const cat = l.category || 'deep_work';
      if (catMap[cat] !== undefined) {
        catMap[cat] += l.durationMinutes;
      } else {
        catMap.practice += l.durationMinutes;
      }
    });

    return [
      { category: 'Deep Work', fullLabel: 'Deep Work Theory', hours: Number((catMap.deep_work / 60).toFixed(1)), minutes: catMap.deep_work },
      { category: 'Practice', fullLabel: 'Problem Drills', hours: Number((catMap.practice / 60).toFixed(1)), minutes: catMap.practice },
      { category: 'Revision', fullLabel: 'Formula & Recall', hours: Number((catMap.revision / 60).toFixed(1)), minutes: catMap.revision },
      { category: 'Lectures', fullLabel: 'Video Breakdown', hours: Number((catMap.lecture / 60).toFixed(1)), minutes: catMap.lecture },
      { category: 'Mocks', fullLabel: 'CBT Mock Tests', hours: Number((catMap.mock_test / 60).toFixed(1)), minutes: catMap.mock_test }
    ];
  }, [filteredLogs]);

  // Mock Test performance trajectory
  const mockTestTrendData = useMemo(() => {
    if (testResults.length === 0) return [];
    return [...testResults]
      .reverse()
      .slice(-8)
      .map((t, idx) => ({
        index: idx + 1,
        title: t.testTitle.replace('Diagnostic Benchmark Test - ', '').replace('Full Length NCERT ', ''),
        scorePercentage: t.scorePercentage,
        questions: t.totalQuestions,
        correct: t.correctAnswers,
        date: t.date
      }));
  }, [testResults]);

  // Flashcards statistics
  const flashcardStats = useMemo(() => {
    const total = flashcards.length;
    const mastered = flashcards.filter((f) => f.mastery === 'mastered').length;
    const learning = flashcards.filter((f) => f.mastery === 'learning').length;
    const unseen = total - mastered - learning;
    const masteryRate = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { total, mastered, learning, unseen, masteryRate };
  }, [flashcards]);

  // Smart Heuristic Recommendations
  const smartRecommendations = useMemo(() => {
    const recs: { title: string; desc: string; type: 'success' | 'tip' | 'alert' }[] = [];

    // Most studied subject
    if (subjectAllocationData.length > 0) {
      const topSubj = subjectAllocationData[0];
      const pct = Math.round((topSubj.minutes / Math.max(1, totalStudyMinutes)) * 100);
      recs.push({
        title: `${topSubj.name} dominates study allocation (${pct}%)`,
        desc: `You have dedicated ${topSubj.hours} hours to ${topSubj.name}. Make sure secondary NCERT subjects like ${
          subjectAllocationData[subjectAllocationData.length - 1]?.name || 'Revision'
        } receive balanced focus.`,
        type: pct > 55 ? 'alert' : 'tip'
      });
    }

    // Sessions cadence
    if (avgSessionsPerDay >= 3) {
      recs.push({
        title: 'High Focus Session Frequency',
        desc: `You are averaging ${avgSessionsPerDay} focus sessions per day. This micro-sprint cadence aligns with optimal cognitive memory retention.`,
        type: 'success'
      });
    } else {
      recs.push({
        title: 'Session Cadence Opportunity',
        desc: `You are averaging ${avgSessionsPerDay} sessions per day. Try adding one short 25-minute Pomodoro in the morning to increase your daily average.`,
        type: 'tip'
      });
    }

    // Active Recall vs Passive Learning Ratio
    const activeMinutes =
      (categoryData.find((c) => c.category === 'Practice')?.minutes || 0) +
      (categoryData.find((c) => c.category === 'Mocks')?.minutes || 0) +
      (categoryData.find((c) => c.category === 'Revision')?.minutes || 0);
    const passiveMinutes = categoryData.find((c) => c.category === 'Lectures')?.minutes || 0;
    const activeRatio = Math.round((activeMinutes / Math.max(1, activeMinutes + passiveMinutes)) * 100);

    if (activeRatio >= 60) {
      recs.push({
        title: `Strong Active Recall Ratio (${activeRatio}%)`,
        desc: 'The majority of your time is spent solving numerical problems, taking CBT mocks, and flashcard drills rather than passive watching.',
        type: 'success'
      });
    } else {
      recs.push({
        title: 'Increase Active Problem Solving',
        desc: 'Lectures account for substantial study time. Increase your time on practice drills and formula cards to solidify concepts.',
        type: 'tip'
      });
    }

    return recs;
  }, [subjectAllocationData, totalStudyMinutes, avgSessionsPerDay, categoryData]);

  // Handle submit manual log
  const handleSaveManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    onAddSessionLog({
      date: manualDate,
      startTime: '10:00',
      durationMinutes: Number(manualDurationMinutes) || 30,
      subject: manualSubject,
      taskTitle: manualTitle.trim(),
      category: manualCategory,
      xpEarned: Math.round(Number(manualDurationMinutes) * 1.5)
    });

    setManualTitle('');
    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full pb-10">
      {/* 1. Header & Controls */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Study Insights & Productivity Trends</span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-normal">
                {daysCount}-Day Rolling Analysis
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Productivity & Focus Analytics
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Track daily study hours, session volume, cognitive rhythm, and subject mastery velocity.
            </p>
          </div>

          {/* Action buttons & Time Range Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Segmented Time Range Controller */}
            <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  timeRange === '7d'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange('14d')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  timeRange === '14d'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                14 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  timeRange === '30d'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                30 Days
              </button>
            </div>

            {/* Log Offline Study Session Button */}
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Study Block</span>
            </button>
          </div>
        </div>

        {/* 2. Top Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-5">
          {/* Total Study Hours */}
          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
              <span className="font-medium">Total Study Time</span>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                {totalStudyHours}
              </span>
              <span className="text-xs font-semibold text-zinc-500">hours</span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <span>Goal: {profile.targetHoursPerDay}h/day</span>
              <span>·</span>
              <span className={goalAchievementRate >= 80 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-600 dark:text-amber-400'}>
                {goalAchievementRate}% met
              </span>
            </div>
          </div>

          {/* Average Focus Sessions Per Day */}
          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
              <span className="font-medium">Avg Focus Sessions</span>
              <Timer className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                {avgSessionsPerDay}
              </span>
              <span className="text-xs font-semibold text-zinc-500">sessions/day</span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>{filteredLogs.length} total completed blocks</span>
            </div>
          </div>

          {/* Active Consistency / Streak */}
          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
              <span className="font-medium">Habit Consistency</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                {activeDaysCount}/{daysCount}
              </span>
              <span className="text-xs font-semibold text-zinc-500">active days</span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <span>{profile.streakDays} Day Active Streak</span>
              <span>·</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {Math.round((activeDaysCount / daysCount) * 100)}% uptime
              </span>
            </div>
          </div>

          {/* Average Daily Study Hours */}
          <div className="bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
              <span className="font-medium">Daily Study Rate</span>
              <Zap className="w-4 h-4 text-sky-500" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                {avgHoursPerDay}
              </span>
              <span className="text-xs font-semibold text-zinc-500">hours/day</span>
            </div>
            <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <span>Avg {Math.round((totalStudyMinutes / Math.max(1, filteredLogs.length)))}m per session</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Primary Charts Section: Study Hours & Focus Sessions Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart: Daily Study Hours vs Target (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Daily Study Hours & Goal Target
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Study hours logged each day compared against your daily {profile.targetHoursPerDay}h goal.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">Study Hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 inline-block" />
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">Target ({profile.targetHoursPerDay}h)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis 
                  dataKey="dayLabel" 
                  tick={{ fontSize: 11, fill: '#888888' }} 
                  axisLine={{ stroke: '#88888830' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#888888' }} 
                  axisLine={{ stroke: '#88888830' }}
                  tickLine={false}
                  unit="h"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-lg text-xs space-y-1.5 min-w-44">
                          <div className="font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-1 flex justify-between items-center">
                            <span>{data.date}</span>
                            <span className="text-[10px] font-normal text-zinc-400">{data.sessionCount} sessions</span>
                          </div>
                          <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
                            <span>Study Time:</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{data.studyHours} hrs ({data.totalMinutes}m)</span>
                          </div>
                          <div className="flex justify-between text-zinc-500">
                            <span>Daily Target:</span>
                            <span>{data.targetHours} hrs</span>
                          </div>
                          {data.subjects && Object.keys(data.subjects).length > 0 && (
                            <div className="pt-1.5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-0.5">
                              <span className="text-[10px] uppercase font-bold text-zinc-400">Subjects Studied:</span>
                              {Object.entries(data.subjects).map(([subj, mins]) => (
                                <div key={subj} className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
                                  <span>{subj}</span>
                                  <span>{String(mins)}m</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine 
                  y={profile.targetHoursPerDay || 4} 
                  stroke="#ef4444" 
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <Bar 
                  dataKey="studyHours" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sessions Distribution & Productivity Rhythm (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Daily Focus Sessions
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Completed focus blocks per day across the current period.
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis 
                  dataKey="dayLabel" 
                  tick={{ fontSize: 10, fill: '#888888' }} 
                  axisLine={{ stroke: '#88888830' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#888888' }} 
                  axisLine={{ stroke: '#88888830' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg shadow-md text-xs">
                          <div className="font-semibold text-zinc-900 dark:text-white">{data.date}</div>
                          <div className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                            {data.sessionCount} focus sessions
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sessionCount" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#sessionGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Total Sessions:</span>
            <span className="font-bold text-zinc-900 dark:text-white">{filteredLogs.length} blocks</span>
          </div>
        </div>
      </div>

      {/* 4. Secondary Row: Subject Time Allocation & Time-of-Day Rhythm */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Allocation Donut (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Subject Time Allocation
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Share of study time across your NCERT & STEM subjects.
              </p>
            </div>
            <PieIcon className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Donut Chart */}
            <div className="sm:col-span-6 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="minutes"
                  >
                    {subjectAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const pct = Math.round((data.minutes / Math.max(1, totalStudyMinutes)) * 100);
                        return (
                          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg shadow-md text-xs">
                            <div className="font-bold text-zinc-900 dark:text-white">{data.name}</div>
                            <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
                              {data.hours} hrs ({data.minutes}m) · {pct}%
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Breakdown List */}
            <div className="sm:col-span-6 space-y-2">
              {subjectAllocationData.map((item) => {
                const pct = Math.round((item.minutes / Math.max(1, totalStudyMinutes)) * 100);
                return (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-28 sm:max-w-32">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                      {item.hours}h ({pct}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time-of-Day Rhythm (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Cognitive Time-of-Day Rhythm
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                When you perform focus sessions and peak cognitive alertness.
              </p>
            </div>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeOfDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#888888' }} 
                  axisLine={{ stroke: '#88888830' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#888888' }} 
                  axisLine={{ stroke: '#88888830' }}
                  tickLine={false}
                  unit="h"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg shadow-md text-xs">
                          <div className="font-bold text-zinc-900 dark:text-white">{data.name}</div>
                          <div className="text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                            {data.hours} hours ({data.sessions} sessions)
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                  {timeOfDayData.map((entry, index) => (
                    <Cell key={`cell-tod-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span>Primary Focus Window:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {timeOfDayData.reduce((prev, cur) => (cur.hours > prev.hours ? cur : prev)).name}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Learning Activity Balance & Mock Test Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="mb-4">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Learning Activity Breakdown
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Balance between active recall (drills, tests, flashcards) and theory lectures.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {categoryData.map((c) => {
              const pct = Math.round((c.minutes / Math.max(1, totalStudyMinutes)) * 100);
              return (
                <div key={c.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {c.fullLabel}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-mono">
                      {c.hours} hrs ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Active Recall Efficiency:</span>
            </div>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round(
                (((categoryData.find((c) => c.category === 'Practice')?.minutes || 0) +
                  (categoryData.find((c) => c.category === 'Mocks')?.minutes || 0) +
                  (categoryData.find((c) => c.category === 'Revision')?.minutes || 0)) /
                  Math.max(1, totalStudyMinutes)) *
                  100
              )}% Active Learning
            </span>
          </div>
        </div>

        {/* Mock Test Score Trajectory (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Mock Test Score Trajectory
              </h2>
              {onOpenMockTest && (
                <button
                  onClick={onOpenMockTest}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Practice CBT</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Accuracy and scoring performance across timed exam simulator attempts.
            </p>
          </div>

          {mockTestTrendData.length > 0 ? (
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTestTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                  <XAxis 
                    dataKey="index" 
                    tick={{ fontSize: 10, fill: '#888888' }} 
                    axisLine={{ stroke: '#88888830' }}
                    tickLine={false}
                    tickFormatter={(val) => `Test #${val}`}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10, fill: '#888888' }} 
                    axisLine={{ stroke: '#88888830' }}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg shadow-md text-xs space-y-1">
                            <div className="font-bold text-zinc-900 dark:text-white">{data.title}</div>
                            <div className="text-indigo-600 dark:text-indigo-400 font-bold">
                              Score: {data.scorePercentage}% ({data.correct}/{data.questions} correct)
                            </div>
                            <div className="text-[10px] text-zinc-400">{data.date}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={75} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1} />
                  <Line 
                    type="monotone" 
                    dataKey="scorePercentage" 
                    stroke="#6366f1" 
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#6366f1' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 space-y-2">
              <Award className="w-8 h-8 text-zinc-400 mx-auto" />
              <div className="text-xs">No mock tests completed yet.</div>
              {onOpenMockTest && (
                <button
                  onClick={onOpenMockTest}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
                >
                  Start First Timed Mock Test
                </button>
              )}
            </div>
          )}

          {/* Flashcard Mastery Summary */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Formula Cards Mastery:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {flashcardStats.mastered} / {flashcardStats.total} formulas mastered ({flashcardStats.masteryRate}%)
            </span>
          </div>
        </div>
      </div>

      {/* 6. Smart Heuristic Advice & Actionable Insights */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Personalized Study Observations & Advice
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {smartRecommendations.map((rec, i) => (
            <div 
              key={i} 
              className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                rec.type === 'success'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                  : rec.type === 'alert'
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/40 text-amber-900 dark:text-amber-200'
                  : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-800/40 text-indigo-900 dark:text-indigo-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{rec.title}</span>
              </div>
              <p className="opacity-90 leading-relaxed font-normal">
                {rec.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Modal: Log Offline Study Session */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <Plus className="w-4 h-4" />
              <span>Manual Study Logger</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              Log Offline Study Block
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-5">
              Record offline library hours, school coaching sessions, or notebook revisions to update your productivity graphs.
            </p>

            <form onSubmit={handleSaveManualLog} className="space-y-4">
              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Subject
                </label>
                <select
                  value={manualSubject}
                  onChange={(e) => setManualSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white outline-hidden focus:border-indigo-500"
                >
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Biology">Biology</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Title / Topic */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Topic or Chapter Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Optics & Wave Interference Problems"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Duration & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="360"
                    step="5"
                    value={manualDurationMinutes}
                    onChange={(e) => setManualDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Date
                  </label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Activity Type
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white outline-hidden focus:border-indigo-500"
                >
                  <option value="deep_work">Deep Work Theory</option>
                  <option value="practice">Numerical Practice & Drills</option>
                  <option value="revision">Formula & Revision</option>
                  <option value="lecture">Video / Classroom Lecture</option>
                  <option value="mock_test">Mock Test Practice</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Save to Study Log (+{Math.round(manualDurationMinutes * 1.5)} XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
