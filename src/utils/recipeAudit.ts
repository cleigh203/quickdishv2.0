import type { Recipe } from "../types/recipe";
import { allRecipes } from "../data/recipes";
import { getRecipeImage } from "./recipeImages";

type AuditFlag =
  | "wrongPrefix"
  | "badTotalTime"
  | "missingQuick"
  | "imageMissing"
  | "manualReview";

export interface RecipeAuditRecord {
  id: string;
  name: string;
  cuisine: string;
  totalTime?: number;
  quickFlag: boolean;
  idPrefixOK?: boolean;
  imageShapeOK?: boolean;
  desiredPrefix?: string;
  flags: AuditFlag[];
}

const isDessert = (recipe: Recipe): boolean => {
  const idIsDessert = recipe.id?.startsWith("dessert-") || recipe.tags?.includes("dessert") || false;
  const cuisineIsDessert = /dessert/i.test(recipe.cuisine || "");
  return idIsDessert || cuisineIsDessert;
};

const computeTotalTime = (recipe: Recipe): number | undefined => {
  const toMinutes = (s?: string): number | undefined => {
    if (!s) return undefined;
    const match = s.match(/(\d+)\s*min/);
    return match ? parseInt(match[1], 10) : undefined;
  };
  const prep = toMinutes(recipe.prepTime);
  const cook = toMinutes(recipe.cookTime);
  return prep !== undefined && cook !== undefined ? prep + cook : recipe.totalTime;
};

const hasQuickTag = (recipe: Recipe): boolean => {
  return (recipe.tags || []).some(t => t.toLowerCase() === "quick");
};

const checkImage = (recipe: Recipe): { ok: boolean } => {
  try {
    const url = getRecipeImage(recipe);
    if (!url) return { ok: false };
    return { ok: true };
  } catch {
    return { ok: false };
  }
};

export const auditRecipes = (recipes: Recipe[]): RecipeAuditRecord[] => {
  return recipes.map((r) => {
    const flags: AuditFlag[] = [];

    // totalTime
    const computed = computeTotalTime(r);
    if (computed !== undefined && r.totalTime !== undefined && computed !== r.totalTime) {
      flags.push("badTotalTime");
    }

    // quick
    const quickFlag = !!(computed !== undefined && computed <= 30 && !isDessert(r));
    if (quickFlag && !hasQuickTag(r)) {
      flags.push("missingQuick");
    }

    // id prefix check (non-breaking; only for Lunch/Dinner cuisines)
    let idPrefixOK: boolean | undefined = undefined;
    let desiredPrefix: string | undefined = undefined;
    if (r.cuisine === "Lunch") {
      desiredPrefix = "lunch-";
      idPrefixOK = r.id?.startsWith(desiredPrefix);
      if (idPrefixOK === false) flags.push("wrongPrefix");
    } else if (r.cuisine === "Dinner") {
      desiredPrefix = "dinner-";
      idPrefixOK = r.id?.startsWith(desiredPrefix);
      if (idPrefixOK === false) flags.push("wrongPrefix");
    }

    // image shape/availability check (tolerant)
    const { ok } = checkImage(r);
    const imageShapeOK = ok;
    if (!ok) {
      flags.push("imageMissing");
    }

    return {
      id: r.id,
      name: r.name,
      cuisine: r.cuisine,
      totalTime: r.totalTime ?? computed,
      quickFlag,
      idPrefixOK,
      imageShapeOK,
      desiredPrefix,
      flags,
    } satisfies RecipeAuditRecord;
  });
};

const isLunchCandidate = (r: Recipe): boolean => {
  const hasLunchCuisine = r.cuisine === "Lunch";
  const hasLunchPrefix = typeof r.id === 'string' && r.id.startsWith('lunch-');
  const hasLunchTag = (r.tags || []).some(t => t.toLowerCase() === 'lunch');
  return hasLunchCuisine || hasLunchPrefix || hasLunchTag;
};

export const getLunchRecipes = (): Recipe[] => {
  return allRecipes.filter(isLunchCandidate);
};

export const getDinnerRecipes = (): Recipe[] => {
  return allRecipes.filter(r => r.cuisine === "Dinner");
};

export const auditFirstNLunch = (n: number): RecipeAuditRecord[] => {
  const lunch = getLunchRecipes().slice(0, n);
  return auditRecipes(lunch);
};

export const toJson = (records: RecipeAuditRecord[]): string => {
  return JSON.stringify(records, null, 2);
};


