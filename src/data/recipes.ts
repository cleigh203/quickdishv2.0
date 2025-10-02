import { Recipe } from "@/types/recipe";

// Import AI-generated images
import mummyDogsImg from "@/assets/recipes/mummy-dogs.jpg";
import burritoBowlImg from "@/assets/recipes/copycat-burrito-bowl.jpg";
import honeyGarlicChickenImg from "@/assets/recipes/quick-honey-garlic-chicken.jpg";
import pizzaFrittataImg from "@/assets/recipes/leftover-pizza-frittata.jpg";
import witchFingersImg from "@/assets/recipes/witch-finger-cookies.jpg";
import alfredoImg from "@/assets/recipes/copycat-alfredo.jpg";
import shrimpStirfryImg from "@/assets/recipes/quick-shrimp-stirfry.jpg";
import chickenTacosImg from "@/assets/recipes/leftover-chicken-tacos.jpg";
import bloodyMaryEggsImg from "@/assets/recipes/bloody-mary-eggs.jpg";
import crunchwrapImg from "@/assets/recipes/copycat-crunchwrap.jpg";
import lemonSalmonImg from "@/assets/recipes/quick-lemon-salmon.jpg";
import friedRiceImg from "@/assets/recipes/leftover-fried-rice.jpg";
import spiderPizzaImg from "@/assets/recipes/spider-web-pizza-new.jpg";
import avocadoRollsImg from "@/assets/recipes/copycat-avocado-rolls.jpg";
import beefBroccoliImg from "@/assets/recipes/quick-beef-broccoli.jpg";
import bloominOnionImg from "@/assets/recipes/copycat-bloomin-onion.jpg";
import thaiBasilImg from "@/assets/recipes/quick-thai-basil-chicken.jpg";
import pastaCarbonaraImg from "@/assets/recipes/leftover-pasta-carbonara.jpg";
import graveyardCupsImg from "@/assets/recipes/graveyard-dirt-cups.jpg";
import broccoliSoupImg from "@/assets/recipes/copycat-broccoli-soup.jpg";
import tuscanShrimpImg from "@/assets/recipes/quick-tuscan-shrimp.jpg";
import potatoCroquettesImg from "@/assets/recipes/leftover-potato-croquettes.jpg";
import monsterSmoothieImg from "@/assets/recipes/monster-smoothie-bowl.jpg";
import lettuceWrapsImg from "@/assets/recipes/copycat-lettuce-wraps.jpg";
import capreseChickenImg from "@/assets/recipes/quick-caprese-chicken.jpg";
import turkeyQuesadillasImg from "@/assets/recipes/leftover-turkey-quesadillas.jpg";
import frankensteinTreatsImg from "@/assets/recipes/frankenstein-treats.jpg";
import cheddarBiscuitsImg from "@/assets/recipes/copycat-cheddar-biscuits.jpg";
import teriyakiSalmonImg from "@/assets/recipes/quick-teriyaki-salmon.jpg";
import frenchDipImg from "@/assets/recipes/leftover-french-dip.jpg";
import pumpkinDonutsImg from "@/assets/recipes/pumpkin-donuts.jpg";
import chickenSandwichImg from "@/assets/recipes/copycat-chicken-sandwich.jpg";
import sesameNoodlesImg from "@/assets/recipes/quick-sesame-noodles.jpg";
import hamHashImg from "@/assets/recipes/leftover-ham-hash.jpg";
import ghostMeringuesImg from "@/assets/recipes/ghost-meringues.jpg";
import cornSalsaImg from "@/assets/recipes/copycat-corn-salsa.jpg";
import chickenFajitasImg from "@/assets/recipes/quick-chicken-fajitas.jpg";
import steakQuesadillaImg from "@/assets/recipes/leftover-steak-quesadilla.jpg";
import caramelAppleImg from "@/assets/recipes/caramel-apple-slices.jpg";
import roadhouseRollsImg from "@/assets/recipes/copycat-roadhouse-rolls.jpg";
import kungPaoImg from "@/assets/recipes/quick-kung-pao-chicken.jpg";
import burgerSlidersImg from "@/assets/recipes/leftover-burger-sliders.jpg";
import batNachosImg from "@/assets/recipes/bat-wing-nachos.jpg";
import eggBitesImg from "@/assets/recipes/copycat-egg-bites.jpg";
import shrimpScampiImg from "@/assets/recipes/quick-shrimp-scampi.jpg";
import sausageBurritoImg from "@/assets/recipes/leftover-sausage-burrito.jpg";
import poisonAppleImg from "@/assets/recipes/poison-apple-cocktail.jpg";
import animalFriesImg from "@/assets/recipes/copycat-animal-fries.jpg";
import mongolianBeefImg from "@/assets/recipes/quick-mongolian-beef.jpg";
import porkNachosImg from "@/assets/recipes/leftover-pork-nachos.jpg";
import eyeballMeatballsImg from "@/assets/recipes/eyeball-meatballs.jpg";
import hashbrownCasseroleImg from "@/assets/recipes/copycat-hashbrown-casserole.jpg";
import greekChickenImg from "@/assets/recipes/quick-greek-chicken.jpg";
import brisketMacImg from "@/assets/recipes/leftover-brisket-mac.jpg";
import mcgriddlesImg from "@/assets/recipes/copycat-mcgriddles.jpg";
import steakBitesImg from "@/assets/recipes/quick-steak-bites.jpg";
import stuffingMuffinsImg from "@/assets/recipes/leftover-stuffing-muffins.jpg";
import meatballSubImg from "@/assets/recipes/copycat-meatball-sub.jpg";
import padThaiImg from "@/assets/recipes/quick-pad-thai.jpg";
import salmonSaladImg from "@/assets/recipes/leftover-salmon-salad.jpg";

// Dessert images are served from Lovable uploads

export const allRecipes: Recipe[] = [
  // ========== DESSERTS (25) ==========
  {
    id: "dessert-tiramisu",
    name: "Classic Tiramisu",
    description: "Italian coffee-soaked ladyfingers with creamy mascarpone. Restaurant quality.",
    cookTime: "0 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Italian",
    image: "/lovable-uploads/dessert-tiramisu.png",
    totalTime: 30,
    tags: ["dessert", "italian", "coffee", "no-bake"],
    ingredients: [
      { amount: "6", unit: "", item: "egg yolks" },
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "16", unit: "oz", item: "mascarpone cheese" },
      { amount: "1.5", unit: "cups", item: "heavy cream" },
      { amount: "2", unit: "cups", item: "strong espresso, cooled" },
      { amount: "3", unit: "tbsp", item: "coffee liqueur" },
      { amount: "24", unit: "", item: "ladyfinger cookies" },
      { amount: "2", unit: "tbsp", item: "cocoa powder" }
    ],
    instructions: [
      "Whisk [6 egg yolks] and [3/4 cup sugar] in bowl over simmering water until thick.",
      "Remove from heat, beat in [16 oz mascarpone] until smooth.",
      "Whip [1.5 cups cream] to stiff peaks, fold into mascarpone mixture.",
      "Mix [2 cups espresso] with [3 tbsp liqueur] in shallow dish.",
      "Quickly dip [24 ladyfingers] in coffee, arrange in 9x13 dish.",
      "Spread half the mascarpone cream over ladyfingers.",
      "Repeat with second layer of dipped ladyfingers and cream.",
      "Dust with [2 tbsp cocoa powder], refrigerate 4 hours before serving."
    ]
  },
  {
    id: "dessert-cheesecake",
    name: "New York Cheesecake",
    description: "Dense, creamy cheesecake with graham cracker crust. Perfection.",
    cookTime: "60 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "American",
    image: "/lovable-uploads/dessert-cheesecake.png",
    totalTime: 80,
    tags: ["dessert", "baked", "american", "rich"],
    ingredients: [
      { amount: "2", unit: "cups", item: "graham cracker crumbs" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "32", unit: "oz", item: "cream cheese, softened" },
      { amount: "1.25", unit: "cups", item: "sugar" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "2", unit: "tsp", item: "vanilla extract" },
      { amount: "1", unit: "cup", item: "sour cream" }
    ],
    instructions: [
      "Preheat oven to 325°F. Mix [2 cups graham crumbs] with [1/2 cup melted butter].",
      "Press into 9-inch springform pan, bake 10 minutes.",
      "Beat [32 oz cream cheese] and [1.25 cups sugar] until smooth.",
      "Add [4 eggs] one at a time, then [2 tsp vanilla] and [1 cup sour cream].",
      "Pour over crust, bake 60 minutes until center barely jiggles.",
      "Turn off oven, crack door, let cool 1 hour.",
      "Refrigerate 4 hours before serving."
    ]
  },
  {
    id: "dessert-brownies",
    name: "Fudgy Chocolate Brownies",
    description: "Ultra fudgy brownies with crackly tops. Better than boxed mix.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 16,
    cuisine: "American",
    image: "/lovable-uploads/dessert-brownies.png",
    totalTime: 40,
    tags: ["dessert", "chocolate", "baked", "easy"],
    ingredients: [
      { amount: "1", unit: "cup", item: "butter" },
      { amount: "2", unit: "cups", item: "sugar" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "3/4", unit: "cup", item: "cocoa powder" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "1", unit: "cup", item: "chocolate chips" }
    ],
    instructions: [
      "Preheat oven to 350°F. Grease 9x13 pan.",
      "Melt [1 cup butter], stir in [2 cups sugar].",
      "Beat in [4 eggs] one at a time.",
      "Sift [3/4 cup cocoa], [1 cup flour], [1/2 tsp salt], fold into batter.",
      "Fold in [1 cup chocolate chips].",
      "Spread in pan, bake 25-30 minutes until toothpick has moist crumbs.",
      "Cool completely before cutting."
    ]
  },
  {
    id: "dessert-macarons",
    name: "French Macarons",
    description: "Delicate almond meringue cookies with buttercream. Worth the effort.",
    cookTime: "15 mins",
    prepTime: "45 mins",
    difficulty: "hard",
    servings: 24,
    cuisine: "French",
    image: "/lovable-uploads/dessert-macarons.png",
    totalTime: 60,
    tags: ["dessert", "french", "baked", "elegant"],
    ingredients: [
      { amount: "1.75", unit: "cups", item: "powdered sugar" },
      { amount: "1", unit: "cup", item: "almond flour" },
      { amount: "3", unit: "", item: "egg whites" },
      { amount: "1/4", unit: "cup", item: "granulated sugar" },
      { amount: "1/4", unit: "tsp", item: "cream of tartar" },
      { amount: "1", unit: "cup", item: "butter, softened" },
      { amount: "2", unit: "cups", item: "powdered sugar (for filling)" },
      { amount: "1", unit: "tsp", item: "vanilla extract" }
    ],
    instructions: [
      "Sift [1.75 cups powdered sugar] and [1 cup almond flour] together 3 times.",
      "Beat [3 egg whites] and [1/4 tsp cream of tartar] to soft peaks.",
      "Gradually add [1/4 cup sugar], beat to stiff, glossy peaks.",
      "Fold dry ingredients into meringue in 3 additions until lava-like.",
      "Pipe 1.5-inch circles on parchment, tap pan, let sit 30 minutes.",
      "Bake at 300°F for 13-15 minutes. Cool completely.",
      "Beat [1 cup butter], [2 cups powdered sugar], [1 tsp vanilla] for filling.",
      "Sandwich cookies with buttercream, refrigerate before serving."
    ]
  },
  {
    id: "dessert-creme-brulee",
    name: "Crème Brûlée",
    description: "Silky vanilla custard with caramelized sugar crust. Torch required.",
    cookTime: "40 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "French",
    image: "/lovable-uploads/dessert-creme-brulee.png",
    totalTime: 55,
    tags: ["dessert", "french", "elegant", "custard"],
    ingredients: [
      { amount: "2", unit: "cups", item: "heavy cream" },
      { amount: "1", unit: "", item: "vanilla bean" },
      { amount: "5", unit: "", item: "egg yolks" },
      { amount: "1/2", unit: "cup", item: "sugar" },
      { amount: "6", unit: "tbsp", item: "sugar (for topping)" }
    ],
    instructions: [
      "Preheat oven to 325°F. Heat [2 cups cream] with [1 vanilla bean] seeds until steaming.",
      "Whisk [5 egg yolks] and [1/2 cup sugar] until pale.",
      "Slowly whisk hot cream into yolks, strain.",
      "Pour into 6 ramekins, place in roasting pan with hot water halfway up sides.",
      "Bake 35-40 minutes until edges set but centers jiggle.",
      "Refrigerate 4 hours.",
      "Sprinkle [1 tbsp sugar] on each, caramelize with torch."
    ]
  },
  {
    id: "dessert-apple-pie",
    name: "Classic Apple Pie",
    description: "Buttery crust with cinnamon apple filling. All-American classic.",
    cookTime: "50 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "American",
    image: "/lovable-uploads/dessert-apple-pie.png",
    totalTime: 80,
    tags: ["dessert", "baked", "american", "fruit"],
    ingredients: [
      { amount: "2", unit: "", item: "pie crusts" },
      { amount: "6", unit: "cups", item: "sliced apples" },
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "2", unit: "tbsp", item: "flour" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1/4", unit: "tsp", item: "nutmeg" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "", item: "egg" }
    ],
    instructions: [
      "Preheat oven to 425°F. Line 9-inch pie pan with one crust.",
      "Toss [6 cups apples], [3/4 cup sugar], [2 tbsp flour], [1 tsp cinnamon], [1/4 tsp nutmeg].",
      "Pour filling into crust, dot with [2 tbsp butter].",
      "Cover with second crust, crimp edges, cut vents.",
      "Brush with beaten [egg], sprinkle with sugar.",
      "Bake 15 minutes at 425°F, reduce to 350°F, bake 35 more minutes.",
      "Cool 2 hours before slicing."
    ]
  },
  {
    id: "dessert-lava-cake",
    name: "Chocolate Lava Cake",
    description: "Individual cakes with molten chocolate center. Impress anyone.",
    cookTime: "12 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "French",
    image: "/lovable-uploads/dessert-lava-cake.png",
    totalTime: 27,
    tags: ["dessert", "chocolate", "elegant", "quick"],
    ingredients: [
      { amount: "6", unit: "oz", item: "dark chocolate" },
      { amount: "1/2", unit: "cup", item: "butter" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "2", unit: "", item: "egg yolks" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "2", unit: "tbsp", item: "flour" },
      { amount: "1", unit: "tsp", item: "vanilla extract" }
    ],
    instructions: [
      "Preheat oven to 425°F. Butter and cocoa 4 ramekins.",
      "Melt [6 oz chocolate] and [1/2 cup butter] together.",
      "Whisk [2 eggs], [2 yolks], [1/4 cup sugar] until thick.",
      "Fold in chocolate, then [2 tbsp flour] and [1 tsp vanilla].",
      "Divide among ramekins, bake 12-14 minutes until edges set.",
      "Let sit 1 minute, invert onto plates.",
      "Serve immediately with vanilla ice cream."
    ]
  },
  {
    id: "dessert-pavlova",
    name: "Pavlova",
    description: "Crispy meringue with whipped cream and fresh berries. Show-stopper.",
    cookTime: "90 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Australian",
    image: "/lovable-uploads/dessert-pavlova.png",
    totalTime: 110,
    tags: ["dessert", "meringue", "fruit", "elegant"],
    ingredients: [
      { amount: "4", unit: "", item: "egg whites" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1", unit: "tsp", item: "cornstarch" },
      { amount: "1", unit: "tsp", item: "white vinegar" },
      { amount: "2", unit: "cups", item: "heavy cream" },
      { amount: "2", unit: "tbsp", item: "powdered sugar" },
      { amount: "3", unit: "cups", item: "mixed berries" }
    ],
    instructions: [
      "Preheat oven to 300°F. Draw 8-inch circle on parchment.",
      "Beat [4 egg whites] to soft peaks, gradually add [1 cup sugar].",
      "Beat to stiff peaks, fold in [1 tsp cornstarch] and [1 tsp vinegar].",
      "Spread meringue in circle, creating slight well in center.",
      "Bake 90 minutes, turn off oven, leave inside 1 hour.",
      "Whip [2 cups cream] with [2 tbsp powdered sugar].",
      "Top cooled meringue with cream and [3 cups berries]."
    ]
  },
  {
    id: "dessert-baklava",
    name: "Baklava",
    description: "Flaky phyllo with honey and nuts. Middle Eastern perfection.",
    cookTime: "45 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 24,
    cuisine: "Middle Eastern",
    image: "/lovable-uploads/dessert-baklava.png",
    totalTime: 75,
    tags: ["dessert", "nuts", "honey", "baked"],
    ingredients: [
      { amount: "16", unit: "oz", item: "phyllo dough" },
      { amount: "1", unit: "cup", item: "butter, melted" },
      { amount: "3", unit: "cups", item: "chopped walnuts" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1", unit: "cup", item: "water" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1/2", unit: "cup", item: "honey" }
    ],
    instructions: [
      "Preheat oven to 350°F. Mix [3 cups walnuts] with [1 tsp cinnamon].",
      "Brush 9x13 pan with [butter], layer 8 sheets [phyllo], brushing each with butter.",
      "Sprinkle 1 cup nut mixture, layer 5 sheets phyllo with butter.",
      "Repeat layers twice, top with 8 sheets phyllo.",
      "Cut into diamonds, bake 45 minutes until golden.",
      "Simmer [1 cup water], [1 cup sugar], [1/2 cup honey] 10 minutes.",
      "Pour hot syrup over warm baklava, cool completely."
    ]
  },
  {
    id: "dessert-churros",
    name: "Churros",
    description: "Fried dough with cinnamon sugar and chocolate sauce. Addictive.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Spanish",
    image: "/lovable-uploads/dessert-churros.png",
    totalTime: 35,
    tags: ["dessert", "fried", "cinnamon", "spanish"],
    ingredients: [
      { amount: "1", unit: "cup", item: "water" },
      { amount: "2", unit: "tbsp", item: "sugar" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "2", unit: "tbsp", item: "vegetable oil" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1/2", unit: "cup", item: "sugar (for coating)" },
      { amount: "1", unit: "tsp", item: "cinnamon" }
    ],
    instructions: [
      "Heat [1 cup water], [2 tbsp sugar], [1/2 tsp salt], [2 tbsp oil] to boiling.",
      "Remove from heat, stir in [1 cup flour] until smooth.",
      "Beat in [2 eggs] one at a time until glossy.",
      "Heat 2 inches oil to 375°F.",
      "Pipe 4-inch strips into hot oil, fry until golden, about 2 minutes per side.",
      "Drain on paper towels.",
      "Roll in mixture of [1/2 cup sugar] and [1 tsp cinnamon]."
    ]
  },
  {
    id: "dessert-panna-cotta",
    name: "Panna Cotta",
    description: "Silky Italian cream dessert with berry compote. Elegant and easy.",
    cookTime: "5 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Italian",
    image: "/lovable-uploads/dessert-panna-cotta.png",
    totalTime: 15,
    tags: ["dessert", "italian", "no-bake", "elegant"],
    ingredients: [
      { amount: "2", unit: "cups", item: "heavy cream" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "2.5", unit: "tsp", item: "gelatin powder" },
      { amount: "3", unit: "tbsp", item: "cold water" },
      { amount: "2", unit: "cups", item: "mixed berries" }
    ],
    instructions: [
      "Sprinkle [2.5 tsp gelatin] over [3 tbsp cold water], let bloom 5 minutes.",
      "Heat [2 cups cream] and [1/4 cup sugar] until sugar dissolves.",
      "Remove from heat, stir in gelatin until dissolved.",
      "Add [1 tsp vanilla], pour into 6 ramekins.",
      "Refrigerate 4 hours until set.",
      "Top with [mixed berries] before serving."
    ]
  },
  {
    id: "dessert-cannoli",
    name: "Cannoli",
    description: "Crispy shells filled with sweet ricotta. Italian bakery classic.",
    cookTime: "5 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Italian",
    image: "/lovable-uploads/dessert-cannoli.png",
    totalTime: 35,
    tags: ["dessert", "italian", "fried", "ricotta"],
    ingredients: [
      { amount: "12", unit: "", item: "cannoli shells" },
      { amount: "2", unit: "cups", item: "ricotta cheese" },
      { amount: "1", unit: "cup", item: "powdered sugar" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "1/2", unit: "cup", item: "mini chocolate chips" },
      { amount: "1/4", unit: "cup", item: "chopped pistachios" }
    ],
    instructions: [
      "Beat [2 cups ricotta], [1 cup powdered sugar], [1 tsp vanilla] until smooth.",
      "Fold in [1/2 cup mini chocolate chips].",
      "Transfer filling to piping bag.",
      "Fill [12 cannoli shells] just before serving.",
      "Dip ends in [1/4 cup pistachios].",
      "Dust with powdered sugar."
    ]
  },
  {
    id: "dessert-bread-pudding",
    name: "Bread Pudding",
    description: "Warm custard-soaked bread with vanilla sauce. Ultimate comfort dessert.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "American",
    image: "/lovable-uploads/dessert-bread-pudding.png",
    totalTime: 60,
    tags: ["dessert", "comfort", "baked", "warm"],
    ingredients: [
      { amount: "8", unit: "cups", item: "cubed bread" },
      { amount: "4", unit: "cups", item: "milk" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "2", unit: "tsp", item: "vanilla extract" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1/2", unit: "cup", item: "raisins" }
    ],
    instructions: [
      "Preheat oven to 350°F. Place [8 cups bread] in greased 9x13 dish.",
      "Whisk [4 cups milk], [4 eggs], [1 cup sugar], [2 tsp vanilla], [1 tsp cinnamon].",
      "Pour over bread, press down, let soak 10 minutes.",
      "Scatter [1/2 cup raisins] over top.",
      "Bake 45 minutes until golden and set.",
      "Serve warm with vanilla sauce or ice cream."
    ]
  },
  {
    id: "dessert-flan",
    name: "Flan",
    description: "Silky caramel custard. Latin American favorite.",
    cookTime: "50 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Latin American",
    image: "/lovable-uploads/dessert-flan.png",
    totalTime: 65,
    tags: ["dessert", "custard", "caramel", "baked"],
    ingredients: [
      { amount: "1", unit: "cup", item: "sugar (for caramel)" },
      { amount: "5", unit: "", item: "eggs" },
      { amount: "1", unit: "can", item: "sweetened condensed milk" },
      { amount: "1", unit: "can", item: "evaporated milk" },
      { amount: "1", unit: "cup", item: "whole milk" },
      { amount: "1", unit: "tsp", item: "vanilla extract" }
    ],
    instructions: [
      "Preheat oven to 350°F. Melt [1 cup sugar] in pan until golden, pour into 9-inch round pan.",
      "Blend [5 eggs], [condensed milk], [evaporated milk], [1 cup milk], [1 tsp vanilla].",
      "Pour over caramel, place in roasting pan with hot water halfway up.",
      "Bake 50 minutes until set with slight jiggle.",
      "Cool, refrigerate 4 hours.",
      "Run knife around edge, invert onto serving plate."
    ]
  },
  {
    id: "dessert-eclairs",
    name: "Chocolate Éclairs",
    description: "Choux pastry with cream filling and chocolate glaze. French bakery perfection.",
    cookTime: "30 mins",
    prepTime: "30 mins",
    difficulty: "hard",
    servings: 12,
    cuisine: "French",
    image: "/lovable-uploads/dessert-eclairs.png",
    totalTime: 60,
    tags: ["dessert", "french", "pastry", "chocolate"],
    ingredients: [
      { amount: "1", unit: "cup", item: "water" },
      { amount: "1/2", unit: "cup", item: "butter" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "2", unit: "cups", item: "heavy cream" },
      { amount: "1/4", unit: "cup", item: "powdered sugar" },
      { amount: "8", unit: "oz", item: "dark chocolate" }
    ],
    instructions: [
      "Preheat oven to 400°F. Boil [1 cup water] and [1/2 cup butter].",
      "Add [1 cup flour] all at once, stir until ball forms.",
      "Beat in [4 eggs] one at a time until smooth and glossy.",
      "Pipe 4-inch strips on parchment, bake 30 minutes until golden.",
      "Cool completely, split lengthwise.",
      "Whip [2 cups cream] with [1/4 cup powdered sugar], pipe into shells.",
      "Melt [8 oz chocolate], dip tops, let set."
    ]
  },
  {
    id: "dessert-tres-leches",
    name: "Tres Leches Cake",
    description: "Ultra-moist sponge cake soaked in three milks. Ridiculously good.",
    cookTime: "30 mins",
    prepTime: "20 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "Latin American",
    image: "/lovable-uploads/dessert-tres-leches.png",
    totalTime: 50,
    tags: ["dessert", "cake", "moist", "latin"],
    ingredients: [
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "1.5", unit: "tsp", item: "baking powder" },
      { amount: "5", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1/3", unit: "cup", item: "milk" },
      { amount: "1", unit: "can", item: "evaporated milk" },
      { amount: "1", unit: "can", item: "sweetened condensed milk" },
      { amount: "1/2", unit: "cup", item: "heavy cream" }
    ],
    instructions: [
      "Preheat oven to 350°F. Grease 9x13 pan.",
      "Beat [5 eggs] and [1 cup sugar] 5 minutes until thick.",
      "Fold in [1 cup flour] and [1.5 tsp baking powder], then [1/3 cup milk].",
      "Pour into pan, bake 30 minutes until golden.",
      "Poke holes all over warm cake.",
      "Mix [evaporated milk], [condensed milk], [1/2 cup cream], pour over cake.",
      "Refrigerate 4 hours, top with whipped cream."
    ]
  },
  {
    id: "dessert-cinnamon-rolls",
    name: "Cinnamon Rolls",
    description: "Soft, fluffy rolls with cinnamon sugar and cream cheese frosting. Better than Cinnabon.",
    cookTime: "25 mins",
    prepTime: "40 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "American",
    image: "/lovable-uploads/dessert-cinnamon-rolls.png",
    totalTime: 65,
    tags: ["dessert", "breakfast", "baked", "cinnamon"],
    ingredients: [
      { amount: "3.5", unit: "cups", item: "flour" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "1", unit: "packet", item: "instant yeast" },
      { amount: "1", unit: "cup", item: "warm milk" },
      { amount: "1/3", unit: "cup", item: "butter, melted" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1", unit: "cup", item: "brown sugar" },
      { amount: "2", unit: "tbsp", item: "cinnamon" },
      { amount: "8", unit: "oz", item: "cream cheese" }
    ],
    instructions: [
      "Mix [3.5 cups flour], [1/4 cup sugar], [yeast]. Add [1 cup milk], [1/3 cup butter], [1 egg].",
      "Knead 5 minutes, let rise 1 hour until doubled.",
      "Roll into 16x12 rectangle, brush with butter.",
      "Mix [1 cup brown sugar] and [2 tbsp cinnamon], sprinkle over dough.",
      "Roll up tightly, cut into 12 rolls, place in greased 9x13 pan.",
      "Let rise 30 minutes, bake at 350°F for 25 minutes.",
      "Beat [8 oz cream cheese], powdered sugar, and vanilla, spread on warm rolls."
    ]
  },
  {
    id: "dessert-molten-cookies",
    name: "Chocolate Chip Cookies",
    description: "Thick, chewy cookies with crispy edges. The perfect cookie.",
    cookTime: "12 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 24,
    cuisine: "American",
    image: "/lovable-uploads/dessert-cookies.png",
    totalTime: 27,
    tags: ["dessert", "cookies", "chocolate", "easy"],
    ingredients: [
      { amount: "2.25", unit: "cups", item: "flour" },
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "1", unit: "cup", item: "butter, softened" },
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "3/4", unit: "cup", item: "brown sugar" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "2", unit: "tsp", item: "vanilla extract" },
      { amount: "2", unit: "cups", item: "chocolate chips" }
    ],
    instructions: [
      "Preheat oven to 375°F. Mix [2.25 cups flour] and [1 tsp baking soda].",
      "Beat [1 cup butter], [3/4 cup sugar], [3/4 cup brown sugar] until fluffy.",
      "Beat in [2 eggs] and [2 tsp vanilla].",
      "Stir in flour mixture, then [2 cups chocolate chips].",
      "Drop rounded tablespoons 2 inches apart on ungreased baking sheets.",
      "Bake 9-12 minutes until golden brown.",
      "Cool on baking sheet 2 minutes before removing."
    ]
  },
  {
    id: "dessert-carrot-cake",
    name: "Carrot Cake",
    description: "Moist spiced cake with cream cheese frosting. Surprisingly addictive.",
    cookTime: "35 mins",
    prepTime: "20 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "American",
    image: "/lovable-uploads/dessert-carrot-cake.png",
    totalTime: 55,
    tags: ["dessert", "cake", "spiced", "baked"],
    ingredients: [
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "2", unit: "tsp", item: "baking soda" },
      { amount: "2", unit: "tsp", item: "cinnamon" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1.5", unit: "cups", item: "sugar" },
      { amount: "1", unit: "cup", item: "vegetable oil" },
      { amount: "3", unit: "cups", item: "grated carrots" },
      { amount: "16", unit: "oz", item: "cream cheese frosting" }
    ],
    instructions: [
      "Preheat oven to 350°F. Grease 9x13 pan.",
      "Mix [2 cups flour], [2 tsp baking soda], [2 tsp cinnamon], [1/2 tsp salt].",
      "Beat [4 eggs], [1.5 cups sugar], [1 cup oil] until blended.",
      "Stir in flour mixture, then [3 cups carrots].",
      "Pour into pan, bake 35-40 minutes until toothpick comes clean.",
      "Cool completely, frost with [cream cheese frosting]."
    ]
  },
  {
    id: "dessert-mousse",
    name: "Chocolate Mousse",
    description: "Light and airy chocolate dessert. Elegant and rich.",
    cookTime: "0 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "French",
    image: "/lovable-uploads/dessert-mousse.png",
    totalTime: 20,
    tags: ["dessert", "chocolate", "no-bake", "elegant"],
    ingredients: [
      { amount: "8", unit: "oz", item: "dark chocolate" },
      { amount: "3", unit: "tbsp", item: "butter" },
      { amount: "3", unit: "", item: "egg yolks" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "1.5", unit: "cups", item: "heavy cream" },
      { amount: "3", unit: "", item: "egg whites" }
    ],
    instructions: [
      "Melt [8 oz chocolate] and [3 tbsp butter], cool slightly.",
      "Whisk [3 egg yolks] and [1/4 cup sugar] until thick, fold into chocolate.",
      "Whip [1.5 cups cream] to soft peaks, fold into chocolate mixture.",
      "Beat [3 egg whites] to stiff peaks, gently fold into chocolate.",
      "Divide among 6 serving dishes.",
      "Refrigerate 4 hours before serving."
    ]
  },
  {
    id: "dessert-profiteroles",
    name: "Profiteroles",
    description: "Cream puffs with ice cream and chocolate sauce. French perfection.",
    cookTime: "25 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "French",
    image: "/lovable-uploads/dessert-profiteroles.png",
    totalTime: 45,
    tags: ["dessert", "french", "pastry", "chocolate"],
    ingredients: [
      { amount: "1", unit: "cup", item: "water" },
      { amount: "1/2", unit: "cup", item: "butter" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1", unit: "quart", item: "vanilla ice cream" },
      { amount: "8", unit: "oz", item: "dark chocolate" },
      { amount: "1/2", unit: "cup", item: "heavy cream" }
    ],
    instructions: [
      "Preheat oven to 400°F. Boil [1 cup water] and [1/2 cup butter].",
      "Add [1 cup flour] all at once, stir until ball forms.",
      "Beat in [4 eggs] one at a time until smooth.",
      "Drop tablespoons 2 inches apart, bake 25 minutes until golden.",
      "Cool, split, fill with [vanilla ice cream].",
      "Melt [8 oz chocolate] with [1/2 cup cream], drizzle over puffs."
    ]
  },
  {
    id: "dessert-red-velvet",
    name: "Red Velvet Cake",
    description: "Vibrant red cake with tangy cream cheese frosting. Southern classic.",
    cookTime: "30 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "American",
    image: "/lovable-uploads/dessert-red-velvet.png",
    totalTime: 50,
    tags: ["dessert", "cake", "american", "baked"],
    ingredients: [
      { amount: "2.5", unit: "cups", item: "flour" },
      { amount: "1.5", unit: "cups", item: "sugar" },
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "1", unit: "cup", item: "buttermilk" },
      { amount: "1.5", unit: "cups", item: "vegetable oil" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "2", unit: "tbsp", item: "cocoa powder" },
      { amount: "2", unit: "oz", item: "red food coloring" },
      { amount: "16", unit: "oz", item: "cream cheese frosting" }
    ],
    instructions: [
      "Preheat oven to 350°F. Grease two 9-inch round pans.",
      "Mix [2.5 cups flour], [1.5 cups sugar], [1 tsp baking soda], [2 tbsp cocoa].",
      "Whisk [1 cup buttermilk], [1.5 cups oil], [2 eggs], [2 oz food coloring].",
      "Combine wet and dry ingredients, divide between pans.",
      "Bake 30 minutes until toothpick comes clean.",
      "Cool completely, frost with [cream cheese frosting]."
    ]
  },
  {
    id: "dessert-key-lime-pie",
    name: "Key Lime Pie",
    description: "Tart and creamy with graham crust. Florida classic.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "American",
    image: "/lovable-uploads/dessert-key-lime-pie.png",
    totalTime: 35,
    tags: ["dessert", "citrus", "pie", "easy"],
    ingredients: [
      { amount: "1.5", unit: "cups", item: "graham cracker crumbs" },
      { amount: "1/3", unit: "cup", item: "butter, melted" },
      { amount: "2", unit: "cans", item: "sweetened condensed milk" },
      { amount: "4", unit: "", item: "egg yolks" },
      { amount: "1/2", unit: "cup", item: "key lime juice" },
      { amount: "1", unit: "cup", item: "heavy cream" }
    ],
    instructions: [
      "Preheat oven to 350°F. Mix [1.5 cups graham crumbs] and [1/3 cup butter].",
      "Press into 9-inch pie pan, bake 10 minutes.",
      "Whisk [2 cans condensed milk], [4 egg yolks], [1/2 cup lime juice].",
      "Pour into crust, bake 15 minutes.",
      "Cool, refrigerate 4 hours.",
      "Top with whipped [1 cup cream] before serving."
    ]
  },
  {
    id: "dessert-bananas-foster",
    name: "Bananas Foster",
    description: "Caramelized bananas with rum sauce over vanilla ice cream. Flaming dessert drama.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "American",
    image: "/lovable-uploads/dessert-bananas-foster.png",
    totalTime: 15,
    tags: ["dessert", "quick", "fruit", "warm"],
    ingredients: [
      { amount: "1/4", unit: "cup", item: "butter" },
      { amount: "1/2", unit: "cup", item: "brown sugar" },
      { amount: "1/4", unit: "tsp", item: "cinnamon" },
      { amount: "4", unit: "", item: "bananas, sliced" },
      { amount: "1/4", unit: "cup", item: "dark rum" },
      { amount: "1", unit: "pint", item: "vanilla ice cream" }
    ],
    instructions: [
      "Melt [1/4 cup butter] in skillet over medium heat.",
      "Add [1/2 cup brown sugar] and [1/4 tsp cinnamon], stir until dissolved.",
      "Add [4 sliced bananas], cook 2 minutes until caramelized.",
      "Add [1/4 cup rum], carefully ignite (optional).",
      "Let flames subside or simmer 1 minute.",
      "Serve immediately over [vanilla ice cream]."
    ]
  },
  {
    id: "dessert-lemon-bars",
    name: "Lemon Bars",
    description: "Tangy lemon curd on buttery shortbread. Bright and refreshing.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 16,
    cuisine: "American",
    image: "/lovable-uploads/dessert-lemon-bars.png",
    totalTime: 40,
    tags: ["dessert", "citrus", "baked", "bars"],
    ingredients: [
      { amount: "1", unit: "cup", item: "butter, softened" },
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "1/2", unit: "cup", item: "powdered sugar" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1.5", unit: "cups", item: "sugar" },
      { amount: "1/3", unit: "cup", item: "lemon juice" },
      { amount: "1/4", unit: "cup", item: "flour" }
    ],
    instructions: [
      "Preheat oven to 350°F. Beat [1 cup butter], [2 cups flour], [1/2 cup powdered sugar].",
      "Press into greased 9x13 pan, bake 20 minutes.",
      "Whisk [4 eggs], [1.5 cups sugar], [1/3 cup lemon juice], [1/4 cup flour].",
      "Pour over hot crust, bake 25 minutes until set.",
      "Cool completely, dust with powdered sugar.",
      "Cut into squares."
    ]
  },

  // ========== HALLOWEEN RECIPES (12) ==========
  {
    id: "halloween-mummy-dogs",
    name: "Mummy Hot Dogs",
    description: "Crescent-wrapped hot dogs with mustard eyes. Kids go absolutely insane for these.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "easy",
    servings: 10,
    cuisine: "Halloween",
    image: mummyDogsImg,
    totalTime: 35,
    tags: ["halloween", "party", "kids"],
    ingredients: [
      { amount: "2", unit: "cans", item: "crescent roll dough" },
      { amount: "10", unit: "", item: "hot dogs" },
      { amount: "1/4", unit: "cup", item: "mustard" },
      { amount: "20", unit: "", item: "candy eyes" },
      { amount: "1", unit: "", item: "egg" }
    ],
    instructions: [
      "Preheat oven to 375°F. Line baking sheet with parchment.",
      "Pat hot dogs dry with paper towels.",
      "Unroll crescent dough, cut into thin strips (about 1/4 inch wide).",
      "Wrap dough strips around each hot dog to look like mummy bandages, leaving a gap near top for face.",
      "Beat egg and brush over dough.",
      "Bake 12-15 minutes until golden brown.",
      "Use mustard to attach candy eyes in the face gap."
    ]
  },
  {
    id: "halloween-witch-fingers",
    name: "Witch Finger Cookies",
    description: "Almond nail cookies with red jam blood. Creepy and delicious.",
    cookTime: "12 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 24,
    cuisine: "Halloween",
    image: witchFingersImg,
    totalTime: 42,
    tags: ["halloween", "dessert", "cookies"],
    ingredients: [
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "1", unit: "cup", item: "butter" },
      { amount: "1", unit: "cup", item: "powdered sugar" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "1/2", unit: "cup", item: "sliced almonds" },
      { amount: "1/4", unit: "cup", item: "raspberry jam" }
    ],
    instructions: [
      "Beat butter and sugar until fluffy.",
      "Mix in egg and vanilla.",
      "Add flour gradually, mixing until dough forms.",
      "Chill dough 30 minutes.",
      "Roll pieces of dough into finger shapes with knuckle indentations.",
      "Press almond slice on one end for fingernail.",
      "Bake at 350°F for 10-12 minutes until edges are golden.",
      "While warm, add small amount of jam at 'nail' for blood effect."
    ]
  },
  {
    id: "halloween-bloody-mary-eggs",
    name: "Bloody Mary Deviled Eggs",
    description: "Spooky Halloween appetizer with red-tinted filling and celery garnish.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "Halloween",
    image: bloodyMaryEggsImg,
    totalTime: 35,
    tags: ["halloween", "appetizer", "protein"],
    ingredients: [
      { amount: "12", unit: "", item: "eggs" },
      { amount: "1/2", unit: "cup", item: "mayonnaise" },
      { amount: "2", unit: "tbsp", item: "tomato paste" },
      { amount: "1", unit: "tbsp", item: "horseradish" },
      { amount: "1", unit: "tsp", item: "hot sauce" },
      { amount: "1", unit: "tsp", item: "Worcestershire sauce" },
      { amount: "12", unit: "", item: "celery leaves" }
    ],
    instructions: [
      "Hard boil eggs, cool in ice bath, peel and halve.",
      "Remove yolks to bowl and mash.",
      "Mix yolks with mayo, tomato paste, horseradish, hot sauce, and Worcestershire.",
      "Pipe or spoon mixture back into egg whites.",
      "Garnish each with a celery leaf.",
      "Refrigerate until serving."
    ]
  },
  {
    id: "halloween-spider-pizza",
    name: "Spider Web Pizza",
    description: "Mozzarella web design with olive spider. Halloween party showstopper.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Halloween",
    image: spiderPizzaImg,
    totalTime: 35,
    tags: ["halloween", "dinner", "party"],
    ingredients: [
      { amount: "1", unit: "lb", item: "pizza dough" },
      { amount: "1", unit: "cup", item: "pizza sauce" },
      { amount: "2", unit: "cups", item: "shredded mozzarella" },
      { amount: "1/2", unit: "cup", item: "black olives" },
      { amount: "1", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Preheat oven to 450°F.",
      "Roll out pizza dough on baking sheet.",
      "Spread sauce evenly, leaving 1-inch border.",
      "Sprinkle most of the cheese, saving some for web.",
      "Bake 10 minutes until crust is golden.",
      "While hot, create web pattern with remaining cheese in concentric circles.",
      "Create spider from olive slices (body and legs).",
      "Return to oven 2 minutes to melt web cheese."
    ]
  },
  {
    id: "halloween-graveyard-cups",
    name: "Graveyard Dirt Cups",
    description: "Chocolate pudding with crushed Oreos, gummy worms, and cookie tombstones.",
    cookTime: "5 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "Halloween",
    image: graveyardCupsImg,
    totalTime: 20,
    tags: ["halloween", "dessert", "kids"],
    ingredients: [
      { amount: "3.4", unit: "oz", item: "instant chocolate pudding mix" },
      { amount: "2", unit: "cups", item: "cold milk" },
      { amount: "20", unit: "", item: "Oreo cookies, crushed" },
      { amount: "16", unit: "", item: "gummy worms" },
      { amount: "8", unit: "", item: "Milano cookies (tombstones)" },
      { amount: "1", unit: "tube", item: "black decorating gel" }
    ],
    instructions: [
      "Make pudding according to package directions.",
      "Crush Oreos in food processor to fine crumbs.",
      "Layer pudding and crushed Oreos in clear cups.",
      "Top with more Oreo 'dirt'.",
      "Write 'RIP' on Milano cookies with black gel.",
      "Insert cookie tombstones into cups.",
      "Add gummy worms crawling out.",
      "Refrigerate until serving."
    ]
  },
  {
    id: "halloween-monster-smoothie",
    name: "Monster Green Smoothie Bowl",
    description: "Bright green smoothie with Halloween themed toppings. Healthy and festive.",
    cookTime: "0 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 2,
    cuisine: "Halloween",
    image: monsterSmoothieImg,
    totalTime: 10,
    tags: ["halloween", "breakfast", "healthy", "vegetarian"],
    ingredients: [
      { amount: "2", unit: "cups", item: "spinach" },
      { amount: "1", unit: "", item: "frozen banana" },
      { amount: "1", unit: "cup", item: "mango chunks" },
      { amount: "1", unit: "cup", item: "almond milk" },
      { amount: "1", unit: "tbsp", item: "honey" },
      { amount: "1/4", unit: "cup", item: "granola" },
      { amount: "8", unit: "", item: "candy eyes" },
      { amount: "2", unit: "tbsp", item: "chocolate chips" }
    ],
    instructions: [
      "Blend spinach, banana, mango, almond milk, and honey until smooth.",
      "Pour into bowls.",
      "Top with granola in center.",
      "Add candy eyes and chocolate chip 'mouth'.",
      "Serve immediately."
    ]
  },
  {
    id: "halloween-frankenstein-treats",
    name: "Frankenstein Rice Krispie Treats",
    description: "Green colored treats with chocolate bolt decorations. Cute and easy.",
    cookTime: "10 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "Halloween",
    image: frankensteinTreatsImg,
    totalTime: 25,
    tags: ["halloween", "dessert", "kids"],
    ingredients: [
      { amount: "3", unit: "tbsp", item: "butter" },
      { amount: "4", unit: "cups", item: "mini marshmallows" },
      { amount: "6", unit: "cups", item: "Rice Krispies cereal" },
      { amount: "10", unit: "drops", item: "green food coloring" },
      { amount: "1/2", unit: "cup", item: "chocolate chips" },
      { amount: "24", unit: "", item: "candy eyes" }
    ],
    instructions: [
      "Melt butter in large pot over low heat.",
      "Add marshmallows and stir until melted.",
      "Add green food coloring and mix well.",
      "Remove from heat, add Rice Krispies, stir to coat.",
      "Press mixture into greased 9x13 pan.",
      "Cool 10 minutes, cut into squares.",
      "Melt chocolate, pipe 'hair' and 'bolts' on sides.",
      "Attach candy eyes with chocolate."
    ]
  },
  {
    id: "halloween-caramel-apple",
    name: "Caramel Apple Slices",
    description: "Apple slices with caramel and chocolate drizzle. Easy Halloween party snack.",
    cookTime: "5 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Halloween",
    image: caramelAppleImg,
    totalTime: 15,
    tags: ["halloween", "snack", "dessert"],
    ingredients: [
      { amount: "4", unit: "", item: "apples, sliced" },
      { amount: "1", unit: "cup", item: "caramel sauce" },
      { amount: "1/2", unit: "cup", item: "chocolate chips, melted" },
      { amount: "1/4", unit: "cup", item: "crushed peanuts" },
      { amount: "1/4", unit: "cup", item: "mini M&Ms" }
    ],
    instructions: [
      "Slice apples into thick rounds, remove seeds.",
      "Arrange apple slices on serving platter.",
      "Drizzle caramel sauce over each slice.",
      "Drizzle melted chocolate over caramel.",
      "Sprinkle with crushed peanuts and M&Ms.",
      "Serve immediately or refrigerate up to 2 hours."
    ]
  },
  {
    id: "halloween-bat-nachos",
    name: "Bat Wing Nachos",
    description: "Black tortilla chips with all the toppings. Spooky and delicious.",
    cookTime: "10 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Halloween",
    image: batNachosImg,
    totalTime: 25,
    tags: ["halloween", "appetizer", "party"],
    ingredients: [
      { amount: "1", unit: "bag", item: "black tortilla chips" },
      { amount: "2", unit: "cups", item: "shredded cheddar" },
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1", unit: "packet", item: "taco seasoning" },
      { amount: "1", unit: "cup", item: "black beans" },
      { amount: "1/2", unit: "cup", item: "jalapeños" },
      { amount: "1", unit: "cup", item: "sour cream" },
      { amount: "1", unit: "cup", item: "guacamole" }
    ],
    instructions: [
      "Brown ground beef, add taco seasoning and water per package.",
      "Simmer until thickened.",
      "Arrange black chips on large baking sheet.",
      "Top with seasoned beef, black beans, and cheese.",
      "Bake at 375°F for 8-10 minutes until cheese melts.",
      "Top with jalapeños, sour cream, and guacamole.",
      "Serve immediately while hot."
    ]
  },
  {
    id: "halloween-eyeball-meatballs",
    name: "Eyeball Meatballs",
    description: "Spaghetti with mozzarella and olive eyeballs. Creepy pasta perfection.",
    cookTime: "25 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Halloween",
    image: eyeballMeatballsImg,
    totalTime: 45,
    tags: ["halloween", "dinner", "pasta"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1/2", unit: "cup", item: "breadcrumbs" },
      { amount: "1", unit: "jar", item: "marinara sauce" },
      { amount: "1", unit: "lb", item: "spaghetti" },
      { amount: "12", unit: "", item: "mozzarella balls" },
      { amount: "12", unit: "", item: "black olive slices" }
    ],
    instructions: [
      "Mix ground beef, egg, and breadcrumbs. Form into meatballs.",
      "Brown meatballs in skillet, then simmer in marinara 15 minutes.",
      "Cook spaghetti according to package.",
      "Place mozzarella ball on each meatball while hot.",
      "Add olive slice on mozzarella as 'pupil'.",
      "Serve meatballs over spaghetti with extra sauce."
    ]
  },
  {
    id: "halloween-pumpkin-donuts",
    name: "Pumpkin Spice Donuts",
    description: "Orange glazed donuts with festive fall flavors. Bakery quality at home.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Halloween",
    image: pumpkinDonutsImg,
    totalTime: 35,
    tags: ["halloween", "dessert", "breakfast"],
    ingredients: [
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "1/2", unit: "cup", item: "pumpkin puree" },
      { amount: "1/2", unit: "cup", item: "sugar" },
      { amount: "2", unit: "tsp", item: "baking powder" },
      { amount: "1", unit: "tsp", item: "pumpkin spice" },
      { amount: "1/2", unit: "cup", item: "milk" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "2", unit: "cups", item: "powdered sugar" },
      { amount: "3", unit: "tbsp", item: "milk for glaze" },
      { amount: "10", unit: "drops", item: "orange food coloring" }
    ],
    instructions: [
      "Preheat oven to 375°F. Grease donut pan.",
      "Mix flour, sugar, baking powder, pumpkin spice.",
      "In another bowl, whisk pumpkin, milk, eggs.",
      "Combine wet and dry ingredients.",
      "Pipe batter into donut pan.",
      "Bake 12-15 minutes until springy.",
      "Cool completely.",
      "Make glaze: mix powdered sugar, milk, orange coloring.",
      "Dip donuts in glaze, let set."
    ]
  },
  {
    id: "halloween-poison-apple",
    name: "Poison Apple Cocktail",
    description: "Bright green martini with candy apple garnish. Halloween party essential.",
    cookTime: "0 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 1,
    cuisine: "Halloween",
    image: poisonAppleImg,
    totalTime: 5,
    tags: ["halloween", "cocktail", "party"],
    ingredients: [
      { amount: "2", unit: "oz", item: "vodka" },
      { amount: "1", unit: "oz", item: "apple liqueur" },
      { amount: "1", unit: "oz", item: "melon liqueur" },
      { amount: "1", unit: "oz", item: "lime juice" },
      { amount: "1", unit: "oz", item: "simple syrup" },
      { amount: "1", unit: "", item: "small green apple" },
      { amount: "", unit: "", item: "dry ice (optional)" }
    ],
    instructions: [
      "Fill cocktail shaker with ice.",
      "Add vodka, apple liqueur, melon liqueur, lime juice, and simple syrup.",
      "Shake vigorously for 15 seconds.",
      "Strain into martini glass.",
      "Garnish with apple slice or mini apple.",
      "Optional: Add small piece of dry ice for fog effect (never consume dry ice)."
    ]
  },

  // ========== RESTAURANT COPYCATS (18) ==========
  {
    id: "copycat-burrito-bowl",
    name: "Chipotle Burrito Bowl",
    description: "Better than Chipotle. Cilantro lime rice, perfectly seasoned protein, all the toppings.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Mexican",
    image: burritoBowlImg,
    totalTime: 45,
    tags: ["copycat", "mexican", "healthy", "protein"],
    ingredients: [
      { amount: "2", unit: "cups", item: "white rice" },
      { amount: "1/4", unit: "cup", item: "lime juice" },
      { amount: "1/4", unit: "cup", item: "cilantro, chopped" },
      { amount: "1", unit: "lb", item: "chicken breast" },
      { amount: "2", unit: "tbsp", item: "taco seasoning" },
      { amount: "1", unit: "can", item: "black beans" },
      { amount: "1", unit: "cup", item: "corn" },
      { amount: "1", unit: "cup", item: "pico de gallo" },
      { amount: "1", unit: "cup", item: "guacamole" },
      { amount: "1", unit: "cup", item: "shredded cheese" },
      { amount: "1/2", unit: "cup", item: "sour cream" }
    ],
    instructions: [
      "Cook rice according to package. When done, mix in lime juice and cilantro.",
      "Season chicken with taco seasoning, grill or pan-fry until cooked through.",
      "Slice chicken into strips.",
      "Heat black beans with cumin.",
      "Assemble bowls: rice base, beans, corn, chicken.",
      "Top with pico de gallo, guacamole, cheese, and sour cream."
    ]
  },
  {
    id: "copycat-alfredo",
    name: "Olive Garden Chicken Alfredo",
    description: "Restaurant quality creamy alfredo with perfectly grilled chicken.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Italian",
    image: alfredoImg,
    totalTime: 30,
    tags: ["copycat", "italian", "pasta", "comfort"],
    ingredients: [
      { amount: "1", unit: "lb", item: "fettuccine" },
      { amount: "1", unit: "lb", item: "chicken breast" },
      { amount: "1", unit: "cup", item: "butter" },
      { amount: "2", unit: "cups", item: "heavy cream" },
      { amount: "2", unit: "cups", item: "parmesan cheese, grated" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1/4", unit: "cup", item: "fresh parsley" }
    ],
    instructions: [
      "Season and grill chicken breast until cooked through. Slice into strips.",
      "Cook fettuccine according to package, drain.",
      "In large pan, melt butter and sauté garlic 1 minute.",
      "Add heavy cream, bring to simmer.",
      "Gradually whisk in parmesan until smooth and creamy.",
      "Toss pasta in sauce.",
      "Top with sliced chicken and parsley."
    ]
  },
  {
    id: "copycat-crunchwrap",
    name: "Taco Bell Crunchwrap Supreme",
    description: "Crispy, creamy, crunchy perfection. Better than the drive-thru.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Mexican",
    image: crunchwrapImg,
    totalTime: 35,
    tags: ["copycat", "mexican", "fast-food"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1", unit: "packet", item: "taco seasoning" },
      { amount: "4", unit: "large", item: "flour tortillas" },
      { amount: "4", unit: "", item: "tostada shells" },
      { amount: "1", unit: "cup", item: "nacho cheese sauce" },
      { amount: "1", unit: "cup", item: "sour cream" },
      { amount: "2", unit: "cups", item: "shredded lettuce" },
      { amount: "1", unit: "cup", item: "diced tomatoes" },
      { amount: "1", unit: "cup", item: "shredded cheese" }
    ],
    instructions: [
      "Brown ground beef, add taco seasoning and water, simmer until thick.",
      "Warm large tortillas to make pliable.",
      "On each tortilla center: seasoned beef, nacho cheese, tostada shell.",
      "Top tostada with sour cream, lettuce, tomatoes, cheese.",
      "Fold tortilla edges toward center, creating hexagon.",
      "Place fold-side down in hot skillet, press with spatula 2-3 minutes.",
      "Flip and cook other side until golden and crispy.",
      "Cut in half and serve immediately."
    ]
  },
  {
    id: "copycat-avocado-rolls",
    name: "Cheesecake Factory Avocado Egg Rolls",
    description: "Crispy rolls with creamy avocado filling and sweet tamarind sauce.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Asian Fusion",
    image: avocadoRollsImg,
    totalTime: 35,
    tags: ["copycat", "appetizer", "vegetarian"],
    ingredients: [
      { amount: "3", unit: "", item: "ripe avocados" },
      { amount: "1/2", unit: "cup", item: "sun-dried tomatoes, chopped" },
      { amount: "1/4", unit: "cup", item: "red onion, diced" },
      { amount: "1/4", unit: "cup", item: "cilantro, chopped" },
      { amount: "1", unit: "tbsp", item: "lime juice" },
      { amount: "12", unit: "", item: "egg roll wrappers" },
      { amount: "2", unit: "cups", item: "oil for frying" },
      { amount: "1/2", unit: "cup", item: "tamarind sauce" }
    ],
    instructions: [
      "Mash avocados in bowl.",
      "Mix in sun-dried tomatoes, red onion, cilantro, and lime juice.",
      "Place 2 tbsp filling in center of each wrapper.",
      "Fold corners toward center, roll tightly, seal with water.",
      "Heat oil to 350°F.",
      "Fry rolls 2-3 minutes until golden brown.",
      "Drain on paper towels.",
      "Serve with tamarind dipping sauce."
    ]
  },
  {
    id: "copycat-bloomin-onion",
    name: "Outback Bloomin' Onion",
    description: "Crispy fried onion bloom with signature dipping sauce. Show-stopping appetizer.",
    cookTime: "15 mins",
    prepTime: "30 mins",
    difficulty: "hard",
    servings: 4,
    cuisine: "American",
    image: bloominOnionImg,
    totalTime: 45,
    tags: ["copycat", "appetizer", "fried"],
    ingredients: [
      { amount: "1", unit: "large", item: "sweet onion" },
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "1", unit: "tbsp", item: "paprika" },
      { amount: "1", unit: "tbsp", item: "cayenne pepper" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "milk" },
      { amount: "6", unit: "cups", item: "oil for frying" },
      { amount: "1/2", unit: "cup", item: "mayo" },
      { amount: "2", unit: "tbsp", item: "ketchup" },
      { amount: "1", unit: "tbsp", item: "horseradish" }
    ],
    instructions: [
      "Cut onion into bloom: slice 1 inch from top, peel. Cut 12-16 wedges downward, stopping 1/2 inch from bottom.",
      "Soak in ice water 10 minutes to open 'petals'.",
      "Mix flour, paprika, cayenne, garlic powder.",
      "Whisk eggs and milk.",
      "Dredge onion in flour, dip in egg wash, coat again in flour.",
      "Heat oil to 350°F. Fry onion 10 minutes until golden.",
      "Make sauce: mix mayo, ketchup, and horseradish.",
      "Serve hot with dipping sauce."
    ]
  },
  {
    id: "copycat-broccoli-soup",
    name: "Panera Broccoli Cheddar Soup",
    description: "Creamy, cheesy perfection in a bread bowl. Comfort food champion.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "American",
    image: broccoliSoupImg,
    totalTime: 40,
    tags: ["copycat", "soup", "vegetarian", "comfort"],
    ingredients: [
      { amount: "1", unit: "lb", item: "broccoli florets" },
      { amount: "1/2", unit: "cup", item: "butter" },
      { amount: "1", unit: "medium", item: "onion, diced" },
      { amount: "1/4", unit: "cup", item: "flour" },
      { amount: "4", unit: "cups", item: "chicken broth" },
      { amount: "2", unit: "cups", item: "half-and-half" },
      { amount: "3", unit: "cups", item: "shredded cheddar" },
      { amount: "1/4", unit: "tsp", item: "nutmeg" }
    ],
    instructions: [
      "Steam broccoli until tender, chop into small pieces.",
      "Melt butter in large pot, sauté onion until soft.",
      "Whisk in flour, cook 1 minute.",
      "Gradually add broth and half-and-half, whisking constantly.",
      "Bring to simmer, cook until thickened (about 15 minutes).",
      "Stir in cheddar until melted.",
      "Add broccoli and nutmeg.",
      "Season with salt and pepper. Serve in bread bowls if desired."
    ]
  },
  {
    id: "copycat-lettuce-wraps",
    name: "PF Chang's Lettuce Wraps",
    description: "Savory chicken mixture in crispy lettuce cups. Addictively delicious.",
    cookTime: "15 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Asian",
    image: lettuceWrapsImg,
    totalTime: 30,
    tags: ["copycat", "asian", "healthy", "appetizer"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground chicken" },
      { amount: "1", unit: "can", item: "water chestnuts, diced" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "hoisin sauce" },
      { amount: "1", unit: "tbsp", item: "rice vinegar" },
      { amount: "1", unit: "tbsp", item: "sesame oil" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "fresh ginger, grated" },
      { amount: "2", unit: "", item: "green onions, sliced" },
      { amount: "1", unit: "head", item: "butter lettuce" }
    ],
    instructions: [
      "Heat sesame oil in large skillet over high heat.",
      "Add ground chicken, cook until browned and crumbly.",
      "Add garlic and ginger, cook 1 minute.",
      "Stir in water chestnuts, soy sauce, hoisin, and rice vinegar.",
      "Cook 2-3 minutes until sauce thickens.",
      "Stir in green onions.",
      "Separate lettuce into individual cups.",
      "Spoon chicken mixture into lettuce cups and serve."
    ]
  },
  {
    id: "copycat-cheddar-biscuits",
    name: "Red Lobster Cheddar Bay Biscuits",
    description: "Fluffy, cheesy biscuits brushed with garlic butter. Pure heaven.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "American",
    image: cheddarBiscuitsImg,
    totalTime: 25,
    tags: ["copycat", "bread", "side", "vegetarian"],
    ingredients: [
      { amount: "2", unit: "cups", item: "Bisquick mix" },
      { amount: "1", unit: "cup", item: "shredded cheddar" },
      { amount: "2/3", unit: "cup", item: "milk" },
      { amount: "1/2", unit: "cup", item: "melted butter" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1/4", unit: "tsp", item: "Old Bay seasoning" },
      { amount: "1/4", unit: "cup", item: "parsley, chopped" }
    ],
    instructions: [
      "Preheat oven to 450°F.",
      "Mix Bisquick, cheddar, and milk until soft dough forms.",
      "Drop spoonfuls onto greased baking sheet.",
      "Bake 10-12 minutes until golden.",
      "Mix melted butter, garlic powder, Old Bay, and parsley.",
      "Brush hot biscuits with garlic butter.",
      "Serve immediately."
    ]
  },
  {
    id: "copycat-roadhouse-rolls",
    name: "Texas Roadhouse Rolls",
    description: "Soft, fluffy rolls with cinnamon honey butter. The best part of dinner.",
    cookTime: "15 mins",
    prepTime: "90 mins",
    difficulty: "medium",
    servings: 24,
    cuisine: "American",
    image: roadhouseRollsImg,
    totalTime: 105,
    tags: ["copycat", "bread", "side"],
    ingredients: [
      { amount: "1", unit: "cup", item: "warm milk" },
      { amount: "2", unit: "tbsp", item: "active dry yeast" },
      { amount: "1/3", unit: "cup", item: "sugar" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1/3", unit: "cup", item: "butter, melted" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "4", unit: "cups", item: "flour" },
      { amount: "1", unit: "cup", item: "butter, softened" },
      { amount: "1/4", unit: "cup", item: "honey" },
      { amount: "1/4", unit: "cup", item: "powdered sugar" },
      { amount: "1", unit: "tsp", item: "cinnamon" }
    ],
    instructions: [
      "Dissolve yeast in warm milk with 1 tbsp sugar. Let sit 5 minutes.",
      "Add remaining sugar, egg, melted butter, and salt.",
      "Mix in flour until dough forms. Knead 5 minutes.",
      "Place in greased bowl, cover, let rise 1 hour.",
      "Punch down, form into 24 rolls. Place on baking sheet.",
      "Let rise 30 minutes. Bake at 350°F for 12-15 minutes.",
      "Make honey butter: whip softened butter with honey, powdered sugar, and cinnamon.",
      "Brush hot rolls with melted butter. Serve with honey butter."
    ]
  },
  {
    id: "copycat-corn-salsa",
    name: "Chipotle Corn Salsa",
    description: "Fresh, zesty corn salsa with lime and cilantro. Perfect for everything.",
    cookTime: "5 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "Mexican",
    image: cornSalsaImg,
    totalTime: 15,
    tags: ["copycat", "mexican", "vegan", "side"],
    ingredients: [
      { amount: "3", unit: "cups", item: "frozen corn, thawed" },
      { amount: "1/2", unit: "cup", item: "red onion, finely diced" },
      { amount: "1", unit: "", item: "jalapeño, seeded and minced" },
      { amount: "1/4", unit: "cup", item: "cilantro, chopped" },
      { amount: "2", unit: "tbsp", item: "lime juice" },
      { amount: "1", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Char corn in dry hot skillet until slightly blackened, about 5 minutes.",
      "Let cool to room temperature.",
      "Mix corn with red onion, jalapeño, cilantro, lime juice, and salt.",
      "Refrigerate at least 1 hour before serving.",
      "Serve with chips, tacos, or burrito bowls."
    ]
  },
  {
    id: "copycat-egg-bites",
    name: "Starbucks Egg Bites",
    description: "Fluffy sous vide style egg cups. Perfect protein-packed breakfast.",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "American",
    image: eggBitesImg,
    totalTime: 40,
    tags: ["copycat", "breakfast", "protein", "keto"],
    ingredients: [
      { amount: "8", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "cottage cheese" },
      { amount: "1", unit: "cup", item: "shredded cheese" },
      { amount: "1/2", unit: "cup", item: "cooked bacon, crumbled" },
      { amount: "1/4", unit: "tsp", item: "salt" },
      { amount: "1/4", unit: "tsp", item: "pepper" }
    ],
    instructions: [
      "Preheat oven to 300°F. Grease muffin tin.",
      "Blend eggs and cottage cheese until smooth.",
      "Stir in shredded cheese, bacon, salt, and pepper.",
      "Pour into muffin cups, filling 3/4 full.",
      "Place muffin tin in larger baking dish. Add 1 inch hot water to outer dish.",
      "Bake 30 minutes until set.",
      "Cool 5 minutes before removing from tin.",
      "Store in fridge up to 5 days."
    ]
  },
  {
    id: "copycat-hashbrown-casserole",
    name: "Cracker Barrel Hashbrown Casserole",
    description: "Creamy, cheesy potato perfection. The ultimate comfort side dish.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 10,
    cuisine: "American",
    image: hashbrownCasseroleImg,
    totalTime: 60,
    tags: ["copycat", "side", "comfort", "vegetarian"],
    ingredients: [
      { amount: "2", unit: "lbs", item: "frozen shredded hashbrowns, thawed" },
      { amount: "1", unit: "can", item: "cream of chicken soup" },
      { amount: "2", unit: "cups", item: "sour cream" },
      { amount: "2", unit: "cups", item: "shredded cheddar" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "1/2", unit: "cup", item: "onion, diced" },
      { amount: "2", unit: "cups", item: "corn flakes, crushed" }
    ],
    instructions: [
      "Preheat oven to 350°F. Grease 9x13 baking dish.",
      "Mix hashbrowns, soup, sour cream, cheese, 1/4 cup melted butter, and onion.",
      "Spread in baking dish.",
      "Mix crushed corn flakes with remaining 1/4 cup melted butter.",
      "Sprinkle over casserole.",
      "Bake 45 minutes until golden and bubbly.",
      "Let rest 5 minutes before serving."
    ]
  },
  {
    id: "copycat-mcgriddles",
    name: "McDonald's McGriddles",
    description: "Pancake breakfast sandwich with syrup pockets. Breakfast game changer.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "American",
    image: mcgriddlesImg,
    totalTime: 35,
    tags: ["copycat", "breakfast", "fast-food"],
    ingredients: [
      { amount: "1", unit: "cup", item: "pancake mix" },
      { amount: "3/4", unit: "cup", item: "water" },
      { amount: "1/4", unit: "cup", item: "maple syrup" },
      { amount: "4", unit: "", item: "sausage patties" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "4", unit: "slices", item: "American cheese" }
    ],
    instructions: [
      "Make pancakes according to package. Pour syrup on hot griddle, top with pancake batter to create syrup pockets.",
      "Cook pancakes until golden, flip and cook other side.",
      "Cook sausage patties according to package.",
      "Fry eggs to desired doneness.",
      "Assemble: pancake, sausage, cheese, egg, top pancake.",
      "Wrap in foil and let steam 2 minutes before serving."
    ]
  },
  {
    id: "copycat-meatball-sub",
    name: "Subway Meatball Sub",
    description: "Meatballs in marinara with melted provolone. Comfort sandwich perfection.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Italian",
    image: meatballSubImg,
    totalTime: 45,
    tags: ["copycat", "sandwich", "italian", "comfort"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1/2", unit: "cup", item: "breadcrumbs" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1/4", unit: "cup", item: "parmesan" },
      { amount: "2", unit: "cups", item: "marinara sauce" },
      { amount: "4", unit: "", item: "sub rolls" },
      { amount: "8", unit: "slices", item: "provolone cheese" }
    ],
    instructions: [
      "Mix ground beef, breadcrumbs, egg, and parmesan. Form into meatballs.",
      "Brown meatballs in skillet.",
      "Add marinara, simmer 20 minutes.",
      "Toast sub rolls lightly.",
      "Place meatballs and sauce on rolls.",
      "Top with provolone slices.",
      "Broil 2 minutes until cheese melts.",
      "Serve immediately."
    ]
  },
  {
    id: "copycat-animal-fries",
    name: "In-N-Out Animal Style Fries",
    description: "Loaded fries with cheese, special sauce, and grilled onions. West Coast legend.",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "American",
    image: animalFriesImg,
    totalTime: 40,
    tags: ["copycat", "fast-food", "side"],
    ingredients: [
      { amount: "2", unit: "lbs", item: "frozen french fries" },
      { amount: "1", unit: "large", item: "onion, sliced" },
      { amount: "8", unit: "slices", item: "American cheese" },
      { amount: "1/2", unit: "cup", item: "mayo" },
      { amount: "2", unit: "tbsp", item: "ketchup" },
      { amount: "2", unit: "tbsp", item: "sweet pickle relish" },
      { amount: "1", unit: "tsp", item: "white vinegar" }
    ],
    instructions: [
      "Cook fries according to package until extra crispy.",
      "Caramelize onions in skillet until golden, about 15 minutes.",
      "Make spread: mix mayo, ketchup, relish, and vinegar.",
      "Place hot fries on serving platter.",
      "Top with torn cheese slices.",
      "Add caramelized onions.",
      "Drizzle with special spread.",
      "Serve immediately while hot."
    ]
  },
  {
    id: "copycat-chicken-sandwich",
    name: "Chick-fil-A Chicken Sandwich",
    description: "Perfectly crispy chicken breast with pickles. Fast food perfection at home.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "American",
    image: chickenSandwichImg,
    totalTime: 35,
    tags: ["copycat", "fast-food", "sandwich"],
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" },
      { amount: "1", unit: "cup", item: "pickle juice" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "2", unit: "tbsp", item: "powdered sugar" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1/2", unit: "cup", item: "milk" },
      { amount: "4", unit: "", item: "brioche buns" },
      { amount: "16", unit: "", item: "pickle slices" },
      { amount: "4", unit: "cups", item: "peanut oil for frying" }
    ],
    instructions: [
      "Marinate chicken in pickle juice 30 minutes to 4 hours.",
      "Mix flour, powdered sugar, and paprika.",
      "Whisk egg and milk in another bowl.",
      "Dredge chicken in flour, dip in egg wash, coat again in flour.",
      "Heat oil to 350°F. Fry chicken 5-7 minutes per side until golden.",
      "Drain on paper towels.",
      "Butter and toast buns.",
      "Place chicken on bun, top with pickles."
    ]
  },

  // ========== QUICK MEALS UNDER 30 MIN (18) ==========
  {
    id: "quick-honey-garlic-chicken",
    name: "Sheet Pan Honey Garlic Chicken",
    description: "Everything cooks on one pan in 25 minutes. Crispy skin, caramelized veggies.",
    cookTime: "25 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "American",
    image: honeyGarlicChickenImg,
    totalTime: 30,
    tags: ["quick", "dinner", "one-pan", "protein"],
    ingredients: [
      { amount: "4", unit: "", item: "chicken thighs" },
      { amount: "3", unit: "cups", item: "broccoli florets" },
      { amount: "2", unit: "cups", item: "bell peppers, chopped" },
      { amount: "1/4", unit: "cup", item: "honey" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Preheat oven to 425°F.",
      "Mix honey, soy sauce, and garlic.",
      "Arrange chicken and vegetables on sheet pan.",
      "Brush chicken with honey garlic sauce.",
      "Drizzle vegetables with olive oil.",
      "Bake 25 minutes until chicken reaches 165°F.",
      "Serve immediately."
    ]
  },
  {
    id: "quick-shrimp-stirfry",
    name: "15-Minute Shrimp Stir Fry",
    description: "Restaurant quality stir fry faster than delivery. Glossy sauce, perfect vegetables.",
    cookTime: "8 mins",
    prepTime: "7 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Asian",
    image: shrimpStirfryImg,
    totalTime: 15,
    tags: ["quick", "asian", "protein", "healthy"],
    ingredients: [
      { amount: "1", unit: "lb", item: "large shrimp, peeled" },
      { amount: "3", unit: "cups", item: "stir fry vegetables" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "oyster sauce" },
      { amount: "1", unit: "tbsp", item: "sesame oil" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "cornstarch" },
      { amount: "2", unit: "cups", item: "cooked rice" }
    ],
    instructions: [
      "Mix soy sauce, oyster sauce, and cornstarch.",
      "Heat wok or large skillet over high heat.",
      "Add sesame oil, then shrimp. Cook 2 minutes per side.",
      "Remove shrimp, add vegetables and garlic.",
      "Stir fry 3 minutes until crisp-tender.",
      "Return shrimp, add sauce.",
      "Toss until glossy, about 1 minute.",
      "Serve over rice."
    ]
  },
  {
    id: "quick-lemon-salmon",
    name: "One-Pan Lemon Herb Salmon",
    description: "Perfectly flaky salmon with roasted vegetables. Healthy dinner in 20 minutes.",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Mediterranean",
    image: lemonSalmonImg,
    totalTime: 20,
    tags: ["quick", "healthy", "protein", "one-pan"],
    ingredients: [
      { amount: "4", unit: "", item: "salmon fillets" },
      { amount: "1", unit: "lb", item: "asparagus" },
      { amount: "2", unit: "cups", item: "cherry tomatoes" },
      { amount: "2", unit: "", item: "lemons" },
      { amount: "3", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" }
    ],
    instructions: [
      "Preheat oven to 400°F.",
      "Arrange salmon, asparagus, and tomatoes on sheet pan.",
      "Drizzle with olive oil, sprinkle with Italian seasoning.",
      "Top salmon with lemon slices.",
      "Bake 12-15 minutes until salmon flakes easily.",
      "Squeeze fresh lemon over everything.",
      "Serve immediately."
    ]
  },
  {
    id: "quick-beef-broccoli",
    name: "20-Minute Beef and Broccoli",
    description: "Better than takeout. Tender beef, crisp broccoli, glossy brown sauce.",
    cookTime: "12 mins",
    prepTime: "8 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Asian",
    image: beefBroccoliImg,
    totalTime: 20,
    tags: ["quick", "asian", "protein"],
    ingredients: [
      { amount: "1", unit: "lb", item: "flank steak, sliced thin" },
      { amount: "4", unit: "cups", item: "broccoli florets" },
      { amount: "1/4", unit: "cup", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "oyster sauce" },
      { amount: "2", unit: "tbsp", item: "brown sugar" },
      { amount: "1", unit: "tbsp", item: "cornstarch" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "cups", item: "cooked rice" }
    ],
    instructions: [
      "Mix soy sauce, oyster sauce, brown sugar, and cornstarch.",
      "Heat large skillet or wok over high heat.",
      "Sear beef in batches, 2 minutes per side. Remove.",
      "Add broccoli, stir fry 3 minutes.",
      "Add garlic, cook 30 seconds.",
      "Return beef, add sauce.",
      "Toss until sauce thickens and coats everything.",
      "Serve over rice."
    ]
  },
  {
    id: "quick-thai-basil-chicken",
    name: "30-Minute Thai Basil Chicken",
    description: "Spicy, aromatic, addictive. Street food perfection at home.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Thai",
    image: thaiBasilImg,
    totalTime: 25,
    tags: ["quick", "thai", "asian", "spicy"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground chicken" },
      { amount: "1", unit: "cup", item: "fresh Thai basil leaves" },
      { amount: "4", unit: "", item: "Thai chilies, sliced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "3", unit: "tbsp", item: "fish sauce" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "sugar" },
      { amount: "2", unit: "cups", item: "jasmine rice, cooked" }
    ],
    instructions: [
      "Heat wok over high heat.",
      "Add ground chicken, breaking up as it cooks.",
      "Add garlic and chilies, stir fry 1 minute.",
      "Add fish sauce, soy sauce, and sugar.",
      "Cook until chicken is done, about 5 minutes.",
      "Remove from heat, stir in Thai basil until wilted.",
      "Serve over jasmine rice with fried egg on top if desired."
    ]
  },
  {
    id: "quick-tuscan-shrimp",
    name: "25-Minute Tuscan Garlic Shrimp",
    description: "Creamy sun-dried tomato sauce with spinach. Restaurant quality at home.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Italian",
    image: tuscanShrimpImg,
    totalTime: 25,
    tags: ["quick", "italian", "protein", "pasta"],
    ingredients: [
      { amount: "1", unit: "lb", item: "large shrimp" },
      { amount: "3", unit: "cups", item: "spinach" },
      { amount: "1/2", unit: "cup", item: "sun-dried tomatoes" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1/2", unit: "cup", item: "parmesan" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "lb", item: "pasta" }
    ],
    instructions: [
      "Cook pasta according to package.",
      "Sauté shrimp in butter 2 minutes per side, remove.",
      "Add garlic, cook 30 seconds.",
      "Add sun-dried tomatoes and heavy cream.",
      "Simmer 3 minutes.",
      "Stir in parmesan and spinach until wilted.",
      "Return shrimp, toss with drained pasta.",
      "Serve immediately."
    ]
  },
  {
    id: "quick-caprese-chicken",
    name: "15-Minute Caprese Chicken",
    description: "Melted mozzarella, fresh tomatoes, basil, balsamic. Italian perfection.",
    cookTime: "12 mins",
    prepTime: "3 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Italian",
    image: capreseChickenImg,
    totalTime: 15,
    tags: ["quick", "italian", "protein", "healthy"],
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" },
      { amount: "8", unit: "slices", item: "fresh mozzarella" },
      { amount: "2", unit: "", item: "tomatoes, sliced" },
      { amount: "1/4", unit: "cup", item: "fresh basil" },
      { amount: "2", unit: "tbsp", item: "balsamic glaze" },
      { amount: "2", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Pound chicken to even thickness.",
      "Season with salt and pepper.",
      "Heat olive oil in skillet over medium-high.",
      "Cook chicken 5 minutes per side.",
      "Top each breast with mozzarella and tomato slices.",
      "Cover, cook 2 minutes until cheese melts.",
      "Top with fresh basil and balsamic drizzle."
    ]
  },
  {
    id: "quick-teriyaki-salmon",
    name: "20-Minute Teriyaki Salmon Bowls",
    description: "Glazed salmon over rice with fresh vegetables. Healthy and delicious.",
    cookTime: "12 mins",
    prepTime: "8 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Japanese",
    image: teriyakiSalmonImg,
    totalTime: 20,
    tags: ["quick", "healthy", "asian", "protein"],
    ingredients: [
      { amount: "4", unit: "", item: "salmon fillets" },
      { amount: "1/3", unit: "cup", item: "teriyaki sauce" },
      { amount: "3", unit: "cups", item: "cooked rice" },
      { amount: "1", unit: "cup", item: "edamame" },
      { amount: "1", unit: "", item: "cucumber, sliced" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" }
    ],
    instructions: [
      "Brush salmon with teriyaki sauce.",
      "Heat skillet over medium-high heat.",
      "Cook salmon skin-side down 5 minutes.",
      "Flip, brush with more sauce, cook 4 minutes.",
      "Assemble bowls: rice, edamame, cucumber, avocado.",
      "Top with salmon.",
      "Drizzle with remaining teriyaki and sprinkle sesame seeds."
    ]
  },
  {
    id: "quick-sesame-noodles",
    name: "20-Minute Cold Sesame Noodles",
    description: "Addictive peanut sesame sauce with vegetables. Perfect for meal prep.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Asian",
    image: sesameNoodlesImg,
    totalTime: 20,
    tags: ["quick", "asian", "vegan", "cold"],
    ingredients: [
      { amount: "1", unit: "lb", item: "spaghetti or lo mein noodles" },
      { amount: "1/4", unit: "cup", item: "peanut butter" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "sesame oil" },
      { amount: "2", unit: "tbsp", item: "rice vinegar" },
      { amount: "1", unit: "tbsp", item: "honey" },
      { amount: "2", unit: "", item: "cucumbers, julienned" },
      { amount: "2", unit: "", item: "carrots, julienned" },
      { amount: "1/4", unit: "cup", item: "green onions" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" }
    ],
    instructions: [
      "Cook noodles according to package. Drain and rinse with cold water.",
      "Whisk together peanut butter, soy sauce, sesame oil, rice vinegar, and honey.",
      "Toss noodles with sauce until evenly coated.",
      "Add cucumbers, carrots, and green onions.",
      "Toss everything together.",
      "Sprinkle with sesame seeds.",
      "Serve cold or at room temperature."
    ]
  },
  {
    id: "quick-chicken-fajitas",
    name: "30-Minute Chicken Fajitas",
    description: "Sizzling peppers and onions with perfectly seasoned chicken. Tex-Mex night done right.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Mexican",
    image: chickenFajitasImg,
    totalTime: 30,
    tags: ["quick", "mexican", "protein"],
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken breast, sliced" },
      { amount: "3", unit: "", item: "bell peppers, sliced" },
      { amount: "1", unit: "large", item: "onion, sliced" },
      { amount: "2", unit: "tbsp", item: "fajita seasoning" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "8", unit: "", item: "flour tortillas" },
      { amount: "1", unit: "cup", item: "sour cream" },
      { amount: "1", unit: "cup", item: "guacamole" },
      { amount: "1", unit: "cup", item: "shredded cheese" }
    ],
    instructions: [
      "Season chicken with fajita seasoning.",
      "Heat oil in large cast iron skillet over high heat.",
      "Cook chicken 5-6 minutes until done. Remove.",
      "Add peppers and onions, cook 5-7 minutes until charred.",
      "Return chicken to pan, toss together.",
      "Warm tortillas.",
      "Serve fajita mixture with tortillas and toppings."
    ]
  },
  {
    id: "quick-kung-pao-chicken",
    name: "25-Minute Kung Pao Chicken",
    description: "Spicy, sweet, crunchy. Takeout favorite made better at home.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Chinese",
    image: kungPaoImg,
    totalTime: 25,
    tags: ["quick", "chinese", "spicy", "protein"],
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken breast, cubed" },
      { amount: "1/2", unit: "cup", item: "roasted peanuts" },
      { amount: "4", unit: "", item: "dried red chilies" },
      { amount: "1", unit: "cup", item: "bell pepper, diced" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "rice vinegar" },
      { amount: "2", unit: "tbsp", item: "hoisin sauce" },
      { amount: "1", unit: "tbsp", item: "cornstarch" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "cups", item: "rice" }
    ],
    instructions: [
      "Mix soy sauce, rice vinegar, hoisin, and cornstarch.",
      "Heat wok over high heat.",
      "Stir fry chicken until golden, about 5 minutes. Remove.",
      "Add dried chilies and peanuts, toast 1 minute.",
      "Add garlic and bell peppers, stir fry 2 minutes.",
      "Return chicken, add sauce.",
      "Toss until sauce thickens.",
      "Serve over rice."
    ]
  },
  {
    id: "quick-shrimp-scampi",
    name: "15-Minute Shrimp Scampi",
    description: "Garlic butter white wine sauce over linguine. Restaurant quality, ridiculously easy.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Italian",
    image: shrimpScampiImg,
    totalTime: 15,
    tags: ["quick", "italian", "protein", "pasta"],
    ingredients: [
      { amount: "1", unit: "lb", item: "large shrimp, peeled" },
      { amount: "1", unit: "lb", item: "linguine" },
      { amount: "4", unit: "tbsp", item: "butter" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1/2", unit: "cup", item: "white wine" },
      { amount: "1", unit: "", item: "lemon" },
      { amount: "1/4", unit: "cup", item: "parsley, chopped" },
      { amount: "1/4", unit: "tsp", item: "red pepper flakes" }
    ],
    instructions: [
      "Cook linguine according to package. Reserve 1 cup pasta water.",
      "Melt butter in large skillet over medium heat.",
      "Add garlic, cook 30 seconds until fragrant.",
      "Add shrimp, cook 2 minutes per side.",
      "Add white wine, simmer 2 minutes.",
      "Toss in drained pasta with lemon juice and red pepper flakes.",
      "Add pasta water if needed to create sauce.",
      "Top with fresh parsley."
    ]
  },
  {
    id: "quick-mongolian-beef",
    name: "20-Minute Mongolian Beef",
    description: "Sweet and savory beef over rice. PF Chang's copycat that's better than delivery.",
    cookTime: "12 mins",
    prepTime: "8 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Asian",
    image: mongolianBeefImg,
    totalTime: 20,
    tags: ["quick", "asian", "protein"],
    ingredients: [
      { amount: "1", unit: "lb", item: "flank steak, sliced thin" },
      { amount: "1/4", unit: "cup", item: "soy sauce" },
      { amount: "1/4", unit: "cup", item: "brown sugar" },
      { amount: "1/4", unit: "cup", item: "water" },
      { amount: "2", unit: "tbsp", item: "cornstarch" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "fresh ginger, grated" },
      { amount: "4", unit: "", item: "green onions, cut into 2-inch pieces" },
      { amount: "2", unit: "cups", item: "rice" }
    ],
    instructions: [
      "Toss beef with 1 tbsp cornstarch.",
      "Mix soy sauce, brown sugar, water, and remaining cornstarch.",
      "Heat oil in wok over high heat.",
      "Sear beef in batches, 2 minutes per side. Remove.",
      "Add garlic and ginger, cook 30 seconds.",
      "Add sauce, bring to boil.",
      "Return beef, add green onions.",
      "Toss until sauce thickens. Serve over rice."
    ]
  },
  {
    id: "quick-greek-chicken",
    name: "25-Minute Greek Chicken Bowls",
    description: "Mediterranean flavors with tzatziki. Fresh, healthy, and satisfying.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Greek",
    image: greekChickenImg,
    totalTime: 25,
    tags: ["quick", "greek", "healthy", "protein"],
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken breast, cubed" },
      { amount: "2", unit: "tbsp", item: "Greek seasoning" },
      { amount: "3", unit: "cups", item: "cooked rice" },
      { amount: "1", unit: "cup", item: "cucumber, diced" },
      { amount: "1", unit: "cup", item: "tomatoes, diced" },
      { amount: "1/2", unit: "cup", item: "kalamata olives" },
      { amount: "1/2", unit: "cup", item: "feta cheese" },
      { amount: "1", unit: "cup", item: "tzatziki sauce" }
    ],
    instructions: [
      "Season chicken with Greek seasoning.",
      "Heat oil in skillet over medium-high.",
      "Cook chicken 6-8 minutes until golden and cooked through.",
      "Assemble bowls: rice base, chicken, cucumber, tomatoes, olives.",
      "Top with feta and tzatziki sauce.",
      "Serve immediately."
    ]
  },
  {
    id: "quick-steak-bites",
    name: "15-Minute Garlic Butter Steak Bites",
    description: "Perfectly seared steak cubes with crispy potatoes. Steakhouse quality, weeknight easy.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "American",
    image: steakBitesImg,
    totalTime: 15,
    tags: ["quick", "protein", "steak"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "sirloin steak, cubed" },
      { amount: "1", unit: "lb", item: "baby potatoes, halved" },
      { amount: "4", unit: "tbsp", item: "butter" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "fresh thyme" },
      { amount: "2", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Microwave potatoes 5 minutes until tender.",
      "Heat olive oil in large cast iron skillet over high heat.",
      "Sear steak bites 2 minutes per side. Remove.",
      "Add butter to pan with potatoes, cook until crispy, 3-4 minutes.",
      "Add garlic and thyme, cook 30 seconds.",
      "Return steak, toss in garlic butter.",
      "Serve immediately."
    ]
  },
  {
    id: "quick-pad-thai",
    name: "30-Minute Pad Thai",
    description: "Restaurant quality Thai street food. Sweet, tangy, and perfectly balanced.",
    cookTime: "15 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Thai",
    image: padThaiImg,
    totalTime: 30,
    tags: ["quick", "thai", "asian", "noodles"],
    ingredients: [
      { amount: "8", unit: "oz", item: "rice noodles" },
      { amount: "1", unit: "lb", item: "shrimp" },
      { amount: "3", unit: "tbsp", item: "fish sauce" },
      { amount: "2", unit: "tbsp", item: "tamarind paste" },
      { amount: "2", unit: "tbsp", item: "brown sugar" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "bean sprouts" },
      { amount: "1/2", unit: "cup", item: "peanuts, crushed" },
      { amount: "3", unit: "", item: "green onions, sliced" },
      { amount: "1", unit: "", item: "lime" }
    ],
    instructions: [
      "Soak rice noodles in hot water 10 minutes. Drain.",
      "Mix fish sauce, tamarind paste, and brown sugar.",
      "Heat wok over high heat.",
      "Cook shrimp 2 minutes per side. Remove.",
      "Scramble eggs in wok. Remove.",
      "Add noodles and sauce to wok, toss 2 minutes.",
      "Return shrimp and eggs, add bean sprouts.",
      "Top with peanuts, green onions, and lime wedges."
    ]
  },

  // ========== LEFTOVER MAKEOVERS (12) ==========
  {
    id: "leftover-pizza-frittata",
    name: "Leftover Pizza Frittata",
    description: "Last night's pizza transformed into gourmet breakfast. Genius.",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Italian",
    image: pizzaFrittataImg,
    totalTime: 20,
    tags: ["leftover", "breakfast", "eggs"],
    ingredients: [
      { amount: "3", unit: "slices", item: "leftover pizza, chopped" },
      { amount: "8", unit: "", item: "eggs" },
      { amount: "1/4", unit: "cup", item: "milk" },
      { amount: "1/2", unit: "cup", item: "mozzarella" },
      { amount: "2", unit: "tbsp", item: "fresh basil" },
      { amount: "1", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Preheat oven to 375°F.",
      "Whisk eggs and milk together.",
      "Heat olive oil in oven-safe skillet.",
      "Add chopped pizza pieces, sauté 2 minutes.",
      "Pour egg mixture over pizza.",
      "Top with mozzarella.",
      "Cook on stovetop 5 minutes until edges set.",
      "Transfer to oven, bake 10 minutes until puffy and golden.",
      "Top with fresh basil."
    ]
  },
  {
    id: "leftover-chicken-tacos",
    name: "Rotisserie Chicken Tacos",
    description: "Store-bought rotisserie chicken becomes gourmet taco night.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Mexican",
    image: chickenTacosImg,
    totalTime: 20,
    tags: ["leftover", "mexican", "quick"],
    ingredients: [
      { amount: "3", unit: "cups", item: "rotisserie chicken, shredded" },
      { amount: "1", unit: "tbsp", item: "taco seasoning" },
      { amount: "8", unit: "", item: "tortillas" },
      { amount: "1", unit: "cup", item: "shredded cabbage" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "1/2", unit: "cup", item: "cilantro" },
      { amount: "1", unit: "", item: "lime" },
      { amount: "1/2", unit: "cup", item: "sour cream" }
    ],
    instructions: [
      "Heat shredded chicken with taco seasoning and 2 tbsp water.",
      "Warm tortillas.",
      "Fill tortillas with seasoned chicken.",
      "Top with cabbage, avocado, cilantro.",
      "Drizzle with sour cream and lime juice.",
      "Serve immediately."
    ]
  },
  {
    id: "leftover-fried-rice",
    name: "Better-Than-Takeout Fried Rice",
    description: "Day-old rice is the secret. Restaurant quality at midnight.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Asian",
    image: friedRiceImg,
    totalTime: 15,
    tags: ["leftover", "asian", "quick"],
    ingredients: [
      { amount: "4", unit: "cups", item: "cold leftover rice" },
      { amount: "3", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "frozen peas and carrots" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "sesame oil" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "3", unit: "", item: "green onions, sliced" }
    ],
    instructions: [
      "Beat eggs, scramble in hot wok. Remove and chop.",
      "Heat sesame oil in wok over high heat.",
      "Add garlic, cook 30 seconds.",
      "Add rice, breaking up clumps. Stir fry 5 minutes.",
      "Add peas and carrots, cook 2 minutes.",
      "Add soy sauce and scrambled eggs.",
      "Toss everything together.",
      "Top with green onions."
    ]
  },
  {
    id: "leftover-pasta-carbonara",
    name: "Leftover Pasta Carbonara",
    description: "Transform plain pasta into creamy Roman masterpiece.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Italian",
    image: pastaCarbonaraImg,
    totalTime: 15,
    tags: ["leftover", "italian", "pasta"],
    ingredients: [
      { amount: "1", unit: "lb", item: "leftover cooked pasta" },
      { amount: "6", unit: "slices", item: "bacon" },
      { amount: "3", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "parmesan cheese" },
      { amount: "2", unit: "cloves", item: "garlic, minced" },
      { amount: "1/2", unit: "tsp", item: "black pepper" }
    ],
    instructions: [
      "Cook bacon until crispy, reserve 2 tbsp fat. Chop bacon.",
      "Whisk eggs, parmesan, and black pepper.",
      "Heat bacon fat in large pan, add garlic.",
      "Add leftover pasta, toss to coat and heat through.",
      "Remove from heat, quickly toss with egg mixture (heat of pasta will cook eggs).",
      "Add bacon pieces.",
      "Serve immediately with extra parmesan."
    ]
  },
  {
    id: "leftover-potato-croquettes",
    name: "Mashed Potato Croquettes",
    description: "Crispy outside, creamy inside. Leftover mashed potatoes level up.",
    cookTime: "15 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "French",
    image: potatoCroquettesImg,
    totalTime: 30,
    tags: ["leftover", "side", "fried"],
    ingredients: [
      { amount: "3", unit: "cups", item: "leftover mashed potatoes" },
      { amount: "1", unit: "cup", item: "shredded cheddar" },
      { amount: "1/4", unit: "cup", item: "chives, chopped" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1", unit: "cup", item: "breadcrumbs" },
      { amount: "2", unit: "cups", item: "oil for frying" }
    ],
    instructions: [
      "Mix mashed potatoes with cheese and chives.",
      "Form into small cylinders or balls.",
      "Beat egg in shallow bowl.",
      "Place breadcrumbs in another bowl.",
      "Dip each croquette in egg, then roll in breadcrumbs.",
      "Heat oil to 350°F.",
      "Fry croquettes 3-4 minutes until golden.",
      "Drain on paper towels. Serve with sour cream."
    ]
  },
  {
    id: "leftover-turkey-quesadillas",
    name: "Turkey Cranberry Quesadillas",
    description: "Thanksgiving leftovers meet Tex-Mex. Surprisingly amazing.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Fusion",
    image: turkeyQuesadillasImg,
    totalTime: 15,
    tags: ["leftover", "fusion", "quick"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover turkey, shredded" },
      { amount: "1/2", unit: "cup", item: "cranberry sauce" },
      { amount: "2", unit: "cups", item: "shredded cheese" },
      { amount: "8", unit: "", item: "flour tortillas" },
      { amount: "2", unit: "tbsp", item: "butter" }
    ],
    instructions: [
      "Lay 4 tortillas on counter.",
      "Spread each with cranberry sauce.",
      "Top with turkey and cheese.",
      "Cover with remaining tortillas.",
      "Melt butter in large skillet over medium heat.",
      "Cook quesadillas 3-4 minutes per side until golden and cheese melts.",
      "Cut into wedges.",
      "Serve with sour cream."
    ]
  },
  {
    id: "leftover-french-dip",
    name: "Roast Beef French Dip Sliders",
    description: "Turn leftover roast into bistro-worthy sandwiches.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "American",
    image: frenchDipImg,
    totalTime: 25,
    tags: ["leftover", "sandwich", "comfort"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover roast beef, sliced" },
      { amount: "1", unit: "large", item: "onion, caramelized" },
      { amount: "6", unit: "", item: "slider buns or rolls" },
      { amount: "6", unit: "slices", item: "provolone cheese" },
      { amount: "2", unit: "cups", item: "beef broth" },
      { amount: "1", unit: "tbsp", item: "Worcestershire sauce" }
    ],
    instructions: [
      "Heat beef broth with Worcestershire sauce for dipping.",
      "Toast slider buns lightly.",
      "Layer roast beef and caramelized onions on buns.",
      "Top with provolone.",
      "Broil 2 minutes until cheese melts.",
      "Serve with hot au jus for dipping."
    ]
  },
  {
    id: "leftover-ham-hash",
    name: "Ham and Potato Breakfast Hash",
    description: "Holiday ham becomes the ultimate brunch. Top with fried eggs.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "American",
    image: hamHashImg,
    totalTime: 30,
    tags: ["leftover", "breakfast", "brunch"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover ham, diced" },
      { amount: "3", unit: "cups", item: "potatoes, diced" },
      { amount: "1", unit: "", item: "bell pepper, diced" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "2", unit: "tbsp", item: "butter" }
    ],
    instructions: [
      "Melt butter in large cast iron skillet.",
      "Add potatoes, cook 10 minutes until golden and crispy.",
      "Add bell pepper and onion, cook 5 minutes.",
      "Stir in ham, heat through.",
      "Make 4 wells in hash, crack an egg into each.",
      "Cover and cook until eggs reach desired doneness.",
      "Serve immediately."
    ]
  },
  {
    id: "leftover-steak-quesadilla",
    name: "Steak Quesadilla with Chimichurri",
    description: "Last night's steak becomes today's gourmet lunch.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 2,
    cuisine: "Fusion",
    image: steakQuesadillaImg,
    totalTime: 20,
    tags: ["leftover", "fusion", "quick"],
    ingredients: [
      { amount: "1", unit: "cup", item: "leftover steak, sliced" },
      { amount: "1", unit: "cup", item: "caramelized onions" },
      { amount: "1", unit: "cup", item: "shredded cheese" },
      { amount: "4", unit: "", item: "flour tortillas" },
      { amount: "1/4", unit: "cup", item: "chimichurri sauce" }
    ],
    instructions: [
      "Layer steak, onions, and cheese on 2 tortillas.",
      "Top with remaining tortillas.",
      "Heat in skillet 3-4 minutes per side until cheese melts.",
      "Cut into wedges.",
      "Drizzle with chimichurri sauce."
    ]
  },
  {
    id: "leftover-burger-sliders",
    name: "Burger Sliders with Special Sauce",
    description: "Leftover burgers become party-worthy sliders.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "American",
    image: burgerSlidersImg,
    totalTime: 20,
    tags: ["leftover", "party", "quick"],
    ingredients: [
      { amount: "4", unit: "", item: "leftover burger patties, halved" },
      { amount: "8", unit: "", item: "Hawaiian rolls" },
      { amount: "8", unit: "slices", item: "cheddar cheese" },
      { amount: "1/2", unit: "cup", item: "mayo" },
      { amount: "2", unit: "tbsp", item: "ketchup" },
      { amount: "1", unit: "tbsp", item: "pickle relish" },
      { amount: "16", unit: "", item: "pickle slices" }
    ],
    instructions: [
      "Reheat burger halves in skillet with cheese slices on top.",
      "Toast Hawaiian rolls.",
      "Make special sauce: mix mayo, ketchup, and relish.",
      "Spread sauce on rolls.",
      "Add burger halves and pickles.",
      "Serve immediately."
    ]
  },
  {
    id: "leftover-pork-nachos",
    name: "Pulled Pork Nachos",
    description: "BBQ leftovers become loaded nacho perfection.",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "American",
    image: porkNachosImg,
    totalTime: 20,
    tags: ["leftover", "party", "appetizer"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover pulled pork" },
      { amount: "1", unit: "bag", item: "tortilla chips" },
      { amount: "2", unit: "cups", item: "shredded cheese" },
      { amount: "1", unit: "cup", item: "black beans" },
      { amount: "1/2", unit: "cup", item: "jalapeños" },
      { amount: "1/2", unit: "cup", item: "sour cream" },
      { amount: "1/4", unit: "cup", item: "green onions" }
    ],
    instructions: [
      "Preheat oven to 375°F.",
      "Spread chips on large baking sheet.",
      "Top with pulled pork, beans, and cheese.",
      "Bake 10 minutes until cheese melts.",
      "Top with jalapeños, sour cream, and green onions.",
      "Serve immediately."
    ]
  },
  {
    id: "leftover-brisket-mac",
    name: "Brisket Mac and Cheese",
    description: "Leftover brisket meets comfort food champion. Next-level amazing.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "American",
    image: brisketMacImg,
    totalTime: 30,
    tags: ["leftover", "comfort", "pasta"],
    ingredients: [
      { amount: "1", unit: "lb", item: "macaroni" },
      { amount: "2", unit: "cups", item: "leftover brisket, chopped" },
      { amount: "3", unit: "cups", item: "shredded cheddar" },
      { amount: "2", unit: "cups", item: "milk" },
      { amount: "1/4", unit: "cup", item: "butter" },
      { amount: "1/4", unit: "cup", item: "flour" },
      { amount: "1", unit: "cup", item: "panko breadcrumbs" }
    ],
    instructions: [
      "Cook macaroni according to package.",
      "Melt butter, whisk in flour, cook 1 minute.",
      "Gradually add milk, whisking until thick.",
      "Stir in cheese until melted.",
      "Mix pasta, cheese sauce, and brisket.",
      "Transfer to baking dish, top with panko.",
      "Broil 3 minutes until golden.",
      "Serve hot."
    ]
  },
  {
    id: "leftover-sausage-burrito",
    name: "Sausage Breakfast Burrito",
    description: "Leftover breakfast sausage wrapped in morning perfection.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Mexican",
    image: sausageBurritoImg,
    totalTime: 15,
    tags: ["leftover", "breakfast", "quick"],
    ingredients: [
      { amount: "8", unit: "", item: "leftover cooked sausage links" },
      { amount: "6", unit: "", item: "eggs, scrambled" },
      { amount: "1", unit: "cup", item: "shredded cheese" },
      { amount: "1/2", unit: "cup", item: "salsa" },
      { amount: "4", unit: "large", item: "flour tortillas" },
      { amount: "1/2", unit: "cup", item: "sour cream" }
    ],
    instructions: [
      "Reheat sausage links, chop into pieces.",
      "Scramble eggs until just set.",
      "Warm tortillas.",
      "Layer eggs, sausage, cheese, and salsa on each tortilla.",
      "Roll into burritos.",
      "Serve with sour cream."
    ]
  },
  {
    id: "leftover-stuffing-muffins",
    name: "Leftover Stuffing Muffins",
    description: "Thanksgiving stuffing becomes portable savory muffins.",
    cookTime: "25 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "American",
    image: stuffingMuffinsImg,
    totalTime: 30,
    tags: ["leftover", "side", "thanksgiving"],
    ingredients: [
      { amount: "4", unit: "cups", item: "leftover stuffing" },
      { amount: "2", unit: "", item: "eggs, beaten" },
      { amount: "1/2", unit: "cup", item: "chicken broth" },
      { amount: "1/2", unit: "cup", item: "shredded cheese" }
    ],
    instructions: [
      "Preheat oven to 350°F. Grease muffin tin.",
      "Mix stuffing with eggs, broth, and cheese.",
      "Pack mixture into muffin cups.",
      "Bake 25 minutes until golden and crispy on top.",
      "Let cool 5 minutes before removing.",
      "Serve with gravy or cranberry sauce."
    ]
  },
  {
    id: "leftover-salmon-salad",
    name: "Salmon Caesar Salad",
    description: "Last night's salmon becomes gourmet lunch salad.",
    cookTime: "0 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 2,
    cuisine: "American",
    image: salmonSaladImg,
    totalTime: 10,
    tags: ["leftover", "salad", "healthy", "quick"],
    ingredients: [
      { amount: "2", unit: "", item: "leftover salmon fillets, flaked" },
      { amount: "1", unit: "head", item: "romaine lettuce, chopped" },
      { amount: "1/2", unit: "cup", item: "Caesar dressing" },
      { amount: "1/2", unit: "cup", item: "parmesan, shaved" },
      { amount: "1", unit: "cup", item: "croutons" },
      { amount: "1", unit: "", item: "lemon" }
    ],
    instructions: [
      "Chop romaine and place in large bowl.",
      "Add Caesar dressing, toss to coat.",
      "Top with flaked salmon.",
      "Add parmesan shavings and croutons.",
      "Squeeze fresh lemon over salad.",
      "Serve immediately."
    ]
  }
];

// Helper functions
export const getRecipesByCollection = (collection: string): Recipe[] => {
  return allRecipes.filter(recipe => recipe.id.startsWith(collection));
};

export const getRecipesByTag = (tag: string): Recipe[] => {
  return allRecipes.filter(recipe => recipe.tags?.includes(tag));
};

export const getRecipesByDifficulty = (difficulty: string): Recipe[] => {
  return allRecipes.filter(recipe => recipe.difficulty === difficulty);
};

export const getQuickRecipes = (): Recipe[] => {
  return allRecipes.filter(recipe => recipe.totalTime && recipe.totalTime <= 30);
};
