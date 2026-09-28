import React from 'react';
import { Flame, Play, Sparkles } from 'lucide-react';
import { UserProfile, StudyTask } from '../types';
import { calculateLevel } from '../data/achievements';

interface HeroOverviewProps {
  profile: UserProfile;
  tasks: StudyTask[];
  onOpenFocusMode: () => void;
  onOpenGamification: () => void;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  profile,
  tasks,
  onOpenFocusMode,
  onOpenGamification
}) => {
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const levelInfo = calculateLevel(profile.totalXp);

  // SVG Circular progress ring calculations
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Today's Focus & Quote */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target: {profile.targetSubject}</span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-zinc-500 dark:text-zinc-400">{profile.targetHoursPerDay}h goal today</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Daily Study Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {progressPercent === 100 && totalTasks > 0
              ? "All daily checklist targets crushed! Review your notes or start a bonus focus session."
              : `${completedTasks} of ${totalTasks} tasks complete today. Focus on deliberate practice and active recall.`}
          </p>
        </div>

        {/* Center / Right: Progress Ring & Gamification Metrics */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-zinc-100 dark:border-zinc-800/80">
          {/* Progress Ring */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  className="stroke-zinc-100 dark:stroke-zinc-800"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-700 ease-out"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  {progressPercent}%
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">
                Task Completion
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {completedTasks}/{totalTasks} objectives
              </div>
            </div>
          </div>

          {/* XP & Level Info */}
          <button
            onClick={onOpenGamification}
            className="flex-1 sm:flex-initial text-left p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
          >
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Level {levelInfo.level}: {levelInfo.title}
              </span>
              <span className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                {profile.totalXp} XP
              </span>
            </div>

            {/* Micro Progress Bar for Level */}
            <div className="w-full sm:w-36 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">
              {levelInfo.nextLevelXp - levelInfo.currentLevelXp} XP to next rank
            </div>
          </button>

          {/* Focus Button */}
          <button
            onClick={onOpenFocusMode}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs transition-all shadow-sm active:scale-98"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Focus Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
