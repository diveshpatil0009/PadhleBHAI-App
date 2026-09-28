import React from 'react';
import { 
  Sun, 
  Moon, 
  Settings, 
  Flame, 
  Zap, 
  Timer, 
  GraduationCap,
  Globe
} from 'lucide-react';
import { UserProfile, AcademicLevel, LearningLanguage } from '../types';
import { ACADEMIC_LEVELS, LANGUAGES } from '../data/mockResources';
import { calculateLevel } from '../data/achievements';

interface HeaderProps {
  profile: UserProfile;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSetTheme?: (theme: 'dark' | 'light') => void;
  onOpenSettings: () => void;
  onOpenFocusMode: () => void;
  onOpenGamification: () => void;
  onQuickChangeLanguage: (lang: LearningLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  theme,
  onToggleTheme,
  onSetTheme,
  onOpenSettings,
  onOpenFocusMode,
  onOpenGamification,
  onQuickChangeLanguage
}) => {
  const activeLevelObj = ACADEMIC_LEVELS.find((l) => l.id === profile.academicLevel) || ACADEMIC_LEVELS[1];

  const handleSelectTheme = (newTheme: 'dark' | 'light') => {
    if (onSetTheme) {
      onSetTheme(newTheme);
    } else if (newTheme !== theme) {
      onToggleTheme();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors bg-white/95 border-zinc-200 dark:bg-zinc-950/95 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
        {/* Brand & Level Indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <span>S</span>
              <span className="text-indigo-200 text-xs">⚡</span>
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white">
                StudyPulse
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block mx-1" />

          {/* Academic Level Badge (visible on mobile and desktop) */}
          <button
            onClick={onOpenSettings}
            title="Click to change academic level"
            className="flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-200/80 dark:border-zinc-800 shrink-0"
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-semibold">{activeLevelObj.badge}</span>
            <span className="hidden md:inline text-zinc-500 dark:text-zinc-400">· {activeLevelObj.label.split('(')[0]}</span>
          </button>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Prominent White / Dark Theme Switcher */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 shrink-0">
            <button
              type="button"
              onClick={() => handleSelectTheme('light')}
              className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 text-xs rounded-md transition-all ${
                theme === 'light'
                  ? 'bg-white text-zinc-900 shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              title="Switch to White (Light) Theme"
            >
              <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : ''}`} />
              <span className="hidden sm:inline text-[11px]">White</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectTheme('dark')}
              className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 text-xs rounded-md transition-all ${
                theme === 'dark'
                  ? 'bg-zinc-800 text-white shadow-xs font-bold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
              title="Switch to Dark Theme"
            >
              <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-indigo-400' : ''}`} />
              <span className="hidden sm:inline text-[11px]">Dark</span>
            </button>
          </div>

          {/* Gamification Streak & XP Badge */}
          <button
            onClick={onOpenGamification}
            title="View Achievements & Progress"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/15 text-amber-700 dark:text-amber-400 transition-colors border border-amber-500/20 text-xs font-bold shrink-0"
          >
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{profile.streakDays}d</span>
            </div>
            <div className="h-3 w-px bg-amber-500/30 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{profile.totalXp} XP</span>
            </div>
          </button>

          {/* Quick Focus Mode Button */}
          <button
            onClick={onOpenFocusMode}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95 shrink-0"
            title="Start Pomodoro Focus Timer"
          >
            <Timer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Focus</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Settings & Profile"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
