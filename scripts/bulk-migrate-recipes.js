import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://cyfzllfiuqhtesgwbxyo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5ZnpsbGZpdXFodGVzZ3dieHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDI0MTgsImV4cCI6MjA3NDgxODQxOH0.Ko3gcB6BQ6Jod-vgQHv7gDFvpgAzhy_ozVSpdAmN0q4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function bulkMigrateRecipes() {
  console.log('🚀 Starting bulk recipe migration to Supabase...');
  console.log('📊 This will upload 420+ recipes with AI-generated images');
  console.log('⏱️  This process may take 10-15 minutes...\n');

  try {
    // Test the Supabase function first with a simple recipe
    console.log('🔧 Testing Supabase connection and migration function...');

    // Simple test recipe to verify the function works
    const testRecipe = {
      id: "test-bulk-migration",
      name: "Bulk Migration Test Recipe",
      description: "Testing the bulk migration functionality",
      cookTime: "30 mins",
      prepTime: "15 mins",
      difficulty: "medium",
      servings: 4,
      ingredients: [
        { amount: "1", unit: "cup", item: "test ingredient" }
      ],
      instructions: ["Mix ingredients", "Cook for 30 minutes", "Serve hot"],
      cuisine: "American",
      tags: ["test", "bulk-migration"]
    };

    console.log('🌐 Calling Supabase migration function with test recipe...');

    const { data: testData, error: testError } = await supabase.functions.invoke('migrate-static-recipes', {
      body: { recipes: [testRecipe] }
    });

    if (testError) {
      console.error('❌ Test migration failed:', testError);
      console.log('💡 Make sure the migrate-static-recipes function is deployed in Supabase');
      return;
    }

    if (testData && testData.successCount > 0) {
      console.log('✅ Supabase function is working! Ready for bulk migration.');
    } else {
      console.log('⚠️  Test completed but no recipes were processed');
      return;
    }

    console.log('\n🎯 Next Steps:');
    console.log('1. 📱 Open your app at http://localhost:8080/');
    console.log('2. 🔧 Navigate to: http://localhost:8080/admin/migrate-recipes');
    console.log('3. 📋 In the migration form, enter ALL recipe names (one per line)');
    console.log('4. 🚀 Click "Migrate Recipes with Ultra-Realistic Images"');
    console.log('\n💡 TIP: Copy all recipe names from your recipe files and paste them in');

  } catch (error) {
    console.error('💥 Migration script error:', error);
  }
}

// Run the test
bulkMigrateRecipes();
