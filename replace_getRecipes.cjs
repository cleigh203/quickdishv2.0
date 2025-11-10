const fs = require('fs');
const path = 'src/pages/Generate.tsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
const start = lines.findIndex(line => line.includes('// Function to get recipes for each category'));
if (start === -1) {
  console.error('Marker line not found');
  process.exit(1);
}
const funcStart = lines.findIndex((line, idx) => idx >= start && line.includes('const getRecipesByCategory'));
if (funcStart === -1) {
  console.error('Function definition not found');
  process.exit(1);
}
let end = funcStart;
while (end < lines.length && !lines[end].trim().endsWith('};')) {
  end++;
}
if (end >= lines.length) {
  console.error('Function end not found');
  process.exit(1);
}
const newBlock = [
  '  // Function to get recipes for each category',
  '  const getRecipesByCategory = (categoryId: string): Recipe[] => {',
  '    switch (categoryId) {',
  '      // --- TAG-BASED FILTERS ---',
  '      case " quick\: // For Quick and Easy',
 ' return combinedRecipes.filter(r => r.tags?.includes(\quick\));',
 ' ',
 ' case \onepot\: // For One Pot Meals',
 ' return combinedRecipes.filter(r => r.tags?.includes(\one-pot\));',
 ' ',
 ' case \family\: // For Family Approved',
 ' return combinedRecipes.filter(r => ',
 ' r.tags?.includes(\family-friendly\) || r.tags?.includes(\kid-friendly\)',
 ' );',
 '',
 ' // --- CATEGORY-BASED FILTERS ---',
 ' case \fall\: // 👈 **FIXED**: Checks category Fall Favorites',
 ' return combinedRecipes.filter(r => r.category === \Fall Favorites\);',
 ' ',
 ' case \cleaneats\: // 👈 **FIXED**: Now includes Clean Eats',
 ' return combinedRecipes.filter(r => r.category === \Clean Eats\);',
 '',
 ' case \breakfast\: // For Breakfast',
 ' return combinedRecipes.filter(r => r.category === \Breakfast\);',
 ' ',
 ' case \copycat\: // For Restaurant Copycats',
 ' return combinedRecipes.filter(r => r.category === \Restaurant Copycats\);',
 ' ',
 ' default:',
 ' return [];',
 ' }',
 ' };'
];
lines.splice(start, end - start + 1, ...newBlock);
fs.writeFileSync(path, lines.join('\r\n'));
