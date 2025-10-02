import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Heart, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { allRecipes } from "@/data/recipes";
import { Recipe } from "@/types/recipe";
import { recipeStorage } from "@/utils/recipeStorage";
import { CustomRecipeForm } from "@/components/CustomRecipeForm";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const SavedRecipes = () => {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deleteRecipeId, setDeleteRecipeId] = useState<string | null>(null);

  const loadRecipes = () => {
    // Load saved recipe IDs from localStorage
    const savedIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Combine hardcoded recipes and dynamically generated recipes
    const dynamicRecipes = recipeStorage.getRecipes();
    const allAvailableRecipes = [...allRecipes, ...dynamicRecipes];
    
    // Remove duplicates by ID (prioritize dynamic versions)
    const recipeMap = new Map<string, Recipe>();
    allAvailableRecipes.forEach(recipe => {
      recipeMap.set(recipe.id, recipe);
    });
    
    // Filter recipes that match saved IDs
    const saved = Array.from(recipeMap.values()).filter(recipe => 
      savedIds.includes(recipe.id)
    );
    setSavedRecipes(saved);

    // Load custom recipes
    const custom = JSON.parse(localStorage.getItem('customRecipes') || '[]');
    setCustomRecipes(custom);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleRecipeClick = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleDelete = (recipeId: string) => {
    setDeleteRecipeId(recipeId);
  };

  const confirmDelete = () => {
    if (deleteRecipeId) {
      const updatedCustomRecipes = customRecipes.filter(r => r.id !== deleteRecipeId);
      localStorage.setItem('customRecipes', JSON.stringify(updatedCustomRecipes));
      setCustomRecipes(updatedCustomRecipes);
      toast.success("Recipe deleted");
      setDeleteRecipeId(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleSave = () => {
    loadRecipes();
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-16 px-6 text-center text-white">
        <Heart className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Saved Recipes</h1>
        <p className="text-xl text-white/90">Your favorite recipes in one place</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your Own Recipe
          </Button>
        </div>

        {customRecipes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">My Custom Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customRecipes.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    <div className="relative h-48 rounded-t-xl overflow-hidden bg-gradient-to-br from-[#FF6B35]/20 to-[#FF6B35]/10">
                      {recipe.imageUrl || recipe.image ? (
                        <img 
                          src={recipe.imageUrl || recipe.image} 
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          👨‍🍳
                        </div>
                      )}
                      <Badge className="absolute top-3 right-3 bg-[#FF6B35] text-white">
                        MY RECIPE
                      </Badge>
                    </div>
                    <div className="p-4 bg-card rounded-b-xl border border-t-0">
                      <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(recipe);
                      }}
                      className="flex-1"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(recipe.id);
                      }}
                      className="flex-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {savedRecipes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Saved Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe.id)}
                />
              ))}
            </div>
          </div>
        )}

        {savedRecipes.length === 0 && customRecipes.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-3">No saved recipes yet</h2>
            <p className="text-muted-foreground mb-8">
              Start saving your favorite recipes to see them here
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/generate')}
              className="bg-gradient-to-r from-pink-500 to-rose-500"
            >
              Discover Recipes
            </Button>
          </div>
        )}
      </div>

      <CustomRecipeForm
        open={showForm}
        onOpenChange={handleFormClose}
        editRecipe={editingRecipe}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteRecipeId} onOpenChange={() => setDeleteRecipeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipe? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default SavedRecipes;
