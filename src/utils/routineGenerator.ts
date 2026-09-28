import { ScheduleBlock, UserProfile, BlockType } from '../types';

interface GenerationPreferences {
  startHour?: number; // e.g. 8 for 08:00
  includeWeekends?: boolean;
  focusStyle?: 'deep_sprints' | 'balanced' | 'spaced_recall';
}

export function generateSmartWeeklyRoutine(
  profile: UserProfile,
  prefs: GenerationPreferences = {}
): ScheduleBlock[] {
  const targetDailyHours = profile.targetHoursPerDay || 4;
  const startHour = prefs.startHour ?? 8;
  const includeWeekends = prefs.includeWeekends ?? true;
  const newBlocks: ScheduleBlock[] = [];

  // Determine subjects based on profile
  const subjectPool: { [key: string]: string[] } = {
    ncert_physics: ['NCERT Physics: Mechanics & Optics', 'Derivations & Numerical Practice', 'Physics PYQ Solving', 'Formula Revision'],
    ncert_chemistry: ['Organic Chemistry: Reaction Mechanisms', 'Inorganic NCERT Line-by-Line', 'Physical Chemistry Numericals', 'NCERT Exemplar Problems'],
    ncert_mathematics: ['Calculus & Differential Equations', 'Algebra & Matrices Practice', 'Trigonometric Identities & Drills', 'NCERT Solutions & Exercises'],
    ncert_biology: ['Botany: Plant Physiology & Ecology', 'Zoology: Human Physiology', 'Genetics & Biotechnology Revision', 'Diagrams & NCERT Flashcards'],
    ncert_science_9_10: ['Class 10 Science: Chemical Reactions', 'Electricity & Light Optics', 'Life Processes Biology', 'NCERT In-text & Exercise Questions'],
    ncert_social_science: ['History: Rise of Nationalism', 'Geography: Resources & Agriculture', 'Civics: Power Sharing & Federalism', 'Map Work & Answer Writing'],
    ncert_commerce_acc: ['Accountancy: Partnership Fundamentals', 'Company Accounts & Shares', 'Macroeconomics & National Income', 'Business Studies Case Studies'],
    computer_science: ['Data Structures & Algorithms', 'Python Programming', 'CBSE CS Projects & Practice', 'Computer Networks & SQL'],
    stem_engineering: ['Advanced Mathematics', 'Physics & Mechanics', 'Engineering Concepts', 'Problem Solving Drills'],
    medical_biology: ['Anatomy & Physiology', 'Biochemistry', 'Microbiology & Genetics', 'Clinical Cases & Recall'],
    business_economics: ['Micro/Macroeconomics', 'Financial Accounting', 'Statistics & Analytics', 'Case Study Analysis'],
    humanities_social: ['Historical Analysis', 'Critical Philosophy', 'Social Theory & Ethics', 'Essay Drafting & Synthesis'],
    foundational_math_sci: ['Algebra & Geometry', 'General Science', 'Conceptual Physics', 'Practice Problem Sets']
  };

  const subjects = subjectPool[profile.fieldOfStudy] || [profile.targetSubject || 'NCERT Concepts', 'Practice Drills', 'Revision & Notes'];

  // Days: 1 = Monday ... 6 = Saturday, 0 = Sunday
  const daysToSchedule = includeWeekends ? [1, 2, 3, 4, 5, 6, 0] : [1, 2, 3, 4, 5];

  daysToSchedule.forEach((day) => {
    let currentHour = startHour;
    let currentMinute = 0;
    let hoursAccumulated = 0;
    let blockIndex = 0;

    const isWeekend = day === 6 || day === 0;
    const dayTarget = isWeekend ? Math.max(2, Math.round(targetDailyHours * 0.7)) : targetDailyHours;

    while (hoursAccumulated < dayTarget && currentHour < 22) {
      blockIndex++;
      const subject = subjects[(day + blockIndex) % subjects.length];
      
      // Determine block type and duration
      let blockDuration = 90; // minutes
      let type: BlockType = 'deep_work';
      let title = `Deep Focus: ${subject}`;

      if (blockIndex === 1) {
        blockDuration = targetDailyHours >= 5 ? 120 : 90;
        type = 'deep_work';
        title = `Core Deep Work: ${subject}`;
      } else if (blockIndex === 2) {
        blockDuration = 60;
        type = 'practice';
        title = `Active Drills & Problem Solving`;
      } else if (blockIndex === 3) {
        // Break block
        blockDuration = 30;
        type = 'break';
        title = 'Mind Reset & Physical Movement';
      } else if (blockIndex === 4) {
        blockDuration = 60;
        type = 'lecture';
        title = `Resource & Video Review`;
      } else {
        blockDuration = 45;
        type = 'revision';
        title = `Spaced Repetition & Daily Summary`;
      }

      // Calculate start and end strings
      const startStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      
      let endTotalMin = currentHour * 60 + currentMinute + blockDuration;
      let endHour = Math.floor(endTotalMin / 60);
      let endMinute = endTotalMin % 60;
      const endStr = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      newBlocks.push({
        id: `gen-${day}-${blockIndex}-${Date.now().toString().slice(-4)}`,
        dayOfWeek: day,
        startTime: startStr,
        endTime: endStr,
        title,
        subject: type === 'break' ? 'Rest' : subject,
        type,
        completed: false
      });

      // Update pointers (add 10 min buffer between study blocks if not a break)
      const buffer = type === 'break' ? 0 : 15;
      let nextTotalMin = endTotalMin + buffer;
      currentHour = Math.floor(nextTotalMin / 60);
      currentMinute = nextTotalMin % 60;

      if (type !== 'break') {
        hoursAccumulated += blockDuration / 60;
      }
    }
  });

  return newBlocks;
}
