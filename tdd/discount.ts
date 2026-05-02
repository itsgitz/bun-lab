// GREEN PHASE, write the laziest code possible to satisfy the test.
// export function applyDiscount(total: number): number {
//   if (total > 100) {
//     return total * 0.9;
//   }
//   return total;
// }

// REFACTOR PHASE (clean up)
const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.1;
export function applyDiscount(total: number): number {
  const isEligible = total > DISCOUNT_THRESHOLD;
  return isEligible ? total * (1 - DISCOUNT_RATE) : total;
}
