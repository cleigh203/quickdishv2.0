import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus, Upload, Image as ImageIcon } from "lucide-react";
import { Recipe } from "@/types/recipe";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CustomRecipeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRecipe?: Recipe | null;
  onSave: () => void;
}

export const CustomRecipeForm = ({ open, onOpenChange, editRecipe, onSave }: CustomRecipeFormProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [cookTime, setCookTime] = useState("30 mins");
  const [prepTime, setPrepTime] = useState("15 mins");
  const [servings, setServings] = useState<number>(4);
  const [difficulty, setDifficulty] = useState("Medium");
  const [cuisine, setCuisine] = useState("Custom");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (editRecipe) {
      setTitle(editRecipe.name);
      setDescription(editRecipe.description);
      const existingImageUrl = editRecipe.imageUrl || editRecipe.image || "";
      setImagePreview(existingImageUrl);
      setImageFile(null); // Don't set file for existing recipes
      setIngredients(
        editRecipe.ingredients?.map(ing => {
          if (typeof ing === "string") return ing;
          const parts = [ing.amount, ing.unit, ing.item].filter(Boolean);
          return parts.join(" ").trim();
        }) || [""]
      );
      setInstructions(editRecipe.instructions && editRecipe.instructions.length > 0 ? editRecipe.instructions : [""]);
      setCookTime(editRecipe.cookTime || "30 mins");
      setPrepTime(editRecipe.prepTime || "15 mins");
      setServings(editRecipe.servings || 4);
      setDifficulty(editRecipe.difficulty || "Medium");
      setCuisine(editRecipe.cuisine || "Custom");
    } else {
      resetForm();
    }
  }, [editRecipe, open]);

  // Cleanup image preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview("");
    setIngredients([""]);
    setInstructions([""]);
    setCookTime("30 mins");
    setPrepTime("15 mins");
    setServings(4);
    setDifficulty("Medium");
    setCuisine("Custom");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Cleanup old preview if it exists
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview("");
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

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required");
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

    // Validate arrays are properly formatted
    if (!Array.isArray(filteredIngredients) || !Array.isArray(filteredInstructions)) {
      console.error('Validation error: ingredients or instructions are not arrays', {
        ingredients: filteredIngredients,
        instructions: filteredInstructions
      });
      toast.error("Invalid recipe data format. Please try again.");
      return;
    }

    if (!user) {
      toast.error("Please sign in to save recipes");
      return;
    }

    setIsSaving(true);
    setIsUploading(false);

    try {
      // For new recipes, generate a unique ID
      // For edits, we'll handle updates separately if needed
      const recipeId = editRecipe?.id || `custom-${Date.now()}`;
      
      // Parse ingredients into proper format
      const recipeIngredients = filteredIngredients.map(ing => {
        const parts = ing.trim().split(' ');
        const amount = parts[0] || "";
        const unit = parts.length > 2 ? parts[1] : "";
        const item = parts.length > 2 ? parts.slice(2).join(' ') : parts.slice(1).join(' ');
        return { amount, unit, item: item || parts[0] || "" };
      });

      // Validate ingredients are properly formatted
      if (!Array.isArray(recipeIngredients) || recipeIngredients.length === 0) {
        console.error('Validation error: recipeIngredients is not a valid array', recipeIngredients);
        toast.error("Invalid ingredients format. Please check your ingredients.");
        setIsSaving(false);
        return;
      }

      // Validate instructions are properly formatted
      if (!Array.isArray(filteredInstructions) || filteredInstructions.length === 0) {
        console.error('Validation error: instructions is not a valid array', filteredInstructions);
        toast.error("Invalid instructions format. Please check your instructions.");
        setIsSaving(false);
        return;
      }

      // Upload image first if a new file is selected
      let finalImageUrl = editRecipe?.imageUrl || editRecipe?.image || '';
      
      if (imageFile) {
        setIsUploading(true);
        console.log('Starting image upload...', { fileName: imageFile.name, fileSize: imageFile.size, fileType: imageFile.type });

        try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          console.log('Uploading to recipe-images bucket:', fileName);

          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('recipe-images')
            .upload(fileName, imageFile);

          if (uploadError) {
            console.error('Upload error details:', JSON.stringify(uploadError, null, 2));
            toast.error("Image upload failed", {
              description: uploadError.message || "Failed to upload image. Please try again."
            });
            setIsSaving(false);
            setIsUploading(false);
            return;
          }

          console.log('Upload successful:', uploadData);

          const { data: urlData } = supabase.storage
            .from('recipe-images')
            .getPublicUrl(fileName);

          finalImageUrl = urlData.publicUrl;
          console.log('Image URL generated:', finalImageUrl);
          setIsUploading(false);
        } catch (uploadError: any) {
          console.error('Upload exception:', JSON.stringify(uploadError, null, 2));
          toast.error("Image upload failed", {
            description: uploadError?.message || "An error occurred during image upload."
          });
          setIsSaving(false);
          setIsUploading(false);
          return;
        }
      }

      const trimmedCookTime = cookTime.trim() || "30 mins";
      const trimmedPrepTime = prepTime.trim() || "15 mins";
      const normalizedServings = Number.isFinite(servings) && servings > 0 ? servings : 4;
      const normalizedDifficulty = difficulty.trim() || "Medium";
      const normalizedCuisine = cuisine.trim() || "Custom";

      const basePayload = {
        name: title.trim(),
        description: description.trim() || '',
        cook_time: trimmedCookTime,
        prep_time: trimmedPrepTime,
        difficulty: normalizedDifficulty,
        servings: normalizedServings,
        ingredients: recipeIngredients,
        instructions: filteredInstructions,
        cuisine: normalizedCuisine,
        image_url: finalImageUrl || null,
        tags: editRecipe?.tags && editRecipe.tags.length > 0 ? editRecipe.tags : ["custom"]
      };

      console.log('Saving recipe with payload:', JSON.stringify({ ...basePayload, recipe_id: recipeId }, null, 2));

      if (editRecipe) {
        const { error } = await supabase
          .from('generated_recipes')
          .update(basePayload)
          .eq('recipe_id', recipeId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Update error details:', JSON.stringify(error, null, 2));
          toast.error("Update failed", {
            description: error.message || "Failed to update recipe."
          });
          setIsSaving(false);
          return;
        }

        toast.success("Recipe updated successfully!");
      } else {
        const insertPayload = {
          user_id: user.id,
          recipe_id: recipeId,
          ...basePayload,
        };

        const { data, error } = await supabase
          .from('generated_recipes')
          .insert(insertPayload)
          .select()
          .single();

        if (error) {
          console.error('Save error details:', JSON.stringify(error, null, 2));
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Error details:', error.details);
          console.error('Error hint:', error.hint);
          
          let errorMessage = "Failed to save recipe.";
          if (error.message) {
            errorMessage = error.message;
          } else if (error.code) {
            errorMessage = `Error ${error.code}: ${error.message || 'Failed to save recipe'}`;
          }
          
          toast.error("Save failed", {
            description: errorMessage
          });
          setIsSaving(false);
          return;
        }

        console.log('Recipe saved successfully:', data);
        toast.success("Recipe created successfully!");
      }
      resetForm();
      onSave();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Save exception:', JSON.stringify(error, null, 2));
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      
      let errorMessage = "An unexpected error occurred while saving the recipe.";
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error("Save failed", {
        description: errorMessage
      });
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editRecipe ? "Update Recipe" : "Create Your Own Recipe"}</DialogTitle>
          <DialogDescription>
            {editRecipe ? "Update your custom recipe details below." : "Create a custom recipe with your own ingredients and instructions."}
          </DialogDescription>
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="prepTime">Prep Time *</Label>
              <Input
                id="prepTime"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="e.g., 15 mins"
              />
            </div>
            <div>
              <Label htmlFor="cookTime">Cook Time *</Label>
              <Input
                id="cookTime"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="e.g., 30 mins"
              />
            </div>
            <div>
              <Label htmlFor="servings">Servings *</Label>
              <Input
                id="servings"
                type="number"
                min={1}
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value, 10) || 1)}
                placeholder="e.g., 4"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Input
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="e.g., Easy"
              />
            </div>
            <div>
              <Label htmlFor="cuisine">Cuisine</Label>
              <Input
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g., Italian"
              />
            </div>
          </div>

          <div>
            <Label>Recipe Image</Label>
            <div className="space-y-3">
              {!imagePreview ? (
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={isSaving || isUploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, WEBP (MAX. 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="mt-2"
                    disabled={isSaving || isUploading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
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
          <Button onClick={handleSave} className="bg-[#047857] hover:bg-[#047857]/90" disabled={isSaving || isUploading}>
            {isUploading ? "Uploading Image..." : isSaving ? "Saving..." : editRecipe ? "Update Recipe" : "Save Recipe"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
