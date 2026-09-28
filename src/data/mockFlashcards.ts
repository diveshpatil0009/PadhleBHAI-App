import { Flashcard } from '../types/testAndFlashcards';

export const INITIAL_FLASHCARDS: Flashcard[] = [
  // ==========================================
  // PHYSICS FLASHCARDS (NCERT Class 11 & 12)
  // ==========================================
  {
    id: 'fc-phy-coulomb',
    subject: 'ncert_physics',
    topic: 'Electrostatics',
    academicLevel: 'ncert_class_11_12_science',
    front: "Coulomb's Law in Vector Form",
    backEquation: 'F₁₂ = [1 / (4πε₀)] · [q₁ · q₂ / r²] · r̂₂₁',
    backExplanation: 'where 1 / (4πε₀) ≈ 9 × 10⁹ N·m²/C². Force acts along the line joining the centers of the two charges. In a dielectric medium with constant K, force decreases by factor K: F_med = F_vac / K.',
    examTip: 'Remember: Like charges repel (r̂₂₁ points away), unlike charges attract. Always include the unit vector r̂ in 3-mark CBSE board derivations!',
    mastery: 'unseen',
    reviewCount: 0
  },
  {
    id: 'fc-phy-gauss',
    subject: 'ncert_physics',
    topic: 'Electrostatics',
    academicLevel: 'ncert_class_11_12_science',
    front: "Gauss's Law & Electric Flux",
    backEquation: 'Φ_E = ∮ E · dA = q_enclosed / ε₀',
    backExplanation: 'Electric flux through any closed Gaussian surface equals total net charge enclosed divided by permittivity of free space ε₀ (8.854 × 10⁻¹² C²/N·m²). Independent of surface shape or size.',
    examTip: 'If a dipole (+q and -q) is placed inside a closed sphere, net flux is exactly ZERO because q_net = 0!',
    mastery: 'unseen',
    reviewCount: 0
  },
  {
    id: 'fc-phy-capacitance',
    subject: 'ncert_physics',
    topic: 'Capacitance',
    academicLevel: 'ncert_class_11_12_science',
    front: 'Parallel Plate Capacitor & Energy Stored',
    backEquation: 'C = (K · ε₀ · A) / d  |  U = ½ C V² = Q² / (2C)',
    backExplanation: 'A = plate area (m²), d = plate separation (m), K = dielectric constant. Energy density u = ½ ε₀ E².',
    examTip: 'When battery remains connected, V remains constant (Q increases). If battery is disconnected before inserting dielectric, Q remains constant (V decreases by K).',
    mastery: 'unseen',
    reviewCount: 0
  },
  {
    id: 'fc-phy-ohm',
    subject: 'ncert_physics',
    topic: 'Current Electricity',
    academicLevel: 'ncert_class_11_12_science',
    front: "Drift Velocity & Ohm's Law Microscopic Form",
    backEquation: 'v_d = (e · E · τ) / m  |  J = σ · E = n · e · v_d',
    backExplanation: 'e = electron charge (1.6 × 10⁻¹⁹ C), τ = relaxation time between collisions, m = electron mass, J = current density (A/m²), σ = electrical conductivity.',
    examTip: 'As temperature increases in metals, thermal vibrations increase, relaxation time τ decreases, so resistance INCREASES.',
    mastery: 'unseen',
    reviewCount: 0
  },

  // ==========================================
  // CHEMISTRY FLASHCARDS (NCERT Class 11 & 12)
  // ==========================================
  {
    id: 'fc-chem-vsepr',
    subject: 'ncert_chemistry',
    topic: 'Chemical Bonding',
    academicLevel: 'ncert_class_11_12_science',
    front: 'Steric Number (SN) & Hybridization Rule',
    backEquation: 'SN = (σ bonds) + (Lone Pairs on Central Atom)',
    backExplanation: 'SN = 2 → sp (Linear, 180°)\nSN = 3 → sp² (Trigonal Planar, 120°)\nSN = 4 → sp³ (Tetrahedral, 109.5°)\nSN = 5 → sp³d (Trigonal Bipyramidal, 90° & 120°)\nSN = 6 → sp³d² (Octahedral, 90°)',
    examTip: 'Lone pair repulsions: lp-lp > lp-bp > bp-bp. In NH₃: 3 bp + 1 lp → bond angle reduces from 109.5° to 107°.',
    mastery: 'unseen',
    reviewCount: 0
  },
  {
    id: 'fc-chem-nernst',
    subject: 'ncert_chemistry',
    topic: 'Electrochemistry',
    academicLevel: 'ncert_class_11_12_science',
    front: 'Nernst Equation at 298 K',
    backEquation: 'E_cell = E°_cell - (0.0591 / n) · log₁₀(Q)',
    backExplanation: 'E°_cell = E°_cathode - E°_anode. n = number of moles of electrons transferred. Q = reaction quotient = [Products] / [Reactants] with stoichiometric powers.',
    examTip: 'At equilibrium: E_cell = 0 and Q = K_c. Thus: E°_cell = (0.0591 / n) · log₁₀(K_c).',
    mastery: 'unseen',
    reviewCount: 0
  },
  {
    id: 'fc-chem-arrhenius',
    subject: 'ncert_chemistry',
    topic: 'Chemical Kinetics',
    academicLevel: 'ncert_class_11_12_science',
    front: 'Arrhenius Equation (Temperature Dependence)',
    backEquation: 'k = A · e^(-E_a / (R·T))  |  log(k₂/k₁) = (E_a / 2.303R) · [(T₂ - T₁) / (T₁ · T₂)]',
    backExplanation: 'k = rate constant, A = frequency factor, E_a = activation energy (J/mol), R = 8.314 J/(mol·K), T = temperature in Kelvin.',
    examTip: 'Graph of ln(k) vs 1/T has Slope = -E_a / R. Graph of log₁₀(k) vs 1/T has Slope = -E_a / (2.303 R).',
    mastery: 'unseen',
    reviewCount: 0
  },

  // ==========================================
  // MATHEMATICS FLASHCARDS (NCERT Class 10 & 11 & 12)
  // ==========================================
  {
    id: 'fc-math-pythagoras-trig',
    subject: 'ncert_mathematics',
    topic: 'Trigonometry',
    academicLevel: 'ncert_class_9_10',
    front: 'Fundamental Trigonometric Identities',
    backEquation: 'sin²θ + cos²θ = 1  |  1 + tan²θ = sec²θ  |  1 + cot²θ = csc²θ',
    backExplanation: 'Valid for all permissible real angles. Rearrangements:\nsec²θ - tan²θ = 1 ⇒ (sec θ - tan θ)(sec θ + tan θ) = 1\ncsc²θ - cot²θ = 1 ⇒ (csc θ - cot θ)(csc θ + cot θ) = 1',
    examTip: 'If sec θ + tan θ = p, then sec θ - tan θ = 1 / p. Adding both immediately gives 2 sec θ = p + 1/p!',
    mastery: 'unseen',
    reviewCount: 0
  },
  {
    id: 'fc-math-product-quotient',
    subject: 'ncert_mathematics',
    topic: 'Calculus: Derivatives',
    academicLevel: 'ncert_class_11_12_science',
    front: 'Product Rule & Quotient Rule of Differentiation',
    backEquation: 'd/dx [u · v] = u·v\' + v·u\'  |  d/dx [u / v] = (v·u\' - u·v\') / v²',
    backExplanation: 'u and v are differentiable functions of x. For Quotient rule: denominator is squared, numerator starts with (Denominator × Derivative of Numerator).',
    examTip: 'Common mistake: Don\'t write u·v\' - v·u\' in the numerator! It is ALWAYS v·u\' - u·v\'.',
    mastery: 'unseen',
    reviewCount: 0
  },
  {
    id: 'fc-math-integration-by-parts',
    subject: 'ncert_mathematics',
    topic: 'Calculus: Integrals',
    academicLevel: 'ncert_class_11_12_science',
    front: 'Integration by Parts (ILATE Rule)',
    backEquation: '∫ u · v dx = u · ∫ v dx - ∫ [ u\' · (∫ v dx) ] dx',
    backExplanation: 'Priority for choosing first function u according to ILATE:\nI: Inverse trigonometric\nL: Logarithmic\nA: Algebraic\nT: Trigonometric\nE: Exponential',
    examTip: 'For ∫ ln(x) dx, treat as ∫ (ln x) · 1 dx with u = ln x and v = 1! Answer = x ln x - x + C.',
    mastery: 'unseen',
    reviewCount: 0
  },

  // ==========================================
  // BIOLOGY FLASHCARDS (NCERT Class 10 & 12)
  // ==========================================
  {
    id: 'fc-bio-photosynthesis',
    subject: 'ncert_biology',
    topic: 'Life Processes',
    academicLevel: 'ncert_class_9_10',
    front: 'Photosynthesis Master Reaction & Products',
    backEquation: '6CO₂ + 12H₂O ──[Chlorophyll / Sunlight]──> C₆H₁₂O₆ + 6O₂ + 6H₂O',
    backExplanation: 'Photolysis of water splits 2H₂O into 4H⁺ + 4e⁻ + O₂ in the grana thylakoid membrane. Oxygen gas evolved comes from WATER, not from CO₂ (demonstrated by radioactive O¹⁸ tracer experiments).',
    examTip: 'CBSE Board high-yield question: Name the source of oxygen released during photosynthesis. Answer: Water (H₂O).',
    mastery: 'unseen',
    reviewCount: 0
  },
  {
    id: 'fc-bio-central-dogma',
    subject: 'ncert_biology',
    topic: 'Molecular Basis of Inheritance',
    academicLevel: 'ncert_class_11_12_science',
    front: 'Central Dogma of Molecular Biology',
    backEquation: 'DNA ──[Replication]──> DNA ──[Transcription]──> mRNA ──[Translation]──> Protein',
    backExplanation: 'Proposed by Francis Crick in 1958. Exception: Retroviruses (e.g. HIV) carry out Reverse Transcription (RNA → cDNA) via Reverse Transcriptase (Teminism).',
    examTip: 'Transcription enzyme: DNA-dependent RNA polymerase. Reads template strand in 3\' → 5\' direction and synthesizes RNA in 5\' → 3\' direction.',
    mastery: 'unseen',
    reviewCount: 0
  }
];
