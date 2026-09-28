# Implementation Plan: Exam Practice, Formula Flashcards & Study Export

This plan details the implementation of three high-impact study tools selected for **StudyPulse**, elevating it into a comprehensive exam preparation companion with top-tier user experience.

---

## 1. Feature Architecture & User Flow

### A. Interactive Mock Test Simulator & NCERT Question Bank
- **Exam Setup & Modes**:
  - **Quick Sprint (15 mins - 10 questions)**: Rapid formula & concept recall.
  - **Chapter Test (30 mins - 20 questions)**: Focused topic mastery (e.g., Electrostatics, Trigonometry, Chemical Reactions, Life Processes).
  - **Comprehensive Practice (60 mins - 40 questions)**: Full syllabus mock test with negative marking toggle.
- **NTA / CBSE CBT Exam Interface**:
  - Live countdown timer with pause and warning prompts.
  - Question navigation palette with color indicators:
    - *Green*: Answered
    - *Purple*: Marked for Review
    - *Amber*: Answered & Marked for Review
    - *Gray*: Not visited / Skipped
  - Clear option, review later, and submit test actions.
- **Post-Test Performance Analytics**:
  - Instant score report: Total Score, Accuracy %, Time spent per question.
  - Detailed step-by-step explanations with NCERT chapter references.
  - Mistake Log integration: 1-click "Add Question to Doubt / Mistake Log" in Notebook.
  - Gamification reward: XP points awarded based on test score (+50 to +100 XP).

---

### B. Formula Flashcard Deck with 3D Flip Animation
- **Subject-Wise Decks**:
  - Categorized by subjects: **Physics**, **Chemistry**, **Mathematics**, **Biology**, and **Computer Science**.
  - Ready-to-study decks for high-yield formulas and concepts (e.g., Coulomb's Law, VSEPR shapes, Trig values, Derivatives, Cellular respiration).
- **Interactive Card Interface**:
  - Smooth CSS 3D flip transition between Front (Concept / Question / Formula Name) and Back (Equation, SI units, Derivation note, Exam tip).
  - Self-Assessment buttons (Spaced Repetition):
    - 🔴 *Hard / Review Again* (re-queues card in session)
    - 🟡 *Good / Almost There*
    - 🟢 *Mastered / Easy* (increments mastery count in `localStorage`)
- **Custom Flashcard Creator**:
  - Students can add their own custom flashcards for tricky formulas or definitions.
  - Stored locally with tag support.

---

### C. Print-Friendly PDF Cheat Sheet & Full Data Backup
- **Print / PDF Study Handouts**:
  - Dedicated `@media print` CSS styling for all chapter notes, formula cheat sheets, and notebook entries.
  - Generates clean, printer-friendly, multi-page study sheets without web navigation or dark mode backgrounds.
  - Includes clean metadata header: Subject, Chapter title, Student name, Date, and formula tables.
- **Full Study Hub Backup & Restore**:
  - One-click "Export All Study Data" (downloads a structured `.json` file containing all tasks, notes, custom YouTube links, flashcard mastery, and test records).
  - "Import / Restore Data" file upload modal with validation, ensuring students never lose their study companion data across devices or browser resets.

---

## 2. Technical Modifications & Files

### New Components & Data Modules:
1. `src/types/testAndFlashcards.ts`:
   - Data types for `MockQuestion`, `TestSession`, `TestResult`, `Flashcard`, and `DeckProgress`.
2. `src/data/mockQuestions.ts`:
   - Curated NCERT question bank covering Physics, Chemistry, Math, Biology, and CS.
3. `src/data/mockFlashcards.ts`:
   - Curated NCERT formula cards with explanations, diagrams, and memory aids.
4. `src/components/MockTestModal.tsx`:
   - Full-featured test environment with countdown timer, question palette, and result analytics.
5. `src/components/FlashcardsView.tsx`:
   - 3D card flipper with keyboard navigation (Space to flip, Arrow keys to rate), deck switcher, and "+ New Card" modal.
6. `src/components/BackupRestoreModal.tsx`:
   - Clean modal for JSON backup export, import preview, and print sheet generation.

### Modified Files:
1. `src/components/TabsNavigation.tsx`:
   - Add "Practice & Flashcards" tab or dedicated sub-tabs accessible on both desktop and mobile bottom navigation.
2. `src/components/DashboardView.tsx`:
   - Add quick launch cards: "Quick Formula Sprint (Flashcards)" and "Start Mock Test".
3. `src/components/ResourceViewerModal.tsx`:
   - Add a direct "Print / Save PDF Handout" button to format notes for print.
4. `src/utils/storage.ts`:
   - Add persistent storage keys for `FLASHCARDS`, `TEST_RESULTS`, and global export/import utility.
5. `src/App.tsx`:
   - Wire test modals, flashcard states, and backup actions into the application shell.

---

## 3. User Experience & Verification Checklist
- [ ] Mobile-tested: Flashcard swipes and mock test question palette fit comfortably on phone screens.
- [ ] Zero login maintained: All test results and flashcard progress persist in `localStorage`.
- [ ] Theme compatibility: Both White and Dark mode look high contrast and legible.
- [ ] Compilation & Lint: App compiles and lints with 0 errors via `compile_applet` and `lint_applet`.
