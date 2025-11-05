import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { toast } from "sonner";

interface CustomRecipeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRecipe?: Recipe | null;
  onSave: () => void;
}

export const CustomRecipeForm = ({ open, onOpenChange, editRecipe, onSave }: CustomRecipeFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  useEffect(() => {
    if (editRecipe) {
      setTitle(editRecipe.name);
      setDescription(editRecipe.description);
      setImageUrl(editRecipe.imageUrl || editRecipe.image || "");
      setIngredients(editRecipe.ingredients?.map(ing => `${ing.amount} ${ing.unit} ${ing.item}`.trim()) || []);
      setInstructions(editRecipe.instructions);
    } else {
      resetForm();
    }
  }, [editRecipe, open]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setIngredients([""]);
    setInstructions([""]);
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => setInstructions([...instructions, ""]);
  const removeInstruction = (index: number) => setInstructions(instructions.filter((_, i) => i !== index));
  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const filteredIngredients = ingredients.filter(i => i.trim());
    const filteredInstructions = instructions.filter(i => i.trim());

    if (filteredIngredients.length === 0) {
      toast.error("At least one ingredient is required");
      return;
    }

    if (filteredInstructions.length === 0) {
      toast.error("At least one instruction is required");
      return;
    }

    const recipe: Recipe = {
      id: editRecipe?.id || `custom-${Date.now()}`,
      name: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      image: imageUrl.trim() || undefined,
      ingredients: filteredIngredients.map(ing => {
        const parts = ing.trim().split(' ');
        const amount = parts[0] || "";
        const unit = parts[1] || "";
        const item = parts.slice(2).join(' ') || parts[0] || "";
        return { amount, unit, item };
      }),
      instructions: filteredInstructions,
      cookTime: "Custom",
      prepTime: "Custom",
      difficulty: "Custom",
      servings: 4,
      cuisine: "Custom",
      isPremium: false,
      tags: ["custom"]
    };

    // COMMENTED OUT: No localStorage recipe storage - only database for logged-in users
    // const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
    const customRecipes: Recipe[] = [];
    
    if (editRecipe) {
      // COMMENTED OUT: localStorage recipe storage disabled
      // const index = customRecipes.findIndex((r: Recipe) => r.id === editRecipe.id);
      // if (index !== -1) {
      //   customRecipes[index] = recipe;
      // }
    } else {
      // COMMENTED OUT: localStorage recipe storage disabled
      // customRecipes.push(recipe);
    }

    // COMMENTED OUT: localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
    toast.success(editRecipe ? "Recipe updated!" : "Recipe created!");
    resetForm();
    onSave();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editRecipe ? "Update Recipe" : "Create Your Own Recipe"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter recipe title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your recipe"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label>Ingredients *</Label>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="e.g., 2 cups flour"
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addIngredient} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Ingredient
              </Button>
            </div>
          </div>

          <div>
            <Label>Instructions *</Label>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    rows={2}
                  />
                  {instructions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeInstruction(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addInstruction} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Instruction
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#FF6B35] hover:bg-[#FF6B35]/90">
            {editRecipe ? "Update Recipe" : "Save Recipe"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
