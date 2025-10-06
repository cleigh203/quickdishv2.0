import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BottomNav } from "@/components/BottomNav";

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white py-12 px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold mb-2">Help & FAQ</h1>
          <p className="text-white/90">Find answers to common questions</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Getting Started */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🚀 Getting Started
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="create-account" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I create an account?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Tap "Sign Up," enter your email and password, and you're ready to cook! Takes less than 30 seconds.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="free-to-use" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Is QuickDish free to use?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! QuickDish is completely free with access to 350+ recipes, meal planning, shopping lists, and cooking mode. Premium ($2.99/month) adds AI chat and nutritional facts.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tutorial-again" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I see the tutorial again?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Go to Profile → Help & Support → "Show Tutorial Again"
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Using Recipes */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🍳 Using Recipes
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="find-recipes" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I find recipes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Browse by category from the home screen, or use the search bar at the top. You can also filter by meal type, cooking time, or difficulty.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="save-favorites" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Can I save my favorite recipes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Open any recipe, tap the three dots (•••) at the top right, then select "Add to Saved."
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="saved-recipes" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Where are my saved recipes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Tap the "Favorites" or "Saved" tab in the main navigation to see all saved recipes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="modify-recipes" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Can I modify recipes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can add personal notes to any recipe using "Add Notes" in the three-dot menu.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="share-recipe" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I share a recipe with friends?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Open the recipe, tap the three dots (•••), and select "Share Recipe."
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="print-recipe" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Can I print recipes?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Use the "Export as PDF" option in the three-dot menu, then print from your device.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Cooking Mode */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🎙️ Cooking Mode
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="what-cooking-mode" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                What is Cooking Mode?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Cooking Mode provides hands-free, step-by-step voice instructions while you cook. No need to touch your phone with messy hands!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="start-cooking-mode" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I start Cooking Mode?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Open any recipe, tap the three dots (•••), and select "Start Cooking Mode."
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="voice-commands" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                What voice commands work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Try saying: "Next step," "Previous step," "Repeat that," or "Set timer for 10 minutes."
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="voice-not-working" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Voice commands aren't working. Help!
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Make sure microphone permissions are enabled for QuickDish in your device settings. Also check that your volume is turned up.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Meal Planning */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📅 Meal Planning
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="meal-planning-work" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How does meal planning work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Open any recipe, tap the three dots (•••), select "Add to Meal Plan," and choose which day to add it to.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="multiple-meals" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Can I plan multiple meals per day?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Add breakfast, lunch, dinner, and snacks to each day of the week.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="view-meal-plan" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I view my meal plan?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Tap the "Meal Plan" or calendar icon in the main navigation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="remove-meal" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I remove a meal from my plan?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Tap the meal in your calendar and select "Remove" or tap the X/trash icon.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="move-meals" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Can I move meals to different days?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Long-press a meal and drag it to a new day, or remove and re-add it.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Shopping Lists */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🛒 Shopping Lists
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="create-shopping-list" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I create a shopping list?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Go to your Meal Plan and tap "Generate Shopping List." All ingredients from your planned meals will be added automatically.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="add-custom-items" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Can I add my own items to the shopping list?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Tap the "+" button on the Shopping List page to add custom items.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="check-off-items" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I check off items while shopping?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Tap the checkbox next to each item as you add it to your cart.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delete-items" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Can I delete items from the list?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, swipe left on any item or tap the trash icon to remove it.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="multiple-lists" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Can I have multiple shopping lists?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Currently, QuickDish supports one active shopping list. Check off completed items to clear them.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Pantry Management */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🥫 Pantry Management
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="what-pantry" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                What is the Pantry feature?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Track ingredients you already have at home so you don't buy duplicates when shopping.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="access-pantry" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I access my pantry?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Go to Profile → "My Pantry"
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="add-pantry-items" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I add items to my pantry?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                In your pantry, tap "+ Add Items" then choose: Add Common Staples (quick-add essentials) or Add Manually (type item details).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="organize-pantry" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Can I organize my pantry by category?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Items are automatically organized into categories like Staples, Produce, Proteins, Dairy, etc.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="edit-pantry-items" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I edit or delete pantry items?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Swipe left on any item to delete, or tap the item to edit details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="common-staples" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                What are "Common Staples"?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                A quick way to add 20+ common pantry items like flour, sugar, olive oil, salt, pepper, etc. Just check the items you have and add them all at once!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Premium Features */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            💎 Premium Features
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="premium-included" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                What's included with Premium?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>AI Chat: Ask cooking questions and get instant answers</li>
                  <li>Nutritional Facts: Detailed nutrition info for all recipes</li>
                  <li>Early Access: Try new features before everyone else</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="premium-cost" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How much does Premium cost?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                $4.99 per month with automatic renewal. Cancel anytime.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="upgrade-premium" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I upgrade to Premium?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Go to Profile → Subscription → "Upgrade to Premium" and follow the payment process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cancel-premium" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Can I cancel my Premium subscription?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! Go to Profile → Subscription → "Cancel Subscription." You'll keep access until the end of your billing period.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="refund-premium" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                Do I get a refund if I cancel?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No refunds for partial months, but you keep access until your current period ends.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="restore-premium" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I restore my Premium subscription on a new device?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Go to Profile → Subscription → "Restore Purchases"
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* AI Chat */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🤖 AI Chat (Premium)
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="use-ai-chat" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                How do I use AI Chat?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Open any recipe, tap the three dots (•••), then select "Ask AI About This Recipe."
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ask-ai" className="bg-card rounded-lg px-4">
              <AccordionTrigger className="text-left">
                What can I ask the AI?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  <li>Ingredient substitutions (e.g., "Can I use honey instead of sugar?")</li>
                  <li>Cooking techniques (e.g., "How do I properly sauté onions?")</li>
                  <li>Recipe modifications (e.g., "How can I make this vegan?")</li>
                  <li>Timing questions (e.g., "Can I prep this ahead?")</li>
                  <li>Equipment alternatives (e.g., "I don't have a stand mixer")</li>
                  <li>Scaling recipes (e.g., "How do I double this recipe?")</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Help;
