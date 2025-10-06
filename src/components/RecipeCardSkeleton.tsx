import { Skeleton } from "@/components/ui/skeleton";

export const RecipeCardSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden border border-border bg-card">
      <Skeleton className="w-full h-32" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
};
