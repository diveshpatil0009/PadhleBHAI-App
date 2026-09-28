import { AcademicLevel, FieldOfStudy } from './index';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface MockQuestion {
  id: string;
  subject: FieldOfStudy;
  academicLevel: AcademicLevel;
  chapter: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number; // 0, 1, 2, 3
  explanation: string;
  ncertReference: string;
  formulaUsed?: string;
  difficulty: QuestionDifficulty;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number | null; // null if skipped
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
}

export interface TestResult {
  id: string;
  date: string;
  testTitle: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  scorePercentage: number;
  totalTimeSeconds: number;
  answers: {
    questionId: string;
    questionText: string;
    selectedOption: string | null;
    correctOption: string;
    isCorrect: boolean;
    explanation: string;
    ncertReference: string;
  }[];
}

export type FlashcardMastery = 'unseen' | 'learning' | 'mastered';

export interface Flashcard {
  id: string;
  subject: FieldOfStudy;
  topic: string;
  academicLevel: AcademicLevel;
  front: string; // Question, term, or formula name
  backEquation: string; // The mathematical or chemical formula
  backExplanation: string; // Explanation, variable definitions, and SI units
  examTip?: string; // Mnemonic or high-yield exam trap
  mastery: FlashcardMastery;
  reviewCount: number;
  isCustom?: boolean;
}
