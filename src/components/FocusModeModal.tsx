import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  X, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Sparkles, 
  CheckCircle2, 
  Timer,
  Coffee,
  Waves
} from 'lucide-react';
import { StudyTask } from '../types';
import { startAmbientSound, stopAmbientSound, AmbientSoundType, playSessionEndAlarm, playCelebrationChime } from '../utils/sound';

interface FocusModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: StudyTask[];
  initialTaskTitle?: string;
  onSessionComplete: (durationMinutes: number, taskTitle: string) => void;
}

type PomodoroPhase = 'pomodoro' | 'short_break' | 'long_break';

export const FocusModeModal: React.FC<FocusModeModalProps> = ({
  isOpen,
  onClose,
  tasks,
  initialTaskTitle,
  onSessionComplete
}) => {
  const [phase, setPhase] = useState<PomodoroPhase>('pomodoro');
  const [targetTaskTitle, setTargetTaskTitle] = useState<string>(
    initialTaskTitle || tasks.find((t) => !t.completed)?.title || 'Deep Concept Mastery'
  );
  
  // Timer durations in seconds: 25m, 5m, 15m
  const phaseDurations: Record<PomodoroPhase, number> = {
    pomodoro: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60
  };

  const [timeLeft, setTimeLeft] = useState<number>(phaseDurations.pomodoro);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('none');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (initialTaskTitle) {
      setTargetTaskTitle(initialTaskTitle);
    }
  }, [initialTaskTitle]);

  // Ambient sound handler
  useEffect(() => {
    if (isOpen && isRunning && ambientSound !== 'none') {
      const stopSound = startAmbientSound(ambientSound);
      return () => stopSound();
    } else {
      stopAmbientSound();
    }
  }, [isOpen, isRunning, ambientSound]);

  // Countdown timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed phase
      setIsRunning(false);
      playSessionEndAlarm();

      if (phase === 'pomodoro') {
        const completedMinutes = Math.round(phaseDurations.pomodoro / 60);
        onSessionComplete(completedMinutes, targetTaskTitle);
        setCompletedSessionsCount((c) => c + 1);
        setShowCelebration(true);
        playCelebrationChime();
        setTimeout(() => setShowCelebration(false), 3000);

        // Auto switch to short break or long break
        const nextBreak: PomodoroPhase = (completedSessionsCount + 1) % 4 === 0 ? 'long_break' : 'short_break';
        setPhase(nextBreak);
        setTimeLeft(phaseDurations[nextBreak]);
      } else {
        // Break finished, ready for next pomodoro
        setPhase('pomodoro');
        setTimeLeft(phaseDurations.pomodoro);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft, phase, completedSessionsCount, targetTaskTitle, onSessionComplete]);

  // Reset timer if modal opens
  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      stopAmbientSound();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleRunning = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(phaseDurations[phase]);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (phase === 'pomodoro') {
      setPhase('short_break');
      setTimeLeft(phaseDurations.short_break);
    } else {
      setPhase('pomodoro');
      setTimeLeft(phaseDurations.pomodoro);
    }
  };

  const handleSelectPhase = (newPhase: PomodoroPhase) => {
    setIsRunning(false);
    setPhase(newPhase);
    setTimeLeft(phaseDurations[newPhase]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Format time MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentTotal = phaseDurations[phase];
  const progressPercent = Math.round(((currentTotal - timeLeft) / currentTotal) * 100);

  // Circular SVG ring
  const ringRadius = 110;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-white flex flex-col justify-between p-4 sm:p-8 animate-fade-in select-none">
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto w-full">
        {/* Phase Badges / Tabs */}
        <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs">
          <button
            onClick={() => handleSelectPhase('pomodoro')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              phase === 'pomodoro' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Focus (25m)</span>
          </button>
          <button
            onClick={() => handleSelectPhase('short_break')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              phase === 'short_break' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Short Break (5m)</span>
          </button>
          <button
            onClick={() => handleSelectPhase('long_break')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              phase === 'long_break' ? 'bg-teal-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Long Break (15m)</span>
          </button>
        </div>

        {/* Ambient Sound & Exit */}
        <div className="flex items-center gap-2">
          {/* Ambient Sound Dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs">
            <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value as AmbientSoundType)}
              className="bg-transparent text-zinc-300 text-xs focus:outline-none"
            >
              <option value="none" className="bg-zinc-900 text-white">Silent / None</option>
              <option value="rain" className="bg-zinc-900 text-white">Rain Patter</option>
              <option value="stream" className="bg-zinc-900 text-white">Forest Stream</option>
              <option value="whitenoise" className="bg-zinc-900 text-white">White Noise</option>
              <option value="binaural" className="bg-zinc-900 text-white">40Hz Gamma Focus</option>
            </select>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Close Focus Mode */}
          <button
            onClick={onClose}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
            title="Exit Focus Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center my-6 space-y-8">
        {/* Active Task Objective Selector */}
        <div className="w-full max-w-md space-y-2">
          <div className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Currently Concentrating On</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={targetTaskTitle}
              onChange={(e) => setTargetTaskTitle(e.target.value)}
              placeholder="What are you mastering in this session?"
              className="w-full text-center px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm sm:text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {tasks.length > 0 && (
            <div className="flex justify-center gap-1 overflow-x-auto py-1">
              <span className="text-[11px] text-zinc-500 mr-1 self-center">Quick pick:</span>
              {tasks.filter(t => !t.completed).slice(0, 3).map(t => (
                <button
                  key={t.id}
                  onClick={() => setTargetTaskTitle(t.title)}
                  className="px-2 py-0.5 rounded text-[10px] bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 truncate max-w-[120px]"
                >
                  {t.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Circular Timer Visual */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r={ringRadius}
              className="stroke-zinc-900"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r={ringRadius}
              className={`transition-all duration-1000 ease-linear ${
                phase === 'pomodoro'
                  ? 'stroke-indigo-500'
                  : phase === 'short_break'
                  ? 'stroke-emerald-500'
                  : 'stroke-teal-500'
              }`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time text */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <div className="text-5xl sm:text-6xl font-mono font-extrabold tracking-tight">
              {timeFormatted}
            </div>
            <div className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mt-1">
              {phase === 'pomodoro' ? 'Deep Work Block' : 'Rest & Refresh'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-95"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleRunning}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-95"
            title="Skip Phase"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Celebration Banner when session ends */}
        {showCelebration && (
          <div className="p-3 px-5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-bounce flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Session complete! +50 XP awarded to your profile!</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900 pt-4">
        <span>Completed today: {completedSessionsCount} sessions</span>
        <span>Anti-distraction mode active · Tab switching minimized</span>
      </div>
    </div>
  );
};
