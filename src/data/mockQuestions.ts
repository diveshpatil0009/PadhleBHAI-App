import { MockQuestion } from '../types/testAndFlashcards';

export const MOCK_QUESTIONS: MockQuestion[] = [
  // ==========================================
  // PHYSICS (NCERT Class 11 & 12 / JEE / NEET)
  // ==========================================
  {
    id: 'q-phy-1',
    subject: 'ncert_physics',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Electric Charges & Fields',
    questionText: 'Two equal and opposite charges of magnitude 2 μC are separated by a distance of 3 cm. What is the electric dipole moment of this system?',
    options: [
      '6 × 10⁻⁸ C·m',
      '6 × 10⁻⁵ C·m',
      '1.5 × 10⁻⁸ C·m',
      '12 × 10⁻⁸ C·m'
    ],
    correctOptionIndex: 0,
    explanation: 'Electric dipole moment p = q × (2a), where q = 2 × 10⁻⁶ C and distance 2a = 0.03 m = 3 × 10⁻² m. Thus p = (2 × 10⁻⁶) × (3 × 10⁻²) = 6 × 10⁻⁸ C·m directed from negative to positive charge.',
    formulaUsed: 'p = q · 2a',
    ncertReference: 'NCERT Class 12 Physics, Chapter 1, Section 1.10',
    difficulty: 'easy'
  },
  {
    id: 'q-phy-2',
    subject: 'ncert_physics',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Electrostatic Potential & Capacitance',
    questionText: 'A parallel plate capacitor with air between the plates has a capacitance of 8 pF. If the distance between the plates is reduced by half and the space between them is filled with a substance of dielectric constant K = 6, what will be the new capacitance?',
    options: [
      '48 pF',
      '96 pF',
      '24 pF',
      '16 pF'
    ],
    correctOptionIndex: 1,
    explanation: 'Original capacitance C₀ = ε₀A / d = 8 pF. New capacitance C = K ε₀A / (d / 2) = 2K · C₀. Substituting K = 6 gives C = 2 × 6 × 8 pF = 96 pF.',
    formulaUsed: 'C = (K · ε₀A) / d\'',
    ncertReference: 'NCERT Class 12 Physics, Chapter 2, Example 2.8',
    difficulty: 'medium'
  },
  {
    id: 'q-phy-3',
    subject: 'ncert_physics',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Current Electricity',
    questionText: 'A wire of resistance R is stretched uniformly until its length becomes double its initial value. What is the new resistance of the wire?',
    options: [
      '2 R',
      'R / 2',
      '4 R',
      '16 R'
    ],
    correctOptionIndex: 2,
    explanation: 'When a wire is stretched, its volume remains constant: V = A · l = A\' · l\'. Since l\' = 2l, the new cross-sectional area A\' = A / 2. New resistance R\' = ρ(l\' / A\') = ρ(2l / (A / 2)) = 4 ρ(l / A) = 4R.',
    formulaUsed: 'R = ρ · l / A',
    ncertReference: 'NCERT Class 12 Physics, Chapter 3, Section 3.5',
    difficulty: 'medium'
  },
  {
    id: 'q-phy-4',
    subject: 'ncert_physics',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Work, Energy and Power',
    questionText: 'A body of mass 2 kg moving with a velocity of 3 m/s collides head-on elastically with a stationary body of mass 1 kg. What is the velocity of the 2 kg body after collision?',
    options: [
      '1 m/s',
      '2 m/s',
      '0.5 m/s',
      '4 m/s'
    ],
    correctOptionIndex: 0,
    explanation: 'For a 1D elastic collision: v₁ = [(m₁ - m₂) / (m₁ + m₂)] u₁ + [2m₂ / (m₁ + m₂)] u₂. With u₂ = 0: v₁ = [(2 - 1) / (2 + 1)] × 3 = (1 / 3) × 3 = 1 m/s in the forward direction.',
    formulaUsed: 'v₁ = [(m₁ - m₂) / (m₁ + m₂)] u₁',
    ncertReference: 'NCERT Class 11 Physics, Chapter 6, Section 6.12',
    difficulty: 'hard'
  },

  // ==========================================
  // CHEMISTRY (NCERT Class 10 & 11 & 12)
  // ==========================================
  {
    id: 'q-chem-1',
    subject: 'ncert_chemistry',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Chemical Bonding',
    questionText: 'According to VSEPR theory, what is the geometry and shape of the ClF₃ molecule?',
    options: [
      'Trigonal planar geometry, T-shape',
      'Trigonal bipyramidal geometry, T-shaped',
      'Tetrahedral geometry, Pyramidal',
      'Octahedral geometry, Square planar'
    ],
    correctOptionIndex: 1,
    explanation: 'Chlorine has 7 valence electrons. In ClF₃, it forms 3 single bonds with fluorine and retains 2 lone pairs. Steric number = 3 + 2 = 5, corresponding to trigonal bipyramidal electron geometry. To minimize lone-pair repulsions, the two lone pairs occupy equatorial positions, resulting in a T-shaped molecular geometry.',
    formulaUsed: 'Steric Number = Bond pairs + Lone pairs',
    ncertReference: 'NCERT Class 11 Chemistry, Chapter 4, Table 4.7',
    difficulty: 'medium'
  },
  {
    id: 'q-chem-2',
    subject: 'ncert_chemistry',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Solutions & Colligative Properties',
    questionText: 'Which colligative property is most widely used for the determination of the molar mass of polymers and biomolecules (proteins)?',
    options: [
      'Relative lowering of vapor pressure',
      'Elevation in boiling point',
      'Depression in freezing point',
      'Osmotic pressure'
    ],
    correctOptionIndex: 3,
    explanation: 'Osmotic pressure (Π = CRT) is measured at room temperature, and biomolecules are not stable at elevated temperatures. Furthermore, molar mass of polymers is large, so boiling point elevation and freezing point depression are too tiny to measure accurately, whereas osmotic pressure values are significant even for very dilute solutions.',
    formulaUsed: 'Π = C R T',
    ncertReference: 'NCERT Class 12 Chemistry, Chapter 2, Section 2.6.4',
    difficulty: 'easy'
  },
  {
    id: 'q-chem-3',
    subject: 'ncert_chemistry',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Chemical Kinetics',
    questionText: 'For a first-order reaction, how long does it take for 75% of the reaction to complete compared to its half-life (t₁/₂)?',
    options: [
      '1.5 × t₁/₂',
      '2 × t₁/₂',
      '3 × t₁/₂',
      '4 × t₁/₂'
    ],
    correctOptionIndex: 1,
    explanation: 'In a first-order reaction, after 1 half-life, 50% remains. After 2 half-lives, 25% remains, meaning 75% has reacted. Therefore, t_75% = 2 × t₁/₂.',
    formulaUsed: 't = (2.303 / k) · log(100 / (100 - %))',
    ncertReference: 'NCERT Class 12 Chemistry, Chapter 4, Example 4.8',
    difficulty: 'easy'
  },

  // ==========================================
  // MATHEMATICS (NCERT Class 10 & 11 & 12)
  // ==========================================
  {
    id: 'q-math-1',
    subject: 'ncert_mathematics',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Calculus: Limits & Continuity',
    questionText: 'Evaluate the limit: lim (x → 0) [(1 - cos(4x)) / x²]',
    options: [
      '2',
      '4',
      '8',
      '16'
    ],
    correctOptionIndex: 2,
    explanation: 'Using the standard identity 1 - cos(θ) = 2 sin²(θ / 2): 1 - cos(4x) = 2 sin²(2x). Then lim (x → 0) [2 sin²(2x) / x²] = 2 × lim (x → 0) [(sin(2x) / x)²] = 2 × (2)² = 2 × 4 = 8.',
    formulaUsed: 'lim (θ → 0) (sin θ / θ) = 1',
    ncertReference: 'NCERT Class 11 Mathematics, Chapter 13, Limits',
    difficulty: 'medium'
  },
  {
    id: 'q-math-2',
    subject: 'ncert_mathematics',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Integrals: Definite Integrals',
    questionText: 'Evaluate: ∫ from 0 to π/2 of [sin(x) / (sin(x) + cos(x))] dx',
    options: [
      'π / 4',
      'π / 2',
      '1',
      '0'
    ],
    correctOptionIndex: 0,
    explanation: 'Let I = ∫₀^(π/2) [sin x / (sin x + cos x)] dx. By the King\'s property ∫₀^a f(x) dx = ∫₀^a f(a - x) dx: I = ∫₀^(π/2) [cos x / (cos x + sin x)] dx. Adding the two expressions: 2I = ∫₀^(π/2) 1 dx = π/2. Therefore I = π/4.',
    formulaUsed: '∫₀^a f(x) dx = ∫₀^a f(a - x) dx',
    ncertReference: 'NCERT Class 12 Mathematics, Chapter 7, Property P4',
    difficulty: 'easy'
  },
  {
    id: 'q-math-3',
    subject: 'ncert_mathematics',
    academicLevel: 'ncert_class_9_10',
    chapter: 'Quadratic Equations',
    questionText: 'If one root of the quadratic equation 2x² + kx - 6 = 0 is 2, what is the value of k and the other root?',
    options: [
      'k = -1, other root = -1.5',
      'k = 1, other root = 1.5',
      'k = -2, other root = -2',
      'k = 2, other root = -3'
    ],
    correctOptionIndex: 0,
    explanation: 'Substitute x = 2: 2(2)² + k(2) - 6 = 0 ⇒ 8 + 2k - 6 = 0 ⇒ 2k = -2 ⇒ k = -1. Product of roots α · β = c / a = -6 / 2 = -3. Since α = 2, β = -3 / 2 = -1.5.',
    formulaUsed: 'α · β = c / a',
    ncertReference: 'NCERT Class 10 Mathematics, Chapter 4, Exercise 4.2',
    difficulty: 'easy'
  },

  // ==========================================
  // BIOLOGY (NCERT Class 10 & 11 & 12)
  // ==========================================
  {
    id: 'q-bio-1',
    subject: 'ncert_biology',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Genetics & Inheritance',
    questionText: 'In a dihybrid cross between two heterozygous round yellow seeded pea plants (RrYy × RrYy), what proportion of offspring will have wrinkled green seeds?',
    options: [
      '9 / 16',
      '3 / 16',
      '1 / 16',
      '1 / 4'
    ],
    correctOptionIndex: 2,
    explanation: 'In Mendel\'s dihybrid cross, the phenotypic ratio is 9:3:3:1 (Round Yellow : Round Green : Wrinkled Yellow : Wrinkled Green). The double recessive phenotype (wrinkled green, rryy) occurs with a probability of (1/4) × (1/4) = 1/16.',
    formulaUsed: 'Mendel Dihybrid Ratio 9:3:3:1',
    ncertReference: 'NCERT Class 12 Biology, Chapter 5, Section 5.3',
    difficulty: 'easy'
  },
  {
    id: 'q-bio-2',
    subject: 'ncert_biology',
    academicLevel: 'ncert_class_9_10',
    chapter: 'Life Processes',
    questionText: 'Which enzyme is responsible for breaking down proteins into peptones in the acidic environment of the human stomach?',
    options: [
      'Trypsin',
      'Pepsin',
      'Salivary Amylase',
      'Lipase'
    ],
    correctOptionIndex: 1,
    explanation: 'Pepsin is secreted by gastric glands as inactive pepsinogen, which is activated by hydrochloric acid (HCl, pH ~1.8) to digest proteins into peptones. Trypsin operates in the alkaline small intestine.',
    formulaUsed: 'Pepsinogen + HCl → Active Pepsin',
    ncertReference: 'NCERT Class 10 Science, Chapter 6, Life Processes',
    difficulty: 'easy'
  },

  // ==========================================
  // COMPUTER SCIENCE (CBSE Class 11 & 12)
  // ==========================================
  {
    id: 'q-cs-1',
    subject: 'computer_science',
    academicLevel: 'ncert_class_11_12_science',
    chapter: 'Python Data Structures',
    questionText: 'What is the output of the following Python snippet?\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))',
    options: [
      '3',
      '4',
      'Error',
      'None'
    ],
    correctOptionIndex: 1,
    explanation: 'Lists in Python are mutable objects. The assignment y = x does not create a copy of the list; it binds the identifier y to the same list object in memory as x. Mutating y via y.append(4) mutates the list referenced by both x and y, so len(x) evaluates to 4.',
    formulaUsed: 'List Reference & Mutability',
    ncertReference: 'CBSE Computer Science Class 11-12, Python Core',
    difficulty: 'easy'
  }
];
