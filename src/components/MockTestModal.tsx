import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Timer, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Award, 
  BookOpen, 
  RotateCcw, 
  Bookmark, 
  ChevronRight, 
  ChevronLeft,
  BookMarked,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';
import { MockQuestion, TestResult, UserAnswer } from '../types/testAndFlashcards';
import { FieldOfStudy, AcademicLevel } from '../types';
import { MOCK_QUESTIONS } from '../data/mockQuestions';
import { SUBJECT_OPTIONS } from '../data/mockResources';

interface MockTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userFieldOfStudy: FieldOfStudy;
  userAcademicLevel: AcademicLevel;
  onCompleteTest: (result: TestResult, xpEarned: number) => void;
  onAddDoubtToNotebook?: (title: string, subject: string, content: string) => void;
}

export const MockTestModal: React.FC<MockTestModalProps> = ({
  isOpen,
  onClose,
  userFieldOfStudy,
  userAcademicLevel,
  onCompleteTest,
  onAddDoubtToNotebook
}) => {
  // Test Setup States
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [testDurationMins, setTestDurationMins] = useState<number>(15);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const [testQuestions, setTestQuestions] = useState<MockQuestion[]>([]);
  
  // Active Test States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(15 * 60);
  const [finalResult, setFinalResult] = useState<TestResult | null>(null);
  const [addedDoubts, setAddedDoubts] = useState<Record<string, boolean>>({});

  const timerRef = useRef<any>(null);

  // Prepare questions on test start
  const handleStartTest = () => {
    let pool = MOCK_QUESTIONS;
    if (selectedSubject !== 'all') {
      pool = pool.filter((q) => q.subject === selectedSubject);
    }
    // If not enough questions in filter, fallback to pool
    if (pool.length === 0) pool = MOCK_QUESTIONS;

    // Shuffle and pick questions based on duration
    const questionCount = testDurationMins === 15 ? Math.min(10, pool.length) : Math.min(15, pool.length);
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, questionCount);

    setTestQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setTimeRemainingSeconds(testDurationMins * 60);
    
    // Initialise answers
    const initialAnswers: Record<string, UserAnswer> = {};
    shuffled.forEach((q) => {
      initialAnswers[q.id] = {
        questionId: q.id,
        selectedOptionIndex: null,
        isMarkedForReview: false,
        timeSpentSeconds: 0
      };
    });
    setUserAnswers(initialAnswers);
    setIsTestActive(true);
    setIsTestFinished(false);
    setFinalResult(null);
  };

  // Timer effect
  useEffect(() => {
    if (isTestActive && !isTestFinished) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTestActive, isTestFinished, userAnswers]);

  if (!isOpen) return null;

  const currentQ = testQuestions[currentQuestionIndex];
  const currentAnswer = currentQ ? userAnswers[currentQ.id] : null;

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOptionIndex: optionIndex
      }
    }));
  };

  const handleToggleReview = () => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        isMarkedForReview: !prev[currentQ.id]?.isMarkedForReview
      }
    }));
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOptionIndex: null
      }
    }));
  };

  const handleSubmitTest = () => {
    clearInterval(timerRef.current);
    
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const detailedAnswers = testQuestions.map((q) => {
      const uAns = userAnswers[q.id];
      const hasAnswered = uAns && uAns.selectedOptionIndex !== null;
      const isCorrect = hasAnswered && uAns.selectedOptionIndex === q.correctOptionIndex;

      if (!hasAnswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        questionId: q.id,
        questionText: q.questionText,
        selectedOption: hasAnswered ? q.options[uAns.selectedOptionIndex!] : null,
        correctOption: q.options[q.correctOptionIndex],
        isCorrect,
        explanation: q.explanation,
        ncertReference: q.ncertReference
      };
    });

    const scorePercentage = testQuestions.length > 0 
      ? Math.round((correctCount / testQuestions.length) * 100) 
      : 0;

    const totalTimeSpent = (testDurationMins * 60) - timeRemainingSeconds;

    const result: TestResult = {
      id: `test-${Date.now()}`,
      date: new Date().toISOString(),
      testTitle: `${testDurationMins}m Practice Quiz (${testQuestions.length} Questions)`,
      subject: selectedSubject === 'all' ? 'All Subjects' : selectedSubject,
      totalQuestions: testQuestions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unanswered: unansweredCount,
      scorePercentage,
      totalTimeSeconds: totalTimeSpent,
      answers: detailedAnswers
    };

    setFinalResult(result);
    setIsTestFinished(true);
    setIsTestActive(false);

    // Award XP based on performance: baseline 40 XP + accuracy points
    const xpEarned = 40 + Math.round((scorePercentage / 100) * 60);
    onCompleteTest(result, xpEarned);
  };

  const handleAddDoubtClick = (q: any) => {
    if (!onAddDoubtToNotebook) return;
    const title = `Doubt: ${q.questionText.slice(0, 45)}...`;
    const content = `# Exam Doubt & Solution
**Question**: ${q.questionText}

**Your Answer**: ${q.selectedOption || 'Skipped'}
**Correct Answer**: ${q.correctOption}

---

## NCERT Step-by-Step Explanation
${q.explanation}

**Source**: ${q.ncertReference}
`;
    onAddDoubtToNotebook(title, 'Exam Doubts', content);
    setAddedDoubts((prev) => ({ ...prev, [q.questionId]: true }));
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================
            CASE 1: SETUP SCREEN (BEFORE TEST STARTS)
            ======================================================== */}
        {!isTestActive && !isTestFinished && (
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                    NCERT Mock Test & Practice Simulator
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Timed practice with authentic board & competitive questions
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 text-xs sm:text-sm">
              {/* Select Subject */}
              <div className="space-y-2">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block uppercase tracking-wider text-xs">
                  1. Choose Subject
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSubject('all')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      selectedSubject === 'all'
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                    }`}
                  >
                    <span>All NCERT Subjects</span>
                  </button>
                  {SUBJECT_OPTIONS.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                        selectedSubject === sub.id
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                      }`}
                    >
                      <span className="truncate">{sub.label.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Duration */}
              <div className="space-y-2">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block uppercase tracking-wider text-xs">
                  2. Test Duration & Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { mins: 15, qCount: 10, title: 'Quick Sprint', desc: 'Rapid formula & concept recall' },
                    { mins: 30, qCount: 15, title: 'Chapter Test', desc: 'Thorough subject evaluation' },
                    { mins: 45, qCount: 20, title: 'Exam Mock', desc: 'Real CBSE board timed condition' }
                  ].map((mode) => (
                    <div
                      key={mode.mins}
                      onClick={() => setTestDurationMins(mode.mins)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        testDurationMins === mode.mins
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white">
                        <span>{mode.title}</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">{mode.mins} mins</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {mode.desc} ({mode.qCount} questions)
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Instructions Banner */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1.5 text-amber-800 dark:text-amber-300">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>CBT Rules & Gamification Reward:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-700 dark:text-amber-400">
                  <li>Questions follow authentic CBSE & competitive exam syllabus.</li>
                  <li>Use the question palette to jump between questions or mark tricky problems for review.</li>
                  <li>Earning high accuracy awards up to <strong>+100 XP</strong> for your mastery level!</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-950/50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartTest}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Practice Test</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            CASE 2: ACTIVE CBT TEST SIMULATOR
            ======================================================== */}
        {isTestActive && currentQ && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header: Timer & Actions */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/90 dark:bg-zinc-950/90">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                  Q {currentQuestionIndex + 1} of {testQuestions.length}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                  {currentQ.chapter}
                </span>
              </div>

              {/* Timer */}
              <div className={`flex items-center gap-2 font-mono text-sm sm:text-base font-bold px-3 py-1 rounded-xl border ${
                timeRemainingSeconds < 120
                  ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900 animate-pulse'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-700'
              }`}>
                <Timer className="w-4 h-4 text-indigo-500" />
                <span>{formatTimer(timeRemainingSeconds)}</span>
              </div>

              {/* Submit Test Button */}
              <button
                onClick={handleSubmitTest}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95"
              >
                Submit Test
              </button>
            </div>

            {/* Test Body: Question + Options + Palette */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6">
              {/* Question & Options Area */}
              <div className="flex-1 space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Single Choice Question
                    </span>
                    {currentQ.formulaUsed && (
                      <span className="font-mono bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        Formula: {currentQ.formulaUsed}
                      </span>
                    )}
                  </div>
                  <p className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white leading-relaxed">
                    {currentQ.questionText}
                  </p>
                </div>

                {/* 4 Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = currentAnswer?.selectedOptionIndex === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20 shadow-xs'
                            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Question Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleReview}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        currentAnswer?.isMarkedForReview
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {currentAnswer?.isMarkedForReview ? '★ Marked for Review' : 'Mark for Review'}
                    </button>
                    {currentAnswer?.selectedOptionIndex !== null && (
                      <button
                        type="button"
                        onClick={handleClearResponse}
                        className="px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        Clear Response
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold disabled:opacity-40"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 inline mr-1" />
                      Prev
                    </button>
                    <button
                      type="button"
                      disabled={currentQuestionIndex === testQuestions.length - 1}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(testQuestions.length - 1, prev + 1))}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Question Navigation Palette (Right Column) */}
              <div className="w-full md:w-60 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-4 md:pt-0 md:pl-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Question Palette
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {testQuestions.map((q, idx) => {
                    const ans = userAnswers[q.id];
                    const isAnswered = ans && ans.selectedOptionIndex !== null;
                    const isReview = ans && ans.isMarkedForReview;
                    const isCurrent = idx === currentQuestionIndex;

                    let bgClass = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
                    if (isAnswered && isReview) {
                      bgClass = 'bg-amber-500 text-white font-bold';
                    } else if (isReview) {
                      bgClass = 'bg-purple-600 text-white font-bold';
                    } else if (isAnswered) {
                      bgClass = 'bg-emerald-600 text-white font-bold';
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-lg text-xs flex items-center justify-center transition-all ${bgClass} ${
                          isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-900 scale-105' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Palette Legend */}
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                    <span>Marked for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            CASE 3: FINAL RESULTS & DETAILED SOLUTIONS REVIEW
            ======================================================== */}
        {isTestFinished && finalResult && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    Test Results & Step-by-Step Solutions
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Review your answers, study explanations, and save doubts
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Report Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Scorecard Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200/60 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Performance Summary
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                    {finalResult.correctAnswers} / {finalResult.totalQuestions} Correct
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Accuracy: <span className="font-bold text-zinc-900 dark:text-white">{finalResult.scorePercentage}%</span> · Time: <span className="font-mono">{formatTimer(finalResult.totalTimeSeconds)}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">XP Awarded</div>
                    <div className="text-lg font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-center">
                      <Zap className="w-4 h-4 fill-current" />
                      <span>+{40 + Math.round((finalResult.scorePercentage / 100) * 60)} XP</span>
                    </div>
                  </div>

                  <button
                    onClick={handleStartTest}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Test</span>
                  </button>
                </div>
              </div>

              {/* Questions Review List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Detailed NCERT Explanations & Solutions
                </h4>

                {finalResult.answers.map((ans, idx) => (
                  <div
                    key={ans.questionId}
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                      ans.isCorrect
                        ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                        : ans.selectedOption === null
                        ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-950/20'
                        : 'border-rose-200 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          ans.isCorrect ? 'bg-emerald-600 text-white' : ans.selectedOption === null ? 'bg-zinc-400 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">
                          {ans.isCorrect ? 'Correct' : ans.selectedOption === null ? 'Skipped' : 'Incorrect'}
                        </span>
                      </div>

                      {/* Add to Notebook Doubt Log */}
                      {onAddDoubtToNotebook && (
                        <button
                          type="button"
                          onClick={() => handleAddDoubtClick(ans)}
                          disabled={addedDoubts[ans.questionId]}
                          className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline disabled:text-zinc-400"
                        >
                          <BookMarked className="w-3.5 h-3.5" />
                          <span>{addedDoubts[ans.questionId] ? 'Saved to Doubt Log' : 'Save to Doubt Log'}</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">
                      {ans.questionText}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Your Answer:</span>
                        <span className={ans.isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                          {ans.selectedOption || 'Not Attempted'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <span className="text-[10px] text-zinc-400 block">Correct Answer:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {ans.correctOption}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-step explanation */}
                    <div className="p-3 rounded-xl bg-zinc-100/70 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                      <div className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        <span>NCERT Explanation & Reference:</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                        {ans.explanation}
                      </p>
                      <div className="text-[10px] text-zinc-400 font-mono pt-1">
                        Source: {ans.ncertReference}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom done button */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end bg-zinc-50 dark:bg-zinc-950">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
