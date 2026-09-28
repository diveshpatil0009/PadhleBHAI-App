import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Clock, 
  Play, 
  Sparkles, 
  ArrowUpRight,
  BookOpen,
  Calendar,
  Flame,
  Check,
  Library,
  BookMarked,
  Timer,
  Layers,
  Award,
  Database,
  BarChart3
} from 'lucide-react';
import { StudyTask, ScheduleBlock, UserProfile, TaskPriority, TaskCategory } from '../types';
import { SUBJECT_OPTIONS } from '../data/mockResources';

interface DashboardViewProps {
  profile: UserProfile;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<StudyTask, 'id' | 'createdAt'>) => void;
  onDeleteTask: (taskId: string) => void;
  schedule: ScheduleBlock[];
  onOpenFocusMode: (customTaskTitle?: string) => void;
  onNavigateToTab: (tab: 'insights' | 'resources' | 'flashcards' | 'planner' | 'notebook' | 'achievements') => void;
  onOpenMockTest?: () => void;
  onOpenBackupModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  schedule,
  onOpenFocusMode,
  onNavigateToTab,
  onOpenMockTest,
  onOpenBackupModal
}) => {
  // Today's Study Session Chooser State
  const [selectedSubject, setSelectedSubject] = useState<string>(
    SUBJECT_OPTIONS.find((s) => s.id === profile.fieldOfStudy)?.label || 'Physics (NCERT & JEE/NEET)'
  );
  const [sessionTopic, setSessionTopic] = useState<string>('');
  const [sessionDuration, setSessionDuration] = useState<number>(25);

  // New task form state
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newEstMinutes, setNewEstMinutes] = useState<number>(30);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const todayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon ...
  const todayBlocks = schedule.filter((b) => b.dayOfWeek === todayIndex);

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const handleStartSession = () => {
    const fullTopic = sessionTopic.trim() 
      ? `${selectedSubject.split('(')[0].trim()}: ${sessionTopic.trim()}`
      : `${selectedSubject.split('(')[0].trim()} Study Session`;
    onOpenFocusMode(fullTopic);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      priority: newPriority,
      category: 'practice',
      estimatedMinutes: Number(newEstMinutes) || 30,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0]
    });
    setNewTitle('');
    setIsAddingTask(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* ========================================================
          1. TODAY'S STUDY SESSION & SUBJECT CHOOSER (CENTERPIECE)
          ======================================================== */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Target: {profile.targetHoursPerDay} hrs/day goal</span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-normal">
                {profile.streakDays} Day Streak 🔥
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Today's Study Session
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Select your NCERT subject, chapter topic, and launch your focus timer.
            </p>
          </div>

          {/* Quick stats badge */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-zinc-50 dark:bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800 text-xs">
            <div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Today's Progress</div>
              <div className="font-bold text-zinc-900 dark:text-white">
                {completedTasksCount} / {tasks.length} tasks ({progressPercent}%)
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Subject & Session Configuration Form */}
        <div className="pt-5 space-y-4">
          {/* Step 1: Choose Subject */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>1. Choose Subject</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUBJECT_OPTIONS.map((sub) => {
                const isSelected = selectedSubject === sub.label;
                const shortLabel = sub.label.split('(')[0].trim();
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubject(sub.label)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className="truncate">{shortLabel}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Topic / Chapter input & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            <div className="sm:col-span-8 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
                2. Chapter or Topic to Study
              </label>
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder="e.g. NCERT Ch 1: Electric Charges & Fields, or Ch 8: Trigonometry"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Duration</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[25, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSessionDuration(mins)}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      sessionDuration === mins
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Launch Button */}
          <div className="pt-2">
            <button
              onClick={handleStartSession}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-sm shadow-indigo-600/25 transition-all active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Today's Focus Session</span>
              <span className="text-indigo-200 text-xs font-normal">({sessionDuration} mins)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. TWO-COLUMN RESPONSIVE SECTION: CHECKLIST & TODAY'S TIME
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Today's Action Checklist */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>Today's Study Checklist</span>
                <span className="text-xs font-mono font-normal text-zinc-400">
                  ({completedTasksCount}/{tasks.length})
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Check off items as you complete chapters
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs">
              {(['all', 'pending', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTaskFilter(filter)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors text-[11px] ${
                    taskFilter === filter
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                No tasks matching the selected filter.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                    task.completed
                      ? 'bg-zinc-50/60 dark:bg-zinc-950/40 border-zinc-200/60 dark:border-zinc-800 opacity-60'
                      : 'bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className="text-zinc-400 hover:text-indigo-600 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <span
                      className={`text-xs sm:text-sm font-medium leading-snug truncate ${
                        task.completed
                          ? 'line-through text-zinc-400 dark:text-zinc-500'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!task.completed && (
                      <button
                        onClick={() => onOpenFocusMode(task.title)}
                        title="Focus on this task"
                        className="p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      title="Delete task"
                      className="p-1 text-zinc-400 hover:text-rose-500 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Add Task */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {!isAddingTask ? (
              <button
                onClick={() => setIsAddingTask(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline py-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add new study task</span>
              </button>
            ) : (
              <form onSubmit={handleCreateTask} className="space-y-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Complete NCERT Exercise 8.2 Trigonometry questions 1-5"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex items-center justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-2.5 py-1 text-zinc-500 hover:text-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 font-semibold rounded-lg bg-indigo-600 text-white"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Today's Routine & Quick Menu Links */}
        <div className="lg:col-span-5 space-y-4">
          {/* Today's Schedule Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                  Today's Scheduled Blocks
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('planner')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {todayBlocks.length === 0 ? (
                <div className="py-5 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                  No routine blocks scheduled for today.{' '}
                  <button
                    onClick={() => onNavigateToTab('planner')}
                    className="text-indigo-600 underline font-medium"
                  >
                    Generate in Planner
                  </button>
                </div>
              ) : (
                todayBlocks.slice(0, 3).map((block) => (
                  <div
                    key={block.id}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center justify-between text-xs gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                        {block.startTime} – {block.endTime}
                      </div>
                      <div className="font-semibold text-zinc-800 dark:text-zinc-200 truncate mt-0.5">
                        {block.title}
                      </div>
                    </div>
                    {block.type !== 'break' && (
                      <button
                        onClick={() => onOpenFocusMode(block.title)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 shrink-0"
                      >
                        Focus
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Menu Navigation Cards (clean redirection to full tabs & tools) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <button
              onClick={() => onNavigateToTab('insights')}
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all space-y-1 shadow-xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="font-bold text-zinc-900 dark:text-white pt-1">
                Study Insights
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                Productivity & focus trends
              </div>
            </button>

            <button
              onClick={() => onNavigateToTab('flashcards')}
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all space-y-1 shadow-xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <div className="font-bold text-zinc-900 dark:text-white pt-1">
                Formula Cards
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                Interactive 3D flip decks
              </div>
            </button>

            <button
              onClick={onOpenMockTest}
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all space-y-1 shadow-xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <div className="font-bold text-zinc-900 dark:text-white pt-1">
                Mock Test
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                Timed CBT practice exam
              </div>
            </button>

            <button
              onClick={() => onNavigateToTab('resources')}
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all space-y-1 shadow-xs group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                <Library className="w-4 h-4" />
              </div>
              <div className="font-bold text-zinc-900 dark:text-white pt-1">
                NCERT Feeds
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                PW, Dear Sir, Magnet Brains
              </div>
            </button>

            <button
              onClick={onOpenBackupModal}
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all space-y-1 shadow-xs group col-span-2 sm:col-span-1"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                <Database className="w-4 h-4" />
              </div>
              <div className="font-bold text-zinc-900 dark:text-white pt-1">
                Backup & Print
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                JSON export & PDF sheets
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
