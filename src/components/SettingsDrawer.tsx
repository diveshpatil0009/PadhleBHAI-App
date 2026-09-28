import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  BookOpen, 
  Globe, 
  Clock, 
  RotateCcw, 
  Download, 
  Check, 
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile, AcademicLevel, FieldOfStudy, LearningLanguage } from '../types';
import { ACADEMIC_LEVELS, SUBJECT_OPTIONS, LANGUAGES } from '../data/mockResources';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  theme: 'dark' | 'light';
  onSetTheme: (theme: 'dark' | 'light') => void;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
  onResetAllData: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  theme,
  onSetTheme,
  onSaveProfile,
  onResetAllData
}) => {
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>(profile.academicLevel);
  const [fieldOfStudy, setFieldOfStudy] = useState<FieldOfStudy>(profile.fieldOfStudy);
  const [targetSubject, setTargetSubject] = useState<string>(profile.targetSubject);
  const [language, setLanguage] = useState<LearningLanguage>(profile.language);
  const [targetHoursPerDay, setTargetHoursPerDay] = useState<number>(profile.targetHoursPerDay);
  const [showSavedFeedback, setShowSavedFeedback] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      academicLevel,
      fieldOfStudy,
      targetSubject,
      language,
      targetHoursPerDay
    });
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 600);
  };

  const handleExportData = () => {
    try {
      const exportBlob = new Blob([
        JSON.stringify({
          profile,
          exportedAt: new Date().toISOString()
        }, null, 2)
      ], { type: 'application/json' });
      const url = URL.createObjectURL(exportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studypulse-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Profile & Learning Goals
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Personalized local state · Zero authentication
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-950 dark:text-indigo-300 leading-relaxed">
              Your profile, routine, notes, and streak are stored solely inside your browser's LocalStorage. No tracking, no login barriers.
            </p>
          </div>

          {/* Color Appearance / Theme */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
              Color Appearance / Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSetTheme('light')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-white text-zinc-900 ring-2 ring-indigo-500/20 shadow-xs font-semibold'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">White Theme</div>
                  <div className="text-[10px] text-zinc-500">Crisp bright mode</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSetTheme('dark')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  theme === 'dark'
                    ? 'border-indigo-600 bg-zinc-800 text-white ring-2 ring-indigo-500/20 shadow-xs font-semibold'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Dark Theme</div>
                  <div className="text-[10px] text-zinc-400">Deep OLED dark</div>
                </div>
              </button>
            </div>
          </div>

          {/* Academic Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              Academic Level
            </label>
            <div className="space-y-1.5">
              {ACADEMIC_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setAcademicLevel(lvl.id as AcademicLevel)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors ${
                    academicLevel === lvl.id
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <span>{lvl.label}</span>
                  {academicLevel === lvl.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Field of Study */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              Field of Study
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {SUBJECT_OPTIONS.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setFieldOfStudy(sub.id as FieldOfStudy)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors ${
                    fieldOfStudy === sub.id
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <span>{sub.label}</span>
                  {fieldOfStudy === sub.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Focus Topic / Target Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
              Specific Subject Focus
            </label>
            <input
              type="text"
              value={targetSubject}
              onChange={(e) => setTargetSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Pure Mathematics & Quantum Mechanics"
            />
          </div>

          {/* Preferred Language */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              Preferred Language
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguage(lang.id as LearningLanguage)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors ${
                    language === lang.id
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <span className="truncate">{lang.label}</span>
                  {language === lang.id && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Target Study Hours */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Target Hours / Day
              </label>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {targetHoursPerDay} hrs
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[2, 4, 6, 8].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setTargetHoursPerDay(hrs)}
                  className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${
                    targetHoursPerDay === hrs
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>

          {/* Backup & Reset actions */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2.5">
            <button
              type="button"
              onClick={handleExportData}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Export Study Progress (.json)</span>
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Local Study Data</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-center space-y-2">
                <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                  Are you sure? This erases all tasks, notes, streaks, and routines.
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      onResetAllData();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
          >
            {showSavedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save & Update</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
