export const AI_GENERATION_LIMITS = {
  FREE: 1,
  PREMIUM: 5,
} as const;

export const getAiGenerationLimit = (isPremium: boolean): number => {
  return isPremium ? AI_GENERATION_LIMITS.PREMIUM : AI_GENERATION_LIMITS.FREE;
};
