import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Globe, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Check
} from 'lucide-react';
import { AcademicLevel, FieldOfStudy, LearningLanguage, UserProfile } from '../types';
import { ACADEMIC_LEVELS, SUBJECT_OPTIONS, LANGUAGES } from '../data/mockResources';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: Partial<UserProfile>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('ncert_class_11_12_science');
  const [fieldOfStudy, setFieldOfStudy] = useState<FieldOfStudy>('ncert_physics');
  const [targetSubject, setTargetSubject] = useState<string>('Physics & Chemistry (NCERT)');
  const [language, setLanguage] = useState<LearningLanguage>('hinglish');
  const [targetHoursPerDay, setTargetHoursPerDay] = useState<number>(4);

  if (!isOpen) return null;

  const handleFinish = () => {
    onComplete({
      academicLevel,
      fieldOfStudy,
      targetSubject: targetSubject.trim() || 'General Studies',
      language,
      targetHoursPerDay,
      onboarded: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                Welcome to StudyPulse
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Personalize your study companion in under a minute. Zero login required.
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Step {step} of 3
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  What is your academic level?
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Resources, difficulty levels, and schedules will calibrate to this.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ACADEMIC_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setAcademicLevel(level.id as AcademicLevel)}
                    className={`p-3.5 text-left rounded-xl border transition-all flex flex-col justify-between ${
                      academicLevel === level.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {level.badge}
                      </span>
                      {academicLevel === level.id && (
                        <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </div>
                    <span className="text-sm font-medium leading-snug">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Select your primary field & target subjects
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  We will prioritize verified lectures, formula sheets, and study blocks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUBJECT_OPTIONS.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setFieldOfStudy(sub.id as FieldOfStudy);
                      if (!targetSubject || targetSubject === 'General Studies') {
                        setTargetSubject(sub.label);
                      }
                    }}
                    className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between ${
                      fieldOfStudy === sub.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-medium'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <span className="text-xs">{sub.label}</span>
                    {fieldOfStudy === sub.id && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
                  Specific focus or exam (e.g. Calculus, NEET Physics, AP Biology, Algorithms)
                </label>
                <input
                  type="text"
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  placeholder="e.g. Organic Chemistry & Physics"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500" />
                  Preferred Learning Language
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setLanguage(lang.id as LearningLanguage)}
                      className={`p-3 text-left rounded-xl border transition-all flex items-center justify-between ${
                        language === lang.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-medium'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <span className="text-xs">{lang.label}</span>
                      {language === lang.id && (
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    Daily Study Target
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {targetHoursPerDay} hrs/day
                  </span>
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 mb-3">
                  How many hours of focused study do you aim for daily?
                </p>

                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 6, 8].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setTargetHoursPerDay(hours)}
                      className={`py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                        targetHoursPerDay === hours
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {hours} hrs
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 underline font-medium"
            >
              Skip setup (Start with defaults)
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Companion</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
