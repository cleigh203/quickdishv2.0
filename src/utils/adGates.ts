export type GatePurpose = 'ai_generation' | 'ai_chat' | 'nutrition' | 'interstitial';

const DAY_KEY = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

function getJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// AI Generation gating: 2 free/day, up to 5/day with rewarded ads
export function getAiGenerationCounts() {
  const key = `adGate.aiGen.${DAY_KEY()}`;
  const data = getJSON<{ count: number }>(key, { count: 0 });
  // Policy: 2 per day, each requires a rewarded ad.
  return { count: data.count, free: 2, max: 2 };
}

export function needAdForAiGeneration(): boolean {
  const { count, max } = getAiGenerationCounts();
  // Require ad for each generation until max reached
  return count < max;
}

export function canGenerateAiRecipe(): { allowed: boolean; reason?: string } {
  const { count, max } = getAiGenerationCounts();
  if (count >= max) return { allowed: false, reason: 'Daily limit reached' };
  return { allowed: true };
}

export function recordAiGeneration() {
  const key = `adGate.aiGen.${DAY_KEY()}`;
  const data = getJSON<{ count: number }>(key, { count: 0 });
  data.count += 1;
  setJSON(key, data);
}

// AI Chat gating: 1 rewarded ad per session before first open
export function needAdForChatThisSession(): boolean {
  return sessionStorage.getItem('adGate.chat.watched') !== 'true';
}

export function markChatAdWatched() {
  sessionStorage.setItem('adGate.chat.watched', 'true');
}

// Nutrition gating: 1 ad per recipe per day
export function needAdForNutrition(recipeId: string): boolean {
  const key = `adGate.nutrition.${DAY_KEY()}.${recipeId}`;
  return localStorage.getItem(key) !== 'true';
}

export function markNutritionWatched(recipeId: string) {
  const key = `adGate.nutrition.${DAY_KEY()}.${recipeId}`;
  localStorage.setItem(key, 'true');
}

// Interstitial after 10 recipe views, max 1/hour
export function recordRecipeViewAndCheckInterstitial(): boolean {
  const dayKey = `adGate.views.${DAY_KEY()}`;
  const data = getJSON<{ views: number; lastInterstitialAt?: number }>(dayKey, { views: 0 });
  data.views += 1;
  setJSON(dayKey, data);

  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const eligibleByCount = data.views % 10 === 0;
  const eligibleByTime = !data.lastInterstitialAt || now - data.lastInterstitialAt >= oneHour;
  return eligibleByCount && eligibleByTime;
}

export function markInterstitialShown() {
  const dayKey = `adGate.views.${DAY_KEY()}`;
  const data = getJSON<{ views: number; lastInterstitialAt?: number }>(dayKey, { views: 0 });
  data.lastInterstitialAt = Date.now();
  setJSON(dayKey, data);
}

