/**
 * Utilitas perhitungan nutrisi — pure functions, tidak ada I/O.
 * Bisa dipakai di server component, client component, maupun server actions.
 */

/**
 * Hitung target makronutrien dari kalori target.
 * Distribusi: protein 20%, lemak 25%, karbo 55%.
 * Konsisten dengan calculateDailyNeeds di actions.ts.
 */
export function calculateMacrosFromCalories(targetCalories: number) {
  return {
    kalori: targetCalories,
    protein: Math.round((targetCalories * 0.2) / 4),      // 20%, 4 kkal/g
    lemak: Math.round((targetCalories * 0.25) / 9),        // 25%, 9 kkal/g
    karbohidrat: Math.round((targetCalories * 0.55) / 4),  // 55%, 4 kkal/g
  };
}
