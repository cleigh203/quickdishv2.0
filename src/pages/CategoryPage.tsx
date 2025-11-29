import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '@/contexts/RecipesContext';
import { useEffect, useMemo } from 'react';
import { getRecipeImage } from '@/utils/recipeImages';
import { Recipe } from '@/types/recipe';
import RecipeDetail from './RecipeDetail';
import { Heart } from 'lucide-react';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';

// Map category name to category ID (same as Generate.tsx)
const categoryNameToId: { [key: string]: string } = {
  'Fall Favorites': 'fall',
  'Quick and Easy': 'quick',
  'Clean Eats': 'cleaneats',
  'Restaurant Copycats': 'copycat',
  'Breakfast': 'breakfast',
  'Desserts': 'dessert',
  'One Pot Meals': 'onepot',
  'Family Approved': 'family'
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { recipes } = useRecipes();
  const { saveRecipe, isSaved, unsaveRecipe } = useSavedRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([]);

  // Decode category name from URL
  const decodedCategoryName = categoryName ? decodeURIComponent(categoryName) : null;
  
  // Get category ID from name
  const categoryId = decodedCategoryName ? categoryNameToId[decodedCategoryName] || decodedCategoryName.toLowerCase() : null;

  // Filter recipes by category (same logic as Generate.tsx)
  const categoryRecipes = useMemo(() => {
    if (!categoryId || !decodedCategoryName) return [];

    let filtered: Recipe[] = [];

    switch (categoryId) {
      // --- TAG-BASED FILTERS ---
      case 'quick': // For "Quick and Easy"
        filtered = recipes.filter(r => r.tags?.includes('quick'));
        break;
      case 'onepot': // For "One Pot Meals"
        filtered = recipes.filter(r => r.tags?.includes('one-pot'));
        break;
      case 'family': // For "Family Approved"
        filtered = recipes.filter(r =>
          r.tags?.includes('family-friendly') || r.tags?.includes('kid-friendly')
        );
        break;

      // --- CATEGORY-BASED FILTERS ---
      case 'fall': // For "Fall Favorites"
        filtered = recipes.filter(r => r.category === 'Fall Favorites');
        break;
      case 'cleaneats': // For "Clean Eats"
        filtered = recipes.filter(r => r.category === 'Clean Eats');
        break;
      case 'breakfast': // For "Breakfast"
        filtered = recipes.filter(r => r.category === 'Breakfast');
        break;
      case 'dessert': // For "Desserts"
        filtered = recipes.filter(r => r.category === 'Desserts');
        break;
      case 'copycat': // For "Restaurant Copycats"
        filtered = recipes.filter(r => r.category === 'Restaurant Copycats');
        break;
       
      default:
        return [];
    }

    // Apply dietary filters
    if (dietaryFilters.length > 0) {
      filtered = filtered.filter(recipe => {
        const recipeTags = recipe.tags?.map(t => t.toLowerCase().replace(/\s+/g, '-').replace('glutenfree', 'gluten-free').replace('dairyfree', 'dairy-free')) || [];

        return dietaryFilters.every(filter => {
          const normalizedFilter = filter.toLowerCase().replace(/\s+/g, '-');
          return recipeTags.some(tag =>
            tag === normalizedFilter ||
            tag === normalizedFilter.replace('-', '') ||
            tag.includes(normalizedFilter) ||
            normalizedFilter.includes(tag)
          );
        });
      });
    }

    return filtered;
  }, [categoryId, recipes, decodedCategoryName, dietaryFilters]);

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`category_${categoryName}_scroll`, window.scrollY.toString());
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categoryName]);

  // Restore scroll position on mount
  useEffect(() => {
    const savedScroll = sessionStorage.getItem(`category_${categoryName}_scroll`);
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll));
      }, 100);
    }
  }, [categoryName]);

  return (
    <>
      <div className="min-h-screen pb-20">
        <div className="sticky top-0 bg-white border-b p-4 z-10">
          <button onClick={() => navigate(-1)} className="text-lg">
            ← Back
          </button>
          <h1 className="text-2xl font-bold mt-2">{decodeURIComponent(categoryName || '')}</h1>
        </div>

        {/* Refine Results Section */}
        {categoryRecipes.length > 0 && (
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm font-semibold text-[#047857]"
              >
                <span>🔍</span>
                <span>Refine Results</span>
                <span className="text-xs">{showFilters ? '▲' : '▼'}</span>
              </button>

              {/* Show active filters */}
              {dietaryFilters.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Active:</span>
                  <div className="flex gap-1">
                    {dietaryFilters.map(diet => (
                      <span key={diet} className="px-2 py-1 bg-[#047857] text-white text-xs rounded-full">
                        {diet.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Chips - Collapsible */}
            {showFilters && (
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-700 mb-2 block">DIETARY</label>
                <div className="flex flex-wrap gap-2">
                  {['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Keto'].map((diet) => {
                    const isSelected = dietaryFilters.includes(diet.toLowerCase());
                    return (
                      <button
                        key={diet}
                        onClick={() => {
                          if (isSelected) {
                            setDietaryFilters(dietaryFilters.filter(d => d !== diet.toLowerCase()));
                          } else {
                            setDietaryFilters([...dietaryFilters, diet.toLowerCase()]);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-[#047857] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {diet}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        
        {categoryRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-lg font-semibold text-gray-700 mb-2">No results found</p>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your filters</p>
            {dietaryFilters.length > 0 && (
              <button
                onClick={() => setDietaryFilters([])}
                className="px-4 py-2 bg-[#047857] text-white rounded-lg text-sm font-medium hover:bg-[#03684a] transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4">
            {categoryRecipes.map((recipe, index) => (
            <div 
              key={`${recipe.id}-${index}`}
              className="bg-white rounded-lg shadow cursor-pointer overflow-hidden relative"
            >
              {/* Favorite heart button */}
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation(); // Don't open recipe
                  if (isSaved(recipe.id)) {
                    await unsaveRecipe(recipe.id);
                  } else {
                    await saveRecipe(recipe.id);
                  }
                }}
                className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                aria-label={`${isSaved(recipe.id) ? 'Remove' : 'Save'} ${recipe.name} to favorites`}
              >
                <Heart 
                  className={`w-4 h-4 ${isSaved(recipe.id) ? 'fill-red-500 text-red-500' : 'text-black'}`}
                />
              </button>
              
              <div onClick={() => setSelectedRecipe(recipe)}>
                <div className="relative h-40 w-full bg-white overflow-hidden">
                  {getRecipeImage(recipe, import.meta.env.DEV) ? (
                    <img 
                      src={getRecipeImage(recipe, import.meta.env.DEV)} 
                      alt={recipe.name} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <span className="text-4xl">🍳</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm">{recipe.name}</h3>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
      
      {/* Recipe modal - slides up from bottom */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-slide-up">
          <RecipeDetail 
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        </div>
      )}
    </>
  );
};

export default CategoryPage;
