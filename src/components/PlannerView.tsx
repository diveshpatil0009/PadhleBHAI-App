import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  RotateCcw,
  Calendar
} from 'lucide-react';
import { ScheduleBlock, BlockType, UserProfile } from '../types';
import { generateSmartWeeklyRoutine } from '../utils/routineGenerator';

interface PlannerViewProps {
  schedule: ScheduleBlock[];
  onUpdateSchedule: (newSchedule: ScheduleBlock[]) => void;
  onOpenFocusMode: (taskTitle?: string) => void;
  profile: UserProfile;
  onAwardXp: (amount: number, reason: string) => void;
}

const DAYS_OF_WEEK = [
  { day: 1, name: 'Monday', short: 'Mon' },
  { day: 2, name: 'Tuesday', short: 'Tue' },
  { day: 3, name: 'Wednesday', short: 'Wed' },
  { day: 4, name: 'Thursday', short: 'Thu' },
  { day: 5, name: 'Friday', short: 'Fri' },
  { day: 6, name: 'Saturday', short: 'Sat' },
  { day: 0, name: 'Sunday', short: 'Sun' }
];

export const PlannerView: React.FC<PlannerViewProps> = ({
  schedule,
  onUpdateSchedule,
  onOpenFocusMode,
  profile,
  onAwardXp
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [isAddingBlock, setIsAddingBlock] = useState<boolean>(false);
  const [showGenerateModal, setShowGenerateModal] = useState<boolean>(false);

  // Add block form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>(profile.targetSubject || 'Mathematics');
  const [newStart, setNewStart] = useState<string>('09:00');
  const [newEnd, setNewEnd] = useState<string>('10:30');
  const [newType, setNewType] = useState<BlockType>('deep_work');

  // Generator preferences
  const [genStartHour, setGenStartHour] = useState<number>(8);
  const [genIncludeWeekends, setGenIncludeWeekends] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const activeDayBlocks = schedule
    .filter((b) => b.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleToggleBlockComplete = (blockId: string) => {
    const updated = schedule.map((b) => {
      if (b.id === blockId) {
        const nextCompleted = !b.completed;
        if (nextCompleted) {
          onAwardXp(30, 'Completed scheduled study block');
        }
        return { ...b, completed: nextCompleted };
      }
      return b;
    });
    onUpdateSchedule(updated);
  };

  const handleDeleteBlock = (blockId: string) => {
    onUpdateSchedule(schedule.filter((b) => b.id !== blockId));
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBlock: ScheduleBlock = {
      id: `block-${Date.now()}`,
      dayOfWeek: selectedDay,
      startTime: newStart,
      endTime: newEnd,
      title: newTitle.trim(),
      subject: newSubject.trim() || 'General',
      type: newType,
      completed: false
    };

    onUpdateSchedule([...schedule, newBlock]);
    setNewTitle('');
    setIsAddingBlock(false);
  };

  const handleRunAiRoutine = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateSmartWeeklyRoutine(profile, {
        startHour: genStartHour,
        includeWeekends: genIncludeWeekends
      });
      onUpdateSchedule(generated);
      setIsGenerating(false);
      setShowGenerateModal(false);
      onAwardXp(20, 'AI Generated Study Routine');
    }, 600);
  };

  const getBlockTypeColor = (type: BlockType) => {
    switch (type) {
      case 'deep_work':
        return 'border-l-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20';
      case 'practice':
        return 'border-l-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20';
      case 'lecture':
        return 'border-l-blue-600 bg-blue-50/40 dark:bg-blue-950/20';
      case 'break':
        return 'border-l-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/40';
      case 'revision':
        return 'border-l-amber-600 bg-amber-50/40 dark:bg-amber-950/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & AI Generator Action */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <span>Weekly Study Routine & Timetable</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Calibrated for {profile.targetHoursPerDay} hours/day · {profile.targetSubject}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Generate Routine</span>
          </button>
          <button
            onClick={() => setIsAddingBlock(!isAddingBlock)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Week Day Tab Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
        {DAYS_OF_WEEK.map((d) => {
          const isSelected = selectedDay === d.day;
          const dayCount = schedule.filter((b) => b.dayOfWeek === d.day).length;

          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`flex-1 min-w-[70px] sm:min-w-[90px] py-2.5 px-2 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-xs ring-1 ring-indigo-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="text-[11px] font-medium leading-none uppercase">{d.short}</div>
              <div className="text-xs font-bold mt-1 text-zinc-900 dark:text-white">
                {dayCount} {dayCount === 1 ? 'slot' : 'slots'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Block Form Drawer/Collapsible */}
      {isAddingBlock && (
        <form
          onSubmit={handleCreateBlock}
          className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Add New Study Block ({DAYS_OF_WEEK.find((d) => d.day === selectedDay)?.name})
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingBlock(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
                Activity Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Solve Integral Calculus Problems"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
                Subject / Topic
              </label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Mathematics"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
                  Start Time
                </label>
                <input
                  type="time"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
                  End Time
                </label>
                <input
                  type="time"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-medium">
                Block Category
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as BlockType)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
              >
                <option value="deep_work">Deep Work / Core Theory</option>
                <option value="practice">Practice & Drills</option>
                <option value="lecture">Lecture / Video Study</option>
                <option value="revision">Active Revision & Flashcards</option>
                <option value="break">Scheduled Break / Rest</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingBlock(false)}
              className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      )}

      {/* Schedule Blocks for Selected Day */}
      <div className="space-y-3">
        {activeDayBlocks.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 text-center space-y-3">
            <Calendar className="w-8 h-8 text-zinc-400 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              No routine scheduled for this day
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Draft an intelligent weekly schedule calibrated for your targets with a single click.
            </p>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white"
            >
              AI Generate Routine
            </button>
          </div>
        ) : (
          activeDayBlocks.map((block) => {
            const isBreak = block.type === 'break';

            return (
              <div
                key={block.id}
                className={`p-4 rounded-xl border border-l-4 transition-all flex items-start justify-between gap-4 ${getBlockTypeColor(
                  block.type
                )} ${
                  block.completed
                    ? 'opacity-60 bg-zinc-50/50 dark:bg-zinc-950/40'
                    : 'bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {!isBreak ? (
                    <button
                      type="button"
                      onClick={() => handleToggleBlockComplete(block.id)}
                      className="mt-0.5 text-zinc-400 hover:text-indigo-600 transition-colors shrink-0"
                    >
                      {block.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 hover:stroke-indigo-600" />
                      )}
                    </button>
                  ) : (
                    <div className="w-5 h-5 flex items-center justify-center text-zinc-400 mt-0.5 shrink-0">
                      ☕
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                      <span>{block.startTime} – {block.endTime}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize font-sans font-medium">{block.type.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-sans">{block.subject}</span>
                    </div>

                    <h4
                      className={`text-sm font-bold mt-0.5 ${
                        block.completed
                          ? 'line-through text-zinc-400 dark:text-zinc-500'
                          : 'text-zinc-900 dark:text-white'
                      }`}
                    >
                      {block.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!isBreak && !block.completed && (
                    <button
                      onClick={() => onOpenFocusMode(block.title)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                      title="Launch Pomodoro timer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Focus</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="Remove block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* AI Generate Routine Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  AI Routine Generator
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Generates an optimized weekly timetable based on your goals
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                <span>Target Study Hours:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{profile.targetHoursPerDay} hrs/day</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                <span>Primary Subject:</span>
                <span className="font-bold text-zinc-900 dark:text-white">{profile.targetSubject}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  Routine Start Time
                </label>
                <select
                  value={genStartHour}
                  onChange={(e) => setGenStartHour(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white"
                >
                  <option value={7}>07:00 AM (Early Bird)</option>
                  <option value={8}>08:00 AM (Standard Morning)</option>
                  <option value={9}>09:00 AM (Mid-Morning)</option>
                  <option value={10}>10:00 AM (Late Start)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                    Include Weekends
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Slightly lighter weekend sessions
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={genIncludeWeekends}
                  onChange={(e) => setGenIncludeWeekends(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleRunAiRoutine}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Synthesizing...' : 'Generate Routine'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
