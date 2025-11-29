/**
 * Parse a fractional amount string to a decimal number
 * Handles: "1/4" -> 0.25, "1 1/2" -> 1.5, "2" -> 2
 */
export const parseFraction = (amount: string | number | undefined): number => {
  if (!amount) return 0;
  
  const str = amount.toString().trim();
  
  // If it's already a number, return it
  if (!isNaN(Number(str)) && !str.includes('/')) {
    return Number(str);
  }
  
  // Handle mixed numbers like "1 1/2"
  const mixedMatch = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1]);
    const num = parseInt(mixedMatch[2]);
    const den = parseInt(mixedMatch[3]);
    return whole + (num / den);
  }
  
  // Handle simple fractions like "1/4"
  const fractionMatch = str.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const num = parseInt(fractionMatch[1]);
    const den = parseInt(fractionMatch[2]);
    return num / den;
  }
  
  // Fallback to parseFloat (will handle decimals)
  return parseFloat(str) || 0;
};

/**
 * Format a decimal number back to a fraction if it's a common fraction
 */
export const formatFraction = (num: number): string => {
  // Common fractions
  const commonFractions: Record<number, string> = {
    0.125: '1/8',
    0.25: '1/4',
    0.333: '1/3',
    0.375: '3/8',
    0.5: '1/2',
    0.625: '5/8',
    0.667: '2/3',
    0.75: '3/4',
    0.875: '7/8',
  };
  
  // Check if it's a common fraction (with small tolerance)
  for (const [decimal, fraction] of Object.entries(commonFractions)) {
    if (Math.abs(num - parseFloat(decimal)) < 0.01) {
      return fraction;
    }
  }
  
  // Check for whole numbers
  if (Math.abs(num - Math.round(num)) < 0.01) {
    return Math.round(num).toString();
  }
  
  // Return decimal with max 2 decimal places
  return num.toFixed(2).replace(/\.?0+$/, '');
};

export const formatIngredient = (ingredient: {
  amount?: string | number;
  unit?: string;
  item?: string;
}): string => {
  const amount = ingredient.amount?.toString().trim() || '';
  const unit = ingredient.unit?.toString().trim() || '';
  const item = ingredient.item?.toString().trim() || '';
  
  // Filter out empty strings and join with spaces
  return [amount, unit, item].filter(Boolean).join(' ');
};

