export const BREAK_ACTIVITIES = [
  '🏃 Do 10 jumping jacks',
  '💧 Drink a full glass of water',
  '👁️ Stare at a distant object for 2 minutes',
  '🧘 Take 5 deep breaths — inhale 4s, exhale 6s',
  '🚶 Walk around the room twice',
  '🙆 Stretch your arms over your head for 30 seconds',
  '🤸 Do 5 neck rolls, slow and deliberate',
  '☀️ Step outside, breathe fresh air',
  '👐 Shake out your hands and wrists',
  '🪑 Stand up and sit down 10 times (chair squats)',
];

export const FORMULA_POPUPS = [
  { subject: 'Physics', content: 'Angular Momentum: L = Iω  (I = moment of inertia, ω = angular velocity)' },
  { subject: 'Physics', content: 'Newton\'s 2nd Law: F = ma  |  Impulse: J = FΔt = Δp' },
  { subject: 'Physics', content: 'Kinetic Energy: KE = ½mv²  |  Work: W = Fd·cosθ' },
  { subject: 'Physics', content: 'Coulomb\'s Law: F = kq₁q₂/r²  (k = 8.99 × 10⁹ N·m²/C²)' },
  { subject: 'Chemistry', content: 'Ideal Gas Law: PV = nRT  (R = 8.314 J/mol·K)' },
  { subject: 'Chemistry', content: 'Henderson–Hasselbalch: pH = pKa + log([A⁻]/[HA])' },
  { subject: 'Chemistry', content: 'Gibbs Free Energy: ΔG = ΔH − TΔS  (spontaneous if ΔG < 0)' },
  { subject: 'Chemistry', content: 'Rate Law: r = k[A]ᵐ[B]ⁿ  (m, n = reaction orders)' },
  { subject: 'Biology', content: 'Hardy–Weinberg: p² + 2pq + q² = 1  (p + q = 1)' },
  { subject: 'Biology', content: 'Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂' },
  { subject: 'Mathematics', content: 'Euler\'s Identity: eⁱᵖ + 1 = 0' },
  { subject: 'Mathematics', content: 'Quadratic Formula: x = (−b ± √(b²−4ac)) / 2a' },
  { subject: 'Mathematics', content: 'Bayes\' Theorem: P(A|B) = P(B|A)·P(A) / P(B)' },
];

export function getRandomActivity() {
  return BREAK_ACTIVITIES[Math.floor(Math.random() * BREAK_ACTIVITIES.length)];
}

export function getRandomFormula() {
  return FORMULA_POPUPS[Math.floor(Math.random() * FORMULA_POPUPS.length)];
}
