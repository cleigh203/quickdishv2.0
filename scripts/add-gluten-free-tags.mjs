import fs from 'fs';

const glutenIngredients = [
  'bread', 'flour', 'pasta', 'noodles', 'spaghetti', 'penne', 'fettuccine',
  'tortilla', 'wrap', 'pita', 'bagel', 'bun', 'roll', 'crouton',
  'breading', 'breadcrumb', 'panko', 'couscous', 'orzo', 'ramen',
  'wheat', 'barley', 'rye', 'malt', 'seitan', 'soy sauce', 'baguette',
  'ciabatta', 'croissant', 'sandwich', 'burger bun', 'english muffin'
];

const files = ['src/data/recipes.ts', 'src/data/newRecipes.ts'];
let totalUpdated = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = 0;
  
  // Find all recipe blocks with a simpler pattern
  const lines = content.split('\n');
  let inRecipe = false;
  let recipeStart = -1;
  let recipeId = '';
  let recipeTags = '';
  let recipeIngredients = '';
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect recipe start
    if (line.trim().match(/^\{$/)) {
      inRecipe = true;
      recipeStart = i;
      braceCount = 1;
      recipeId = '';
      recipeTags = '';
      recipeIngredients = '';
      continue;
    }
    
    if (inRecipe) {
      // Track braces
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;
      
      // Extract ID
      const idMatch = line.match(/id:\s*["']([^"']+)["']/);
      if (idMatch) {
        recipeId = idMatch[1];
      }
      
      // Extract tags line
      const tagsMatch = line.match(/tags:\s*\[([^\]]*)\]/);
      if (tagsMatch) {
        recipeTags = tagsMatch[1];
      }
      
      // Collect ingredients
      if (line.includes('ingredients:')) {
        let j = i;
        while (j < lines.length && !lines[j].includes(']')) {
          recipeIngredients += lines[j].toLowerCase();
          j++;
        }
        recipeIngredients += lines[j].toLowerCase();
      }
      
      // Recipe end
      if (braceCount === 0) {
        inRecipe = false;
        
        // Check if should add glutenfree tag
        if (recipeId && recipeTags && recipeIngredients) {
          const hasGlutenFreeTag = recipeTags.includes('glutenfree') || recipeTags.includes('gluten-free');
          const hasGluten = glutenIngredients.some(glutenIng => 
            recipeIngredients.includes(glutenIng.toLowerCase())
          );
          
          if (!hasGlutenFreeTag && !hasGluten && recipeIngredients.length > 50) {
            // Find the tags line and add glutenfree
            for (let k = recipeStart; k <= i; k++) {
              if (lines[k].includes('tags: [')) {
                const currentTags = lines[k].match(/tags:\s*\[([^\]]*)\]/)[1];
                const newTags = currentTags.trim() ? currentTags + ', "glutenfree"' : '"glutenfree"';
                lines[k] = lines[k].replace(/tags:\s*\[([^\]]*)\]/, `tags: [${newTags}]`);
                console.log(`✅ Added glutenfree to: ${recipeId}`);
                updated++;
                break;
              }
            }
          }
        }
      }
    }
  }
  
  content = lines.join('\n');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`\n📁 ${file}: Updated ${updated} recipes`);
  totalUpdated += updated;
});

console.log(`\n🎉 Total recipes updated: ${totalUpdated}`);




