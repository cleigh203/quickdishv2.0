import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { VALID_CATEGORIES } from '@/lib/recipeGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Recipe {
  id: string;
  recipe_id: string;
  name: string;
  description: string;
  cuisine: string;
  difficulty: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  ingredients: any[];
  instructions: string[];
  tags: string[];
  image_url: string;
  source: string;
  ai_generated: boolean;
  needs_validation: boolean;
  verified: boolean;
  kitchen_tested: boolean;
  validation_notes: string | null;
  generated_at: string | null;
  created_at: string;
  nutrition: any;
}

interface CategoryStats {
  category: string;
  total: number;
  needsValidation: number;
  verified: number;
}

const AdminRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'needs-validation' | 'verified'>('needs-validation');
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, selectedCategory, searchQuery, statusFilter]);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('ai_generated', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Cast the data to our Recipe type
      const recipesData = (data || []) as unknown as Recipe[];
      setRecipes(recipesData);
      calculateStats(recipesData);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allRecipes: Recipe[]) => {
    const categoryMap = new Map<string, CategoryStats>();

    VALID_CATEGORIES.forEach(cat => {
      categoryMap.set(cat, {
        category: cat,
        total: 0,
        needsValidation: 0,
        verified: 0
      });
    });

    allRecipes.forEach(recipe => {
      const category = getCategoryFromTags(recipe.tags);
      const stat = categoryMap.get(category);
      if (stat) {
        stat.total++;
        if (recipe.needs_validation) stat.needsValidation++;
        if (recipe.verified) stat.verified++;
      }
    });

    setStats(Array.from(categoryMap.values()));
  };

  const getCategoryFromTags = (tags: string[]): string => {
    for (const cat of VALID_CATEGORIES) {
      if (tags.some(tag => tag.toLowerCase().includes(cat.toLowerCase()))) {
        return cat;
      }
    }
    return 'Family Favorites';
  };

  const filterRecipes = () => {
    let filtered = recipes;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => 
        getCategoryFromTags(r.tags) === selectedCategory
      );
    }

    // Status filter
    if (statusFilter === 'needs-validation') {
      filtered = filtered.filter(r => r.needs_validation && !r.verified);
    } else if (statusFilter === 'verified') {
      filtered = filtered.filter(r => r.verified);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query)
      );
    }

    setFilteredRecipes(filtered);
  };

  const getTotalTime = (prepTime: string, cookTime: string): number => {
    const prep = parseInt(prepTime) || 0;
    const cook = parseInt(cookTime) || 0;
    return prep + cook;
  };

  const getCategoryValidationIssues = (recipe: Recipe): string[] => {
    const issues: string[] = [];
    const category = getCategoryFromTags(recipe.tags);
    const totalTime = getTotalTime(recipe.prep_time, recipe.cook_time);

    switch (category) {
      case 'Quick and Easy':
        if (totalTime > 30) {
          issues.push(`⚠️ Total time ${totalTime}min exceeds 30min limit`);
        }
        if (recipe.ingredients.length > 10) {
          issues.push(`⚠️ ${recipe.ingredients.length} ingredients exceeds 10 max`);
        }
        break;

      case 'Restaurant Copycats':
        const restaurantKeywords = ['chipotle', 'panera', 'olive garden', 'chick-fil-a', 'red lobster'];
        const hasRestaurant = restaurantKeywords.some(k => recipe.name.toLowerCase().includes(k));
        if (!hasRestaurant) {
          issues.push('⚠️ Missing restaurant name in title');
        }
        break;

      case 'Leftover Magic':
        if (!recipe.name.toLowerCase().includes('leftover')) {
          issues.push('⚠️ Missing "leftover" in name');
        }
        break;

      case 'One Pot Wonders':
        if (!recipe.description.toLowerCase().includes('one pot') && 
            !recipe.description.toLowerCase().includes('single pot')) {
          issues.push('⚠️ Doesn\'t mention one pot cooking');
        }
        break;

      case 'Healthy Bowls':
        if (!recipe.name.toLowerCase().includes('bowl')) {
          issues.push('⚠️ Missing "bowl" in name');
        }
        if (recipe.nutrition) {
          const protein = recipe.nutrition.protein || 0;
          if (protein < 20 || protein > 40) {
            issues.push(`⚠️ Protein ${protein}g outside 20-40g range`);
          }
        }
        break;
    }

    return issues;
  };

  const approveRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .update({ 
          verified: true, 
          needs_validation: false,
          validated_at: new Date().toISOString()
        })
        .eq('id', recipeId);

      if (error) throw error;

      toast.success('Recipe approved!');
      fetchRecipes();
    } catch (error) {
      console.error('Error approving recipe:', error);
      toast.error('Failed to approve recipe');
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      toast.success('Recipe deleted');
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const batchApproveCategory = async (category: string) => {
    if (!confirm(`Approve all ${category} recipes?`)) return;

    try {
      const recipesToApprove = recipes.filter(r => 
        getCategoryFromTags(r.tags) === category && 
        r.needs_validation && 
        !r.verified
      );

      for (const recipe of recipesToApprove) {
        await supabase
          .from('recipes')
          .update({ 
            verified: true, 
            needs_validation: false,
            validated_at: new Date().toISOString()
          })
          .eq('id', recipe.id);
      }

      toast.success(`Approved ${recipesToApprove.length} ${category} recipes`);
      fetchRecipes();
    } catch (error) {
      console.error('Error batch approving:', error);
      toast.error('Failed to batch approve');
    }
  };

  const generateCopycatRecipes = async () => {
    setIsGenerating(true);
    toast.info('Starting recipe generation... This may take 5-10 minutes.');

    try {
      const { data, error } = await supabase.functions.invoke('generate-restaurant-copycats');

      if (error) throw error;

      toast.success(`Generated ${data.generated}/${data.total} recipes! ${data.errors?.length || 0} failed.`);
      fetchRecipes();
    } catch (error) {
      console.error('Error generating recipes:', error);
      toast.error('Failed to generate recipes');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleExpanded = (recipeId: string) => {
    const newExpanded = new Set(expandedRecipes);
    if (newExpanded.has(recipeId)) {
      newExpanded.delete(recipeId);
    } else {
      newExpanded.add(recipeId);
    }
    setExpandedRecipes(newExpanded);
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Halloween': 'bg-orange-500',
      'Fall Favorites': 'bg-amber-500',
      'Quick and Easy': 'bg-green-500',
      'Restaurant Copycats': 'bg-blue-500',
      'Breakfast': 'bg-yellow-500',
      'Lunch Ideas': 'bg-cyan-500',
      'Dinner': 'bg-red-500',
      'Desserts': 'bg-pink-500',
      'One Pot Wonders': 'bg-purple-500',
      'Healthy Bowls': 'bg-emerald-500',
      'Leftover Magic': 'bg-indigo-500',
      'Family Favorites': 'bg-rose-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Recipe Review Dashboard</h1>
          <p className="text-muted-foreground">Review and validate AI-generated recipes</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={generateCopycatRecipes} 
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Generate 15 Copycats
              </>
            )}
          </Button>
          <Button onClick={fetchRecipes}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Category Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stats.map(stat => (
              <div key={stat.category} className="space-y-2">
                <div className="text-sm font-medium">{stat.category}</div>
                <div className="space-y-1 text-xs">
                  <div>Total: <span className="font-bold">{stat.total}</span></div>
                  <div className="text-yellow-600">Pending: {stat.needsValidation}</div>
                  <div className="text-green-600">Verified: {stat.verified}</div>
                  {stat.total < 15 && (
                    <div className="text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Gap: {15 - stat.total}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {VALID_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="needs-validation">Needs Validation</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>

            {selectedCategory !== 'all' && (
              <Button 
                variant="outline"
                onClick={() => batchApproveCategory(selectedCategory)}
              >
                Approve All {selectedCategory}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recipe Cards */}
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredRecipes.length} recipes
        </div>

        {filteredRecipes.map(recipe => {
          const category = getCategoryFromTags(recipe.tags);
          const issues = getCategoryValidationIssues(recipe);
          const isExpanded = expandedRecipes.has(recipe.id);
          const totalTime = getTotalTime(recipe.prep_time, recipe.cook_time);

          return (
            <Card key={recipe.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-semibold">{recipe.name}</h3>
                      <Badge className={`${getCategoryColor(category)} text-white`}>
                        {category}
                      </Badge>
                      {recipe.verified && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {recipe.needs_validation && !recipe.verified && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Needs Review
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{recipe.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700"
                      onClick={() => approveRecipe(recipe.id)}
                      disabled={recipe.verified}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700"
                      onClick={() => deleteRecipe(recipe.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className={totalTime > 30 && category === 'Quick and Easy' ? 'text-red-600 font-bold' : ''}>
                      {totalTime} min total
                    </span>
                  </div>
                  <div>Prep: {recipe.prep_time}</div>
                  <div>Cook: {recipe.cook_time}</div>
                  <div>Difficulty: {recipe.difficulty}</div>
                  <div>{recipe.ingredients.length} ingredients</div>
                  <div>{recipe.instructions.length} steps</div>
                  <div>{recipe.servings} servings</div>
                </div>

                {/* Validation Issues */}
                {issues.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
                    {issues.map((issue, idx) => (
                      <div key={idx} className="text-sm text-yellow-800">{issue}</div>
                    ))}
                  </div>
                )}

                {/* Category-Specific Info */}
                {category === 'Healthy Bowls' && recipe.nutrition && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="text-sm font-medium mb-1">Nutrition</div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>Calories: {recipe.nutrition.calories}</div>
                      <div>Protein: {recipe.nutrition.protein}g</div>
                      <div>Carbs: {recipe.nutrition.carbs}g</div>
                      <div>Fat: {recipe.nutrition.fat}g</div>
                    </div>
                  </div>
                )}

                {/* Expandable Details */}
                <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(recipe.id)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full">
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Show Details
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    {/* Ingredients */}
                    <div>
                      <h4 className="font-semibold mb-2">Ingredients</h4>
                      <ul className="space-y-1 text-sm">
                        {recipe.ingredients.map((ing: any, idx: number) => (
                          <li key={idx}>
                            {ing.amount} {ing.unit} {ing.name}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h4 className="font-semibold mb-2">Instructions</h4>
                      <ol className="space-y-2 text-sm list-decimal list-inside">
                        {recipe.instructions.map((step: string, idx: number) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="font-semibold mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {recipe.tags.map((tag: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          );
        })}

        {filteredRecipes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No recipes found matching your filters
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminRecipes;
