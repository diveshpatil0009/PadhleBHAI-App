import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  BookOpen, 
  Award, 
  Shuffle, 
  Tag, 
  Layers,
  GraduationCap
} from 'lucide-react';
import { Flashcard, FlashcardMastery } from '../types/testAndFlashcards';
import { FieldOfStudy, AcademicLevel } from '../types';
import { SUBJECT_OPTIONS } from '../data/mockResources';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  onUpdateFlashcards: (cards: Flashcard[]) => void;
  onAwardXp: (amount: number, reason: string) => void;
  userFieldOfStudy: FieldOfStudy;
  userAcademicLevel: AcademicLevel;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  flashcards,
  onUpdateFlashcards,
  onAwardXp,
  userFieldOfStudy,
  userAcademicLevel
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [masteryFilter, setMasteryFilter] = useState<'all' | 'learning' | 'mastered'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Custom Flashcard form
  const [newFront, setNewFront] = useState('');
  const [newEquation, setNewEquation] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newExamTip, setNewExamTip] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newSubject, setNewSubject] = useState<FieldOfStudy>(userFieldOfStudy);

  // Filter cards
  const filteredCards = useMemo(() => {
    return flashcards.filter((card) => {
      const matchSub = selectedSubject === 'all' || card.subject === selectedSubject;
      const matchMastery = 
        masteryFilter === 'all' || 
        (masteryFilter === 'mastered' && card.mastery === 'mastered') ||
        (masteryFilter === 'learning' && card.mastery !== 'mastered');
      return matchSub && matchMastery;
    });
  }, [flashcards, selectedSubject, masteryFilter]);

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredCards.length) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  }, [filteredCards.length, selectedSubject, masteryFilter]);

  const activeCard = filteredCards[currentIndex];

  // Keyboard navigation: Space = Flip, ArrowLeft = Prev, ArrowRight = Next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredCards.length]);

  const handleNext = () => {
    setIsFlipped(false);
    if (filteredCards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (filteredCards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...flashcards].sort(() => 0.5 - Math.random());
    onUpdateFlashcards(shuffled);
    setCurrentIndex(0);
  };

  const handleRateMastery = (masteryStatus: FlashcardMastery) => {
    if (!activeCard) return;
    const updated = flashcards.map((c) => {
      if (c.id === activeCard.id) {
        return {
          ...c,
          mastery: masteryStatus,
          reviewCount: c.reviewCount + 1
        };
      }
      return c;
    });
    onUpdateFlashcards(updated);

    if (masteryStatus === 'mastered') {
      onAwardXp(10, `Mastered formula: ${activeCard.front}`);
    }
    handleNext();
  };

  const handleCreateCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newEquation.trim()) return;

    const newCard: Flashcard = {
      id: `fc-custom-${Date.now()}`,
      subject: newSubject,
      topic: newTopic.trim() || 'Custom Formula',
      academicLevel: userAcademicLevel,
      front: newFront.trim(),
      backEquation: newEquation.trim(),
      backExplanation: newExplanation.trim() || 'Formula reference and notes.',
      examTip: newExamTip.trim() || undefined,
      mastery: 'unseen',
      reviewCount: 0,
      isCustom: true
    };

    onUpdateFlashcards([newCard, ...flashcards]);
    onAwardXp(15, 'Created new formula flashcard');
    setNewFront('');
    setNewEquation('');
    setNewExplanation('');
    setNewExamTip('');
    setNewTopic('');
    setIsAddModalOpen(false);
  };

  const totalCardsInDeck = filteredCards.length;
  const masteredCount = filteredCards.filter((c) => c.mastery === 'mastered').length;
  const progressPercent = totalCardsInDeck > 0 ? Math.round((masteredCount / totalCardsInDeck) * 100) : 0;

  return (
    <div className="space-y-5 max-w-4xl mx-auto w-full">
      {/* Top Banner & Action */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Spaced Repetition</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
            NCERT Formula Flashcard Decks
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mt-0.5">
            Test yourself on core formulas, derivations, and exam traps. Tap card or press <kbd className="font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border text-[10px]">Space</kbd> to flip.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
            title="Shuffle active deck"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Flashcard</span>
          </button>
        </div>
      </div>

      {/* Filter and Deck Status Sub-bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl text-xs">
        {/* Subject Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
              selectedSubject === 'all'
                ? 'bg-white dark:bg-zinc-900 font-bold text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
            }`}
          >
            All Decks
          </button>
          {SUBJECT_OPTIONS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedSubject === sub.id
                  ? 'bg-white dark:bg-zinc-900 font-bold text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
              }`}
            >
              {sub.label.split('(')[0].trim()}
            </button>
          ))}
        </div>

        {/* Deck Mastery Progress Ring */}
        <div className="flex items-center gap-3">
          <div className="text-right text-[11px] text-zinc-500">
            <span>Deck Mastery: </span>
            <span className="font-bold text-zinc-900 dark:text-white">
              {masteredCount} / {totalCardsInDeck} ({progressPercent}%)
            </span>
          </div>
          <div className="w-20 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      {filteredCards.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No cards found in this deck
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try switching the subject filter, or create your first custom flashcard!
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white"
          >
            Create Flashcard
          </button>
        </div>
      ) : activeCard ? (
        <div className="space-y-4">
          {/* Flip Card Wrapper with Perspective */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative w-full h-[360px] sm:h-[400px] cursor-pointer select-none [perspective:1000px] group"
          >
            <div 
              className={`w-full h-full rounded-2xl border transition-all duration-500 [transform-style:preserve-3d] shadow-sm hover:shadow-md ${
                isFlipped 
                  ? '[transform:rotateY(180deg)] border-indigo-400 dark:border-indigo-600 bg-white dark:bg-zinc-900' 
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between [backface-visibility:hidden]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                      {activeCard.topic}
                    </span>
                    {activeCard.isCustom && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                        Custom
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-zinc-400 text-xs">
                    {currentIndex + 1} / {totalCardsInDeck}
                  </span>
                </div>

                <div className="my-auto text-center space-y-3 px-4">
                  <div className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                    Concept / Formula Name
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-snug">
                    {activeCard.front}
                  </h3>
                </div>

                <div className="text-center">
                  <span className="text-[11px] text-zinc-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 flex items-center justify-center gap-1.5 transition-colors">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Click card or press Space to reveal formula</span>
                  </span>
                </div>
              </div>

              {/* BACK OF CARD (Rotated 180deg) */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] bg-zinc-50/50 dark:bg-zinc-950/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                    Formula & Solution Details
                  </span>
                  <span className="font-mono text-zinc-400 text-xs">
                    {currentIndex + 1} / {totalCardsInDeck}
                  </span>
                </div>

                <div className="my-auto space-y-4">
                  {/* Big Formula Block */}
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-900/60 shadow-xs text-center">
                    <span className="text-sm sm:text-lg font-mono font-bold text-indigo-600 dark:text-indigo-300">
                      {activeCard.backEquation}
                    </span>
                  </div>

                  {/* Variables and definitions */}
                  <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                    {activeCard.backExplanation}
                  </p>

                  {/* High-yield exam tip */}
                  {activeCard.examTip && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <span><strong>Exam Trap / Mnemonic:</strong> {activeCard.examTip}</span>
                    </div>
                  )}
                </div>

                <div className="text-center text-[10px] text-zinc-400">
                  Rate your recall below to adjust review intervals
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card Controls: Spaced Repetition Rating */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Self-Rating buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <button
                onClick={() => handleRateMastery('learning')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold text-xs transition-colors"
                title="Review this formula again soon"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Needs Review</span>
              </button>

              <button
                onClick={() => handleRateMastery('mastered')}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                title="Mark formula as mastered (+10 XP)"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mastered! (+10 XP)</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold"
            >
              <span>Next Card</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Add Custom Flashcard Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                  Add Custom Formula Flashcard
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomCard} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as FieldOfStudy)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-medium text-xs"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.label.split('(')[0]}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Topic Tag</label>
                  <input
                    type="text"
                    required
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Optics or Calculus"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Front (Concept / Term)</label>
                <input
                  type="text"
                  required
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. Snell's Law & Refractive Index"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Back Equation (Formula)</label>
                <input
                  type="text"
                  required
                  value={newEquation}
                  onChange={(e) => setNewEquation(e.target.value)}
                  placeholder="e.g. n₁ · sin(θ₁) = n₂ · sin(θ₂)"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Explanation & Variable Definitions</label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="where n is refractive index and θ is angle of incidence/refraction..."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Exam Trap / Tip (Optional)</label>
                <input
                  type="text"
                  value={newExamTip}
                  onChange={(e) => setNewExamTip(e.target.value)}
                  placeholder="e.g. When light enters denser medium, speed & wavelength decrease, frequency is unchanged!"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-500 hover:text-zinc-800 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
