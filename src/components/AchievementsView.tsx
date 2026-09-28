import React from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Target, 
  Award, 
  FileText, 
  Compass, 
  Lock,
  Sparkles
} from 'lucide-react';
import { AchievementBadge, UserProfile } from '../types';
import { calculateLevel, XP_TABLE } from '../data/achievements';

interface AchievementsViewProps {
  profile: UserProfile;
  achievements: AchievementBadge[];
  onOpenFocusMode: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  profile,
  achievements,
  onOpenFocusMode
}) => {
  const levelInfo = calculateLevel(profile.totalXp);
  const unlockedCount = achievements.filter((a) => a.progress >= a.maxProgress).length;

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6 text-indigo-500" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />;
      case 'Target':
        return <Target className="w-6 h-6 text-rose-500" />;
      case 'Award':
        return <Award className="w-6 h-6 text-yellow-500" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-teal-500" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-purple-500 fill-purple-500" />;
      default:
        return <Clock className="w-6 h-6 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Hero Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Academic Tier
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                Level {levelInfo.level} · {levelInfo.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                {profile.totalXp} XP
              </div>
              <div className="text-xs text-zinc-400">Total Experience</div>
            </div>
            <button
              onClick={onOpenFocusMode}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs"
            >
              Earn +50 XP
            </button>
          </div>
        </div>

        {/* Progress Bar to next level */}
        <div className="space-y-1.5">
          <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <span>Progress in tier: {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP</span>
            <span>{levelInfo.nextLevelXp - levelInfo.currentLevelXp} XP to next milestone</span>
          </div>
        </div>
      </div>

      {/* Gamification Stats Triple */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
              {profile.streakDays} Days
            </div>
            <div className="text-xs text-zinc-500">Daily Study Streak</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
              {profile.totalStudyMinutes} mins
            </div>
            <div className="text-xs text-zinc-500">Focus Time Logged</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-zinc-900 dark:text-white">
              {unlockedCount} / {achievements.length}
            </div>
            <div className="text-xs text-zinc-500">Badges Unlocked</div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Achievement Milestones</span>
          </h3>
          <span className="text-xs text-zinc-400">
            Keep completing daily targets and Pomodoro blocks to unlock all
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((badge) => {
            const isUnlocked = badge.progress >= badge.maxProgress;
            const progressPct = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'border-indigo-500/30 bg-white dark:bg-zinc-900 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 opacity-75'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {isUnlocked ? renderBadgeIcon(badge.iconName) : <Lock className="w-5 h-5 text-zinc-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {badge.title}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-zinc-400">
                        {badge.progress} / {badge.maxProgress}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {badge.description}
                  </p>

                  {!isUnlocked && (
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
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
  );
};
