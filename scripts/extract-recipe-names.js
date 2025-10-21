import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractRecipeNames() {
  console.log('📋 Extracting all recipe names for bulk migration...\n');

  const recipeFiles = [
    { file: 'src/data/recipes.ts', name: 'Main Recipes' },
    { file: 'src/data/newRecipes.ts', name: 'New Recipes' },
    { file: 'src/data/halloweenRecipes.ts', name: 'Halloween Recipes' }
  ];

  const allNames = [];

  for (const { file, name } of recipeFiles) {
    console.log(`🔍 Processing ${name}...`);
    const filePath = path.join(__dirname, '..', file);

    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Extract recipe names using regex
      const nameMatches = content.match(/name:\s*"([^"]+)"/g);

      if (nameMatches) {
        const names = nameMatches.map(match => match.replace(/name:\s*"/, '').replace(/"/, ''));
        allNames.push(...names);
        console.log(`✅ Found ${names.length} recipes in ${name}`);
      } else {
        console.log(`⚠️  No recipe names found in ${name}`);
      }
    } catch (error) {
      console.log(`❌ Error reading ${file}:`, error.message);
    }
  }

  console.log(`\n📊 TOTAL RECIPES FOUND: ${allNames.length}`);
  console.log('\n📋 RECIPE NAMES FOR MIGRATION:');
  console.log('=====================================');
  allNames.forEach(name => console.log(name));

  // Save to a file for easy copying
  const outputFile = path.join(__dirname, '..', 'recipe-names-for-migration.txt');
  fs.writeFileSync(outputFile, allNames.join('\n'));

  console.log(`\n💾 Recipe names saved to: ${outputFile}`);
  console.log('📋 Copy these names and paste them into the migration form in your app');

  return allNames;
}

// Run the extraction
extractRecipeNames();





