const fs = require( fs);
const path = src/pages/Generate.tsx;
let content = fs.readFileSync(path, utf8);

const oldBlock = \n  // Function to get recipes for each category\n  // CATEGORY-BASED: All categories use the category field\n  const getRecipesByCategory = (categoryId: string): Recipe[] => {\n    switch (categoryId) {\n      // CATEGORY-BASED FILTERS\n      case 'quick':\n        return combinedRecipes.filter(r => r.category === 'Quick and Easy');\n      \n      case 'cleaneats':\n        return combinedRecipes.filter(r => r.category === 'Clean Eats');\n      \n      case 'fall':\n        return combinedRecipes.filter(r => r.category === 'Fall Favorites');\n      \n      case 'onepot':\n        return combinedRecipes.filter(r => r.category === 'One Pot Meals');\n      \n      case 'family':\n        return combinedRecipes.filter(r => r.category === 'Family Approved');\n      \n      case 'leftover':\n        return combinedRecipes.filter(r => r.tags?.includes('leftover'));\n      \n      // CATEGORY-BASED FILTERS (Main Meal Types)\n      case 'breakfast':\n        return combinedRecipes.filter(r => r.category === 'Breakfast');\n      \n      case 'dessert':\n        return combinedRecipes.filter(r => r.category === 'Desserts');\n      \n      case 'copycat':\n        return combinedRecipes.filter(r => r.category === 'Restaurant Copycats');\n      \n      default:\n        return [];\n    }\n  };\n;

const newBlock = \n  // Function to get recipes for each category\n  const getRecipesByCategory = (categoryId: string): Recipe[] => {\n    switch (categoryId) {\n      // --- TAG-BASED FILTERS ---\n      case 'quick': // For Quick and Easy\n        return combinedRecipes.filter(r => r.tags?.includes('quick'));\n        \n      case 'onepot': // For One Pot Meals\n        return combinedRecipes.filter(r => r.tags?.includes('one-pot'));\n      \n      case 'family': // For Family Approved\n        return combinedRecipes.filter(r => \n          r.tags?.includes('family-friendly') || r.tags?.includes('kid-friendly')\n        );\n\n      // --- CATEGORY-BASED FILTERS ---\n      case 'fall': // 👈 **FIXED**: Checks category Fall Favorites\n        return combinedRecipes.filter(r => r.category === 'Fall Favorites');\n        \n      case 'cleaneats': // 👈 **FIXED**: Now includes Clean Eats\n        return combinedRecipes.filter(r => r.category === 'Clean Eats');\n\n      case 'breakfast': // For Breakfast\n        return combinedRecipes.filter(r => r.category === 'Breakfast');\n      \n      case 'copycat': // For Restaurant Copycats\n        return combinedRecipes.filter(r => r.category === 'Restaurant Copycats');\n      \n      default:\n        return [];\n    }\n  };\n;

if (!content.includes(oldBlock)) {
  console.error(Old block not found);
  process.exit(1);
}

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(path, content);
