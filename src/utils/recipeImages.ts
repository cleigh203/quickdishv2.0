import { Recipe } from "@/types/recipe";

// Smart image mapping based on recipe content
// Local overrides to immediately reflect updated images on localhost
const imageOverrides: Record<string, string> = {
  "quick-tuscan-shrimp": "https://i.imgur.com/DbZzWVl.png",
  "quick-thai-basil-chicken": "https://i.imgur.com/njeoQZu.png",
  "quick-shrimp-stirfry": "https://i.imgur.com/laMTVMu.png",
  "quick-caprese-chicken": "https://i.imgur.com/G4KB35R.png",
  "quick-shrimp-scampi": "https://i.imgur.com/ry6O5R0.png",
  "quick-mongolian-beef": "https://i.imgur.com/38vSHb8.png",
  "quick-greek-chicken": "https://i.imgur.com/gkppx9G.png",
  "quick-pad-thai": "https://i.imgur.com/OZqGxHF.png",
  "quick-steak-bites": "https://i.imgur.com/9FOICSU.png",
  "leftover-fried-rice": "https://i.imgur.com/5jrWKDF.png",
  "leftover-pasta-carbonara": "https://i.imgur.com/AQ7SNIE.png",
  "teriyaki-chicken": "https://i.imgur.com/T4OZWKW.png",
  "maple-glazed-salmon": "https://i.imgur.com/gk4bJTS.png",
  "quick-two-ingredient-pici-pasta": "https://i.imgur.com/SldTS5S.png",
};

export const getRecipeImage = (recipe: Recipe & { ingredientInput?: string }, cacheBust: boolean = false): string => {
  // If AI-generated and no explicit image, return a neutral white placeholder (no random stock)
  if ((recipe as any).isAiGenerated && !recipe.imageUrl && !recipe.image) {
    // 1x1 white PNG data URI
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8////fwAJ/wP+3YtR6QAAAABJRU5ErkJggg==';
  }
  // Force override first so it wins regardless of source (static/DB/cached)
  if (recipe.id && imageOverrides[recipe.id]) {
    let url = imageOverrides[recipe.id];
    if (cacheBust && url && !url.startsWith('data:') && !url.includes('pexels.com') && !url.includes('unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}v=${Date.now()}`;
    }
    return url;
  }

  // Check imageUrl first (Halloween recipes)
  if (recipe.imageUrl && !recipe.imageUrl.includes('undefined')) {
    let url = recipe.imageUrl;
    if (cacheBust && !url.startsWith('data:') && !url.includes('pexels.com') && !url.includes('unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}v=${Date.now()}`;
    }
    return url;
  }

  // Check image second (generated recipes)
  if (recipe.image && !recipe.image.includes('undefined')) {
    let url = recipe.image;
    if (cacheBust && !url.startsWith('data:') && !url.includes('pexels.com') && !url.includes('unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}v=${Date.now()}`;
    }
    return url;
  }

  // As a fallback, try local dessert asset naming convention if image is missing
  if ((!recipe.imageUrl && !recipe.image) && recipe.id && recipe.id.startsWith('dessert-')) {
    return `/lovable-uploads/${recipe.id}.png`;
  }
  
  // Build a combined search string for better matching
  const title = (recipe.name || '').toLowerCase();
  const ingredients = (recipe.ingredientInput || '').toLowerCase();
  const searchText = `${title} ${ingredients}`;
  
  // VEGETARIAN/VEGAN dishes first
  if (searchText.includes('lentil') || searchText.includes('dal')) {
    return 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('veggie') || searchText.includes('vegetable') || searchText.includes('vegan')) {
    return 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('soup') && searchText.includes('lentil')) {
    return 'https://images.pexels.com/photos/1618888/pexels-photo-1618888.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('stew') && !searchText.includes('meat') && !searchText.includes('beef')) {
    return 'https://images.pexels.com/photos/6120503/pexels-photo-6120503.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  
  // SALADS
  if (title.includes('salad')) {
    return 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  
  // DESSERTS
  if (searchText.includes('apple pie')) {
    return 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('pumpkin pie')) {
    return 'https://images.pexels.com/photos/3992133/pexels-photo-3992133.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('cherry pie')) {
    return 'https://images.pexels.com/photos/5639931/pexels-photo-5639931.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('pie') && !searchText.includes('pizza')) {
    return 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('cheesecake')) {
    return 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('chocolate cake')) {
    return 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('cake') || searchText.includes('dessert')) {
    return 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('cookie')) {
    return 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('brownie')) {
    return 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  
  // MAIN DISHES
  if (searchText.includes('pasta')) {
    return 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('pizza')) {
    return 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('burger')) {
    return 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('sandwich')) {
    return 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('soup') && !searchText.includes('lentil')) {
    return 'https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('steak')) {
    return 'https://images.pexels.com/photos/361184/pexels-photo-361184.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  
  // BREAKFAST
  if (searchText.includes('pancake') || searchText.includes('waffle')) {
    return 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('eggs') && !searchText.includes('lentil')) {
    return 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('breakfast')) {
    return 'https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  
  // PROTEINS
  if (searchText.includes('chicken') && !searchText.includes('lentil')) {
    return 'https://images.pexels.com/photos/2994900/pexels-photo-2994900.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('beef')) {
    return 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('fish')) {
    return 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('shrimp')) {
    return 'https://images.pexels.com/photos/3843224/pexels-photo-3843224.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  if (searchText.includes('pork')) {
    return 'https://images.pexels.com/photos/793785/pexels-photo-793785.jpeg?auto=compress&cs=tinysrgb&w=600';
  }
  
  // Default variety images
  const defaultImages = [
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/718742/pexels-photo-718742.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg?auto=compress&cs=tinysrgb&w=600'
  ];
  
  const index = recipe.id ? 
    parseInt(recipe.id.toString().slice(-1)) % defaultImages.length : 
    Math.floor(Math.random() * defaultImages.length);
  
  return defaultImages[index];
};