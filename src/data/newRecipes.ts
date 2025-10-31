import { Recipe } from "@/types/recipe";

// Placeholder images - will be generated in batches
const placeholderImg = "https://via.placeholder.com/400x300/10b981/ffffff?text=QuickDish";

// Dessert Images
import dessertChocolateTrufflesImg from "@/assets/recipes/dessert-chocolate-truffles.jpg";
import dessertChocolateFondueImg from "@/assets/recipes/dessert-chocolate-fondue.jpg";
import dessertPeachCobblerImg from "@/assets/recipes/dessert-peach-cobbler.jpg";
import dessertPumpkinCheesecakeImg from "@/assets/recipes/dessert-pumpkin-cheesecake.jpg";
import dessertBananaBreadChocolateImg from "@/assets/recipes/dessert-banana-bread-chocolate.jpg";
import dessertChocolateSouffleImg from "@/assets/recipes/dessert-chocolate-souffle.jpg";
import dessertStrawberryShortcakeImg from "@/assets/recipes/dessert-strawberry-shortcake.jpg";
import dessertCremeCaramelImg from "@/assets/recipes/dessert-creme-caramel.jpg";
const dessertCookieDoughBrowniesImg = "https://i.imgur.com/APa5Q7p.png";
import dessertRaspberryTartImg from "@/assets/recipes/dessert-raspberry-tart.jpg";
import dessertChocolateMousseCakeImg from "@/assets/recipes/dessert-chocolate-mousse-cake.jpg";
import dessertLemonMeringuePieImg from "@/assets/recipes/dessert-lemon-meringue-pie.jpg";
import dessertBostonCreamPieImg from "@/assets/recipes/dessert-boston-cream-pie.jpg";
import dessertBiscottiImg from "@/assets/recipes/dessert-biscotti.jpg";
import dessertSaltedCaramelTartImg from "@/assets/recipes/dessert-salted-caramel-tart.jpg";
import dessertStickyToffeePuddingImg from "@/assets/recipes/dessert-sticky-toffee-pudding.jpg";
import dessertOperaCakeImg from "@/assets/recipes/dessert-opera-cake.jpg";
import dessertRaspberryWhiteChocolateCheesecakeImg from "@/assets/recipes/dessert-raspberry-white-chocolate-cheesecake.jpg";
import dessertSmoresBarsImg from "@/assets/recipes/dessert-smores-bars.jpg";
import dessertCoconutCreamPieImg from "@/assets/recipes/dessert-coconut-cream-pie.jpg";

// Lunch Images
// import lunchChickenShawarmaWrapImg from "@/assets/recipes/lunch-chicken-shawarma-wrap.jpg";
// import lunchSouthwestChickenBowlImg from "@/assets/recipes/lunch-southwest-chicken-bowl.jpg";
import lunchTunaNicoiseSaladImg from "@/assets/recipes/lunch-tuna-nicoise-salad.jpg";
const lunchCaliforniaRollBowlImg = "https://i.imgur.com/jnWJP9g.png";
import lunchMediterraneanQuinoaBowlImg from "@/assets/recipes/lunch-mediterranean-quinoa-bowl.jpg";
// import lunchBanhMiSandwichImg from "@/assets/recipes/banh-mi-sandwich.jpg";

// Quick & Easy Images
// import quickBuffaloChickenWrapImg from "@/assets/recipes/quick-buffalo-chicken-wrap.jpg";
const quickGreekSaladChickenImg = "https://i.imgur.com/gkppx9G.png";
import quickTurkeyAvocadoClubImg from "@/assets/recipes/quick-turkey-avocado-club.jpg";
import quickCapresePaniniImg from "@/assets/recipes/quick-caprese-panini.jpg";
const quickBbqPulledPorkImg = "https://i.imgur.com/CgEPf5L.png";
const quickFalafelPitaImg = "https://i.imgur.com/2UtV6mM.png";
import quickChickenCaesarImg from "@/assets/recipes/quick-chicken-caesar.jpg";
// import quickMargheritaFlatbreadImg from "@/assets/recipes/quick-margherita-flatbread.jpg";
// import quickCobbSaladImg from "@/assets/recipes/quick-cobb-salad.jpg";
import quickPestoPastaSaladImg from "@/assets/recipes/quick-pesto-pasta-salad.jpg";
// import quickKoreanBbqBowlImg from "@/assets/recipes/quick-korean-bbq-bowl.jpg";
// import quickShrimpPoBoyImg from "@/assets/recipes/quick-shrimp-po-boy.jpg";
// import quickTomatoSoupGrilledCheeseImg from "@/assets/recipes/quick-tomato-soup-grilled-cheese.jpg";

// One-Pot Wonders Images
import onePotChickenDumplingsImg from "@/assets/recipes/one-pot-chicken-dumplings.jpg";
// import onePotBeefBourguignonImg from "@/assets/recipes/one-pot-beef-bourguignon.jpg";
import onePotCreamyTuscanChickenImg from "@/assets/recipes/one-pot-creamy-tuscan-chicken.jpg";
// import onePotChiliConCarneImg from "@/assets/recipes/one-pot-chili-con-carne.jpg";
import onePotSeafoodPaellaImg from "@/assets/recipes/one-pot-seafood-paella.jpg";
import onePotChickenCacciatoreImg from "@/assets/recipes/one-pot-chicken-cacciatore.jpg";
// import onePotMoroccanTagineImg from "@/assets/recipes/one-pot-moroccan-tagine.jpg";
// import onePotTuscanWhiteBeanSoupImg from "@/assets/recipes/one-pot-tuscan-white-bean-soup.jpg";
// import onePotChickenTikkaMasalaImg from "@/assets/recipes/one-pot-chicken-tikka-masala.jpg";
import onePotPotRoastImg from "@/assets/recipes/one-pot-pot-roast.jpg";

export const newRecipes: Recipe[] = [
  // ========== DESSERTS (20) ==========
  {
    id: "dessert-chocolate-souffle",
    name: "Chocolate Soufflé",
    description: "Light and airy French chocolate dessert that rises beautifully.",
    cookTime: "20 mins",
    prepTime: "20 mins",
    difficulty: "hard",
    servings: 4,
    cuisine: "French",
    image: "https://i.imgur.com/xfbQZnq.png",
    totalTime: 40,
    tags: ["dessert", "chocolate", "french", "elegant", "vegetarian", "glutenfree"],
    nutrition: { calories: 320, protein: 8, carbs: 38, fat: 16, fiber: 3, sugar: 28, servingSize: "1 soufflé" },
    ingredients: [
      { amount: "4", unit: "oz", item: "dark chocolate, chopped" },
      { amount: "3", unit: "tbsp", item: "butter" },
      { amount: "3", unit: "", item: "eggs, separated" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "1", unit: "tbsp", item: "cocoa powder" },
      { amount: "1/4", unit: "tsp", item: "cream of tartar" }
    ],
    instructions: [
      "Preheat oven to 375°F. Butter and sugar 4 ramekins.",
      "Melt chocolate and butter together, let cool slightly.",
      "Whisk egg yolks with half the sugar until thick.",
      "Beat egg whites with cream of tartar until soft peaks.",
      "Gradually add remaining sugar, beat until stiff peaks.",
      "Fold chocolate mixture into yolks, then gently fold in whites.",
      "Divide among ramekins, run thumb around rim.",
      "Bake 15-18 minutes until puffed. Serve immediately."
    ]
  },
  {
    id: "dessert-strawberry-shortcake",
    name: "Strawberry Shortcake",
    description: "Classic American dessert with fluffy biscuits and fresh berries.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "American",
    image: dessertStrawberryShortcakeImg,
    totalTime: 35,
    tags: ["dessert", "summer", "berries", "classic", "vegetarian"],
    nutrition: { calories: 385, protein: 5, carbs: 52, fat: 18, fiber: 3, sugar: 28, servingSize: "1 shortcake" },
    ingredients: [
      { amount: "2", unit: "cups", item: "all-purpose flour" },
      { amount: "1/3", unit: "cup", item: "sugar" },
      { amount: "1", unit: "tbsp", item: "baking powder" },
      { amount: "1/2", unit: "cup", item: "cold butter, cubed" },
      { amount: "2/3", unit: "cup", item: "milk" },
      { amount: "1", unit: "lb", item: "strawberries, sliced" },
      { amount: "2", unit: "cups", item: "heavy cream, whipped" }
    ],
    instructions: [
      "Preheat oven to 425°F.",
      "Mix flour, 2 tbsp sugar, baking powder, and salt.",
      "Cut in butter until mixture resembles coarse crumbs.",
      "Stir in milk until just combined.",
      "Drop onto baking sheet, bake 12-15 minutes.",
      "Toss strawberries with remaining sugar.",
      "Split shortcakes, fill with berries and cream."
    ]
  },
  {
    id: "dessert-creme-caramel",
    name: "Crème Caramel",
    description: "Silky smooth French custard with golden caramel sauce.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "French",
    image: "https://i.imgur.com/TmVkeFb.png",
    totalTime: 60,
    tags: ["dessert", "custard", "french", "elegant", "vegetarian", "glutenfree"],
    nutrition: { calories: 295, protein: 7, carbs: 38, fat: 12, fiber: 0, sugar: 35, servingSize: "1 custard" },
    ingredients: [
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "2", unit: "cups", item: "whole milk" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "1/4", unit: "cup", item: "water" }
    ],
    instructions: [
      "Make caramel: Cook 3/4 cup sugar with water until amber.",
      "Pour into 6 ramekins, swirl to coat bottoms.",
      "Whisk eggs with remaining sugar and vanilla.",
      "Heat milk until steaming, slowly whisk into eggs.",
      "Strain custard into ramekins.",
      "Bake in water bath at 325°F for 40-45 minutes.",
      "Chill 4 hours, invert to serve."
    ]
  },
  {
    id: "dessert-cookie-dough-brownies",
    name: "Cookie Dough Brownies",
    description: "Fudgy brownies topped with edible cookie dough and ganache.",
    cookTime: "30 mins",
    prepTime: "25 mins",
    difficulty: "medium",
    servings: 16,
    cuisine: "American",
    image: dessertCookieDoughBrowniesImg,
    totalTime: 55,
    tags: ["dessert", "chocolate", "decadent", "crowd-pleaser", "vegetarian"],
    nutrition: { calories: 425, protein: 5, carbs: 54, fat: 22, fiber: 2, sugar: 38, servingSize: "1 brownie" },
    ingredients: [
      { amount: "1", unit: "box", item: "brownie mix" },
      { amount: "1/2", unit: "cup", item: "butter, softened" },
      { amount: "3/4", unit: "cup", item: "brown sugar" },
      { amount: "1", unit: "cup", item: "heat-treated flour" },
      { amount: "2", unit: "tbsp", item: "milk" },
      { amount: "1", unit: "cup", item: "mini chocolate chips" },
      { amount: "1", unit: "cup", item: "chocolate chips for ganache" },
      { amount: "1/2", unit: "cup", item: "heavy cream" }
    ],
    instructions: [
      "Bake brownies according to package, cool completely.",
      "Beat butter and brown sugar until fluffy.",
      "Mix in flour, milk, and chips for cookie dough.",
      "Spread over cooled brownies, refrigerate 30 minutes.",
      "Heat cream, pour over chocolate chips, stir smooth.",
      "Pour ganache over cookie dough layer.",
      "Refrigerate 2 hours before cutting."
    ]
  },
  {
    id: "dessert-raspberry-tart",
    name: "Raspberry Tart",
    description: "Buttery tart shell with pastry cream and fresh raspberries.",
    cookTime: "25 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "French",
    image: dessertRaspberryTartImg,
    totalTime: 55,
    tags: ["dessert", "berries", "french", "elegant", "vegetarian"],
    nutrition: { calories: 365, protein: 6, carbs: 48, fat: 17, fiber: 4, sugar: 26, servingSize: "1 slice" },
    ingredients: [
      { amount: "1 1/4", unit: "cups", item: "all-purpose flour" },
      { amount: "1/2", unit: "cup", item: "cold butter" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "2", unit: "cups", item: "milk" },
      { amount: "4", unit: "", item: "egg yolks" },
      { amount: "1/3", unit: "cup", item: "sugar" },
      { amount: "3", unit: "tbsp", item: "cornstarch" },
      { amount: "2", unit: "cups", item: "fresh raspberries" }
    ],
    instructions: [
      "Make crust: Mix flour, butter, sugar until crumbly.",
      "Press into tart pan, bake at 350°F for 20 minutes.",
      "Make pastry cream: Whisk yolks, sugar, cornstarch.",
      "Heat milk, slowly whisk into yolk mixture.",
      "Cook until thick, cool completely.",
      "Spread cream in tart shell.",
      "Arrange raspberries on top, brush with glaze."
    ]
  },
  {
    id: "dessert-chocolate-mousse-cake",
    name: "Chocolate Mousse Cake",
    description: "Rich chocolate cake layered with airy chocolate mousse.",
    cookTime: "35 mins",
    prepTime: "30 mins",
    difficulty: "hard",
    servings: 12,
    cuisine: "French",
    image: dessertChocolateMousseCakeImg,
    totalTime: 65,
    tags: ["dessert", "chocolate", "elegant", "showstopper", "vegetarian", "glutenfree"],
    nutrition: { calories: 485, protein: 7, carbs: 52, fat: 28, fiber: 3, sugar: 38, servingSize: "1 slice" },
    ingredients: [
      { amount: "1", unit: "box", item: "chocolate cake mix" },
      { amount: "8", unit: "oz", item: "dark chocolate" },
      { amount: "2", unit: "cups", item: "heavy cream" },
      { amount: "4", unit: "", item: "eggs, separated" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "1", unit: "tsp", item: "vanilla extract" }
    ],
    instructions: [
      "Bake cake according to package, cool and slice horizontally.",
      "Melt chocolate, let cool slightly.",
      "Beat egg yolks with sugar until thick.",
      "Whip cream to soft peaks.",
      "Beat egg whites to stiff peaks.",
      "Fold chocolate into yolks, then fold in cream and whites.",
      "Layer cake with mousse, refrigerate 4 hours."
    ]
  },
  {
    id: "dessert-lemon-meringue-pie",
    name: "Lemon Meringue Pie",
    description: "Tangy lemon curd topped with fluffy toasted meringue.",
    cookTime: "30 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "American",
    image: dessertLemonMeringuePieImg,
    totalTime: 60,
    tags: ["dessert", "citrus", "classic", "showstopper", "vegetarian", "glutenfree"],
    nutrition: { calories: 395, protein: 6, carbs: 62, fat: 14, fiber: 1, sugar: 42, servingSize: "1 slice" },
    ingredients: [
      { amount: "1", unit: "", item: "pie crust, pre-baked" },
      { amount: "1 1/2", unit: "cups", item: "sugar" },
      { amount: "6", unit: "tbsp", item: "cornstarch" },
      { amount: "1 1/2", unit: "cups", item: "water" },
      { amount: "4", unit: "", item: "egg yolks" },
      { amount: "1/2", unit: "cup", item: "lemon juice" },
      { amount: "2", unit: "tbsp", item: "lemon zest" },
      { amount: "4", unit: "", item: "egg whites" },
      { amount: "1/2", unit: "cup", item: "sugar" }
    ],
    instructions: [
      "Mix 1 1/2 cups sugar and cornstarch in saucepan.",
      "Gradually stir in water, cook until thick.",
      "Whisk egg yolks, add hot mixture slowly.",
      "Return to pan, cook 2 minutes, remove from heat.",
      "Stir in lemon juice and zest, pour into crust.",
      "Beat egg whites to soft peaks, add 1/2 cup sugar.",
      "Spread meringue over filling, seal edges.",
      "Bake at 350°F for 12-15 minutes until golden."
    ]
  },
  {
    id: "dessert-boston-cream-pie",
    name: "Boston Cream Pie",
    description: "Vanilla cake with custard filling and chocolate glaze.",
    cookTime: "30 mins",
    prepTime: "25 mins",
    difficulty: "medium",
    servings: 10,
    cuisine: "American",
    image: dessertBostonCreamPieImg,
    totalTime: 55,
    tags: ["dessert", "classic", "custard", "chocolate", "vegetarian", "glutenfree"],
    nutrition: { calories: 395, protein: 6, carbs: 54, fat: 17, fiber: 1, sugar: 36, servingSize: "1 slice" },
    ingredients: [
      { amount: "1", unit: "box", item: "yellow cake mix" },
      { amount: "2", unit: "cups", item: "milk" },
      { amount: "1", unit: "box", item: "vanilla pudding mix" },
      { amount: "1", unit: "cup", item: "chocolate chips" },
      { amount: "1/2", unit: "cup", item: "heavy cream" }
    ],
    instructions: [
      "Bake cake in two 9-inch rounds, cool completely.",
      "Make custard: Cook pudding with milk until thick.",
      "Chill custard completely.",
      "Place one cake layer on plate, spread with custard.",
      "Top with second layer.",
      "Heat cream, pour over chocolate chips, stir smooth.",
      "Pour glaze over top, let set before serving."
    ]
  },
  {
    id: "dessert-peach-cobbler",
    name: "Peach Cobbler",
    description: "Warm peaches topped with buttery biscuit crust.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "American",
    image: dessertPeachCobblerImg,
    totalTime: 60,
    tags: ["dessert", "fruit", "comfort-food", "summer", "vegetarian"],
    nutrition: { calories: 365, protein: 4, carbs: 62, fat: 12, fiber: 3, sugar: 42, servingSize: "1 serving" },
    ingredients: [
      { amount: "6", unit: "cups", item: "sliced peaches" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "1", unit: "cup", item: "milk" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "2", unit: "tsp", item: "baking powder" },
      { amount: "1", unit: "tsp", item: "cinnamon" }
    ],
    instructions: [
      "Preheat oven to 350°F.",
      "Pour melted butter into 9x13 dish.",
      "Mix flour, 3/4 cup sugar, baking powder, and milk.",
      "Pour batter over butter (don't stir).",
      "Toss peaches with remaining sugar and cinnamon.",
      "Spoon peaches over batter (don't stir).",
      "Bake 40-45 minutes until golden. Serve warm."
    ]
  },
  {
    id: "dessert-chocolate-truffles",
    name: "Chocolate Truffles",
    description: "Rich ganache rolled in cocoa powder for elegant bites.",
    cookTime: "5 mins",
    prepTime: "20 mins",
    difficulty: "easy",
    servings: 24,
    cuisine: "French",
    image: dessertChocolateTrufflesImg,
    totalTime: 25,
    tags: ["dessert", "chocolate", "elegant", "gift-worthy", "vegetarian", "glutenfree"],
    nutrition: { calories: 95, protein: 1, carbs: 8, fat: 7, fiber: 1, sugar: 6, servingSize: "1 truffle" },
    ingredients: [
      { amount: "8", unit: "oz", item: "dark chocolate, chopped" },
      { amount: "1/2", unit: "cup", item: "heavy cream" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "1/2", unit: "cup", item: "cocoa powder for rolling" }
    ],
    instructions: [
      "Heat cream until simmering.",
      "Pour over chopped chocolate, let sit 2 minutes.",
      "Stir until smooth, add butter and vanilla.",
      "Refrigerate 2 hours until firm.",
      "Scoop into balls, roll in cocoa powder.",
      "Store in refrigerator up to 2 weeks."
    ]
  },
  {
    id: "dessert-biscotti",
    name: "Almond Biscotti",
    description: "Twice-baked Italian cookies perfect for dunking in coffee.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 24,
    cuisine: "Italian",
    image: dessertBiscottiImg,
    totalTime: 60,
    tags: ["dessert", "cookies", "italian", "gift-worthy", "vegetarian"],
    nutrition: { calories: 125, protein: 3, carbs: 18, fat: 5, fiber: 1, sugar: 8, servingSize: "1 biscotti" },
    ingredients: [
      { amount: "2", unit: "cups", item: "all-purpose flour" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1", unit: "tsp", item: "baking powder" },
      { amount: "3", unit: "", item: "eggs" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "1", unit: "tsp", item: "almond extract" },
      { amount: "1", unit: "cup", item: "whole almonds" }
    ],
    instructions: [
      "Preheat oven to 350°F.",
      "Mix flour, sugar, baking powder, and almonds.",
      "Beat eggs with extracts, add to dry ingredients.",
      "Form into 2 logs on baking sheet.",
      "Bake 30 minutes until golden.",
      "Cool 10 minutes, slice diagonally 1/2-inch thick.",
      "Lay slices flat, bake 10 more minutes per side."
    ]
  },
  {
    id: "dessert-pumpkin-cheesecake",
    name: "Pumpkin Cheesecake",
    description: "Creamy pumpkin spice cheesecake with graham cracker crust.",
    cookTime: "60 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "American",
    image: dessertPumpkinCheesecakeImg,
    totalTime: 80,
    tags: ["dessert", "fall", "holiday", "showstopper", "vegetarian", "glutenfree"],
    nutrition: { calories: 425, protein: 7, carbs: 42, fat: 26, fiber: 1, sugar: 32, servingSize: "1 slice" },
    ingredients: [
      { amount: "2", unit: "cups", item: "graham cracker crumbs" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "24", unit: "oz", item: "cream cheese, softened" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1", unit: "can", item: "pumpkin puree (15 oz)" },
      { amount: "3", unit: "", item: "eggs" },
      { amount: "2", unit: "tsp", item: "pumpkin pie spice" },
      { amount: "1", unit: "tsp", item: "vanilla extract" }
    ],
    instructions: [
      "Preheat oven to 325°F.",
      "Mix crumbs and butter, press into 9-inch springform pan.",
      "Beat cream cheese and sugar until smooth.",
      "Beat in pumpkin, eggs, spice, and vanilla.",
      "Pour over crust.",
      "Bake 60-70 minutes until center is almost set.",
      "Cool, refrigerate 4 hours before serving."
    ]
  },
  {
    id: "dessert-banana-bread-chocolate",
    name: "Chocolate Chip Banana Bread",
    description: "Moist banana bread studded with chocolate chips.",
    cookTime: "60 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 10,
    cuisine: "American",
    image: dessertBananaBreadChocolateImg,
    totalTime: 75,
    tags: ["dessert", "breakfast", "comfort-food", "kid-friendly", "vegetarian"],
    nutrition: { calories: 295, protein: 4, carbs: 42, fat: 12, fiber: 2, sugar: 24, servingSize: "1 slice" },
    ingredients: [
      { amount: "3", unit: "", item: "ripe bananas, mashed" },
      { amount: "1/3", unit: "cup", item: "melted butter" },
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "1", unit: "", item: "egg, beaten" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "1 1/2", unit: "cups", item: "all-purpose flour" },
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "1", unit: "cup", item: "chocolate chips" }
    ],
    instructions: [
      "Preheat oven to 350°F, grease loaf pan.",
      "Mix mashed bananas with melted butter.",
      "Stir in sugar, egg, and vanilla.",
      "Mix in flour and baking soda until just combined.",
      "Fold in chocolate chips.",
      "Pour into loaf pan.",
      "Bake 60 minutes until toothpick comes out clean."
    ]
  },
  {
    id: "dessert-salted-caramel-tart",
    name: "Salted Caramel Tart",
    description: "Buttery tart shell filled with rich salted caramel.",
    cookTime: "30 mins",
    prepTime: "25 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "French",
    image: "https://i.imgur.com/PTKfTA0.png",
    totalTime: 55,
    tags: ["dessert", "caramel", "elegant", "showstopper", "vegetarian"],
    nutrition: { calories: 445, protein: 5, carbs: 54, fat: 24, fiber: 1, sugar: 38, servingSize: "1 slice" },
    ingredients: [
      { amount: "1 1/4", unit: "cups", item: "all-purpose flour" },
      { amount: "1/2", unit: "cup", item: "cold butter" },
      { amount: "2", unit: "tbsp", item: "sugar" },
      { amount: "1 1/2", unit: "cups", item: "sugar for caramel" },
      { amount: "1/2", unit: "cup", item: "water" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "4", unit: "tbsp", item: "butter" },
      { amount: "2", unit: "tsp", item: "sea salt" }
    ],
    instructions: [
      "Make crust: Mix flour, butter, sugar until crumbly.",
      "Press into tart pan, bake at 350°F for 20 minutes.",
      "Make caramel: Cook sugar and water until deep amber.",
      "Carefully whisk in cream (it will bubble).",
      "Remove from heat, stir in butter and salt.",
      "Pour caramel into cooled tart shell.",
      "Refrigerate 2 hours, sprinkle with more sea salt."
    ]
  },
  {
    id: "dessert-sticky-toffee-pudding",
    name: "Sticky Toffee Pudding",
    description: "Warm British date cake with rich toffee sauce.",
    cookTime: "35 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "British",
    image: dessertStickyToffeePuddingImg,
    totalTime: 55,
    tags: ["dessert", "british", "comfort-food", "warm", "vegetarian"],
    nutrition: { calories: 485, protein: 5, carbs: 68, fat: 22, fiber: 2, sugar: 52, servingSize: "1 serving" },
    ingredients: [
      { amount: "1", unit: "cup", item: "chopped dates" },
      { amount: "1", unit: "cup", item: "boiling water" },
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "1/4", unit: "cup", item: "butter" },
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1 1/4", unit: "cups", item: "flour" },
      { amount: "1", unit: "cup", item: "brown sugar for sauce" },
      { amount: "1/2", unit: "cup", item: "butter for sauce" },
      { amount: "3/4", unit: "cup", item: "heavy cream" }
    ],
    instructions: [
      "Soak dates in boiling water with baking soda.",
      "Cream butter and sugar, beat in eggs.",
      "Fold in flour and date mixture.",
      "Pour into greased 9x9 pan, bake at 350°F for 35 mins.",
      "Make sauce: Melt butter, brown sugar, and cream.",
      "Simmer 5 minutes until thick.",
      "Serve warm cake with hot toffee sauce."
    ]
  },
  {
    id: "dessert-opera-cake",
    name: "Opera Cake",
    description: "Elegant French almond sponge with coffee buttercream.",
    cookTime: "30 mins",
    prepTime: "60 mins",
    difficulty: "hard",
    servings: 12,
    cuisine: "French",
    image: dessertOperaCakeImg,
    totalTime: 90,
    tags: ["dessert", "french", "elegant", "showstopper", "vegetarian"],
    nutrition: { calories: 485, protein: 7, carbs: 52, fat: 28, fiber: 2, sugar: 36, servingSize: "1 slice" },
    ingredients: [
      { amount: "6", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "powdered sugar" },
      { amount: "1 1/2", unit: "cups", item: "almond flour" },
      { amount: "1/2", unit: "cup", item: "flour" },
      { amount: "1/4", unit: "cup", item: "butter, melted" },
      { amount: "1/2", unit: "cup", item: "coffee syrup" },
      { amount: "2", unit: "cups", item: "coffee buttercream" },
      { amount: "8", unit: "oz", item: "dark chocolate for glaze" }
    ],
    instructions: [
      "Beat eggs and sugar until thick and pale.",
      "Fold in almond flour and flour.",
      "Fold in melted butter.",
      "Spread on baking sheet, bake at 425°F for 7 minutes.",
      "Cut into 3 layers, brush with coffee syrup.",
      "Layer with coffee buttercream.",
      "Top with chocolate glaze, refrigerate 2 hours."
    ]
  },
  {
    id: "dessert-chocolate-fondue",
    name: "Chocolate Fondue",
    description: "Rich melted chocolate for dipping fruits and treats.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "Swiss",
    image: dessertChocolateFondueImg,
    totalTime: 20,
    tags: ["dessert", "chocolate", "interactive", "party", "vegetarian", "glutenfree"],
    nutrition: { calories: 285, protein: 3, carbs: 28, fat: 18, fiber: 2, sugar: 24, servingSize: "1/4 cup" },
    ingredients: [
      { amount: "12", unit: "oz", item: "dark chocolate, chopped" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "", unit: "", item: "strawberries, bananas, marshmallows for dipping" }
    ],
    instructions: [
      "Heat cream until simmering.",
      "Pour over chopped chocolate, let sit 2 minutes.",
      "Stir until smooth, add butter and vanilla.",
      "Transfer to fondue pot or bowl.",
      "Serve with assorted dippers."
    ]
  },
  {
    id: "dessert-raspberry-white-chocolate-cheesecake",
    name: "Raspberry White Chocolate Cheesecake",
    description: "Creamy white chocolate cheesecake swirled with raspberry.",
    cookTime: "60 mins",
    prepTime: "25 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "American",
    image: dessertRaspberryWhiteChocolateCheesecakeImg,
    totalTime: 85,
    tags: ["dessert", "elegant", "berries", "showstopper", "vegetarian", "glutenfree"],
    nutrition: { calories: 465, protein: 7, carbs: 48, fat: 28, fiber: 1, sugar: 36, servingSize: "1 slice" },
    ingredients: [
      { amount: "2", unit: "cups", item: "graham cracker crumbs" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "24", unit: "oz", item: "cream cheese, softened" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "8", unit: "oz", item: "white chocolate, melted" },
      { amount: "3", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "raspberry puree" }
    ],
    instructions: [
      "Mix crumbs and butter, press into springform pan.",
      "Beat cream cheese and sugar until smooth.",
      "Beat in melted white chocolate and eggs.",
      "Pour over crust.",
      "Drop spoonfuls of raspberry puree on top, swirl.",
      "Bake at 325°F for 60 minutes.",
      "Cool, refrigerate 4 hours."
    ]
  },
  {
    id: "dessert-smores-bars",
    name: "S'mores Bars",
    description: "Graham cracker base with chocolate and toasted marshmallow.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 16,
    cuisine: "American",
    image: "https://i.imgur.com/4FBa5A2.png",
    totalTime: 45,
    tags: ["dessert", "chocolate", "kid-friendly", "crowd-pleaser", "vegetarian", "glutenfree"],
    nutrition: { calories: 325, protein: 4, carbs: 42, fat: 16, fiber: 2, sugar: 28, servingSize: "1 bar" },
    ingredients: [
      { amount: "2", unit: "cups", item: "graham cracker crumbs" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "2", unit: "cups", item: "chocolate chips" },
      { amount: "1", unit: "can", item: "sweetened condensed milk" },
      { amount: "4", unit: "cups", item: "mini marshmallows" }
    ],
    instructions: [
      "Preheat oven to 350°F.",
      "Mix crumbs and butter, press into 9x13 pan.",
      "Sprinkle chocolate chips over crust.",
      "Pour condensed milk over chocolate.",
      "Bake 25 minutes until bubbly.",
      "Top with marshmallows, broil 1-2 minutes until golden.",
      "Cool completely before cutting."
    ]
  },
  {
    id: "dessert-coconut-cream-pie",
    name: "Coconut Cream Pie",
    description: "Creamy coconut custard in flaky crust with whipped cream.",
    cookTime: "20 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "American",
    image: "https://i.imgur.com/skgpMgQ.png",
    totalTime: 40,
    tags: ["dessert", "coconut", "cream", "classic", "vegetarian", "glutenfree"],
    nutrition: { calories: 425, protein: 6, carbs: 48, fat: 24, fiber: 2, sugar: 32, servingSize: "1 slice" },
    ingredients: [
      { amount: "1", unit: "", item: "pie crust, pre-baked" },
      { amount: "2/3", unit: "cup", item: "sugar" },
      { amount: "1/4", unit: "cup", item: "cornstarch" },
      { amount: "2", unit: "cups", item: "milk" },
      { amount: "3", unit: "", item: "egg yolks" },
      { amount: "1 1/2", unit: "cups", item: "sweetened coconut flakes" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "2", unit: "cups", item: "whipped cream" }
    ],
    instructions: [
      "Whisk sugar and cornstarch in saucepan.",
      "Gradually whisk in milk, cook until thick.",
      "Whisk egg yolks, add hot mixture slowly.",
      "Return to pan, cook 2 minutes.",
      "Remove from heat, stir in coconut and vanilla.",
      "Pour into pie crust, chill 4 hours.",
      "Top with whipped cream and toasted coconut."
    ]
  },

  // ========== LUNCH (20) ==========
  {
    id: "lunch-mediterranean-quinoa-bowl",
    name: "Mediterranean Quinoa Bowl",
    description: "Healthy quinoa with feta, olives, cucumbers, and hummus.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Healthy Bowls",
    image: lunchMediterraneanQuinoaBowlImg,
    totalTime: 35,
    tags: ["lunch", "healthy", "vegetarian", "meal-prep", "glutenfree"],
    nutrition: { calories: 385, protein: 14, carbs: 48, fat: 16, fiber: 8, sugar: 6, servingSize: "1 bowl" },
    ingredients: [
      { amount: "2", unit: "cups", item: "cooked quinoa" },
      { amount: "1", unit: "cup", item: "cherry tomatoes, halved" },
      { amount: "1", unit: "", item: "cucumber, diced" },
      { amount: "1/2", unit: "cup", item: "kalamata olives" },
      { amount: "1/2", unit: "cup", item: "feta cheese, crumbled" },
      { amount: "1/4", unit: "cup", item: "red onion, diced" },
      { amount: "1/4", unit: "cup", item: "olive oil" },
      { amount: "2", unit: "tbsp", item: "lemon juice" },
      { amount: "1", unit: "tsp", item: "dried oregano" }
    ],
    instructions: [
      "Cook quinoa according to package, cool.",
      "Combine tomatoes, cucumber, olives, feta, onion.",
      "Whisk olive oil, lemon juice, oregano, salt, pepper.",
      "Toss quinoa with vegetables.",
      "Drizzle with dressing and serve."
    ]
  },
  {
    id: "lunch-buffalo-chicken-wrap",
    name: "Buffalo Chicken Wrap",
    description: "Crispy buffalo chicken in tortilla with ranch and veggies.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch Ideas",
    image: "https://i.imgur.com/UxeGukR.png",
    totalTime: 25,
    tags: ["lunch", "spicy", "quick", "kid-friendly"],
    nutrition: { calories: 465, protein: 32, carbs: 38, fat: 20, fiber: 3, sugar: 4, servingSize: "1 wrap" },
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken tenders" },
      { amount: "1/2", unit: "cup", item: "buffalo sauce" },
      { amount: "4", unit: "", item: "large flour tortillas" },
      { amount: "1", unit: "cup", item: "shredded lettuce" },
      { amount: "1", unit: "", item: "tomato, diced" },
      { amount: "1/2", unit: "cup", item: "ranch dressing" },
      { amount: "1/2", unit: "cup", item: "shredded cheddar" }
    ],
    instructions: [
      "Cook chicken tenders until crispy, 5-6 mins per side.",
      "Toss with buffalo sauce.",
      "Warm tortillas 15 seconds.",
      "Layer lettuce, tomato, chicken, cheese, ranch.",
      "Roll tightly, cut in half."
    ]
  },
  {
    id: "lunch-greek-salad-chicken",
    name: "Greek Salad with Grilled Chicken",
    description: "Fresh vegetables, feta, olives with grilled chicken.",
    cookTime: "15 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch Ideas",
    image: "https://i.imgur.com/R80g8Pn.png",
    totalTime: 30,
    tags: ["lunch", "healthy", "protein", "low-carb", "glutenfree"],
    nutrition: { calories: 395, protein: 36, carbs: 18, fat: 22, fiber: 5, sugar: 8, servingSize: "1 salad" },
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken breast" },
      { amount: "1", unit: "", item: "head romaine lettuce, chopped" },
      { amount: "2", unit: "cups", item: "cherry tomatoes, halved" },
      { amount: "1", unit: "", item: "cucumber, diced" },
      { amount: "1/2", unit: "", item: "red onion, sliced" },
      { amount: "1/2", unit: "cup", item: "kalamata olives" },
      { amount: "1", unit: "cup", item: "feta cheese, crumbled" },
      { amount: "1/4", unit: "cup", item: "olive oil" },
      { amount: "2", unit: "tbsp", item: "red wine vinegar" },
      { amount: "1", unit: "tsp", item: "dried oregano" }
    ],
    instructions: [
      "Season and grill chicken until cooked through.",
      "Let rest, then slice.",
      "Combine lettuce, tomatoes, cucumber, onion, olives.",
      "Whisk oil, vinegar, oregano for dressing.",
      "Top salad with sliced chicken and feta.",
      "Drizzle with dressing."
    ]
  },
  {
    id: "lunch-turkey-avocado-club",
    name: "Turkey Avocado Club",
    description: "Triple-decker sandwich with turkey, bacon, and avocado.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 2,
    cuisine: "Lunch Ideas",
    image: quickTurkeyAvocadoClubImg,
    totalTime: 20,
    tags: ["lunch", "sandwich", "classic", "protein"],
    nutrition: { calories: 585, protein: 38, carbs: 42, fat: 28, fiber: 6, sugar: 5, servingSize: "1 sandwich" },
    ingredients: [
      { amount: "6", unit: "slices", item: "bread, toasted" },
      { amount: "8", unit: "oz", item: "sliced turkey" },
      { amount: "6", unit: "slices", item: "bacon, cooked" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "2", unit: "", item: "tomato, sliced" },
      { amount: "4", unit: "leaves", item: "lettuce" },
      { amount: "4", unit: "tbsp", item: "mayo" }
    ],
    instructions: [
      "Toast bread slices.",
      "Spread mayo on all slices.",
      "On first slice: lettuce, tomato, turkey.",
      "Add second slice.",
      "Top with bacon, avocado, lettuce.",
      "Add final slice, secure with toothpicks.",
      "Cut into quarters."
    ]
  },
  {
    id: "lunch-caprese-panini",
    name: "Caprese Panini",
    description: "Grilled sandwich with mozzarella, tomato, and basil pesto.",
    cookTime: "8 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 2,
    cuisine: "Lunch Ideas",
    image: quickCapresePaniniImg,
    totalTime: 18,
    tags: ["lunch", "vegetarian", "italian", "quick"],
    nutrition: { calories: 485, protein: 22, carbs: 38, fat: 28, fiber: 3, sugar: 6, servingSize: "1 panini" },
    ingredients: [
      { amount: "4", unit: "slices", item: "ciabatta bread" },
      { amount: "8", unit: "oz", item: "fresh mozzarella, sliced" },
      { amount: "2", unit: "", item: "tomatoes, sliced" },
      { amount: "1/4", unit: "cup", item: "basil pesto" },
      { amount: "2", unit: "tbsp", item: "balsamic glaze" },
      { amount: "2", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Spread pesto on bread slices.",
      "Layer mozzarella and tomato.",
      "Drizzle with balsamic glaze.",
      "Brush outside with olive oil.",
      "Grill in panini press or skillet 4 mins per side.",
      "Cut in half and serve warm."
    ]
  },
  {
    id: "lunch-tuna-nicoise-salad",
    name: "Tuna Niçoise Salad",
    description: "French salad with tuna, potatoes, green beans, and eggs.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "French",
    image: lunchTunaNicoiseSaladImg,
    totalTime: 35,
    tags: ["lunch", "healthy", "protein", "elegant", "glutenfree"],
    nutrition: { calories: 425, protein: 32, carbs: 28, fat: 22, fiber: 6, sugar: 5, servingSize: "1 salad" },
    ingredients: [
      { amount: "1", unit: "lb", item: "baby potatoes" },
      { amount: "8", unit: "oz", item: "green beans, trimmed" },
      { amount: "4", unit: "", item: "hard-boiled eggs, halved" },
      { amount: "2", unit: "cans", item: "tuna in olive oil" },
      { amount: "1", unit: "cup", item: "cherry tomatoes, halved" },
      { amount: "1/2", unit: "cup", item: "kalamata olives" },
      { amount: "6", unit: "cups", item: "mixed greens" },
      { amount: "1/4", unit: "cup", item: "olive oil" },
      { amount: "2", unit: "tbsp", item: "red wine vinegar" },
      { amount: "1", unit: "tsp", item: "Dijon mustard" }
    ],
    instructions: [
      "Boil potatoes until tender, halve.",
      "Blanch green beans 3 minutes, cool.",
      "Arrange greens on plates.",
      "Top with potatoes, beans, tuna, eggs, tomatoes, olives.",
      "Whisk oil, vinegar, mustard for dressing.",
      "Drizzle over salad."
    ]
  },
  {
    id: "lunch-california-roll-bowl",
    name: "California Roll Bowl",
    description: "Deconstructed sushi bowl with crab, avocado, and cucumber.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Healthy Bowls",
    image: lunchCaliforniaRollBowlImg,
    totalTime: 35,
    tags: ["lunch", "healthy", "seafood", "meal-prep"],
    nutrition: { calories: 385, protein: 18, carbs: 52, fat: 12, fiber: 6, sugar: 8, servingSize: "1 bowl" },
    ingredients: [
      { amount: "2", unit: "cups", item: "sushi rice, cooked" },
      { amount: "2", unit: "tbsp", item: "rice vinegar" },
      { amount: "8", unit: "oz", item: "imitation crab, shredded" },
      { amount: "2", unit: "", item: "avocados, sliced" },
      { amount: "1", unit: "", item: "cucumber, julienned" },
      { amount: "2", unit: "", item: "carrots, shredded" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" },
      { amount: "1/4", unit: "cup", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "mayo" },
      { amount: "1", unit: "tbsp", item: "sriracha" }
    ],
    instructions: [
      "Mix rice vinegar into warm rice.",
      "Divide rice among bowls.",
      "Top with crab, avocado, cucumber, carrots.",
      "Sprinkle with sesame seeds.",
      "Mix mayo and sriracha for spicy mayo.",
      "Drizzle with soy sauce and spicy mayo."
    ]
  },
  {
    id: "lunch-bbq-pulled-pork-sandwich",
    name: "BBQ Pulled Pork Sandwich",
    description: "Slow-cooked pulled pork with coleslaw on brioche bun.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "American",
    image: quickBbqPulledPorkImg,
    totalTime: 20,
    tags: ["lunch", "bbq", "sandwich", "comfort-food"],
    nutrition: { calories: 565, protein: 38, carbs: 52, fat: 22, fiber: 4, sugar: 18, servingSize: "1 sandwich" },
    ingredients: [
      { amount: "2", unit: "lbs", item: "pulled pork, pre-cooked" },
      { amount: "1", unit: "cup", item: "BBQ sauce" },
      { amount: "4", unit: "", item: "brioche buns" },
      { amount: "2", unit: "cups", item: "coleslaw" },
      { amount: "4", unit: "slices", item: "pickles" }
    ],
    instructions: [
      "Heat pulled pork with BBQ sauce.",
      "Toast brioche buns.",
      "Pile pork on bottom bun.",
      "Top with coleslaw and pickles.",
      "Add top bun and serve."
    ]
  },
  {
    id: "lunch-falafel-pita",
    name: "Falafel Pita",
    description: "Crispy falafel in pita with tahini and fresh vegetables.",
    cookTime: "15 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch Ideas",
    image: quickFalafelPitaImg,
    totalTime: 30,
    tags: ["lunch", "vegetarian", "protein"],
    nutrition: { calories: 425, protein: 16, carbs: 62, fat: 14, fiber: 12, sugar: 8, servingSize: "1 pita" },
    ingredients: [
      { amount: "1", unit: "can", item: "chickpeas, drained (15 oz)" },
      { amount: "1/2", unit: "", item: "onion, chopped" },
      { amount: "3", unit: "cloves", item: "garlic" },
      { amount: "1/4", unit: "cup", item: "fresh parsley" },
      { amount: "2", unit: "tsp", item: "cumin" },
      { amount: "1/4", unit: "cup", item: "flour" },
      { amount: "4", unit: "", item: "pita breads" },
      { amount: "1/4", unit: "cup", item: "tahini sauce" },
      { amount: "2", unit: "cups", item: "mixed vegetables" }
    ],
    instructions: [
      "Pulse chickpeas, onion, garlic, parsley, cumin in food processor.",
      "Mix in flour, form into balls.",
      "Fry in oil until golden, 3-4 mins per side.",
      "Warm pita breads.",
      "Fill with falafel, vegetables, tahini sauce."
    ]
  },
  {
    id: "lunch-chicken-caesar-salad",
    name: "Chicken Caesar Salad",
    description: "Classic Caesar with grilled chicken and parmesan.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch Ideas",
    image: "https://i.imgur.com/BtPoTd0.png",
    totalTime: 25,
    tags: ["lunch", "salad", "protein", "classic"],
    nutrition: { calories: 485, protein: 38, carbs: 22, fat: 28, fiber: 3, sugar: 3, servingSize: "1 salad" },
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken breast" },
      { amount: "1", unit: "", item: "head romaine lettuce, chopped" },
      { amount: "1/2", unit: "cup", item: "Caesar dressing" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese, shaved" },
      { amount: "2", unit: "cups", item: "croutons" },
      { amount: "1", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Season and grill chicken until cooked through.",
      "Let rest, then slice.",
      "Toss lettuce with Caesar dressing.",
      "Top with sliced chicken.",
      "Add croutons and parmesan.",
      "Serve immediately."
    ]
  },
  {
    id: "lunch-banh-mi-sandwich",
    name: "Banh Mi Sandwich",
    description: "Vietnamese sandwich with pork, pickled vegetables, cilantro.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Vietnamese",
    image: "https://i.imgur.com/5TU9h2c.png",
    totalTime: 35,
    tags: ["lunch", "sandwich", "asian", "fresh"],
    nutrition: { calories: 465, protein: 28, carbs: 52, fat: 16, fiber: 4, sugar: 12, servingSize: "1 sandwich" },
    ingredients: [
      { amount: "1", unit: "lb", item: "pork tenderloin" },
      { amount: "4", unit: "", item: "baguettes" },
      { amount: "1", unit: "cup", item: "pickled carrots and daikon" },
      { amount: "1", unit: "", item: "cucumber, sliced" },
      { amount: "1/4", unit: "cup", item: "fresh cilantro" },
      { amount: "2", unit: "tbsp", item: "mayo" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "honey" },
      { amount: "1", unit: "", item: "jalapeño, sliced" }
    ],
    instructions: [
      "Marinate pork in soy sauce and honey 15 minutes.",
      "Grill pork until cooked through, slice thinly.",
      "Toast baguettes, spread with mayo.",
      "Layer pork, pickled vegetables, cucumber, cilantro.",
      "Add jalapeño slices.",
      "Cut in half and serve."
    ]
  },
  {
    id: "lunch-southwest-chicken-bowl",
    name: "Southwest Chicken Bowl",
    description: "Rice bowl with chicken, black beans, corn, and avocado.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Healthy Bowls",
    image: "https://i.imgur.com/OSHCxtG.png",
    totalTime: 35,
    tags: ["lunch", "healthy", "bowl", "meal-prep", "glutenfree"],
    nutrition: { calories: 485, protein: 36, carbs: 52, fat: 16, fiber: 12, sugar: 6, servingSize: "1 bowl" },
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken breast, cubed" },
      { amount: "2", unit: "cups", item: "cooked rice" },
      { amount: "1", unit: "can", item: "black beans, drained" },
      { amount: "1", unit: "cup", item: "corn" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "1", unit: "cup", item: "cherry tomatoes, halved" },
      { amount: "1/2", unit: "cup", item: "shredded cheese" },
      { amount: "1/4", unit: "cup", item: "sour cream" },
      { amount: "2", unit: "tbsp", item: "taco seasoning" },
      { amount: "1", unit: "", item: "lime, cut into wedges" }
    ],
    instructions: [
      "Season chicken with taco seasoning, cook until done.",
      "Divide rice among bowls.",
      "Top with chicken, beans, corn, tomatoes, avocado.",
      "Sprinkle with cheese.",
      "Add dollop of sour cream.",
      "Serve with lime wedges."
    ]
  },
  {
    id: "lunch-margherita-flatbread",
    name: "Margherita Flatbread",
    description: "Thin crust flatbread with fresh mozzarella and basil.",
    cookTime: "12 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch Ideas",
    image: "https://i.imgur.com/q4jsy7M.png",
    totalTime: 22,
    tags: ["lunch", "vegetarian", "italian", "quick"],
    nutrition: { calories: 365, protein: 16, carbs: 42, fat: 16, fiber: 3, sugar: 5, servingSize: "1/4 flatbread" },
    ingredients: [
      { amount: "1", unit: "", item: "flatbread or naan" },
      { amount: "1/2", unit: "cup", item: "marinara sauce" },
      { amount: "8", unit: "oz", item: "fresh mozzarella, sliced" },
      { amount: "2", unit: "", item: "tomatoes, sliced" },
      { amount: "1/4", unit: "cup", item: "fresh basil leaves" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "clove", item: "garlic, minced" }
    ],
    instructions: [
      "Preheat oven to 425°F.",
      "Spread marinara on flatbread.",
      "Top with mozzarella and tomato slices.",
      "Drizzle with olive oil, sprinkle with garlic.",
      "Bake 10-12 minutes until cheese melts.",
      "Top with fresh basil leaves.",
      "Cut into slices and serve."
    ]
  },
  {
    id: "lunch-cobb-salad",
    name: "Cobb Salad",
    description: "Chopped salad with chicken, bacon, egg, and blue cheese.",
    cookTime: "15 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch Ideas",
    image: "https://i.imgur.com/T4c5hb3.png",
    totalTime: 30,
    tags: ["lunch", "salad", "protein", "classic", "glutenfree"],
    nutrition: { calories: 525, protein: 42, carbs: 18, fat: 34, fiber: 5, sugar: 8, servingSize: "1 salad" },
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken breast, grilled and diced" },
      { amount: "6", unit: "cups", item: "chopped romaine lettuce" },
      { amount: "4", unit: "", item: "hard-boiled eggs, chopped" },
      { amount: "8", unit: "slices", item: "bacon, cooked and crumbled" },
      { amount: "1", unit: "cup", item: "cherry tomatoes, halved" },
      { amount: "1", unit: "", item: "avocado, diced" },
      { amount: "1/2", unit: "cup", item: "blue cheese, crumbled" },
      { amount: "1/2", unit: "cup", item: "ranch or blue cheese dressing" }
    ],
    instructions: [
      "Arrange lettuce on large platter or bowls.",
      "Arrange chicken, eggs, bacon, tomatoes, avocado in rows.",
      "Top with blue cheese crumbles.",
      "Serve with dressing on the side."
    ]
  },
  {
    id: "lunch-pesto-pasta-salad",
    name: "Pesto Pasta Salad",
    description: "Cold pasta with pesto, mozzarella, and cherry tomatoes.",
    cookTime: "12 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Lunch Ideas",
    image: "https://i.imgur.com/6xVhDhZ.png",
    totalTime: 22,
    tags: ["lunch", "vegetarian", "pasta", "meal-prep"],
    nutrition: { calories: 385, protein: 12, carbs: 42, fat: 19, fiber: 3, sugar: 4, servingSize: "1 serving" },
    ingredients: [
      { amount: "1", unit: "lb", item: "rotini pasta" },
      { amount: "3/4", unit: "cup", item: "basil pesto" },
      { amount: "2", unit: "cups", item: "cherry tomatoes, halved" },
      { amount: "8", unit: "oz", item: "mozzarella balls" },
      { amount: "1/4", unit: "cup", item: "pine nuts, toasted" },
      { amount: "1/4", unit: "cup", item: "parmesan cheese, grated" }
    ],
    instructions: [
      "Cook pasta according to package, drain and cool.",
      "Toss pasta with pesto.",
      "Add tomatoes and mozzarella.",
      "Sprinkle with pine nuts and parmesan.",
      "Chill 1 hour or serve at room temperature."
    ]
  },
  {
    id: "lunch-korean-bbq-beef-bowl",
    name: "Korean BBQ Beef Bowl",
    description: "Rice bowl with marinated beef, kimchi, and vegetables.",
    cookTime: "15 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Healthy Bowls",
    image: "https://i.imgur.com/r3siPlA.png",
    totalTime: 30,
    tags: ["asian", "bowls", "spicy", "healthy"],
    nutrition: { calories: 525, protein: 38, carbs: 56, fat: 16, fiber: 4, sugar: 12, servingSize: "1 bowl" },
    ingredients: [
      { amount: "1", unit: "lb", item: "beef sirloin, thinly sliced" },
      { amount: "2", unit: "cups", item: "cooked rice" },
      { amount: "1/4", unit: "cup", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "brown sugar" },
      { amount: "1", unit: "tbsp", item: "sesame oil" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "cup", item: "kimchi" },
      { amount: "2", unit: "cups", item: "mixed vegetables" },
      { amount: "2", unit: "", item: "fried eggs" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" }
    ],
    instructions: [
      "Marinate beef in soy sauce, sugar, sesame oil, garlic 15 mins.",
      "Stir-fry beef until cooked through.",
      "Divide rice among bowls.",
      "Top with beef, kimchi, vegetables, fried egg.",
      "Sprinkle with sesame seeds."
    ]
  },
  {
    id: "lunch-shrimp-po-boy",
    name: "Shrimp Po' Boy",
    description: "Fried shrimp sandwich with remoulade and lettuce.",
    cookTime: "15 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Cajun",
    image: "https://i.imgur.com/7CRYCTy.png",
    totalTime: 30,
    tags: ["lunch", "seafood", "sandwich", "southern"],
    nutrition: { calories: 585, protein: 32, carbs: 62, fat: 24, fiber: 3, sugar: 8, servingSize: "1 sandwich" },
    ingredients: [
      { amount: "1", unit: "lb", item: "shrimp, peeled and deveined" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "1", unit: "cup", item: "cornmeal" },
      { amount: "2", unit: "tsp", item: "Cajun seasoning" },
      { amount: "4", unit: "", item: "hoagie rolls" },
      { amount: "1/2", unit: "cup", item: "remoulade sauce" },
      { amount: "2", unit: "cups", item: "shredded lettuce" },
      { amount: "2", unit: "", item: "tomatoes, sliced" },
      { amount: "4", unit: "slices", item: "pickles" }
    ],
    instructions: [
      "Mix flour, cornmeal, and Cajun seasoning.",
      "Coat shrimp in mixture.",
      "Fry in hot oil 3-4 minutes until golden.",
      "Toast hoagie rolls.",
      "Spread remoulade on rolls.",
      "Layer shrimp, lettuce, tomato, pickles."
    ]
  },
  {
    id: "lunch-chicken-shawarma-wrap",
    name: "Chicken Shawarma Wrap",
    description: "Spiced chicken with tahini in warm flatbread.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Middle Eastern",
    image: "https://i.imgur.com/AIzNilp.png",
    totalTime: 35,
    tags: ["lunch", "wrap", "protein", "flavorful"],
    nutrition: { calories: 485, protein: 38, carbs: 42, fat: 18, fiber: 5, sugar: 6, servingSize: "1 wrap" },
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken thighs, sliced" },
      { amount: "2", unit: "tbsp", item: "shawarma spice blend" },
      { amount: "4", unit: "", item: "flatbreads" },
      { amount: "1/4", unit: "cup", item: "tahini sauce" },
      { amount: "1", unit: "cup", item: "diced tomatoes" },
      { amount: "1", unit: "cup", item: "diced cucumber" },
      { amount: "1/2", unit: "", item: "red onion, sliced" },
      { amount: "1/4", unit: "cup", item: "fresh parsley" }
    ],
    instructions: [
      "Marinate chicken in shawarma spice 15 minutes.",
      "Cook chicken until browned and cooked through.",
      "Warm flatbreads.",
      "Spread tahini on flatbreads.",
      "Layer chicken, tomatoes, cucumber, onion, parsley.",
      "Roll tightly and serve."
    ]
  },
  {
    id: "lunch-tomato-soup-grilled-cheese",
    name: "Tomato Soup with Grilled Cheese",
    description: "Creamy tomato soup paired with crispy grilled cheese.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "American",
    image: "https://i.imgur.com/NOrOGqK.jpeg",
    totalTime: 30,
    tags: ["lunch", "comfort-food", "classic", "vegetarian"],
    nutrition: { calories: 525, protein: 18, carbs: 58, fat: 26, fiber: 6, sugar: 18, servingSize: "1 serving" },
    ingredients: [
      { amount: "2", unit: "cans", item: "crushed tomatoes (28 oz)" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "cups", item: "vegetable broth" },
      { amount: "8", unit: "slices", item: "bread" },
      { amount: "8", unit: "slices", item: "cheddar cheese" },
      { amount: "4", unit: "tbsp", item: "butter" }
    ],
    instructions: [
      "Sauté onion and garlic until soft.",
      "Add crushed tomatoes and broth, simmer 15 minutes.",
      "Blend until smooth, stir in cream.",
      "Make grilled cheese: Butter bread, layer cheese, grill.",
      "Serve soup with grilled cheese for dipping."
    ]
  },

  // ========== ONE POT WONDERS (20) ==========
  {
    id: "one-pot-chicken-dumplings",
    name: "Chicken and Dumplings",
    description: "Comforting stew with tender chicken and fluffy dumplings.",
    cookTime: "40 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "American",
    image: "https://i.imgur.com/dt4rUxx.png",
    totalTime: 60,
    tags: ["one-pot", "comfort-food", "chicken", "winter"],
    nutrition: { calories: 525, protein: 38, carbs: 52, fat: 18, fiber: 4, sugar: 6, servingSize: "1 serving" },
    ingredients: [
      { amount: "2", unit: "lbs", item: "chicken thighs" },
      { amount: "4", unit: "cups", item: "chicken broth" },
      { amount: "2", unit: "", item: "carrots, sliced" },
      { amount: "2", unit: "", item: "celery stalks, diced" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "1", unit: "tbsp", item: "baking powder" },
      { amount: "1", unit: "cup", item: "milk" },
      { amount: "1/2", unit: "cup", item: "butter" }
    ],
    instructions: [
      "Cook chicken in broth with vegetables until tender.",
      "Remove chicken, shred, return to pot.",
      "Mix flour, baking powder, butter, milk for dumplings.",
      "Drop spoonfuls of dough into simmering broth.",
      "Cover and cook 15 minutes without lifting lid.",
      "Season and serve hot."
    ]
  },
  {
    id: "one-pot-beef-bourguignon",
    name: "Beef Bourguignon",
    description: "French braised beef in red wine with mushrooms and pearl onions.",
    cookTime: "2 hours",
    prepTime: "20 mins",
    difficulty: "hard",
    servings: 6,
    cuisine: "French",
    image: "https://i.imgur.com/3q9tEp5.png",
    totalTime: 140,
    tags: ["one-pot", "french", "beef", "elegant", "glutenfree"],
    nutrition: { calories: 585, protein: 42, carbs: 24, fat: 32, fiber: 4, sugar: 8, servingSize: "1 serving" },
    ingredients: [
      { amount: "3", unit: "lbs", item: "beef chuck, cubed" },
      { amount: "2", unit: "cups", item: "red wine" },
      { amount: "2", unit: "cups", item: "beef broth" },
      { amount: "8", unit: "oz", item: "mushrooms, halved" },
      { amount: "1", unit: "cup", item: "pearl onions" },
      { amount: "4", unit: "slices", item: "bacon, diced" },
      { amount: "3", unit: "", item: "carrots, chunked" },
      { amount: "2", unit: "tbsp", item: "tomato paste" },
      { amount: "2", unit: "", item: "bay leaves" }
    ],
    instructions: [
      "Brown bacon, remove. Brown beef in batches.",
      "Sauté carrots and onions.",
      "Add tomato paste, wine, broth, bay leaves.",
      "Return beef, simmer covered 2 hours until tender.",
      "Add mushrooms last 30 minutes.",
      "Remove bay leaves, serve over egg noodles."
    ]
  },
  {
    id: "one-pot-creamy-tuscan-chicken",
    name: "Creamy Tuscan Chicken",
    description: "Chicken in sun-dried tomato cream sauce with spinach.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Italian",
    image: onePotCreamyTuscanChickenImg,
    totalTime: 35,
    tags: ["one-pot", "italian", "creamy", "chicken", "glutenfree"],
    nutrition: { calories: 485, protein: 42, carbs: 18, fat: 28, fiber: 3, sugar: 6, servingSize: "1 serving" },
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1/2", unit: "cup", item: "chicken broth" },
      { amount: "1/2", unit: "cup", item: "sun-dried tomatoes, chopped" },
      { amount: "3", unit: "cups", item: "fresh spinach" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" }
    ],
    instructions: [
      "Season and brown chicken on both sides, remove.",
      "Sauté garlic until fragrant.",
      "Add cream, broth, sun-dried tomatoes, Italian seasoning.",
      "Return chicken, simmer 15 minutes until cooked through.",
      "Stir in spinach until wilted.",
      "Add parmesan, stir until melted.",
      "Serve over pasta or rice."
    ]
  },
  {
    id: "one-pot-chili-con-carne",
    name: "Chili Con Carne",
    description: "Hearty beef chili with beans and warm spices.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "Tex-Mex",
    image: "https://i.imgur.com/4oMP3gt.png",
    totalTime: 60,
    tags: ["one-pot", "chili", "beef", "comfort-food", "glutenfree"],
    nutrition: { calories: 425, protein: 32, carbs: 38, fat: 16, fiber: 12, sugar: 8, servingSize: "1 serving" },
    ingredients: [
      { amount: "2", unit: "lbs", item: "ground beef" },
      { amount: "2", unit: "cans", item: "kidney beans (15 oz each)" },
      { amount: "1", unit: "can", item: "diced tomatoes (28 oz)" },
      { amount: "1", unit: "can", item: "tomato sauce (15 oz)" },
      { amount: "2", unit: "", item: "bell peppers, diced" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "tbsp", item: "chili powder" },
      { amount: "1", unit: "tbsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "cayenne pepper" }
    ],
    instructions: [
      "Brown ground beef with onion, drain fat.",
      "Add peppers, cook 5 minutes.",
      "Stir in chili powder, cumin, cayenne.",
      "Add tomatoes, sauce, beans.",
      "Simmer uncovered 45 minutes, stirring occasionally.",
      "Serve with shredded cheese, sour cream, cornbread."
    ]
  },
  {
    id: "one-pot-seafood-paella",
    name: "Seafood Paella",
    description: "Spanish rice with shrimp, mussels, and saffron.",
    cookTime: "35 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Spanish",
    image: "https://i.imgur.com/6yOmyFt.png",
    totalTime: 55,
    tags: ["one-pot", "seafood", "spanish", "rice", "glutenfree"],
    nutrition: { calories: 485, protein: 36, carbs: 62, fat: 12, fiber: 4, sugar: 6, servingSize: "1 serving" },
    ingredients: [
      { amount: "1", unit: "lb", item: "shrimp, peeled" },
      { amount: "1", unit: "lb", item: "mussels, cleaned" },
      { amount: "2", unit: "cups", item: "bomba or arborio rice" },
      { amount: "4", unit: "cups", item: "seafood stock" },
      { amount: "1", unit: "tsp", item: "saffron threads" },
      { amount: "1", unit: "", item: "bell pepper, diced" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "cup", item: "peas" },
      { amount: "1", unit: "", item: "lemon, cut into wedges" }
    ],
    instructions: [
      "Toast saffron, steep in warm stock.",
      "Sauté onion, pepper, garlic until soft.",
      "Add rice, toast 2 minutes.",
      "Pour in saffron stock, don't stir.",
      "Simmer 20 minutes without stirring.",
      "Nestle shrimp and mussels in rice.",
      "Add peas, cover, cook 10 minutes until seafood is done.",
      "Serve with lemon wedges."
    ]
  },
  {
    id: "one-pot-chicken-cacciatore",
    name: "Chicken Cacciatore",
    description: "Italian braised chicken with tomatoes, peppers, and olives.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Italian",
    image: "https://i.imgur.com/2Mfu90S.png",
    totalTime: 60,
    tags: ["one-pot", "italian", "chicken", "braised", "glutenfree"],
    nutrition: { calories: 425, protein: 38, carbs: 24, fat: 20, fiber: 6, sugar: 12, servingSize: "1 serving" },
    ingredients: [
      { amount: "3", unit: "lbs", item: "chicken pieces" },
      { amount: "1", unit: "can", item: "crushed tomatoes (28 oz)" },
      { amount: "2", unit: "", item: "bell peppers, sliced" },
      { amount: "1", unit: "cup", item: "sliced mushrooms" },
      { amount: "1/2", unit: "cup", item: "kalamata olives" },
      { amount: "1", unit: "", item: "onion, sliced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1/2", unit: "cup", item: "white wine" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" }
    ],
    instructions: [
      "Brown chicken on all sides, remove.",
      "Sauté onion, peppers, mushrooms until soft.",
      "Add garlic, cook 1 minute.",
      "Pour in wine, scrape up browned bits.",
      "Add tomatoes, olives, Italian seasoning.",
      "Return chicken, submerge in sauce.",
      "Simmer covered 45 minutes until tender.",
      "Serve over pasta or polenta."
    ]
  },
  {
    id: "one-pot-moroccan-tagine",
    name: "Moroccan Lamb Tagine",
    description: "Slow-cooked lamb with apricots, almonds, and warm spices.",
    cookTime: "2 hours",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Moroccan",
    image: "https://i.imgur.com/O33mI4V.png",
    totalTime: 140,
    tags: ["one-pot", "moroccan", "lamb", "exotic", "glutenfree"],
    nutrition: { calories: 565, protein: 42, carbs: 38, fat: 28, fiber: 8, sugar: 18, servingSize: "1 serving" },
    ingredients: [
      { amount: "2", unit: "lbs", item: "lamb shoulder, cubed" },
      { amount: "1", unit: "cup", item: "dried apricots" },
      { amount: "1/2", unit: "cup", item: "sliced almonds" },
      { amount: "2", unit: "cups", item: "chickpeas, cooked" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "2", unit: "tsp", item: "cinnamon" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "ginger" },
      { amount: "2", unit: "cups", item: "lamb stock" },
      { amount: "2", unit: "tbsp", item: "honey" }
    ],
    instructions: [
      "Brown lamb in batches, remove.",
      "Sauté onion until soft.",
      "Add spices, cook until fragrant.",
      "Return lamb, add stock, chickpeas, apricots, honey.",
      "Bring to boil, reduce to low.",
      "Simmer covered 2 hours until lamb is tender.",
      "Toast almonds, sprinkle over tagine.",
      "Serve over couscous."
    ]
  },
  {
    id: "one-pot-tuscan-white-bean-soup",
    name: "Tuscan White Bean Soup",
    description: "Creamy soup with white beans, kale, and Italian sausage.",
    cookTime: "35 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Italian",
    image: "https://i.imgur.com/FnaU4RH.png",
    totalTime: 50,
    tags: ["one-pot", "soup", "italian", "comfort-food", "glutenfree"],
    nutrition: { calories: 385, protein: 24, carbs: 42, fat: 14, fiber: 12, sugar: 6, servingSize: "1 serving" },
    ingredients: [
      { amount: "1", unit: "lb", item: "Italian sausage" },
      { amount: "2", unit: "cans", item: "white beans (15 oz each)" },
      { amount: "4", unit: "cups", item: "chicken broth" },
      { amount: "4", unit: "cups", item: "chopped kale" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/4", unit: "cup", item: "parmesan cheese" }
    ],
    instructions: [
      "Brown sausage, breaking into pieces.",
      "Add onion, cook until soft.",
      "Add garlic and Italian seasoning, cook 1 minute.",
      "Pour in broth and beans.",
      "Simmer 20 minutes.",
      "Mash some beans against pot for thickness.",
      "Stir in kale, cook until wilted.",
      "Serve with parmesan."
    ]
  },
  {
    id: "one-pot-chicken-tikka-masala",
    name: "Chicken Tikka Masala",
    description: "Creamy Indian curry with tender marinated chicken.",
    cookTime: "30 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Indian",
    image: "https://i.imgur.com/GXpcv9X.png",
    totalTime: 50,
    tags: ["one-pot", "indian", "curry", "creamy", "glutenfree"],
    nutrition: { calories: 485, protein: 38, carbs: 28, fat: 26, fiber: 6, sugar: 12, servingSize: "1 serving" },
    ingredients: [
      { amount: "2", unit: "lbs", item: "chicken thighs, cubed" },
      { amount: "1", unit: "cup", item: "yogurt" },
      { amount: "1", unit: "can", item: "crushed tomatoes (28 oz)" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "garam masala" },
      { amount: "2", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "1", unit: "tsp", item: "turmeric" }
    ],
    instructions: [
      "Marinate chicken in yogurt and half the spices 20 mins.",
      "Sauté onion until golden.",
      "Add garlic and remaining spices, cook 1 minute.",
      "Add tomatoes, simmer 10 minutes.",
      "Add chicken with marinade, simmer 15 minutes.",
      "Stir in cream, simmer 5 more minutes.",
      "Serve with basmati rice and naan."
    ]
  },
  {
    id: "one-pot-pot-roast",
    name: "Classic Pot Roast",
    description: "Tender braised beef with carrots, potatoes, and gravy.",
    cookTime: "3 hours",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "American",
    image: "https://i.imgur.com/IQHQEXN.png",
    totalTime: 200,
    tags: ["one-pot", "beef", "comfort-food", "sunday-dinner", "glutenfree"],
    nutrition: { calories: 525, protein: 48, carbs: 32, fat: 22, fiber: 6, sugar: 8, servingSize: "1 serving" },
    ingredients: [
      { amount: "3", unit: "lbs", item: "beef chuck roast" },
      { amount: "1", unit: "lb", item: "carrots, chunked" },
      { amount: "1.5", unit: "lbs", item: "potatoes, quartered" },
      { amount: "2", unit: "", item: "onions, quartered" },
      { amount: "3", unit: "cups", item: "beef broth" },
      { amount: "2", unit: "tbsp", item: "tomato paste" },
      { amount: "2", unit: "tbsp", item: "Worcestershire sauce" },
      { amount: "2", unit: "", item: "bay leaves" },
      { amount: "1", unit: "tsp", item: "dried thyme" }
    ],
    instructions: [
      "Season roast generously with salt and pepper.",
      "Brown on all sides in Dutch oven.",
      "Remove roast, sauté onions.",
      "Add tomato paste, cook 1 minute.",
      "Pour in broth, Worcestershire, bay leaves, thyme.",
      "Return roast, add carrots and potatoes.",
      "Cover, braise at 300°F for 3 hours until tender.",
      "Remove bay leaves, slice and serve with vegetables and gravy."
    ]
  }
  // ... Continue with remaining 10 one-pot recipes
];
