import React from 'react';
import { 
  X, 
  Trophy, 
  Flame, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Target, 
  Award, 
  FileText, 
  Compass, 
  Lock
} from 'lucide-react';
import { AchievementBadge, UserProfile } from '../types';
import { calculateLevel, XP_TABLE } from '../data/achievements';

interface GamificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  achievements: AchievementBadge[];
}

export const GamificationDrawer: React.FC<GamificationDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  achievements
}) => {
  if (!isOpen) return null;

  const levelInfo = calculateLevel(profile.totalXp);
  const unlockedCount = achievements.filter((a) => a.progress >= a.maxProgress).length;

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-indigo-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'Target':
        return <Target className="w-5 h-5 text-rose-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-teal-500" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-purple-500 fill-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Study Milestones & XP
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {unlockedCount} of {achievements.length} badges unlocked
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Level Status Card */}
          <div className="p-5 rounded-2xl bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Current Rank
                </span>
                <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                  Level {levelInfo.level} · {levelInfo.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {profile.totalXp}
                </span>
                <span className="text-xs text-zinc-400 block">Total XP</span>
              </div>
            </div>

            {/* Level progress bar */}
            <div>
              <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 font-mono">
                <span>{levelInfo.currentLevelXp} XP</span>
                <span>{levelInfo.nextLevelXp - levelInfo.currentLevelXp} XP to next rank</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                <Flame className="w-4 h-4 fill-current" />
                <span>Daily Streak</span>
              </div>
              <div className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
                {profile.streakDays} Days
              </div>
              <div className="text-[10px] text-zinc-400">Active study consistency</div>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span>Focus Minutes</span>
              </div>
              <div className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
                {profile.totalStudyMinutes}m
              </div>
              <div className="text-[10px] text-zinc-400">Pomodoro focus logged</div>
            </div>
          </div>

          {/* XP Rewards Guide */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              How to Earn Points
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Pomodoro Session</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">+{XP_TABLE.POMODORO_SESSION} XP</span>
              </div>
              <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Complete Study Task</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">+{XP_TABLE.TASK_COMPLETED} XP</span>
              </div>
              <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Create Study Note</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">+{XP_TABLE.NOTE_CREATED} XP</span>
              </div>
              <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Explore Resource</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">+{XP_TABLE.RESOURCE_VIEWED} XP</span>
              </div>
            </div>
          </div>

          {/* Badges List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Achievement Badges
            </h4>

            <div className="space-y-2.5">
              {achievements.map((badge) => {
                const isUnlocked = badge.progress >= badge.maxProgress;
                const progressPct = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isUnlocked
                        ? 'border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-950/20'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 opacity-80'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? 'bg-white dark:bg-zinc-900 shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isUnlocked ? renderBadgeIcon(badge.iconName) : <Lock className="w-4 h-4 text-zinc-400" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">
                          {badge.title}
                        </span>
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-400">
                            {badge.progress}/{badge.maxProgress}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
                        {badge.description}
                      </p>

                      {!isUnlocked && (
                        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
