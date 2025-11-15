import { createContext, useContext, useMemo, useEffect, useRef, type ReactNode } from "react";
import { Recipe } from "@/types/recipe";
import { useAllRecipes } from "@/hooks/useAllRecipes";
import { useAuth } from "@/contexts/AuthContext";

type RecipesContextValue = {
  recipes: Recipe[];
  isLoading: boolean;
  refetch: (options?: { force?: boolean }) => Promise<void> | void;
};

const RecipesContext = createContext<RecipesContextValue | undefined>(undefined);

export const RecipesProvider = ({ children }: { children: ReactNode }) => {
  const { allRecipes, isLoading, refetch } = useAllRecipes();
  const { user } = useAuth();

  const value = useMemo<RecipesContextValue>(() => ({
    recipes: allRecipes,
    isLoading,
    refetch,
  }), [allRecipes, isLoading, refetch]);

  const previousUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const currentUserId = user?.id ?? null;
    if (previousUserIdRef.current === currentUserId) {
      return;
    }

    previousUserIdRef.current = currentUserId;
    refetch({ force: true });
  }, [user?.id, refetch]);


  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
};

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }
  return context;
};
