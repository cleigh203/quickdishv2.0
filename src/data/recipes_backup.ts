import { Recipe } from "@/types/recipe";

// Import AI-generated images
const porkChopsApplesImg = "https://i.imgur.com/mbuGyaR.png";
// lemonHerbChickenThighsImg replaced with imgur URL
const lemonHerbChickenThighsImg = "https://i.imgur.com/KwNUHAc.png";
// bbqMeatloafImg replaced with imgur URL
const bbqMeatloafImg = "https://i.imgur.com/cZ6DgEY.png";
// honeyMustardChickenImg replaced with imgur URL
const honeyMustardChickenImg = "https://i.imgur.com/UvKDAtR.png";
// burritoBowlImg replaced with imgur URL
const burritoBowlImg = "https://i.imgur.com/877Y8M2.png";
// chiliMacCheeseImg replaced with imgur URL
const chiliMacCheeseImg = "https://i.imgur.com/Iy5HRsX.png";
// tuscanChickenPastaImg replaced with imgur URL
const tuscanChickenPastaImg = "https://i.imgur.com/BArBYKw.png";
// beefBroccoliImg replaced with imgur URL
const beefBroccoliImg = "https://i.imgur.com/lSRdTNS.png";
// broccoliSoupImg replaced with imgur URL
const broccoliSoupImg = "https://i.imgur.com/5Wn96I7.png";
// capreseChickenImg replaced with imgur URL
const capreseChickenImg = "https://i.imgur.com/LsSmGYN.png";
// chickenSandwichImg replaced with imgur URL
const chickenSandwichImg = "https://i.imgur.com/9M80bvv.png";
// steakQuesadillaImg replaced with imgur URL
const steakQuesadillaImg = "https://i.imgur.com/5ZNF6sl.png";
// roadhouseRollsImg updated with new URL
const roadhouseRollsImg = "https://i.imgur.com/AdBW8B6.png";
// copycatRaisingCanesSauceImg updated with new URL
const copycatRaisingCanesSauceImg = "https://i.imgur.com/KrGQ6ol.png";
// copycatAuntieAnnesPretzelBitesImg updated with new URL
const copycatAuntieAnnesPretzelBitesImg = "https://i.imgur.com/OjGASKI.png";
// burgerSlidersImg replaced with imgur URL
const burgerSlidersImg = "https://i.imgur.com/BJ1aRuN.png";

// eggBitesImg replaced with imgur URL
const eggBitesImg = "https://i.imgur.com/u5ZahL2.png";
// sausageBurritoImg replaced with imgur URL
const sausageBurritoImg = "https://i.imgur.com/TRWioaz.png";
// animalFriesImg replaced with imgur URL
const animalFriesImg = "https://i.imgur.com/R3lKTcY.png";
// meatballSubImg replaced with imgur URL
const meatballSubImg = "https://i.imgur.com/cJ7Z5m8.png";
// applePieImg replaced with imgur URL
const applePieImg = "https://i.imgur.com/EHVFMzi.png";
const butternutSquashSoupImg = "https://i.imgur.com/U7G2UOE.png";
const appleCiderPulledPorkImg = "https://i.imgur.com/aHMkyJB.png";
const cranberryBrieBitesImg = "https://i.imgur.com/AIsG9V8.png";
const harvestChickenVegetablesImg = "https://i.imgur.com/7KtS2Em.png";
const pecanCrustedPorkImg = "https://i.imgur.com/PibHyc6.png";
const cheddarBiscuitsImg = "https://i.imgur.com/7rjsy3s.png";
const cornSalsaImg = "https://i.imgur.com/FOozv2A.png";
const lemonSalmonImg = "https://i.imgur.com/placeholder3.png";
const kungPaoImg = "https://i.imgur.com/iYn9pqC.png";
const pizzaFrittataImg = "https://i.imgur.com/placeholder5.png";
const friedRiceImg = "https://i.imgur.com/placeholder6.png";
const potatoCroquettesImg = "https://i.imgur.com/placeholder7.png";
const turkeyQuesadillasImg = "https://i.imgur.com/placeholder8.png";
const stuffingMuffinsImg = "https://i.imgur.com/placeholder9.png";
const salmonSaladImg = "https://i.imgur.com/placeholder10.png";
const leftoverChickenPhoImg = "https://i.imgur.com/placeholder11.png";
const leftoverChiliCheeseFriesImg = "https://i.imgur.com/placeholder12.png";
const leftoverTurkeyTetrazziniImg = "https://i.imgur.com/placeholder13.png";
const leftoverChickenAlfredoShellsImg = "https://i.imgur.com/placeholder14.png";
const leftoverBbqRibsMacImg = "https://i.imgur.com/S0ROGmn.png";
const leftoverChickenParmSoupImg = "https://i.imgur.com/placeholder16.png";
const leftoverLasagnaGrilledCheeseImg = "https://i.imgur.com/placeholder17.png";
const leftoverPotRoastRamenImg = "https://i.imgur.com/placeholder18.png";
const teriyakiChickenImg = "https://i.imgur.com/placeholder19.png";
const sweetPotatoCasseroleImg = "https://i.imgur.com/YlNbMCE.png";
const chickenFajitaRiceImg = "https://i.imgur.com/rgRODpK.png";
const breakfastHashbrownCasseroleImg = "https://i.imgur.com/placeholder22.png";
const breakfastScrambledEggsBaconImg = "https://i.imgur.com/placeholder23.png";
const breakfastShakshukaClassicImg = "https://i.imgur.com/placeholder24.png";
const bakedChickenMeatballsImg = "https://i.imgur.com/placeholder25.png";
const sheetPanChickenVegetablesImg = "https://i.imgur.com/placeholder26.png";
const tacoSkilletImg = "https://i.imgur.com/placeholder27.png";
const stuffedBellPeppersProteinImg = "https://i.imgur.com/placeholder28.png";
const beefStroganoffProteinImg = "https://i.imgur.com/placeholder29.png";
const onePotCreamyTomatoBeefPastaImg = "https://i.imgur.com/placeholder30.png";
const onePotCajunShrimpPastaImg = "https://i.imgur.com/placeholder31.png";
const onePotMexicanChickenRiceImg = "https://i.imgur.com/placeholder32.png";
const onePotChickenGarlicRiceImg = "https://i.imgur.com/placeholder33.png";
const onePotChickenRiceVegetablesImg = "https://i.imgur.com/placeholder34.png";
const onePotGreekChickenLemonRiceImg = "https://i.imgur.com/placeholder35.png";
const onePotSpinachBeefSoupImg = "https://i.imgur.com/placeholder36.png";
const onePotCoconutCurryLentilSoupImg = "https://i.imgur.com/placeholder37.png";
const onePotChickenPotPieChowderImg = "https://i.imgur.com/placeholder38.png";
const onePotBraisedShortRibsImg = "https://i.imgur.com/placeholder39.png";
const onePotBeefTacoSkilletImg = "https://i.imgur.com/placeholder40.png";
const butterChickpeasImg = "https://i.imgur.com/placeholder41.png";
const veganCoconutBaconImg = "https://i.imgur.com/placeholder42.png";
const pumpkinSpiceLatteOatsImg = "https://i.imgur.com/E8Oav3g.png";
const pumpkinCinnamonRollsImg = "https://i.imgur.com/PWK62lX.png";
const fallPumpkinCheesecakeBarsNewImg = "https://i.imgur.com/placeholder45.png";
const fallCaramelAppleBarsImg = "https://i.imgur.com/PgAOKnL.png";
const fallSweetPotatoCasseroleNewImg = "https://i.imgur.com/placeholder47.png";
const fallButternutSquashSoupNewImg = "https://i.imgur.com/U7G2UOE.png";
const frenchOnionSoupBakeImg = "https://i.imgur.com/placeholder49.png";
const shepherdsPieTwiceBakedImg = "https://i.imgur.com/placeholder50.png";
const marryMeTofuImg = "https://i.imgur.com/placeholder51.png";
const highProteinCucumberSaladImg = "https://i.imgur.com/placeholder52.png";
const marryMeChickpeasImg = "https://i.imgur.com/placeholder53.png";
const chickpeaCurryImg = "https://i.imgur.com/placeholder54.png";
const veganProteinPastaImg = "https://i.imgur.com/placeholder55.png";
const oysterMushroomFriedChickenImg = "https://i.imgur.com/placeholder56.png";
const hotHoneyTofuTendersImg = "https://i.imgur.com/placeholder57.png";
const turkishPastaImg = "https://i.imgur.com/placeholder58.png";
const veganSteakBitesImg = "https://i.imgur.com/placeholder59.png";
const gardenFocacciaImg = "https://i.imgur.com/placeholder60.png";
const turkishLayeredPastaImg = "https://i.imgur.com/placeholder61.png";
const roastedGarlicParmChickenImg = "https://i.imgur.com/placeholder62.png";
const friedChickenRamenImg = "https://i.imgur.com/placeholder63.png";
const turkeyGrilledCheeseImg = "https://i.imgur.com/placeholder64.png";
const creamyTuscanChickenImg = "https://i.imgur.com/placeholder65.png";
const stuffedBellPeppersDinnerImg = "https://i.imgur.com/placeholder66.png";
const caramelAppleNachosImg = "https://i.imgur.com/dGYFnDc.png";
const pumpkinRisottoImg = "https://i.imgur.com/R2KpdiH.png";
// Halloween assets removed for 2025 launch
// Fallbacks for removed Halloween image variables (prevent runtime ReferenceError during purge)

// Import new vegetarian/vegan recipes
// vegetarianChiliImg replaced with imgur URL
const vegetarianChiliImg = "https://i.imgur.com/StJIBqq.png";
// veganNachosImg replaced with imgur URL
const veganNachosImg = "https://i.imgur.com/pjGelRT.png";
// veganMacCheeseImg replaced with imgur URL
const veganMacCheeseImg = "https://i.imgur.com/CwUaiIk.png";
// veganMugCakesImg replaced with imgur URL
const veganMugCakesImg = "https://i.imgur.com/BxsLtJN.png";

// Import fall favorites recipes

// Import NEW fall favorites recipes (20 new items)
const fallPumpkinCinnamonRollsImg = "https://i.imgur.com/PWK62lX.png";
const pumpkinBananaBreadImg = "https://i.imgur.com/ckaT1lp.png";
const stuffedBakedApplesImg = "https://i.imgur.com/McT92wA.png";
const cinnamonRollApplePieImg = "https://i.imgur.com/bGw8DgL.png";

// Import One Pot Wonders recipes
// loadedBakedPotatoSoupImg replaced with imgur URL
const loadedBakedPotatoSoupImg = "https://i.imgur.com/xLNXg9O.png";
// sausageKaleSoupImg replaced with imgur URL
const sausageKaleSoupImg = "https://i.imgur.com/ea4GaUL.png";
// mushroomWildRiceSoupImg replaced with imgur URL
const mushroomWildRiceSoupImg = "https://i.imgur.com/IRAMVFF.png";
// chiliCheeseFriesCasseroleImg replaced with imgur URL
const chiliCheeseFriesCasseroleImg = "https://i.imgur.com/0C3bIhH.png";
// meatballSubCasseroleImg replaced with imgur URL
const meatballSubCasseroleImg = "https://i.imgur.com/0C3bIhH.png";
// crackChickenNoodleSoupImg replaced with imgur URL
const crackChickenNoodleSoupImg = "https://i.imgur.com/G68U25j.png";

// Import new recipes
import { newRecipes } from "./newRecipes";

// Import new vegan recipe images
// veganCrunchwrapImg replaced with imgur URL
const veganCrunchwrapImg = "https://i.imgur.com/H81EieO.png";
// smashBurgerTacosImg replaced with imgur URL
const smashBurgerTacosImg = "https://i.imgur.com/ZjZgGa5.png";

// Import new dinner recipe images
// smashBurgerTacosDinnerImg replaced with imgur URL
const smashBurgerTacosDinnerImg = "https://i.imgur.com/ZjZgGa5.png";
// onePanChickenGravyImg replaced with imgur URL
const onePanChickenGravyImg = "https://i.imgur.com/e0dPz5G.png";
// twoIngredientPiciPastaImg replaced with imgur URL
const twoIngredientPiciPastaImg = "https://i.imgur.com/SldTS5S.png";
// veganCustardToastImg replaced with imgur URL
const veganCustardToastImg = "https://i.imgur.com/H6WEFFf.png";

// Dessert images are served from Lovable uploads

// Lunch (20)
// lunchBuffaloChickenWrapImg replaced with imgur URL
const lunchBuffaloChickenWrapImg = "https://i.imgur.com/wDgcADj.png";
// lunchTurkeyAvocadoClubImg replaced with imgur URL
const lunchTurkeyAvocadoClubImg = "https://i.imgur.com/VozG67M.png";
// lunchTunaNicoiseSaladImg replaced with imgur URL
const lunchTunaNicoiseSaladImg = "https://i.imgur.com/QIrYp3J.png";
// lunchMargheritaFlatbreadImg replaced with imgur URL
const lunchMargheritaFlatbreadImg = "https://i.imgur.com/B8QxTtF.png";

// One Pot Wonders (20)
// onePotMoroccanTagineImg replaced with imgur URL
const onePotMoroccanTagineImg = "https://i.imgur.com/x93gTnK.png";

// Breakfast (20)
// breakfastTacosImg replaced with imgur URL
const breakfastTacosImg = "https://i.imgur.com/KnY1DpE.png";

// New Breakfast Recipes (20)
// breakfastButtermilkPancakesImg replaced with imgur URL
const breakfastButtermilkPancakesImg = "https://i.imgur.com/4AOEnQq.png";
// breakfastCasseroleClassicImg replaced with imgur URL
const breakfastCasseroleClassicImg = "https://i.imgur.com/mHmY7iT.jpeg";
const breakfastQuicheLorraineImg = "https://i.imgur.com/HOOLi2x.png";
// breakfastSandwichClassicImg replaced with imgur URL
const breakfastSandwichClassicImg = "https://i.imgur.com/AEmPQcd.png";
// breakfastTacosClassicImg replaced with imgur URL
const breakfastTacosClassicImg = "https://i.imgur.com/KnY1DpE.png";
// sheetPanChickenFajitasImg replaced with imgur URL
const sheetPanChickenFajitasImg = "https://i.imgur.com/8MTMu7t.png";
// grilledChickenCapreseImg replaced with imgur URL
const grilledChickenCapreseImg = "https://i.imgur.com/LsSmGYN.png";
// slowCookerWhiteChickenChiliImg replaced with imgur URL
const slowCookerWhiteChickenChiliImg = "https://i.imgur.com/7raEzFt.png";
// cheeseburgerBowlsImg replaced with imgur URL
const cheeseburgerBowlsImg = "https://i.imgur.com/yH6PcDe.png";
// onePanBeefPotatoesImg replaced with imgur URL
const onePanBeefPotatoesImg = "https://i.imgur.com/094LhGj.png";
// turkeyMeatloafImg replaced with imgur URL
const turkeyMeatloafImg = "https://i.imgur.com/UPQIShK.png";
// sheetPanShrimpFajitasImg replaced with imgur URL
const sheetPanShrimpFajitasImg = "https://i.imgur.com/KIlgFSD.png";
// pestoBakedSalmonImg replaced with imgur URL
const pestoBakedSalmonImg = "https://i.imgur.com/BZ45ul8.png";
// cottageCheeseBakedZitiImg replaced with imgur URL
const cottageCheeseBakedZitiImg = "https://i.imgur.com/hMeLM0u.png";
// slowCookerLasagnaImg replaced with imgur URL
const slowCookerLasagnaImg = "https://i.imgur.com/kOMSWHD.png";
// chickenQuesadillasImg replaced with imgur URL
const chickenQuesadillasImg = "https://i.imgur.com/DmisYMy.png";

// One Pot Wonders (20)


// Restaurant Copycats (20)
// copycatChickFilASandwichImg replaced with imgur URL
const copycatChickFilASandwichImg = "https://i.imgur.com/9M80bvv.png";
// copycatChipotleBurritoBowlImg replaced with imgur URL
const copycatChipotleBurritoBowlImg = "https://i.imgur.com/877Y8M2.png";
// copycatPaneraBroccoliSoupImg replaced with imgur URL
const copycatPaneraBroccoliSoupImg = "https://i.imgur.com/5Wn96I7.png";
// copycatSubwayMeatballSubImg replaced with imgur URL
const copycatSubwayMeatballSubImg = "https://i.imgur.com/cJ7Z5m8.png";
// copycatStarbucksEggBitesImg replaced with imgur URL
const copycatStarbucksEggBitesImg = "https://i.imgur.com/u5ZahL2.png";
// copycatOutbackBloominOnionImg replaced with imgur URL
const copycatOutbackBloominOnionImg = "https://i.imgur.com/KnOg2Qw.png";

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
    image: "https://i.imgur.com/kVbc5Ha.png",
    totalTime: 240,
    tags: ["dessert", "italian", "coffee", "no-bake", "vegetarian", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 8,
      carbs: 42,
      fat: 20,
      fiber: 1,
      sugar: 28,
      servingSize: "1 slice"
    },
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
    cuisine: "Desserts",
    image: "/lovable-uploads/dessert-cheesecake.png",
    totalTime: 180,
    tags: ["dessert", "baked", "american", "rich", "vegetarian", "glutenfree"],
    nutrition: {
      calories: 520,
      protein: 9,
      carbs: 48,
      fat: 32,
      fiber: 1,
      sugar: 38,
      servingSize: "1 slice"
    },
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
      "Preheat oven to 325?F. Mix [2 cups graham crumbs] with [1/2 cup melted butter].",
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
    cuisine: "Desserts",
    image: "/lovable-uploads/dessert-brownies.png",
    totalTime: 45,
    tags: ["dessert", "chocolate", "baked", "vegetarian"],
    nutrition: {
      calories: 240,
      protein: 3,
      carbs: 32,
      fat: 12,
      fiber: 2,
      sugar: 24,
      servingSize: "1 brownie"
    },
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
      "Preheat oven to 350?F. Grease 9x13 pan.",
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
    totalTime: 120,
    tags: ["dessert", "french", "baked", "elegant", "vegetarian", "glutenfree"],
    ingredients: [
      { amount: "1.75", unit: "cups", item: "powdered sugar" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
      "Bake at 300?F for 13-15 minutes. Cool completely.",
      "Beat [1 cup butter], [2 cups powdered sugar], [1 tsp vanilla] for filling.",
      "Sandwich cookies with buttercream, refrigerate before serving."
    ]
  },
  {
    id: "dessert-creme-brulee",
    name: "Creme Brulee",
    description: "Silky vanilla custard with caramelized sugar crust. Torch required.",
    cookTime: "40 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "French",
    image: "/lovable-uploads/dessert-creme-brulee.png",
    totalTime: 165,
    tags: ["dessert", "french", "elegant", "custard", "vegetarian", "glutenfree"],
    ingredients: [
      { amount: "2", unit: "cups", item: "heavy cream" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "", item: "vanilla bean" },
      { amount: "5", unit: "", item: "egg yolks" },
      { amount: "1/2", unit: "cup", item: "sugar" },
      { amount: "6", unit: "tbsp", item: "sugar (for topping)" }
    ],
    instructions: [
      "Preheat oven to 325?F. Heat [2 cups cream] with [1 vanilla bean] seeds until steaming.",
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
    cuisine: "Desserts",
    image: "https://i.imgur.com/p4zC49N.jpeg",
    totalTime: 80,
    tags: ["dessert", "baked", "american", "fruit", "vegetarian"],
    ingredients: [
      { amount: "2", unit: "", item: "pie crusts" ,
    nutrition: { calories: 150, protein: 5, carbs: 10, fat: 5, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
      { amount: "6", unit: "cups", item: "sliced apples" },
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "2", unit: "tbsp", item: "flour" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1/4", unit: "tsp", item: "nutmeg" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "", item: "egg" }
    ],
    instructions: [
      "Preheat oven to 425?F. Line 9-inch pie pan with one crust.",
      "Toss [6 cups apples], [3/4 cup sugar], [2 tbsp flour], [1 tsp cinnamon], [1/4 tsp nutmeg].",
      "Pour filling into crust, dot with [2 tbsp butter].",
      "Cover with second crust, crimp edges, cut vents.",
      "Brush with beaten [egg], sprinkle with sugar.",
      "Bake 15 minutes at 425?F, reduce to 350?F, bake 35 more minutes.",
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
    image: "https://i.imgur.com/bNSgnOh.png",
    totalTime: 27,
    tags: ["dessert", "chocolate", "elegant", "vegetarian"],
    ingredients: [
      { amount: "6", unit: "oz", item: "dark chocolate" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1/2", unit: "cup", item: "butter" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "2", unit: "", item: "egg yolks" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "2", unit: "tbsp", item: "flour" },
      { amount: "1", unit: "tsp", item: "vanilla extract" }
    ],
    instructions: [
      "Preheat oven to 425?F. Butter and cocoa 4 ramekins.",
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
    totalTime: 120,
    tags: ["dessert", "meringue", "fruit", "elegant", "vegetarian", "glutenfree"],
    ingredients: [
      { amount: "4", unit: "", item: "egg whites" ,
    nutrition: { calories: 150, protein: 5, carbs: 9, fat: 7, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1", unit: "tsp", item: "cornstarch" },
      { amount: "1", unit: "tsp", item: "white vinegar" },
      { amount: "2", unit: "cups", item: "heavy cream" },
      { amount: "2", unit: "tbsp", item: "powdered sugar" },
      { amount: "3", unit: "cups", item: "mixed berries" }
    ],
    instructions: [
      "Preheat oven to 300?F. Draw 8-inch circle on parchment.",
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
    image: "https://i.imgur.com/LTInVnV.png",
    totalTime: 75,
    tags: ["dessert", "nuts", "honey", "baked", "vegetarian", "glutenfree"],
    ingredients: [
      { amount: "16", unit: "oz", item: "phyllo dough" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "butter, melted" },
      { amount: "3", unit: "cups", item: "chopped walnuts" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1", unit: "cup", item: "water" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1/2", unit: "cup", item: "honey" }
    ],
    instructions: [
      "Preheat oven to 350?F. Mix [3 cups walnuts] with [1 tsp cinnamon].",
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
    tags: ["dessert", "fried", "cinnamon", "spanish", "vegetarian"],
    ingredients: [
      { amount: "1", unit: "cup", item: "water" ,
    nutrition: { calories: 150, protein: 5, carbs: 9, fat: 6, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
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
      "Heat 2 inches oil to 375?F.",
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
    image: "https://i.imgur.com/IGqTYAo.png",
    totalTime: 250,
    tags: ["dessert", "italian", "no-bake", "elegant", "vegetarian", "glutenfree"],
    ingredients: [
      { amount: "2", unit: "cups", item: "heavy cream" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    image: "https://i.imgur.com/ghQqpN1.png",
    totalTime: 35,
    tags: ["dessert", "italian", "fried", "ricotta", "vegetarian", "glutenfree"],
    ingredients: [
      { amount: "12", unit: "", item: "cannoli shells" ,
    nutrition: { calories: 150, protein: 5, carbs: 10, fat: 5, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
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
    cuisine: "Desserts",
    image: "https://i.imgur.com/LlMAQTT.png",
    totalTime: 60,
    tags: ["dessert", "comfort", "baked", "warm", "vegetarian"],
    ingredients: [
      { amount: "8", unit: "cups", item: "cubed bread" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "4", unit: "cups", item: "milk" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "2", unit: "tsp", item: "vanilla extract" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1/2", unit: "cup", item: "raisins" }
    ],
    instructions: [
      "Preheat oven to 350?F. Place [8 cups bread] in greased 9x13 dish.",
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
    totalTime: 135,
    tags: ["dessert", "custard", "caramel", "baked", "vegetarian", "glutenfree"],
    ingredients: [
      { amount: "1", unit: "cup", item: "sugar (for caramel)" ,
    nutrition: { calories: 150, protein: 7, carbs: 14, fat: 5, fiber: 1, sugar: 4, servingSize: "1 serving (serves 4)" }},
      { amount: "5", unit: "", item: "eggs" },
      { amount: "1", unit: "can", item: "sweetened condensed milk" },
      { amount: "1", unit: "can", item: "evaporated milk" },
      { amount: "1", unit: "cup", item: "whole milk" },
      { amount: "1", unit: "tsp", item: "vanilla extract" }
    ],
    instructions: [
      "Preheat oven to 350?F. Melt [1 cup sugar] in pan until golden, pour into 9-inch round pan.",
      "Blend [5 eggs], [condensed milk], [evaporated milk], [1 cup milk], [1 tsp vanilla].",
      "Pour over caramel, place in roasting pan with hot water halfway up.",
      "Bake 50 minutes until set with slight jiggle.",
      "Cool, refrigerate 4 hours.",
      "Run knife around edge, invert onto serving plate."
    ]
  },
  {
    id: "dessert-eclairs",
    name: "Chocolate Eclairs",
    description: "Choux pastry with cream filling and chocolate glaze. French bakery perfection.",
    cookTime: "30 mins",
    prepTime: "30 mins",
    difficulty: "hard",
    servings: 12,
    cuisine: "French",
    image: "https://i.imgur.com/MKNZRKQ.png",
    totalTime: 75,
    tags: ["dessert", "french", "pastry", "chocolate", "vegetarian"],
    ingredients: [
      { amount: "1", unit: "cup", item: "water" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1/2", unit: "cup", item: "butter" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "2", unit: "cups", item: "heavy cream" },
      { amount: "1/4", unit: "cup", item: "powdered sugar" },
      { amount: "8", unit: "oz", item: "dark chocolate" }
    ],
    instructions: [
      "Preheat oven to 400?F. Boil [1 cup water] and [1/2 cup butter].",
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
    totalTime: 80,
    tags: ["dessert", "cake", "moist", "latin", "vegetarian"],
    ingredients: [
      { amount: "1", unit: "cup", item: "flour" ,
    nutrition: { calories: 163, protein: 6, carbs: 10, fat: 9, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
      { amount: "1.5", unit: "tsp", item: "baking powder" },
      { amount: "5", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1/3", unit: "cup", item: "milk" },
      { amount: "1", unit: "can", item: "evaporated milk" },
      { amount: "1", unit: "can", item: "sweetened condensed milk" },
      { amount: "1/2", unit: "cup", item: "heavy cream" }
    ],
    instructions: [
      "Preheat oven to 350?F. Grease 9x13 pan.",
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
    cuisine: "Desserts",
    image: "https://i.imgur.com/G37PuDP.png",
    totalTime: 150,
    tags: ["dessert", "breakfast", "baked", "cinnamon", "vegetarian"],
    ingredients: [
      { amount: "3.5", unit: "cups", item: "flour" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
      "Let rise 30 minutes, bake at 350?F for 25 minutes.",
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
    cuisine: "Desserts",
    image: "/lovable-uploads/dessert-cookies.png",
    totalTime: 27,
    tags: ["dessert", "cookies", "chocolate"],
    ingredients: [
      { amount: "2.25", unit: "cups", item: "flour" ,
    nutrition: { calories: 180, protein: 7, carbs: 12, fat: 10, fiber: 1, sugar: 4, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "1", unit: "cup", item: "butter, softened" },
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "3/4", unit: "cup", item: "brown sugar" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "2", unit: "tsp", item: "vanilla extract" },
      { amount: "2", unit: "cups", item: "chocolate chips" }
    ],
    instructions: [
      "Preheat oven to 375?F. Mix [2.25 cups flour] and [1 tsp baking soda].",
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
    cuisine: "Desserts",
    image: "/lovable-uploads/dessert-carrot-cake.png",
    totalTime: 55,
    tags: ["dessert", "cake", "spiced", "baked"],
    ingredients: [
      { amount: "2", unit: "cups", item: "flour" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
      "Preheat oven to 350?F. Grease 9x13 pan.",
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
    tags: ["dessert", "chocolate", "no-bake", "elegant", "glutenfree"],
    ingredients: [
      { amount: "8", unit: "oz", item: "dark chocolate" ,
    nutrition: { calories: 193, protein: 8, carbs: 10, fat: 12, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
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
    image: "https://i.imgur.com/R1STPqN.png",
    totalTime: 75,
    tags: ["dessert", "french", "pastry", "chocolate"],
    ingredients: [
      { amount: "1", unit: "cup", item: "water" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1/2", unit: "cup", item: "butter" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1", unit: "quart", item: "vanilla ice cream" },
      { amount: "8", unit: "oz", item: "dark chocolate" },
      { amount: "1/2", unit: "cup", item: "heavy cream" }
    ],
    instructions: [
      "Preheat oven to 400?F. Boil [1 cup water] and [1/2 cup butter].",
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
    cuisine: "Desserts",
    image: "/lovable-uploads/dessert-red-velvet.png",
    totalTime: 50,
    tags: ["dessert", "cake", "american", "baked"],
    ingredients: [
      { amount: "2.5", unit: "cups", item: "flour" ,
    nutrition: { calories: 150, protein: 6, carbs: 7, fat: 9, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
      "Preheat oven to 350?F. Grease two 9-inch round pans.",
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
    cuisine: "Desserts",
    image: "/lovable-uploads/dessert-key-lime-pie.png",
    totalTime: 135,
    tags: ["dessert", "citrus", "pie", "glutenfree"],
    ingredients: [
      { amount: "1.5", unit: "cups", item: "graham cracker crumbs" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1/3", unit: "cup", item: "butter, melted" },
      { amount: "2", unit: "cans", item: "sweetened condensed milk" },
      { amount: "4", unit: "", item: "egg yolks" },
      { amount: "1/2", unit: "cup", item: "key lime juice" },
      { amount: "1", unit: "cup", item: "heavy cream" }
    ],
    instructions: [
      "Preheat oven to 350?F. Mix [1.5 cups graham crumbs] and [1/3 cup butter].",
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
    cuisine: "Desserts",
    image: "https://i.imgur.com/3CJrgoJ.png",
    totalTime: 15,
    tags: ["dessert", "fruit", "warm", "glutenfree"],
    ingredients: [
      { amount: "1/4", unit: "cup", item: "butter" ,
    nutrition: { calories: 150, protein: 5, carbs: 8, fat: 8, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    cuisine: "Desserts",
    image: "/lovable-uploads/dessert-lemon-bars.png",
    totalTime: 55,
    tags: ["dessert", "citrus", "baked", "bars"],
    ingredients: [
      { amount: "1", unit: "cup", item: "butter, softened" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "1/2", unit: "cup", item: "powdered sugar" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1.5", unit: "cups", item: "sugar" },
      { amount: "1/3", unit: "cup", item: "lemon juice" },
      { amount: "1/4", unit: "cup", item: "flour" }
    ],
    instructions: [
      "Preheat oven to 350?F. Beat [1 cup butter], [2 cups flour], [1/2 cup powdered sugar].",
      "Press into greased 9x13 pan, bake 20 minutes.",
      "Whisk [4 eggs], [1.5 cups sugar], [1/3 cup lemon juice], [1/4 cup flour].",
      "Pour over hot crust, bake 25 minutes until set.",
      "Cool completely, dust with powdered sugar.",
      "Cut into squares."
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
    tags: ["copycat", "mexican", "healthy", "protein", "glutenfree"],
    nutrition: {
      calories: 650,
      protein: 38,
      carbs: 72,
      fat: 22,
      fiber: 12,
      sugar: 4,
      servingSize: "1 bowl"
    },
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
    image: "https://i.imgur.com/rROwWTF.jpeg",
    totalTime: 30,
    tags: ["copycat", "italian", "pasta", "comfort"],
    nutrition: {
      calories: 890,
      protein: 42,
      carbs: 68,
      fat: 48,
      fiber: 3,
      sugar: 5,
      servingSize: "1 plate"
    },
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
      "In large pan, melt butter and saut? garlic 1 minute.",
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
    image: "https://i.imgur.com/JHyp64J.jpeg",
    totalTime: 35,
    tags: ["copycat", "mexican", "fast-food"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    image: "https://i.imgur.com/u1wqedY.jpeg",
    totalTime: 35,
    tags: ["copycat", "appetizer", "vegetarian"],
    ingredients: [
      { amount: "3", unit: "", item: "ripe avocados" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
      "Heat oil to 350?F.",
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
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/KnOg2Qw.png",
    totalTime: 45,
    tags: ["copycat", "appetizer", "fried"],
    ingredients: [
      { amount: "1", unit: "large", item: "sweet onion" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 7, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
      "Heat oil to 350?F. Fry onion 10 minutes until golden.",
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
    cuisine: "One Pot Wonders",
    image: broccoliSoupImg,
    totalTime: 40,
    tags: ["copycat", "soup", "vegetarian", "comfort"],
    ingredients: [
      { amount: "1", unit: "lb", item: "broccoli florets" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
      "Melt butter in large pot, saut? onion until soft.",
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
    image: "https://i.imgur.com/cPUiLpn.jpeg",
    totalTime: 30,
    tags: ["copycat", "asian", "healthy", "appetizer"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground chicken" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 6, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    cuisine: "Restaurant Copycats",
    image: cheddarBiscuitsImg,
    totalTime: 25,
    tags: ["copycat", "bread", "side", "vegetarian", "glutenfree"],
    ingredients: [
      { amount: "2", unit: "cups", item: "Bisquick mix" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "shredded cheddar" },
      { amount: "2/3", unit: "cup", item: "milk" },
      { amount: "1/2", unit: "cup", item: "melted butter" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1/4", unit: "tsp", item: "Old Bay seasoning" },
      { amount: "1/4", unit: "cup", item: "parsley, chopped" }
    ],
    instructions: [
      "Preheat oven to 450?F.",
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
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/AdBW8B6.png",
    totalTime: 105,
    tags: ["copycat", "bread", "side"],
    ingredients: [
      { amount: "1", unit: "cup", item: "warm milk" ,
    nutrition: { calories: 150, protein: 5, carbs: 8, fat: 6, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
      "Let rise 30 minutes. Bake at 350?F for 12-15 minutes.",
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
    tags: ["copycat", "mexican", "vegan", "side", "glutenfree"],
    ingredients: [
      { amount: "3", unit: "cups", item: "frozen corn, thawed" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1/2", unit: "cup", item: "red onion, finely diced" },
      { amount: "1", unit: "", item: "jalape?o, seeded and minced" },
      { amount: "1/4", unit: "cup", item: "cilantro, chopped" },
      { amount: "2", unit: "tbsp", item: "lime juice" },
      { amount: "1", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Char corn in dry hot skillet until slightly blackened, about 5 minutes.",
      "Let cool to room temperature.",
      "Mix corn with red onion, jalape?o, cilantro, lime juice, and salt.",
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
    cuisine: "Restaurant Copycats",
    image: eggBitesImg,
    totalTime: 40,
    tags: ["copycat", "protein", "keto", "glutenfree"],
    ingredients: [
      { amount: "8", unit: "", item: "eggs" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "cottage cheese" },
      { amount: "1", unit: "cup", item: "shredded cheese" },
      { amount: "1/2", unit: "cup", item: "cooked bacon, crumbled" },
      { amount: "1/4", unit: "tsp", item: "salt" },
      { amount: "1/4", unit: "tsp", item: "pepper" }
    ],
    instructions: [
      "Preheat oven to 300?F. Grease muffin tin.",
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
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/wjoyn9U.jpeg",
    totalTime: 60,
    tags: ["copycat", "side", "comfort", "vegetarian", "glutenfree"],
    ingredients: [
      { amount: "2", unit: "lbs", item: "frozen shredded hashbrowns, thawed" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "can", item: "cream of chicken soup" },
      { amount: "2", unit: "cups", item: "sour cream" },
      { amount: "2", unit: "cups", item: "shredded cheddar" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "1/2", unit: "cup", item: "onion, diced" },
      { amount: "2", unit: "cups", item: "corn flakes, crushed" }
    ],
    instructions: [
      "Preheat oven to 350?F. Grease 9x13 baking dish.",
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
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/tM3AbuP.jpeg",
    totalTime: 35,
    tags: ["copycat", "fast-food", "glutenfree"],
    ingredients: [
      { amount: "1", unit: "cup", item: "pancake mix" ,
    nutrition: { calories: 180, protein: 11, carbs: 7, fat: 8, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    tags: ["copycat", "italian", "comfort"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/R3lKTcY.png",
    totalTime: 40,
    tags: ["copycat", "fast-food", "side", "glutenfree"],
    ingredients: [
      { amount: "2", unit: "lbs", item: "frozen french fries" ,
    nutrition: { calories: 188, protein: 13, carbs: 10, fat: 7, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
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
    cuisine: "Restaurant Copycats",
    image: chickenSandwichImg,
    totalTime: 35,
    tags: ["copycat", "fast-food"],
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" ,
    nutrition: { calories: 150, protein: 11, carbs: 8, fat: 5, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
      "Heat oil to 350?F. Fry chicken 5-7 minutes per side until golden.",
      "Drain on paper towels.",
      "Butter and toast buns.",
      "Place chicken on bun, top with pickles."
    ]
  },
  {
    id: "copycat-mcdonalds-big-mac-sauce",
    name: "McDonald's Big Mac Sauce",
    description: "The iconic special sauce that makes Big Macs legendary. Perfect for burgers, fries, or dipping!",
    cookTime: "0 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/9zB6RMV.png",
    totalTime: 5,
    tags: ["copycat", "restaurant", "viral", "mcdonalds", "sauce", "glutenfree"],
    ingredients: [
      { amount: "1", unit: "cup", item: "mayonnaise" ,
    nutrition: { calories: 206, protein: 12, carbs: 13, fat: 9, fiber: 1, sugar: 4, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "tbsp", item: "French dressing" },
      { amount: "4", unit: "tsp", item: "sweet pickle relish" },
      { amount: "1", unit: "tbsp", item: "finely minced white onion" },
      { amount: "1", unit: "tsp", item: "white vinegar" },
      { amount: "1", unit: "tsp", item: "granulated sugar" },
      { amount: "1/8", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Combine all ingredients in a bowl.",
      "Whisk together until smooth and well combined.",
      "Cover and refrigerate for at least 30 minutes to let flavors meld.",
      "Stir before using.",
      "Store in refrigerator for up to 2 weeks.",
      "Perfect on burgers, fries, or as a dipping sauce!"
    ]
  },
  {
    id: "copycat-starbucks-pink-drink",
    name: "Starbucks Pink Drink",
    description: "Refreshing strawberry a?a? drink with coconut milk. Instagram-famous and delicious!",
    cookTime: "0 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/xveBTd3.jpeg",
    totalTime: 10,
    tags: ["copycat", "restaurant", "viral", "starbucks", "beverage", "glutenfree"],
    nutrition: {
      calories: 140,
      protein: 1,
      carbs: 29,
      fat: 3,
      fiber: 2,
      sugar: 24,
      servingSize: "1 grande (16 oz)"
    },
    ingredients: [
      { amount: "3", unit: "cups", item: "white grape juice" },
      { amount: "1", unit: "cup", item: "frozen strawberries" },
      { amount: "1/4", unit: "cup", item: "a?a? juice or powder" },
      { amount: "2", unit: "cups", item: "coconut milk" },
      { amount: "2", unit: "cups", item: "ice" },
      { amount: "1", unit: "cup", item: "fresh strawberries, sliced" }
    ],
    instructions: [
      "Blend white grape juice and frozen strawberries until smooth.",
      "Add a?a? juice or powder and blend again.",
      "Fill glasses with ice.",
      "Pour strawberry mixture over ice.",
      "Top with coconut milk (it will create beautiful swirls).",
      "Add fresh strawberry slices.",
      "Stir gently before drinking and enjoy!"
    ]
  },
  {
    id: "copycat-raising-canes-chicken-fingers",
    name: "Raising Cane's Chicken Fingers",
    description: "Crispy, juicy chicken tenders better than the restaurant. Perfectly seasoned and tender!",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/XXVcldG.png",
    totalTime: 35,
    tags: ["copycat", "restaurant", "viral", "raising-canes", "chicken"],
    nutrition: {
      calories: 390,
      protein: 42,
      carbs: 28,
      fat: 12,
      fiber: 1,
      sugar: 2,
      servingSize: "1 serving (3-4 tenders)"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "chicken tenderloins" },
      { amount: "2", unit: "cups", item: "buttermilk" },
      { amount: "2", unit: "cups", item: "all-purpose flour" },
      { amount: "2", unit: "tsp", item: "garlic powder" },
      { amount: "2", unit: "tsp", item: "paprika" },
      { amount: "1", unit: "tsp", item: "black pepper" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "4", unit: "cups", item: "vegetable oil for frying" }
    ],
    instructions: [
      "Soak chicken in buttermilk for 15-20 minutes.",
      "Mix flour, garlic powder, paprika, pepper, and salt in a bowl.",
      "Heat oil to 350?F in a large pot or deep fryer.",
      "Remove chicken from buttermilk, letting excess drip off.",
      "Dredge each piece in seasoned flour, coating completely.",
      "Fry chicken in batches for 5-7 minutes until golden brown.",
      "Drain on paper towels.",
      "Serve hot with Cane's sauce!"
    ]
  },
  {
    id: "copycat-raising-canes-sauce",
    name: "Raising Cane's Sauce",
    description: "The famous tangy, creamy dipping sauce. Perfect for chicken tenders, fries, or anything!",
    cookTime: "0 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "Restaurant Copycats",
    image: copycatRaisingCanesSauceImg,
    totalTime: 5,
    tags: ["copycat", "restaurant", "viral", "raising-canes", "sauce", "glutenfree"],
    nutrition: {
      calories: 95,
      protein: 0,
      carbs: 3,
      fat: 9,
      fiber: 0,
      sugar: 2,
      servingSize: "2 tbsp"
    },
    ingredients: [
      { amount: "1/2", unit: "cup", item: "mayonnaise" },
      { amount: "1/4", unit: "cup", item: "ketchup" },
      { amount: "1/2", unit: "tsp", item: "garlic powder" },
      { amount: "1/2", unit: "tsp", item: "Worcestershire sauce" },
      { amount: "1/4", unit: "tsp", item: "black pepper" },
      { amount: "1/4", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Combine all ingredients in a bowl.",
      "Whisk until smooth and creamy.",
      "Taste and adjust seasonings if needed.",
      "Refrigerate for 30 minutes for best flavor.",
      "Serve with chicken tenders, fries, or as a burger sauce!",
      "Store in refrigerator for up to 1 week."
    ]
  },
  {
    id: "copycat-panda-express-orange-chicken",
    name: "Panda Express Orange Chicken",
    description: "Sweet, tangy, crispy orange chicken that rivals the original. Restaurant quality at home!",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/cxvnkI5.png",
    totalTime: 35,
    tags: ["copycat", "restaurant", "viral", "panda-express", "chinese"],
    nutrition: {
      calories: 490,
      protein: 28,
      carbs: 62,
      fat: 14,
      fiber: 1,
      sugar: 22,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "boneless chicken thighs, cubed" },
      { amount: "1", unit: "cup", item: "cornstarch" },
      { amount: "2", unit: "", item: "eggs, beaten" },
      { amount: "1/2", unit: "cup", item: "orange juice" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "rice vinegar" },
      { amount: "1", unit: "tbsp", item: "orange zest" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "ginger, grated" },
      { amount: "1/4", unit: "tsp", item: "red pepper flakes" },
      { amount: "3", unit: "cups", item: "vegetable oil for frying" }
    ],
    instructions: [
      "Coat chicken pieces in cornstarch, dip in egg, then coat again in cornstarch.",
      "Heat oil to 350?F and fry chicken until golden and crispy, about 5-6 minutes.",
      "Drain on paper towels.",
      "In a large skillet, combine orange juice, sugar, soy sauce, vinegar, zest, garlic, ginger, and red pepper flakes.",
      "Bring to a boil, then simmer until slightly thickened, about 5 minutes.",
      "Toss fried chicken in the orange sauce until well coated.",
      "Garnish with sesame seeds and green onions.",
      "Serve over steamed rice!"
    ]
  },
  {
    id: "copycat-kfc-coleslaw",
    name: "KFC Coleslaw",
    description: "Creamy, tangy coleslaw just like KFC's famous side dish. Perfect for any BBQ or picnic!",
    cookTime: "0 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/EA1UrJy.png",
    totalTime: 15,
    tags: ["copycat", "restaurant", "viral", "kfc", "side-dish", "glutenfree"],
    nutrition: {
      calories: 170,
      protein: 1,
      carbs: 14,
      fat: 13,
      fiber: 2,
      sugar: 12,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "8", unit: "cups", item: "finely shredded cabbage" },
      { amount: "1/4", unit: "cup", item: "shredded carrot" },
      { amount: "2", unit: "tbsp", item: "minced onion" },
      { amount: "1/3", unit: "cup", item: "sugar" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "1/8", unit: "tsp", item: "black pepper" },
      { amount: "1/4", unit: "cup", item: "milk" },
      { amount: "1/2", unit: "cup", item: "mayonnaise" },
      { amount: "1/4", unit: "cup", item: "buttermilk" },
      { amount: "1.5", unit: "tbsp", item: "white vinegar" },
      { amount: "2.5", unit: "tbsp", item: "lemon juice" }
    ],
    instructions: [
      "Mix cabbage, carrot, and onion in a large bowl.",
      "In a separate bowl, whisk together sugar, salt, pepper, milk, mayonnaise, buttermilk, vinegar, and lemon juice.",
      "Pour dressing over cabbage mixture.",
      "Toss until vegetables are evenly coated.",
      "Cover and refrigerate for at least 2 hours before serving.",
      "Toss again before serving for best flavor!"
    ]
  },
  {
    id: "copycat-applebees-quesadilla-burger",
    name: "Applebee's Quesadilla Burger",
    description: "Epic burger with quesadillas instead of buns! Loaded with cheese, bacon, and pico de gallo.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/FVjy3ls.jpeg",
    totalTime: 35,
    tags: ["copycat", "restaurant", "viral", "applebees", "burger"],
    nutrition: {
      calories: 720,
      protein: 42,
      carbs: 46,
      fat: 42,
      fiber: 2,
      sugar: 4,
      servingSize: "1 burger"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "8", unit: "", item: "flour tortillas (8-inch)" },
      { amount: "2", unit: "cups", item: "shredded Monterey Jack cheese" },
      { amount: "8", unit: "slices", item: "cooked bacon" },
      { amount: "1", unit: "cup", item: "pico de gallo" },
      { amount: "1/2", unit: "cup", item: "chipotle mayo" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" },
      { amount: "1/2", unit: "tsp", item: "garlic powder" }
    ],
    instructions: [
      "Season ground beef with salt, pepper, and garlic powder. Form into 4 patties.",
      "Grill or pan-fry burgers to desired doneness.",
      "Make quesadillas: place cheese on tortilla, fold in half, and cook in skillet until crispy and cheese melts.",
      "Repeat to make 8 quesadilla halves.",
      "Assemble: Place burger patty on one quesadilla half.",
      "Top with bacon, pico de gallo, and chipotle mayo.",
      "Top with another quesadilla half.",
      "Cut in half and serve immediately!"
    ]
  },
  {
    id: "copycat-sonic-cherry-limeade",
    name: "Sonic Cherry Limeade",
    description: "Sweet, tart, and refreshing cherry limeade. Perfect copycat of the Sonic Drive-In favorite!",
    cookTime: "0 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/nwouIOr.png",
    totalTime: 5,
    tags: ["copycat", "restaurant", "viral", "sonic", "beverage", "glutenfree"],
    nutrition: {
      calories: 150,
      protein: 0,
      carbs: 38,
      fat: 0,
      fiber: 0,
      sugar: 36,
      servingSize: "1 glass (16 oz)"
    },
    ingredients: [
      { amount: "1/2", unit: "cup", item: "fresh lime juice" },
      { amount: "1/2", unit: "cup", item: "cherry syrup (or grenadine)" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "4", unit: "cups", item: "cold water or lemon-lime soda" },
      { amount: "2", unit: "cups", item: "ice" },
      { amount: "8", unit: "", item: "maraschino cherries" },
      { amount: "4", unit: "", item: "lime slices" }
    ],
    instructions: [
      "Mix lime juice, cherry syrup, and sugar in a pitcher.",
      "Stir until sugar dissolves.",
      "Add cold water or soda and stir well.",
      "Fill glasses with ice.",
      "Pour cherry limeade over ice.",
      "Garnish with maraschino cherries and lime slices.",
      "Serve immediately with a straw!"
    ]
  },
  {
    id: "copycat-olive-garden-breadsticks-new",
    name: "Olive Garden Breadsticks",
    description: "Soft, fluffy breadsticks brushed with garlic butter. Just like Olive Garden's famous breadsticks!",
    cookTime: "15 mins",
    prepTime: "90 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/BMLXMDN.jpeg",
    totalTime: 105,
    tags: ["copycat", "restaurant", "viral", "olive-garden", "bread"],
    nutrition: {
      calories: 140,
      protein: 4,
      carbs: 25,
      fat: 3,
      fiber: 1,
      sugar: 2,
      servingSize: "1 breadstick"
    },
    ingredients: [
      { amount: "1", unit: "cup", item: "warm water" },
      { amount: "2", unit: "tbsp", item: "sugar" },
      { amount: "2.25", unit: "tsp", item: "active dry yeast" },
      { amount: "3", unit: "cups", item: "all-purpose flour" },
      { amount: "2", unit: "tbsp", item: "butter, softened" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "4", unit: "tbsp", item: "butter, melted (for brushing)" },
      { amount: "1/2", unit: "tsp", item: "garlic powder" },
      { amount: "1/4", unit: "tsp", item: "salt (for topping)" }
    ],
    instructions: [
      "Mix warm water, sugar, and yeast. Let sit for 5 minutes until foamy.",
      "Add flour, softened butter, and salt. Mix until dough forms.",
      "Knead for 5-7 minutes until smooth and elastic.",
      "Place in greased bowl, cover, and let rise for 1 hour.",
      "Punch down dough and divide into 12 pieces.",
      "Roll each into a 7-8 inch breadstick.",
      "Place on baking sheet, cover, and let rise 30 minutes.",
      "Bake at 400?F for 12-15 minutes until golden.",
      "Mix melted butter with garlic powder and salt.",
      "Brush hot breadsticks with garlic butter immediately!",
      "Serve warm and enjoy!"
    ]
  },
  {
    id: "copycat-shake-shack-burger",
    name: "Shake Shack Burger",
    description: "Premium fast-casual burger with ShackSauce and perfectly melted cheese. Better than the original!",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/nYVFsM1.jpeg",
    totalTime: 25,
    tags: ["copycat", "restaurant", "viral", "shake-shack", "burger"],
    nutrition: {
      calories: 610,
      protein: 32,
      carbs: 34,
      fat: 38,
      fiber: 2,
      sugar: 6,
      servingSize: "1 burger"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "ground beef (80/20)" },
      { amount: "4", unit: "", item: "potato hamburger buns" },
      { amount: "8", unit: "slices", item: "American cheese" },
      { amount: "1/2", unit: "cup", item: "mayonnaise" },
      { amount: "1", unit: "tbsp", item: "ketchup" },
      { amount: "1", unit: "tbsp", item: "yellow mustard" },
      { amount: "4", unit: "slices", item: "dill pickle, chopped" },
      { amount: "1", unit: "tsp", item: "white vinegar" },
      { amount: "4", unit: "leaves", item: "lettuce" },
      { amount: "4", unit: "slices", item: "tomato" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" }
    ],
    instructions: [
      "Make ShackSauce: mix mayo, ketchup, mustard, pickles, and vinegar. Refrigerate.",
      "Divide beef into 4 portions (don't overwork the meat).",
      "Shape into thin patties slightly larger than buns.",
      "Season generously with salt and pepper.",
      "Heat griddle or cast iron skillet over high heat.",
      "Cook burgers for 2-3 minutes per side, pressing down with spatula.",
      "Top each burger with 2 cheese slices during last minute.",
      "Toast buns on griddle.",
      "Assemble: bottom bun, ShackSauce, lettuce, tomato, burger, more sauce, top bun.",
      "Serve immediately with crinkle-cut fries!"
    ]
  },
  {
    id: "copycat-five-guys-cajun-fries",
    name: "Five Guys Cajun Fries",
    description: "Hand-cut fries seasoned with spicy Cajun seasoning. Addictively crispy and flavorful!",
    cookTime: "15 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/OzmMRWc.jpeg",
    totalTime: 30,
    tags: ["copycat", "restaurant", "viral", "five-guys", "side-dish", "glutenfree"],
    nutrition: {
      calories: 420,
      protein: 5,
      carbs: 58,
      fat: 20,
      fiber: 5,
      sugar: 2,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "large", item: "russet potatoes" },
      { amount: "8", unit: "cups", item: "peanut oil for frying" },
      { amount: "2", unit: "tbsp", item: "paprika" },
      { amount: "1", unit: "tbsp", item: "garlic powder" },
      { amount: "1", unit: "tbsp", item: "onion powder" },
      { amount: "1", unit: "tbsp", item: "cayenne pepper" },
      { amount: "1", unit: "tsp", item: "dried oregano" },
      { amount: "1", unit: "tsp", item: "dried thyme" },
      { amount: "2", unit: "tsp", item: "salt" },
      { amount: "1", unit: "tsp", item: "black pepper" }
    ],
    instructions: [
      "Cut potatoes into 1/4-inch thick fries. Soak in cold water for 30 minutes.",
      "Mix all spices together to make Cajun seasoning.",
      "Drain and pat potatoes completely dry.",
      "Heat oil to 325?F. Fry potatoes in batches for 5 minutes (blanching).",
      "Remove and let rest for 10 minutes.",
      "Increase oil temperature to 375?F.",
      "Fry again for 2-3 minutes until golden and crispy.",
      "Drain on paper towels.",
      "Toss hot fries with Cajun seasoning.",
      "Serve immediately in a paper cup for authentic Five Guys experience!"
    ]
  },
  {
    id: "copycat-chick-fil-a-chicken-minis",
    name: "Chick-fil-A Chicken Minis",
    description: "Mini chicken sandwiches on sweet yeast rolls. Perfect breakfast or snack!",
    cookTime: "20 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/8ldpDm2.jpeg",
    totalTime: 40,
    tags: ["copycat", "restaurant", "viral", "chick-fil-a"],
    nutrition: {
      calories: 350,
      protein: 24,
      carbs: 36,
      fat: 12,
      fiber: 2,
      sugar: 6,
      servingSize: "3 minis"
    },
    ingredients: [
      { amount: "12", unit: "", item: "frozen yeast dinner rolls" },
      { amount: "1", unit: "lb", item: "chicken breast tenderloins" },
      { amount: "1", unit: "cup", item: "pickle juice" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "1", unit: "tbsp", item: "powdered sugar" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1/2", unit: "cup", item: "milk" },
      { amount: "2", unit: "cups", item: "peanut oil for frying" },
      { amount: "2", unit: "tbsp", item: "melted butter" },
      { amount: "1", unit: "tbsp", item: "honey" }
    ],
    instructions: [
      "Thaw and bake dinner rolls according to package directions.",
      "Marinate chicken in pickle juice for at least 1 hour.",
      "Mix flour, powdered sugar, and paprika.",
      "Whisk egg and milk together.",
      "Dredge chicken in flour, dip in egg wash, then flour again.",
      "Heat oil to 350?F and fry chicken until golden, about 5-6 minutes.",
      "Cut each chicken piece to fit rolls.",
      "Slice rolls horizontally.",
      "Place chicken inside each roll.",
      "Mix melted butter and honey, brush on tops of rolls.",
      "Serve warm!"
    ]
  },
  {
    id: "copycat-olive-garden-zuppa-toscana",
    name: "Olive Garden Zuppa Toscana Soup",
    description: "Creamy Italian sausage soup with kale and potatoes. Restaurant comfort in a bowl!",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/oXx9Huz.png",
    totalTime: 45,
    tags: ["copycat", "restaurant", "viral", "olive-garden", "soup", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 14,
      carbs: 22,
      fat: 20,
      fiber: 3,
      sugar: 3,
      servingSize: "1 bowl"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "Italian sausage" },
      { amount: "6", unit: "slices", item: "bacon, chopped" },
      { amount: "1", unit: "large", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "6", unit: "cups", item: "chicken broth" },
      { amount: "4", unit: "medium", item: "russet potatoes, sliced thin" },
      { amount: "2", unit: "cups", item: "chopped kale" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1/2", unit: "tsp", item: "red pepper flakes" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "1/4", unit: "tsp", item: "black pepper" },
      { amount: "1/4", unit: "cup", item: "grated Parmesan cheese" }
    ],
    instructions: [
      "Cook sausage in large pot until browned. Remove and set aside.",
      "Cook bacon in same pot until crispy. Remove and set aside.",
      "Saut? onion and garlic in bacon fat until softened.",
      "Add chicken broth and potatoes. Bring to boil.",
      "Reduce heat and simmer for 15 minutes until potatoes are tender.",
      "Stir in cooked sausage, kale, and cream.",
      "Simmer for 5 more minutes until kale is wilted.",
      "Season with red pepper flakes, salt, and pepper.",
      "Top each bowl with crispy bacon and Parmesan.",
      "Serve with breadsticks!"
    ]
  },
  {
    id: "copycat-chipotle-guacamole",
    name: "Chipotle Guacamole",
    description: "Fresh, chunky guacamole just like Chipotle's famous recipe. Perfect with chips or on anything!",
    cookTime: "0 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/97cVR9g.png",
    totalTime: 10,
    tags: ["copycat", "restaurant", "viral", "chipotle", "appetizer", "glutenfree"],
    nutrition: {
      calories: 120,
      protein: 2,
      carbs: 7,
      fat: 11,
      fiber: 5,
      sugar: 1,
      servingSize: "1/4 cup"
    },
    ingredients: [
      { amount: "4", unit: "ripe", item: "avocados" },
      { amount: "1/4", unit: "cup", item: "diced red onion" },
      { amount: "2", unit: "tbsp", item: "fresh cilantro, chopped" },
      { amount: "1", unit: "medium", item: "jalape?o, seeded and diced" },
      { amount: "2", unit: "tbsp", item: "fresh lime juice" },
      { amount: "1/2", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Cut avocados in half, remove pit, and scoop flesh into bowl.",
      "Mash avocados with fork, leaving some chunks.",
      "Add red onion, cilantro, and jalape?o.",
      "Squeeze lime juice over mixture.",
      "Add salt and mix well.",
      "Taste and adjust seasonings as needed.",
      "Serve immediately with tortilla chips!",
      "To prevent browning, press plastic wrap directly on surface."
    ]
  },
  {
    id: "copycat-auntie-annes-pretzel-bites",
    name: "Auntie Anne's Pretzel Bites",
    description: "Soft, buttery pretzel bites with cheese sauce. Mall food court favorite at home!",
    cookTime: "15 mins",
    prepTime: "90 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Restaurant Copycats",
    image: copycatAuntieAnnesPretzelBitesImg,
    totalTime: 105,
    tags: ["copycat", "restaurant", "viral", "auntie-annes", "snack"],
    nutrition: {
      calories: 310,
      protein: 8,
      carbs: 54,
      fat: 7,
      fiber: 2,
      sugar: 5,
      servingSize: "1 serving (10 bites)"
    },
    ingredients: [
      { amount: "1.5", unit: "cups", item: "warm water" },
      { amount: "2", unit: "tbsp", item: "sugar" },
      { amount: "2.25", unit: "tsp", item: "active dry yeast" },
      { amount: "4", unit: "cups", item: "all-purpose flour" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "6", unit: "tbsp", item: "melted butter" },
      { amount: "10", unit: "cups", item: "water (for boiling)" },
      { amount: "2/3", unit: "cup", item: "baking soda" },
      { amount: "Coarse", unit: "", item: "salt for topping" }
    ],
    instructions: [
      "Mix warm water, sugar, and yeast. Let sit 5 minutes.",
      "Add flour, salt, and 2 tbsp melted butter. Mix until dough forms.",
      "Knead for 5 minutes until smooth.",
      "Cover and let rise 1 hour.",
      "Divide dough into 8 pieces. Roll each into a rope and cut into 1-inch pieces.",
      "Bring 10 cups water and baking soda to boil.",
      "Boil pretzel bites in batches for 30 seconds.",
      "Place on baking sheet, sprinkle with coarse salt.",
      "Bake at 425?F for 12-15 minutes until golden brown.",
      "Brush with remaining melted butter while hot.",
      "Serve with warm cheese sauce!"
    ]
  },
  {
    id: "copycat-chilis-skillet-queso",
    name: "Chili's Skillet Queso",
    description: "Melted white cheese dip with beef and pico de gallo. Perfect appetizer for any occasion!",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/IiMnXuh.png",
    totalTime: 25,
    tags: ["copycat", "restaurant", "viral", "chilis", "appetizer", "glutenfree"],
    nutrition: {
      calories: 280,
      protein: 15,
      carbs: 6,
      fat: 22,
      fiber: 1,
      sugar: 3,
      servingSize: "1/2 cup"
    },
    ingredients: [
      { amount: "1/2", unit: "lb", item: "ground beef" },
      { amount: "1", unit: "lb", item: "white American cheese, cubed" },
      { amount: "1/2", unit: "cup", item: "milk" },
      { amount: "1/2", unit: "cup", item: "pico de gallo" },
      { amount: "1", unit: "jalape?o", item: "sliced" },
      { amount: "2", unit: "tbsp", item: "fresh cilantro, chopped" },
      { amount: "1/2", unit: "tsp", item: "cumin" },
      { amount: "1/4", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Brown ground beef in skillet, breaking into small pieces. Drain excess fat.",
      "In same skillet, add cheese cubes and milk over low heat.",
      "Stir constantly until cheese is completely melted and smooth.",
      "Stir in cooked beef, cumin, and salt.",
      "Transfer to serving skillet or bowl.",
      "Top with pico de gallo, sliced jalape?os, and cilantro.",
      "Serve immediately with warm tortilla chips!",
      "Keep warm in slow cooker for parties."
    ]
  },
  {
    id: "copycat-taco-bell-mexican-pizza",
    name: "Taco Bell Mexican Pizza",
    description: "Crispy layered pizza with beef, beans, cheese, and toppings. Bring back the cult favorite!",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/bYIFvxg.png",
    totalTime: 35,
    tags: ["copycat", "restaurant", "viral", "taco-bell", "main-dish"],
    nutrition: {
      calories: 540,
      protein: 26,
      carbs: 48,
      fat: 26,
      fiber: 6,
      sugar: 4,
      servingSize: "1 pizza"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1", unit: "packet", item: "taco seasoning" },
      { amount: "1", unit: "can", item: "refried beans (16 oz)" },
      { amount: "8", unit: "", item: "flour tortillas (8-inch)" },
      { amount: "1", unit: "cup", item: "Mexican pizza sauce or enchilada sauce" },
      { amount: "2", unit: "cups", item: "shredded Mexican cheese blend" },
      { amount: "1/2", unit: "cup", item: "diced tomatoes" },
      { amount: "1/4", unit: "cup", item: "sliced green onions" },
      { amount: "Vegetable", unit: "", item: "oil for frying" }
    ],
    instructions: [
      "Brown ground beef and add taco seasoning according to package.",
      "Heat refried beans in microwave or on stovetop.",
      "Fry tortillas in hot oil until crispy on both sides. Drain on paper towels.",
      "Spread beans on 4 tortillas.",
      "Top beans with seasoned beef.",
      "Place another crispy tortilla on top of each.",
      "Spread pizza sauce on top tortilla.",
      "Sprinkle with cheese.",
      "Bake at 400?F for 8-10 minutes until cheese melts.",
      "Top with diced tomatoes and green onions.",
      "Cut into wedges and serve hot!"
    ]
  },
  {
    id: "copycat-chipotle-chicken-avocado-melt",
    name: "Panera Chipotle Chicken Avocado Melt",
    description: "Grilled chicken sandwich with smoked Gouda, cilantro-lime aioli, and chipotle mayo.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/a4SB9L0.jpeg",
    totalTime: 25,
    tags: ["copycat", "restaurant", "panera"],
    nutrition: {
      calories: 520,
      protein: 38,
      carbs: 42,
      fat: 22,
      fiber: 5,
      sugar: 6,
      servingSize: "1 sandwich"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken breast, grilled and sliced" },
      { amount: "8", unit: "slices", item: "sourdough bread" },
      { amount: "8", unit: "slices", item: "smoked Gouda cheese" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "1", unit: "cup", item: "baby spinach" },
      { amount: "1/4", unit: "cup", item: "red onion, thinly sliced" },
      { amount: "1/4", unit: "cup", item: "mayo" },
      { amount: "2", unit: "tbsp", item: "chipotle peppers in adobo, minced" },
      { amount: "2", unit: "tbsp", item: "cilantro, chopped" },
      { amount: "1", unit: "tbsp", item: "lime juice" },
      { amount: "2", unit: "tbsp", item: "butter, softened" }
    ],
    instructions: [
      "Mix [1/4 cup mayo] with [2 tbsp chipotle peppers], [2 tbsp cilantro], [1 tbsp lime juice].",
      "Butter one side of each bread slice.",
      "On unbuttered side, spread chipotle mayo.",
      "Layer [sliced chicken], [2 cheese slices], [avocado], [spinach], [red onion].",
      "Top with another bread slice, buttered side out.",
      "Grill in pan over medium heat 3-4 minutes per side until golden and cheese melts.",
      "Slice diagonally and serve hot."
    ]
  },
  {
    id: "copycat-olive-garden-5-cheese-ziti",
    name: "Olive Garden 5-Cheese Ziti Al Forno",
    description: "Baked ziti with five Italian cheeses and marinara sauce.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/4svN47X.png",
    totalTime: 40,
    tags: ["copycat", "restaurant", "olive-garden", "pasta", "dinner"],
    nutrition: {
      calories: 680,
      protein: 32,
      carbs: 58,
      fat: 34,
      fiber: 4,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "ziti pasta" },
      { amount: "24", unit: "oz", item: "marinara sauce" },
      { amount: "15", unit: "oz", item: "ricotta cheese" },
      { amount: "1", unit: "cup", item: "mozzarella cheese, shredded" },
      { amount: "1", unit: "cup", item: "provolone cheese, shredded" },
      { amount: "1/2", unit: "cup", item: "Romano cheese, grated" },
      { amount: "1/2", unit: "cup", item: "fontina cheese, shredded" },
      { amount: "2", unit: "cups", item: "Alfredo sauce" },
      { amount: "1/2", unit: "cup", item: "Parmesan cheese, grated" }
    ],
    instructions: [
      "Cook [1 lb ziti] according to package directions. Drain.",
      "Mix [15 oz ricotta], [1/2 cup mozzarella], [1/2 cup provolone], [1/4 cup Romano].",
      "In large bowl, combine cooked pasta, [24 oz marinara], and ricotta mixture.",
      "Pour half into greased 9x13 pan.",
      "Drizzle [1 cup Alfredo sauce] over pasta.",
      "Add remaining pasta mixture. Top with [2 cups Alfredo].",
      "Sprinkle remaining cheeses on top.",
      "Bake at 375?F for 25 minutes until bubbly and golden.",
      "Let rest 5 minutes before serving."
    ]
  },
  {
    id: "copycat-starbucks-pumpkin-bread",
    name: "Starbucks Pumpkin Bread",
    description: "Moist pumpkin spice quick bread with pepita topping, just like Starbucks.",
    cookTime: "65 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "Restaurant Copycats",
    image: pumpkinBananaBreadImg,
    totalTime: 80,
    tags: ["copycat", "restaurant", "starbucks", "baking"],
    nutrition: {
      calories: 310,
      protein: 4,
      carbs: 46,
      fat: 13,
      fiber: 2,
      sugar: 28,
      servingSize: "1 slice"
    },
    ingredients: [
      { amount: "1 2/3", unit: "cups", item: "all-purpose flour" },
      { amount: "1 1/2", unit: "cups", item: "sugar" },
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "3/4", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "baking powder" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1", unit: "tsp", item: "nutmeg" },
      { amount: "1/2", unit: "tsp", item: "cloves" },
      { amount: "1/2", unit: "tsp", item: "ginger" },
      { amount: "1", unit: "can", item: "pumpkin puree (15 oz)" },
      { amount: "1/2", unit: "cup", item: "vegetable oil" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1/4", unit: "cup", item: "water" },
      { amount: "1/4", unit: "cup", item: "pepitas (pumpkin seeds)" }
    ],
    instructions: [
      "Preheat oven to 350?F. Grease 9x5 loaf pan.",
      "Mix [1 2/3 cups flour], [1 1/2 cups sugar], [1 tsp baking soda], [3/4 tsp salt], [1/2 tsp baking powder], all spices.",
      "In separate bowl, whisk [1 can pumpkin], [1/2 cup oil], [2 eggs], [1/4 cup water].",
      "Combine wet and dry ingredients, mix until just combined.",
      "Pour into prepared pan. Sprinkle [1/4 cup pepitas] on top.",
      "Bake 65-70 minutes until toothpick comes out clean.",
      "Cool in pan 10 minutes, then remove to wire rack.",
      "Slice and serve warm or at room temperature."
    ]
  },
  {
    id: "copycat-kfc-fried-chicken",
    name: "KFC Original Fried Chicken",
    description: "Crispy fried chicken with the secret blend of 11 herbs and spices.",
    cookTime: "20 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/EeqqSpJ.jpeg",
    totalTime: 50,
    tags: ["copycat", "restaurant", "kfc", "chicken", "dinner"],
    nutrition: {
      calories: 480,
      protein: 36,
      carbs: 18,
      fat: 28,
      fiber: 1,
      sugar: 0,
      servingSize: "1 piece"
    },
    ingredients: [
      { amount: "1", unit: "whole", item: "chicken, cut into pieces (3-4 lbs)" },
      { amount: "2", unit: "cups", item: "buttermilk" },
      { amount: "2", unit: "cups", item: "all-purpose flour" },
      { amount: "2", unit: "tsp", item: "salt" },
      { amount: "1", unit: "tsp", item: "black pepper" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "tsp", item: "onion powder" },
      { amount: "1/2", unit: "tsp", item: "cayenne pepper" },
      { amount: "1/2", unit: "tsp", item: "dried oregano" },
      { amount: "1/2", unit: "tsp", item: "dried basil" },
      { amount: "1/2", unit: "tsp", item: "dried thyme" },
      { amount: "Vegetable", unit: "", item: "oil for frying" }
    ],
    instructions: [
      "Soak [chicken pieces] in [2 cups buttermilk] for 30 minutes.",
      "Mix [2 cups flour] with all spices and seasonings.",
      "Heat oil to 350?F in large heavy pot or deep fryer.",
      "Remove chicken from buttermilk, let excess drip off.",
      "Dredge each piece in seasoned flour, coating completely.",
      "Fry chicken in batches 12-15 minutes, turning once, until golden brown and internal temp reaches 165?F.",
      "Drain on paper towels.",
      "Serve hot with your favorite sides!"
    ]
  },
  {
    id: "copycat-wendys-chili",
    name: "Wendy's Chili",
    description: "Hearty beef and bean chili loaded with tomatoes and spices.",
    cookTime: "2 hrs",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/qu9AiJk.jpeg",
    totalTime: 135,
    tags: ["copycat", "restaurant", "wendys", "soup", "comfort-food", "glutenfree"],
    nutrition: {
      calories: 280,
      protein: 22,
      carbs: 24,
      fat: 10,
      fiber: 7,
      sugar: 6,
      servingSize: "1 cup"
    },
    ingredients: [
      { amount: "2", unit: "lbs", item: "ground beef" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "1", unit: "", item: "green bell pepper, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "can", item: "tomato sauce (29 oz)" },
      { amount: "1", unit: "can", item: "kidney beans (29 oz)" },
      { amount: "1", unit: "can", item: "pinto beans (29 oz)" },
      { amount: "1", unit: "can", item: "diced tomatoes (14.5 oz)" },
      { amount: "1", unit: "cup", item: "water" },
      { amount: "2", unit: "tbsp", item: "chili powder" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "black pepper" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "cayenne pepper" }
    ],
    instructions: [
      "Brown [2 lbs ground beef] in large pot. Drain excess fat.",
      "Add [diced onion], [bell pepper], [3 cloves garlic]. Cook 5 minutes.",
      "Add [29 oz tomato sauce], [29 oz kidney beans], [29 oz pinto beans], [14.5 oz diced tomatoes].",
      "Stir in [1 cup water], [2 tbsp chili powder], [1 tsp cumin], [1 tsp pepper], [1 tsp salt], [1/2 tsp cayenne].",
      "Bring to boil, then reduce heat to low.",
      "Simmer uncovered 2 hours, stirring occasionally.",
      "Serve hot with shredded cheese, sour cream, and oyster crackers."
    ]
  },
  {
    id: "copycat-panda-express-fried-rice",
    name: "Panda Express Fried Rice",
    description: "Restaurant-style fried rice with eggs, peas, carrots, and soy sauce.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/tDN2DYm.jpeg",
    totalTime: 20,
    tags: ["copycat", "restaurant", "panda-express", "rice", "side-dish"],
    nutrition: {
      calories: 310,
      protein: 8,
      carbs: 52,
      fat: 8,
      fiber: 3,
      sugar: 3,
      servingSize: "1 cup"
    },
    ingredients: [
      { amount: "4", unit: "cups", item: "cooked white rice, day-old" },
      { amount: "3", unit: "", item: "eggs, beaten" },
      { amount: "1", unit: "cup", item: "frozen peas and carrots" },
      { amount: "1/2", unit: "cup", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "sesame oil" },
      { amount: "2", unit: "tbsp", item: "vegetable oil" },
      { amount: "2", unit: "", item: "green onions, sliced" },
      { amount: "1/2", unit: "tsp", item: "white pepper" }
    ],
    instructions: [
      "Heat [1 tbsp vegetable oil] in wok or large skillet over high heat.",
      "Add [3 beaten eggs], scramble quickly, remove and set aside.",
      "Add [1 tbsp oil], saut? [diced onion] 2 minutes.",
      "Add [3 cloves garlic], [1 cup peas and carrots], stir-fry 2 minutes.",
      "Add [4 cups day-old rice], break up clumps.",
      "Stir-fry 3-4 minutes until rice is hot.",
      "Add scrambled eggs, [3 tbsp soy sauce], [1 tbsp sesame oil], [1/2 tsp white pepper].",
      "Toss well. Garnish with [sliced green onions]. Serve hot."
    ]
  },
  {
    id: "copycat-olive-garden-house-salad",
    name: "Olive Garden House Salad",
    description: "Fresh salad with Italian dressing, croutons, and Parmesan cheese.",
    cookTime: "0 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/9e1lGi7.jpeg",
    totalTime: 15,
    tags: ["copycat", "restaurant", "olive-garden", "side-dish", "vegetarian"],
    nutrition: {
      calories: 150,
      protein: 3,
      carbs: 12,
      fat: 10,
      fiber: 2,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "head", item: "iceberg lettuce, chopped" },
      { amount: "1/2", unit: "head", item: "romaine lettuce, chopped" },
      { amount: "1/4", unit: "", item: "red cabbage, shredded" },
      { amount: "1", unit: "", item: "red onion, sliced thin" },
      { amount: "1", unit: "cup", item: "cherry tomatoes, halved" },
      { amount: "1", unit: "cup", item: "black olives, sliced" },
      { amount: "1/2", unit: "cup", item: "pepperoncini peppers" },
      { amount: "1", unit: "cup", item: "croutons" },
      { amount: "1/2", unit: "cup", item: "Parmesan cheese, shredded" },
      { amount: "1", unit: "cup", item: "Italian dressing" }
    ],
    instructions: [
      "Chop [iceberg lettuce] and [romaine lettuce]. Place in large bowl.",
      "Add [shredded red cabbage], [sliced red onion], [cherry tomatoes].",
      "Add [sliced black olives] and [pepperoncini peppers].",
      "Toss salad ingredients together.",
      "Top with [croutons] and [Parmesan cheese].",
      "Drizzle with [Italian dressing] just before serving.",
      "Serve immediately with extra dressing on the side."
    ]
  },
  {
    id: "copycat-red-lobster-coconut-shrimp",
    name: "Red Lobster Coconut Shrimp",
    description: "Crispy coconut-crusted shrimp with sweet and tangy pineapple dipping sauce.",
    cookTime: "10 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Restaurant Copycats",
    image: "https://i.imgur.com/ul03Eq5.jpeg",
    totalTime: 30,
    tags: ["copycat", "restaurant", "red-lobster", "seafood", "appetizer"],
    nutrition: {
      calories: 420,
      protein: 24,
      carbs: 36,
      fat: 20,
      fiber: 2,
      sugar: 14,
      servingSize: "6 shrimp"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "large shrimp, peeled and deveined" },
      { amount: "1/2", unit: "cup", item: "all-purpose flour" },
      { amount: "2", unit: "", item: "eggs, beaten" },
      { amount: "1", unit: "cup", item: "panko breadcrumbs" },
      { amount: "1", unit: "cup", item: "sweetened shredded coconut" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "1/4", unit: "tsp", item: "cayenne pepper" },
      { amount: "Vegetable", unit: "", item: "oil for frying" },
      { amount: "1/2", unit: "cup", item: "orange marmalade" },
      { amount: "2", unit: "tbsp", item: "pineapple juice" },
      { amount: "1", unit: "tbsp", item: "honey" },
      { amount: "1", unit: "tsp", item: "Dijon mustard" }
    ],
    instructions: [
      "Pat [shrimp] dry with paper towels.",
      "Set up breading station: [flour] in one bowl, [2 beaten eggs] in second, mix [panko], [coconut], [salt], [cayenne] in third.",
      "Dip each shrimp in flour, then egg, then coconut mixture, pressing to adhere.",
      "Heat 2 inches oil to 350?F in deep pan.",
      "Fry shrimp in batches 2-3 minutes until golden brown. Drain on paper towels.",
      "For sauce: Mix [orange marmalade], [pineapple juice], [honey], [Dijon mustard] in small bowl.",
      "Serve hot shrimp with dipping sauce."
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
    cuisine: "Dinner",
    image: "https://i.imgur.com/MyJgx99.png",
    totalTime: 30,
    tags: ["quick", "dinner", "one-pan", "protein"],
    nutrition: {
      calories: 420,
      protein: 32,
      carbs: 38,
      fat: 16,
      fiber: 4,
      sugar: 22,
      servingSize: "1 thigh with vegetables"
    },
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
      "Preheat oven to 425?F.",
      "Mix honey, soy sauce, and garlic.",
      "Arrange chicken and vegetables on sheet pan.",
      "Brush chicken with honey garlic sauce.",
      "Drizzle vegetables with olive oil.",
      "Bake 25 minutes until chicken reaches 165?F.",
      "Serve immediately."
    ]
  },
  {
    id: "quick-shrimp-stirfry",
    name: "15-Minute Shrimp Stir Fry",
    description: "Restaurant quality stir fry faster than delivery. Glossy sauce, perfect vegetables.",
    cookTime: "8 mins",
    prepTime: "7 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/laMTVMu.png",
    imageUrl: "https://i.imgur.com/laMTVMu.png",
    totalTime: 15,
    tags: ["quick", "asian", "protein", "seafood"],
    nutrition: {
      calories: 280,
      protein: 26,
      carbs: 18,
      fat: 12,
      fiber: 3,
      sugar: 6,
      servingSize: "1 cup"
    },
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: lemonSalmonImg,
    totalTime: 20,
    tags: ["seafood", "protein", "one-pan", "dinner", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 34,
      carbs: 10,
      fat: 16,
      fiber: 3,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "", item: "salmon fillets" },
      { amount: "1", unit: "lb", item: "asparagus" },
      { amount: "2", unit: "cups", item: "cherry tomatoes" },
      { amount: "2", unit: "", item: "lemons" },
      { amount: "3", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" }
    ],
    instructions: [
      "Preheat oven to 400?F.",
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/lSRdTNS.png",
    totalTime: 20,
    tags: ["quick", "asian", "protein"],
    ingredients: [
      { amount: "1", unit: "lb", item: "flank steak, sliced thin" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/guDDUks.png",
    imageUrl: "https://i.imgur.com/njeoQZu.png",
    totalTime: 25,
    tags: ["quick", "thai", "asian", "spicy"],
    nutrition: {
      calories: 280,
      protein: 28,
      carbs: 16,
      fat: 12,
      fiber: 2,
      sugar: 8,
      servingSize: "1 serving with rice"
    },
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/DbZzWVl.png",
    imageUrl: "https://i.imgur.com/DbZzWVl.png",
    totalTime: 25,
    tags: ["quick", "italian", "protein", "pasta"],
    nutrition: {
      calories: 520,
      protein: 32,
      carbs: 52,
      fat: 20,
      fiber: 4,
      sugar: 6,
      servingSize: "1 serving with pasta"
    },
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
      "Saut? shrimp in butter 2 minutes per side, remove.",
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: capreseChickenImg,
    imageUrl: "https://i.imgur.com/G4KB35R.png",
    totalTime: 15,
    tags: ["quick", "italian", "protein", "glutenfree"],
    nutrition: {
      calories: 340,
      protein: 42,
      carbs: 8,
      fat: 15,
      fiber: 2,
      sugar: 5,
      servingSize: "1 serving"
    },
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/O2S54X6.png",
    totalTime: 20,
    tags: ["quick", "healthy", "asian", "protein", "glutenfree"],
    nutrition: {
      calories: 480,
      protein: 36,
      carbs: 52,
      fat: 14,
      fiber: 4,
      sugar: 10,
      servingSize: "1 bowl"
    },
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/DohZtZ9.png",
    totalTime: 20,
    tags: ["quick", "asian", "vegan", "cold"],
    nutrition: {
      calories: 450,
      protein: 14,
      carbs: 62,
      fat: 16,
      fiber: 4,
      sugar: 8,
      servingSize: "1 serving"
    },
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
    id: "quick-kung-pao-chicken",
    name: "25-Minute Kung Pao Chicken",
    description: "Spicy, sweet, crunchy. Takeout favorite made better at home.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: kungPaoImg,
    totalTime: 25,
    tags: ["quick", "chinese", "spicy", "protein"],
    nutrition: {
      calories: 380,
      protein: 32,
      carbs: 28,
      fat: 16,
      fiber: 3,
      sugar: 14,
      servingSize: "1 serving with rice"
    },
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/ry6O5R0.png",
    imageUrl: "https://i.imgur.com/ry6O5R0.png",
    totalTime: 15,
    tags: ["quick", "italian", "protein", "pasta", "glutenfree"],
    nutrition: {
      calories: 520,
      protein: 34,
      carbs: 58,
      fat: 14,
      fiber: 3,
      sugar: 3,
      servingSize: "1 serving"
    },
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/38vSHb8.png",
    imageUrl: "https://i.imgur.com/38vSHb8.png",
    totalTime: 20,
    tags: ["quick", "asian", "protein"],
    nutrition: {
      calories: 420,
      protein: 30,
      carbs: 36,
      fat: 16,
      fiber: 2,
      sugar: 20,
      servingSize: "1 serving with rice"
    },
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/gkppx9G.png",
    imageUrl: "https://i.imgur.com/gkppx9G.png",
    totalTime: 25,
    tags: ["quick", "greek", "healthy", "protein", "glutenfree"],
    nutrition: {
      calories: 420,
      protein: 36,
      carbs: 44,
      fat: 12,
      fiber: 4,
      sugar: 6,
      servingSize: "1 bowl"
    },
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/9FOICSU.png",
    imageUrl: "https://i.imgur.com/9FOICSU.png",
    totalTime: 15,
    tags: ["quick", "protein", "steak", "glutenfree"],
    nutrition: {
      calories: 485,
      protein: 40,
      carbs: 28,
      fat: 24,
      fiber: 3,
      sugar: 2,
      servingSize: "1 serving"
    },
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
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/OZqGxHF.png",
    imageUrl: "https://i.imgur.com/OZqGxHF.png",
    totalTime: 30,
    tags: ["quick", "thai", "asian", "noodles"],
    nutrition: {
      calories: 480,
      protein: 32,
      carbs: 58,
      fat: 12,
      fiber: 4,
      sugar: 14,
      servingSize: "1 serving"
    },
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
    id: "leftover-chicken-tacos",
    name: "Rotisserie Chicken Tacos",
    description: "Store-bought rotisserie chicken becomes gourmet taco night.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Mexican",
    image: "https://i.imgur.com/EBShNRz.png",
    totalTime: 20,
    tags: ["leftover", "mexican", "quick", "kid-friendly"],
    ingredients: [
      { amount: "3", unit: "cups", item: "rotisserie chicken, shredded" ,
    nutrition: { calories: 211, protein: 7, carbs: 9, fat: 12, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
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
    imageUrl: "https://i.imgur.com/5jrWKDF.png",
    totalTime: 15,
    tags: ["leftover", "asian", "quick"],
    ingredients: [
      { amount: "4", unit: "cups", item: "cold leftover rice" ,
    nutrition: { calories: 150, protein: 5, carbs: 7, fat: 5, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    name: "Pasta Carbonara",
    description: "Creamy Roman pasta with pancetta, eggs, and parmesan. Authentic Italian perfection.",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/AQ7SNIE.png",
    imageUrl: "https://i.imgur.com/AQ7SNIE.png",
    totalTime: 20,
    tags: ["leftover", "italian", "pasta", "kid-friendly"],
    ingredients: [
      { amount: "1", unit: "lb", item: "leftover cooked pasta" ,
    nutrition: { calories: 252, protein: 6, carbs: 13, fat: 12, fiber: 1, sugar: 4, servingSize: "1 serving (serves 4)" }},
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
    tags: ["leftover", "side", "fried", "kid-friendly"],
    ingredients: [
      { amount: "3", unit: "cups", item: "leftover mashed potatoes" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
      "Heat oil to 350?F.",
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Fall Favorites",
    image: turkeyQuesadillasImg,
    totalTime: 15,
    tags: ["leftover", "fusion", "quick"],
    nutrition: {
      calories: 485,
      protein: 32,
      carbs: 46,
      fat: 18,
      fiber: 3,
      sugar: 12,
      servingSize: "1 quesadilla"
    },
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
    cuisine: "Dinner",
    image: "https://i.imgur.com/nMkJWTl.png",
    totalTime: 25,
    tags: ["leftover", "sandwich", "comfort"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover roast beef, sliced" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    difficulty: "medium",
    servings: 4,
    cuisine: "Leftover Magic",
    image: "https://i.imgur.com/GaL6S49.png",
    totalTime: 30,
    tags: ["leftover", "breakfast", "brunch", "glutenfree", "kid-friendly"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover ham, diced" ,
    nutrition: { calories: 150, protein: 12, carbs: 7, fat: 6, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    tags: ["leftover", "fusion", "quick", "kid-friendly"],
    ingredients: [
      { amount: "1", unit: "cup", item: "leftover steak, sliced" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    cuisine: "Dinner",
    image: burgerSlidersImg,
    totalTime: 20,
    tags: ["leftover", "party", "quick"],
    ingredients: [
      { amount: "4", unit: "", item: "leftover burger patties, halved" ,
    nutrition: { calories: 150, protein: 6, carbs: 7, fat: 5, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    cuisine: "Dinner",
    image: "https://i.imgur.com/ZUTLFQK.png",
    totalTime: 20,
    tags: ["leftover", "party", "appetizer"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover pulled pork" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "bag", item: "tortilla chips" },
      { amount: "2", unit: "cups", item: "shredded cheese" },
      { amount: "1", unit: "cup", item: "black beans" },
      { amount: "1/2", unit: "cup", item: "jalape?os" },
      { amount: "1/2", unit: "cup", item: "sour cream" },
      { amount: "1/4", unit: "cup", item: "tomatoes, diced" },
      { amount: "1/4", unit: "cup", item: "green onions" }
    ],
    instructions: [
      "Preheat oven to 375?F.",
      "Spread chips on large baking sheet.",
      "Top with pulled pork, beans, and cheese.",
      "Bake 10 minutes until cheese melts.",
      "Top with jalape?os, sour cream, tomatoes, and green onions.",
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
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/wcCTt8t.png",
    totalTime: 30,
    tags: ["leftover", "comfort", "pasta"],
    ingredients: [
      { amount: "1", unit: "lb", item: "macaroni" ,
    nutrition: { calories: 185, protein: 12, carbs: 7, fat: 8, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    cuisine: "Breakfast",
    image: "https://i.imgur.com/TRWioaz.png",
    totalTime: 15,
    tags: ["leftover", "breakfast", "quick"],
    ingredients: [
      { amount: "8", unit: "", item: "leftover cooked sausage links" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
    difficulty: "medium",
    servings: 12,
    cuisine: "Fall Favorites",
    image: stuffingMuffinsImg,
    totalTime: 30,
    tags: ["leftover", "side", "thanksgiving", "vegetarian", "glutenfree", "kid-friendly"],
    nutrition: {
      calories: 195,
      protein: 7,
      carbs: 22,
      fat: 8,
      fiber: 2,
      sugar: 3,
      servingSize: "1 muffin"
    },
    ingredients: [
      { amount: "4", unit: "cups", item: "leftover stuffing" },
      { amount: "2", unit: "", item: "eggs, beaten" },
      { amount: "1/2", unit: "cup", item: "chicken broth" },
      { amount: "1/2", unit: "cup", item: "shredded cheese" }
    ],
    instructions: [
      "Preheat oven to 350?F. Grease muffin tin.",
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
    difficulty: "medium",
    servings: 2,
    cuisine: "Lunch",
    image: salmonSaladImg,
    totalTime: 10,
    tags: ["leftover", "salad", "seafood", "kid-friendly"],
    ingredients: [
      { amount: "2", unit: "", item: "leftover salmon fillets, flaked" ,
    nutrition: { calories: 150, protein: 5, carbs: 5, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
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
  },
  {
    id: "leftover-chicken-enchiladas",
    name: "Rotisserie Chicken Enchiladas",
    description: "Transform leftover chicken into restaurant-quality enchiladas.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Mexican",
    image: "https://i.imgur.com/uybbccM.png",
    totalTime: 40,
    tags: ["leftover", "mexican", "dinner", "comfort-food", "kid-friendly"],
    ingredients: [
      { amount: "3", unit: "cups", item: "leftover rotisserie chicken, shredded" ,
    nutrition: { calories: 150, protein: 5, carbs: 5, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "12", unit: "", item: "flour tortillas" },
      { amount: "2", unit: "cups", item: "red enchilada sauce" },
      { amount: "2", unit: "cups", item: "shredded Mexican cheese blend" },
      { amount: "1", unit: "cup", item: "sour cream" },
      { amount: "1", unit: "can", item: "black beans, drained" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "2", unit: "cloves", item: "garlic, minced" },
      { amount: "", unit: "", item: "Cilantro for garnish" }
    ],
    instructions: [
      "Preheat oven to 375?F. Grease 9x13 baking dish.",
      "Saut? onion and garlic until soft. Mix with chicken and beans.",
      "Spread 1/2 cup enchilada sauce in bottom of dish.",
      "Fill each tortilla with chicken mixture and 2 tbsp cheese. Roll tightly.",
      "Place seam-side down in dish. Pour remaining sauce over top.",
      "Sprinkle with remaining cheese.",
      "Bake 25 minutes until bubbly and cheese is melted.",
      "Top with sour cream, diced tomatoes, and cilantro."
    ]
  },
  {
    id: "leftover-mashed-potato-pancakes",
    name: "Crispy Mashed Potato Pancakes",
    description: "Turn cold mashed potatoes into golden breakfast treats.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Leftover Magic",
    image: "https://i.imgur.com/P68tukC.png",
    totalTime: 25,
    tags: ["leftover", "breakfast", "side-dish", "kid-friendly"],
    ingredients: [
      { amount: "3", unit: "cups", item: "leftover mashed potatoes" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "", item: "eggs, beaten" },
      { amount: "1/2", unit: "cup", item: "flour" },
      { amount: "1/4", unit: "cup", item: "green onions, chopped" },
      { amount: "1", unit: "cup", item: "shredded cheddar cheese" },
      { amount: "4", unit: "tbsp", item: "butter" },
      { amount: "", unit: "", item: "Sour cream and chives for serving" }
    ],
    instructions: [
      "Mix mashed potatoes, eggs, flour, green onions, and cheese in bowl.",
      "Form into 8 patties about 1/2 inch thick.",
      "Melt 2 tbsp butter in large skillet over medium-high heat.",
      "Cook patties 4-5 minutes per side until golden and crispy.",
      "Add more butter as needed for remaining patties.",
      "Serve hot topped with sour cream and chives."
    ]
  },
  {
    id: "leftover-pot-roast-shepherds-pie",
    name: "Pot Roast Shepherd's Pie",
    description: "Classic comfort food using yesterday's pot roast.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/IfwfdrH.png",
    totalTime: 45,
    tags: ["leftover", "comfort-food", "dinner", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 26,
      carbs: 32,
      fat: 16,
      fiber: 4,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "3", unit: "cups", item: "leftover pot roast, shredded" },
      { amount: "2", unit: "cups", item: "leftover vegetables (carrots, onions, celery)" },
      { amount: "1", unit: "cup", item: "leftover gravy or beef broth" },
      { amount: "4", unit: "cups", item: "mashed potatoes" },
      { amount: "1", unit: "cup", item: "frozen peas" },
      { amount: "2", unit: "tbsp", item: "tomato paste" },
      { amount: "1", unit: "tsp", item: "Worcestershire sauce" },
      { amount: "1", unit: "cup", item: "shredded cheddar cheese" }
    ],
    instructions: [
      "Preheat oven to 400?F.",
      "Mix pot roast, vegetables, peas, gravy, tomato paste, and Worcestershire in baking dish.",
      "Spread mashed potatoes evenly over meat mixture.",
      "Use fork to create texture on potato surface.",
      "Sprinkle cheese on top.",
      "Bake 30 minutes until potatoes are golden and filling is bubbly.",
      "Let rest 5 minutes before serving."
    ]
  },
  {
    id: "leftover-chicken-soup-casserole",
    name: "Chicken Noodle Soup Casserole",
    description: "Transform soup into cozy baked comfort food.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Leftover Magic",
    image: "https://i.imgur.com/0D697La.png",
    totalTime: 45,
    tags: ["leftover", "comfort-food", "dinner", "kid-friendly"],
    ingredients: [
      { amount: "4", unit: "cups", item: "leftover chicken noodle soup" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "cooked egg noodles" },
      { amount: "1", unit: "cup", item: "shredded chicken" },
      { amount: "1", unit: "cup", item: "frozen mixed vegetables" },
      { amount: "1", unit: "cup", item: "sour cream" },
      { amount: "2", unit: "cups", item: "shredded mozzarella" },
      { amount: "1", unit: "cup", item: "breadcrumbs" },
      { amount: "3", unit: "tbsp", item: "butter, melted" }
    ],
    instructions: [
      "Preheat oven to 375?F. Grease 9x13 baking dish.",
      "Mix soup, noodles, chicken, vegetables, sour cream, and 1 cup cheese.",
      "Pour into prepared dish.",
      "Mix breadcrumbs with melted butter and remaining cheese.",
      "Sprinkle breadcrumb mixture over casserole.",
      "Bake 30 minutes until golden and bubbly.",
      "Garnish with fresh parsley."
    ]
  },
  {
    id: "leftover-taco-meat-pizza",
    name: "Taco Pizza",
    description: "Mexican meets Italian in this creative leftover mashup.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Fusion",
    image: "https://i.imgur.com/gAaq6Mt.png",
    totalTime: 25,
    tags: ["leftover", "fusion", "dinner", "kid-friendly", "glutenfree"],
    ingredients: [
      { amount: "1", unit: "", item: "pizza dough or pre-made crust" ,
    nutrition: { calories: 150, protein: 11, carbs: 10, fat: 8, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "leftover taco meat" },
      { amount: "1", unit: "cup", item: "refried beans" },
      { amount: "2", unit: "cups", item: "shredded Mexican cheese" },
      { amount: "1", unit: "cup", item: "shredded lettuce" },
      { amount: "1", unit: "", item: "tomato, diced" },
      { amount: "1/2", unit: "cup", item: "sour cream" },
      { amount: "", unit: "", item: "Jalape?os, olives, salsa for topping" }
    ],
    instructions: [
      "Preheat oven to 425?F.",
      "Roll out pizza dough on baking sheet.",
      "Spread refried beans as base sauce.",
      "Top with taco meat and cheese.",
      "Bake 12-15 minutes until crust is golden and cheese melted.",
      "Remove from oven, top with lettuce, tomatoes, sour cream drizzle.",
      "Add jalape?os and olives. Slice and serve with salsa."
    ]
  },
  {
    id: "leftover-chicken-pho",
    name: "Easy Chicken Pho",
    description: "Vietnamese comfort soup using leftover chicken.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: leftoverChickenPhoImg,
    totalTime: 30,
    tags: ["One Pot Wonders", "soup", "asian", "healthy"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover rotisserie chicken, shredded" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "8", unit: "cups", item: "chicken broth" },
      { amount: "8", unit: "oz", item: "rice noodles" },
      { amount: "2", unit: "", item: "star anise" },
      { amount: "1", unit: "stick", item: "cinnamon" },
      { amount: "3", unit: "slices", item: "fresh ginger" },
      { amount: "2", unit: "tbsp", item: "fish sauce" },
      { amount: "1", unit: "tbsp", item: "brown sugar" },
      { amount: "", unit: "", item: "Bean sprouts, basil, lime, jalape?os for serving" }
    ],
    instructions: [
      "Bring broth to boil with star anise, cinnamon, and ginger.",
      "Simmer 15 minutes to infuse flavors. Strain out spices.",
      "Add fish sauce and brown sugar.",
      "Cook rice noodles according to package, drain.",
      "Divide noodles between bowls, add shredded chicken.",
      "Pour hot broth over noodles and chicken.",
      "Top with bean sprouts, fresh herbs, lime juice, and jalape?os."
    ]
  },
  {
    id: "leftover-meatloaf-sliders",
    name: "Meatloaf Sliders with Caramelized Onions",
    description: "Mini sandwiches that make meatloaf exciting again.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Leftover Magic",
    image: "https://i.imgur.com/zFV6MLU.png",
    totalTime: 20,
    tags: ["leftover", "sandwich", "lunch", "kid-friendly"],
    ingredients: [
      { amount: "6", unit: "slices", item: "leftover meatloaf" ,
    nutrition: { calories: 203, protein: 16, carbs: 15, fat: 4, fiber: 2, sugar: 5, servingSize: "1 serving (serves 4)" }},
      { amount: "12", unit: "", item: "slider buns" },
      { amount: "6", unit: "slices", item: "cheddar cheese" },
      { amount: "1", unit: "large", item: "onion, sliced" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1/4", unit: "cup", item: "BBQ sauce" },
      { amount: "1/4", unit: "cup", item: "mayonnaise" }
    ],
    instructions: [
      "Caramelize onions in butter over medium heat, 15 minutes.",
      "Heat meatloaf slices in skillet until warmed through.",
      "Toast slider buns.",
      "Mix BBQ sauce with mayo for spread.",
      "Spread sauce on buns, add meatloaf slice.",
      "Top with cheese slice and caramelized onions.",
      "Serve with fries or chips."
    ]
  },
  {
    id: "leftover-chili-cheese-fries",
    name: "Loaded Chili Cheese Fries",
    description: "Turn leftover chili into irresistible loaded fries.",
    cookTime: "25 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Leftover Magic",
    image: leftoverChiliCheeseFriesImg,
    totalTime: 30,
    tags: ["leftover", "comfort-food", "appetizer", "glutenfree", "kid-friendly"],
    ingredients: [
      { amount: "1", unit: "lb", item: "frozen french fries" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "3", unit: "cups", item: "leftover chili" },
      { amount: "1", unit: "cup", item: "cheddar cheese sauce" },
      { amount: "1/2", unit: "cup", item: "sour cream" },
      { amount: "1/4", unit: "cup", item: "chopped green onions" },
      { amount: "1/4", unit: "cup", item: "pickled jalape?os" }
    ],
    instructions: [
      "Bake fries according to package directions until extra crispy.",
      "Reheat chili until hot.",
      "Arrange fries on large serving platter.",
      "Pour hot chili over fries.",
      "Drizzle with cheese sauce.",
      "Top with dollops of sour cream, green onions, and jalape?os.",
      "Serve immediately while hot."
    ]
  },
  {
    id: "leftover-pulled-pork-egg-rolls",
    name: "BBQ Pulled Pork Egg Rolls",
    description: "Crispy Asian-inspired rolls with Southern BBQ filling.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Fusion",
    image: "https://i.imgur.com/Se5Mgtj.png",
    totalTime: 35,
    tags: ["leftover", "fusion", "appetizer", "kid-friendly"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover pulled pork" ,
    nutrition: { calories: 150, protein: 6, carbs: 7, fat: 7, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "coleslaw" },
      { amount: "12", unit: "", item: "egg roll wrappers" },
      { amount: "1/4", unit: "cup", item: "BBQ sauce" },
      { amount: "1", unit: "", item: "egg, beaten" },
      { amount: "", unit: "", item: "Vegetable oil for frying" },
      { amount: "1/2", unit: "cup", item: "sweet chili sauce for dipping" }
    ],
    instructions: [
      "Mix pulled pork with BBQ sauce and coleslaw.",
      "Lay egg roll wrapper with corner pointing toward you.",
      "Place 2-3 tbsp filling in center.",
      "Fold bottom corner over filling, fold in sides, roll tightly.",
      "Seal edge with beaten egg.",
      "Heat 2 inches oil to 350?F.",
      "Fry egg rolls 3-4 minutes until golden brown.",
      "Drain on paper towels. Serve with sweet chili sauce."
    ]
  },
  {
    id: "leftover-turkey-tetrazzini",
    name: "Turkey Tetrazzini",
    description: "Classic creamy pasta bake perfect for leftover turkey.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Leftover Magic",
    image: leftoverTurkeyTetrazziniImg,
    totalTime: 45,
    tags: ["leftover", "pasta", "comfort-food", "thanksgiving", "kid-friendly"],
    ingredients: [
      { amount: "4", unit: "cups", item: "leftover turkey, cubed" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "lb", item: "spaghetti" },
      { amount: "8", unit: "oz", item: "mushrooms, sliced" },
      { amount: "1", unit: "cup", item: "frozen peas" },
      { amount: "3", unit: "cups", item: "heavy cream" },
      { amount: "1", unit: "cup", item: "chicken broth" },
      { amount: "1", unit: "cup", item: "parmesan cheese, grated" },
      { amount: "1", unit: "cup", item: "breadcrumbs" },
      { amount: "4", unit: "tbsp", item: "butter" }
    ],
    instructions: [
      "Preheat oven to 375?F. Cook spaghetti al dente, drain.",
      "Saut? mushrooms in 2 tbsp butter until golden.",
      "In large bowl, mix spaghetti, turkey, mushrooms, peas, cream, broth, and half the parmesan.",
      "Transfer to greased 9x13 baking dish.",
      "Mix breadcrumbs with remaining butter and parmesan.",
      "Sprinkle breadcrumb mixture over casserole.",
      "Bake 30 minutes until golden and bubbly."
    ]
  },
  {
    id: "leftover-roast-beef-poutine",
    name: "Roast Beef Poutine",
    description: "Canadian classic elevated with tender roast beef.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Leftover Magic",
    image: "https://i.imgur.com/GQd0B8H.png",
    totalTime: 30,
    tags: ["leftover", "comfort-food", "canadian", "glutenfree", "kid-friendly"],
    ingredients: [
      { amount: "1", unit: "lb", item: "frozen french fries" ,
    nutrition: { calories: 256, protein: 19, carbs: 11, fat: 11, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "leftover roast beef, shredded" },
      { amount: "2", unit: "cups", item: "beef gravy" },
      { amount: "2", unit: "cups", item: "cheese curds" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "", unit: "", item: "Fresh parsley for garnish" }
    ],
    instructions: [
      "Bake fries until extra crispy according to package.",
      "Heat roast beef with butter until warmed through.",
      "Heat gravy until simmering.",
      "Divide hot fries among serving bowls.",
      "Top with cheese curds and shredded roast beef.",
      "Pour hot gravy over everything.",
      "Garnish with parsley and serve immediately."
    ]
  },
  {
    id: "leftover-chicken-alfredo-shells",
    name: "Chicken Alfredo Stuffed Shells",
    description: "Creamy pasta shells filled with alfredo and chicken.",
    cookTime: "30 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Italian",
    image: leftoverChickenAlfredoShellsImg,
    totalTime: 50,
    tags: ["leftover", "pasta", "italian", "comfort-food"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover chicken alfredo" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "24", unit: "", item: "jumbo pasta shells" },
      { amount: "2", unit: "cups", item: "ricotta cheese" },
      { amount: "1", unit: "cup", item: "mozzarella cheese, shredded" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "2", unit: "cups", item: "marinara sauce" },
      { amount: "", unit: "", item: "Fresh basil for garnish" }
    ],
    instructions: [
      "Cook pasta shells al dente, drain and cool.",
      "Preheat oven to 375?F.",
      "Mix chicken alfredo with ricotta, half the mozzarella, parmesan, and egg.",
      "Spread 1 cup marinara in bottom of baking dish.",
      "Fill each shell with alfredo mixture, arrange in dish.",
      "Top with remaining marinara and mozzarella.",
      "Cover with foil, bake 25 minutes. Uncover, bake 5 more minutes.",
      "Garnish with fresh basil."
    ]
  },
  {
    id: "leftover-bbq-ribs-mac",
    name: "BBQ Ribs Mac and Cheese",
    description: "Decadent mac topped with tender rib meat.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: leftoverBbqRibsMacImg,
    totalTime: 35,
    tags: ["leftover", "comfort-food", "bbq", "glutenfree"],
    ingredients: [
      { amount: "1", unit: "lb", item: "elbow macaroni" ,
    nutrition: { calories: 193, protein: 13, carbs: 13, fat: 6, fiber: 1, sugar: 4, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "leftover rib meat, shredded" },
      { amount: "4", unit: "cups", item: "shredded cheddar cheese" },
      { amount: "2", unit: "cups", item: "heavy cream" },
      { amount: "1", unit: "cup", item: "milk" },
      { amount: "1/4", unit: "cup", item: "BBQ sauce" },
      { amount: "1", unit: "cup", item: "crispy onion strings" },
      { amount: "2", unit: "tbsp", item: "fresh parsley" }
    ],
    instructions: [
      "Cook macaroni al dente, drain.",
      "In large pot, heat cream and milk until simmering.",
      "Add cheese gradually, stirring until melted and smooth.",
      "Mix in cooked macaroni and rib meat.",
      "Transfer to cast iron skillet or serving dish.",
      "Drizzle with BBQ sauce.",
      "Top with crispy onion strings and parsley.",
      "Serve immediately."
    ]
  },
  {
    id: "leftover-chicken-parm-soup",
    name: "Chicken Parmesan Soup",
    description: "All the flavors of chicken parm in a cozy bowl.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Leftover Magic",
    image: leftoverChickenParmSoupImg,
    totalTime: 35,
    tags: ["leftover", "soup", "comfort-food", "kid-friendly"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover breaded chicken, cubed" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "4", unit: "cups", item: "chicken broth" },
      { amount: "28", unit: "oz", item: "crushed tomatoes" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "2", unit: "cups", item: "mozzarella cheese, shredded" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "", unit: "", item: "Fresh basil and garlic bread for serving" }
    ],
    instructions: [
      "Saut? garlic in olive oil until fragrant.",
      "Add broth, tomatoes, and Italian seasoning. Bring to boil.",
      "Reduce heat, simmer 15 minutes.",
      "Stir in cream and cubed chicken.",
      "Add mozzarella and parmesan, stir until melted.",
      "Season with salt and pepper.",
      "Serve topped with fresh basil and garlic bread."
    ]
  },
  {
    id: "leftover-fajita-breakfast-hash",
    name: "Fajita Breakfast Hash",
    description: "Transform fajita leftovers into hearty breakfast.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Leftover Magic",
    image: "https://i.imgur.com/RRRXpjE.png",
    totalTime: 30,
    tags: ["leftover", "breakfast", "mexican", "glutenfree", "kid-friendly"],
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover fajita meat (chicken or steak)" ,
    nutrition: { calories: 150, protein: 13, carbs: 10, fat: 7, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "leftover peppers and onions" },
      { amount: "3", unit: "cups", item: "breakfast potatoes, diced" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "shredded cheese" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "1/4", unit: "cup", item: "cilantro, chopped" },
      { amount: "", unit: "", item: "Salsa and sour cream for serving" }
    ],
    instructions: [
      "Cook diced potatoes in cast iron skillet until crispy and golden.",
      "Add leftover fajita meat and vegetables, heat through.",
      "Make 4 wells in hash, crack an egg into each.",
      "Cover and cook until eggs reach desired doneness.",
      "Sprinkle with cheese, cover until melted.",
      "Top with avocado slices and cilantro.",
      "Serve with salsa and sour cream."
    ]
  },
  {
    id: "leftover-meatball-casserole",
    name: "Meatball Sub Casserole",
    description: "Deconstructed meatball subs in comforting casserole form.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Leftover Magic",
    image: "https://i.imgur.com/EPxUKLX.png",
    totalTime: 40,
    tags: ["leftover", "comfort-food", "italian", "kid-friendly"],
    ingredients: [
      { amount: "20", unit: "", item: "leftover meatballs" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "4", unit: "cups", item: "marinara sauce" },
      { amount: "1", unit: "loaf", item: "French bread, cubed" },
      { amount: "2", unit: "cups", item: "mozzarella cheese, shredded" },
      { amount: "1", unit: "cup", item: "provolone cheese, sliced" },
      { amount: "1/4", unit: "cup", item: "parmesan cheese" },
      { amount: "2", unit: "tbsp", item: "butter, melted" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" }
    ],
    instructions: [
      "Preheat oven to 375?F. Grease 9x13 baking dish.",
      "Toast bread cubes with melted butter and Italian seasoning.",
      "Layer half the toasted bread in dish.",
      "Top with meatballs, marinara, and half the cheeses.",
      "Add remaining bread cubes.",
      "Top with remaining cheeses.",
      "Bake 25 minutes until bubbly and cheese is golden.",
      "Garnish with fresh basil."
    ]
  },
  {
    id: "leftover-lasagna-grilled-cheese",
    name: "Lasagna Grilled Cheese",
    description: "The ultimate comfort food mashup sandwich.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 2,
    cuisine: "Leftover Magic",
    image: leftoverLasagnaGrilledCheeseImg,
    totalTime: 15,
    tags: ["leftover", "sandwich", "fusion", "kid-friendly"],
    ingredients: [
      { amount: "2", unit: "slices", item: "leftover lasagna" ,
    nutrition: { calories: 175, protein: 6, carbs: 10, fat: 8, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
      { amount: "4", unit: "slices", item: "thick bread" },
      { amount: "4", unit: "slices", item: "mozzarella cheese" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1/4", unit: "cup", item: "marinara sauce for dipping" },
      { amount: "", unit: "", item: "Fresh basil leaves" }
    ],
    instructions: [
      "Butter one side of each bread slice.",
      "Place 2 slices butter-side down in skillet.",
      "Top each with cheese slice, lasagna slice, basil, and another cheese slice.",
      "Top with remaining bread slices, butter-side up.",
      "Cook over medium heat 4-5 minutes per side until golden and cheese melts.",
      "Press down gently with spatula while cooking.",
      "Serve with marinara for dipping."
    ]
  },
  {
    id: "leftover-pot-roast-ramen",
    name: "Pot Roast Ramen",
    description: "Upgrade instant ramen with tender pot roast.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Leftover Magic",
    image: leftoverPotRoastRamenImg,
    totalTime: 25,
    tags: ["leftover", "asian", "soup", "quick", "kid-friendly"],
    nutrition: {
      calories: 420,
      protein: 28,
      carbs: 48,
      fat: 12,
      fiber: 3,
      sugar: 4,
      servingSize: "1 bowl"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "leftover pot roast, shredded" },
      { amount: "4", unit: "packs", item: "ramen noodles" },
      { amount: "8", unit: "cups", item: "beef broth" },
      { amount: "4", unit: "", item: "soft-boiled eggs" },
      { amount: "1", unit: "cup", item: "bok choy, chopped" },
      { amount: "1", unit: "cup", item: "mushrooms, sliced" },
      { amount: "4", unit: "", item: "green onions, sliced" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "sesame oil" }
    ],
    instructions: [
      "Bring beef broth to boil. Add soy sauce and sesame oil.",
      "Cook ramen noodles according to package, drain.",
      "Saut? mushrooms and bok choy until tender.",
      "Divide noodles among 4 bowls.",
      "Top with shredded pot roast, vegetables, and halved soft-boiled eggs.",
      "Pour hot broth over everything.",
      "Garnish with green onions and serve immediately."
    ]
  },
  {
    id: "leftover-taco-stuffed-peppers",
    name: "Taco Stuffed Bell Peppers",
    description: "Colorful peppers filled with seasoned taco filling.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Mexican",
    image: "https://i.imgur.com/8znNLjc.png",
    totalTime: 45,
    tags: ["leftover", "mexican", "dinner", "glutenfree"],
    ingredients: [
      { amount: "6", unit: "", item: "bell peppers, halved and seeded" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "3", unit: "cups", item: "leftover taco meat" },
      { amount: "1", unit: "cup", item: "cooked rice" },
      { amount: "1", unit: "can", item: "black beans, drained" },
      { amount: "1", unit: "cup", item: "corn" },
      { amount: "2", unit: "cups", item: "shredded Mexican cheese" },
      { amount: "1/2", unit: "cup", item: "sour cream" },
      { amount: "", unit: "", item: "Cilantro and lime for garnish" }
    ],
    instructions: [
      "Preheat oven to 375?F.",
      "Arrange pepper halves in baking dish.",
      "Mix taco meat, rice, beans, corn, and 1 cup cheese.",
      "Fill each pepper half with mixture.",
      "Cover with foil, bake 25 minutes.",
      "Remove foil, top with remaining cheese, bake 5 more minutes.",
      "Serve topped with sour cream, cilantro, and lime wedges."
    ]
  },
  {
    id: "leftover-tikka-masala-pot-pie",
    name: "Chicken Tikka Masala Pot Pie",
    description: "Indian flavors meet British comfort in this fusion dish.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Fusion",
    image: "https://i.imgur.com/GcCL2V1.png",
    totalTime: 45,
    tags: ["leftover", "fusion", "indian", "comfort-food"],
    ingredients: [
      { amount: "3", unit: "cups", item: "leftover chicken tikka masala" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "frozen peas" },
      { amount: "1", unit: "cup", item: "diced potatoes, cooked" },
      { amount: "1", unit: "sheet", item: "puff pastry, thawed" },
      { amount: "1", unit: "", item: "egg, beaten" },
      { amount: "2", unit: "tbsp", item: "fresh cilantro" },
      { amount: "", unit: "", item: "Naan bread for serving" }
    ],
    instructions: [
      "Preheat oven to 400?F.",
      "Mix tikka masala with peas and potatoes.",
      "Transfer to pie dish or individual ramekins.",
      "Cover with puff pastry, trim excess, crimp edges.",
      "Cut small vents in top, brush with beaten egg.",
      "Bake 25-30 minutes until pastry is golden and puffed.",
      "Let cool 5 minutes, garnish with cilantro.",
      "Serve with naan bread."
    ]
  },
  {
    id: "honey-garlic-salmon",
    name: "Honey Garlic Glazed Salmon",
    description: "Sweet and savory salmon with Asian-inspired glaze.",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927",
    totalTime: 20,
    tags: ["seafood", "glutenfree", "dinner"],
    nutrition: {
      calories: 385,
      protein: 42,
      carbs: 18,
      fat: 16,
      fiber: 0,
      sugar: 14,
      servingSize: "1 fillet"
    },
    ingredients: [
      { amount: "4", unit: "fillets", item: "salmon fillets (6 oz each)" },
      { amount: "1/4", unit: "cup", item: "honey" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "fresh ginger, grated" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "tbsp", item: "lemon juice" },
      { amount: "2", unit: "", item: "green onions, sliced" }
    ],
    instructions: [
      "Mix honey, soy sauce, garlic, ginger, and lemon juice in a bowl.",
      "Heat olive oil in a large skillet over medium-high heat.",
      "Place salmon fillets skin-side up and cook 4 minutes.",
      "Flip salmon and pour honey garlic mixture over the top.",
      "Cook another 4-5 minutes until salmon flakes easily.",
      "Spoon glaze over salmon and garnish with green onions.",
      "Serve immediately with rice and steamed vegetables."
    ]
  },
  
  {
    id: "chicken-marsala",
    name: "Chicken Marsala",
    description: "Rich mushroom wine sauce over tender chicken.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Italian",
    image: "https://i.imgur.com/95Ka00c.png",
    totalTime: 35,
    tags: ["italian", "comfort-food", "restaurant-quality", "dinner"],
    nutrition: {
      calories: 465,
      protein: 42,
      carbs: 18,
      fat: 24,
      fiber: 2,
      sugar: 3,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts, pounded thin" },
      { amount: "1/2", unit: "cup", item: "all-purpose flour" },
      { amount: "8", unit: "oz", item: "mushrooms, sliced" },
      { amount: "3/4", unit: "cup", item: "Marsala wine" },
      { amount: "1/2", unit: "cup", item: "chicken broth" },
      { amount: "1/4", unit: "cup", item: "heavy cream" },
      { amount: "4", unit: "tbsp", item: "butter" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "fresh parsley, chopped" }
    ],
    instructions: [
      "Season chicken with salt and pepper, then dredge in flour.",
      "Heat olive oil and 2 tbsp butter in a large skillet over medium-high.",
      "Cook chicken 4-5 minutes per side until golden. Remove and set aside.",
      "Add remaining butter and mushrooms. Cook until browned, 5 minutes.",
      "Add garlic and cook 30 seconds.",
      "Pour in Marsala wine and scrape up brown bits. Simmer 3 minutes.",
      "Add chicken broth and cream. Simmer until sauce thickens, 5 minutes.",
      "Return chicken to pan and coat with sauce.",
      "Garnish with parsley and serve over pasta or mashed potatoes."
    ]
  },
  {
    id: "shrimp-tacos",
    name: "Cilantro Lime Shrimp Tacos",
    description: "Fresh and zesty tacos with perfectly seasoned shrimp.",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Mexican",
    image: "https://i.imgur.com/YOqD3jZ.png",
    totalTime: 20,
    tags: ["mexican", "seafood", "dinner"],
    nutrition: {
      calories: 340,
      protein: 32,
      carbs: 35,
      fat: 10,
      fiber: 6,
      sugar: 3,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "large shrimp, peeled" },
      { amount: "3", unit: "tbsp", item: "lime juice" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1/2", unit: "tsp", item: "chili powder" },
      { amount: "12", unit: "", item: "corn tortillas" },
      { amount: "2", unit: "cups", item: "cabbage slaw" },
      { amount: "1/4", unit: "cup", item: "cilantro, chopped" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "", unit: "", item: "sour cream for serving" }
    ],
    instructions: [
      "Mix lime juice, olive oil, garlic powder, cumin, and chili powder.",
      "Toss shrimp with marinade and let sit 10 minutes.",
      "Heat a large skillet over medium-high heat.",
      "Cook shrimp 2-3 minutes per side until pink and cooked through.",
      "Warm tortillas in a dry skillet or microwave.",
      "Assemble tacos with shrimp, cabbage slaw, cilantro, and avocado.",
      "Top with sour cream and extra lime juice.",
      "Serve immediately."
    ]
  },
  {
    id: "stuffed-peppers",
    name: "Italian Stuffed Bell Peppers",
    description: "Hearty peppers filled with seasoned beef and rice.",
    cookTime: "40 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Italian-American",
    image: "https://i.imgur.com/UfcxEMw.png",
    totalTime: 55,
    tags: ["comfort-food", "make-ahead", "glutenfree", "dinner"],
    nutrition: {
      calories: 385,
      protein: 28,
      carbs: 32,
      fat: 16,
      fiber: 5,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "6", unit: "", item: "bell peppers, halved" },
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1/2", unit: "lb", item: "Italian sausage" },
      { amount: "2", unit: "cups", item: "cooked rice" },
      { amount: "2", unit: "cups", item: "marinara sauce" },
      { amount: "1.5", unit: "cups", item: "mozzarella cheese, shredded" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" },
      { amount: "", unit: "", item: "fresh basil for garnish" }
    ],
    instructions: [
      "Preheat oven to 375?F.",
      "Remove seeds from pepper halves and arrange in a baking dish.",
      "Brown ground beef and sausage with onion and garlic. Drain fat.",
      "Mix meat with rice, 1 cup marinara, 1 cup cheese, and Italian seasoning.",
      "Fill each pepper half with meat mixture.",
      "Pour remaining marinara around peppers in the dish.",
      "Cover with foil and bake 30 minutes.",
      "Remove foil, top with remaining cheese, and bake 10 more minutes.",
      "Garnish with fresh basil and serve."
    ]
  },
  {
    id: "teriyaki-chicken",
    name: "Homemade Teriyaki Chicken",
    description: "Better than takeout with homemade teriyaki sauce.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Japanese",
    image: teriyakiChickenImg,
    imageUrl: "https://i.imgur.com/T4OZWKW.png",
    totalTime: 30,
    tags: ["asian", "kid-friendly", "meal-prep", "dinner"],
    nutrition: {
      calories: 395,
      protein: 45,
      carbs: 26,
      fat: 12,
      fiber: 1,
      sugar: 18,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "lbs", item: "chicken thighs, boneless" },
      { amount: "1/2", unit: "cup", item: "soy sauce" },
      { amount: "1/4", unit: "cup", item: "brown sugar" },
      { amount: "2", unit: "tbsp", item: "honey" },
      { amount: "2", unit: "tbsp", item: "rice vinegar" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "ginger, grated" },
      { amount: "1", unit: "tbsp", item: "cornstarch" },
      { amount: "2", unit: "tbsp", item: "water" },
      { amount: "", unit: "", item: "sesame seeds for garnish" },
      { amount: "", unit: "", item: "green onions for garnish" }
    ],
    instructions: [
      "Mix soy sauce, brown sugar, honey, vinegar, garlic, and ginger in a bowl.",
      "Heat a large skillet over medium-high heat with a bit of oil.",
      "Season chicken with salt and pepper, cook 5-6 minutes per side.",
      "Pour teriyaki sauce over chicken and simmer 5 minutes.",
      "Mix cornstarch with water and add to pan to thicken sauce.",
      "Cook 2 more minutes until sauce coats chicken.",
      "Garnish with sesame seeds and green onions.",
      "Serve over rice with steamed broccoli."
    ]
  },
  {
    id: "pork-chops-apples",
    name: "Fall Pork Chop",
    description: "Fall-inspired pork with sweet caramelized apples.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Fall Favorites",
    image: porkChopsApplesImg,
    totalTime: 35,
    tags: ["fall", "comfort-food", "glutenfree", "dinner"],
    nutrition: {
      calories: 420,
      protein: 38,
      carbs: 28,
      fat: 18,
      fiber: 4,
      sugar: 18,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "", item: "bone-in pork chops (1-inch thick)" },
      { amount: "2", unit: "large", item: "apples, sliced" },
      { amount: "1", unit: "large", item: "onion, sliced" },
      { amount: "1/2", unit: "cup", item: "apple cider" },
      { amount: "1/2", unit: "cup", item: "chicken broth" },
      { amount: "3", unit: "tbsp", item: "butter" },
      { amount: "4", unit: "sprigs", item: "fresh thyme" },
      { amount: "1", unit: "tbsp", item: "brown sugar" },
      { amount: "1", unit: "tsp", item: "Dijon mustard" }
    ],
    instructions: [
      "Season pork chops generously with salt and pepper.",
      "Heat 1 tbsp butter in a large skillet over medium-high heat.",
      "Sear pork chops 4 minutes per side. Remove and set aside.",
      "Add remaining butter, apples, and onions. Cook 5 minutes.",
      "Add apple cider, broth, thyme, brown sugar, and mustard.",
      "Return pork chops to pan and simmer 10-12 minutes.",
      "Flip chops halfway through cooking.",
      "Serve with apple-onion mixture spooned over top."
    ]
  },
  {
    id: "butternut-squash-soup",
    name: "Creamy Butternut Squash Soup",
    description: "Velvety smooth soup with fall spices. Perfect comfort food.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Fall Favorites",
    image: butternutSquashSoupImg,
    totalTime: 45,
    tags: ["fall", "soup", "vegetarian", "comfort-food", "glutenfree"],
    nutrition: {
      calories: 180,
      protein: 4,
      carbs: 32,
      fat: 6,
      fiber: 5,
      sugar: 8,
      servingSize: "1 bowl"
    },
    ingredients: [
      { amount: "1", unit: "large", item: "butternut squash, peeled and cubed" },
      { amount: "1", unit: "", item: "onion, chopped" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "4", unit: "cups", item: "vegetable broth" },
      { amount: "1/2", unit: "cup", item: "heavy cream" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1/2", unit: "tsp", item: "nutmeg" },
      { amount: "2", unit: "tbsp", item: "maple syrup" },
      { amount: "", unit: "", item: "Pumpkin seeds for garnish" }
    ],
    instructions: [
      "Melt butter in large pot. Saut? onion until soft, about 5 minutes.",
      "Add garlic and spices, cook 1 minute until fragrant.",
      "Add squash and broth. Bring to boil, then simmer 20 minutes until tender.",
      "Use immersion blender to puree until smooth (or transfer to blender in batches).",
      "Stir in cream and maple syrup. Season with salt and pepper.",
      "Serve hot garnished with cream swirl and pumpkin seeds."
    ]
  },
  {
    id: "maple-glazed-salmon",
    name: "Maple Glazed Salmon",
    description: "Sweet and savory salmon with fall vegetables. Restaurant quality.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/IRLpsco.png",
    imageUrl: "https://i.imgur.com/gk4bJTS.png",
    totalTime: 30,
    tags: ["fall", "protein", "seafood"],
    nutrition: {
      calories: 380,
      protein: 34,
      carbs: 22,
      fat: 18,
      fiber: 3,
      sugar: 14,
      servingSize: "1 fillet"
    },
    ingredients: [
      { amount: "4", unit: "", item: "salmon fillets (6 oz each)" },
      { amount: "1/4", unit: "cup", item: "maple syrup" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "2", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "Dijon mustard" },
      { amount: "2", unit: "cups", item: "Brussels sprouts, halved" },
      { amount: "1", unit: "large", item: "sweet potato, cubed" },
      { amount: "2", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Preheat oven to 400?F. Line baking sheet with parchment.",
      "Toss Brussels sprouts and sweet potato with olive oil, salt, and pepper. Spread on sheet.",
      "Roast vegetables 10 minutes.",
      "Meanwhile, mix maple syrup, soy sauce, garlic, and mustard.",
      "Place salmon on sheet with vegetables. Brush with maple glaze.",
      "Roast 10-12 minutes until salmon flakes easily.",
      "Brush with remaining glaze before serving."
    ]
  },
  {
    id: "apple-cider-pulled-pork",
    name: "Apple Cider Pulled Pork",
    description: "Slow-cooked pork with fall spices. Perfect for sandwiches.",
    cookTime: "6 hours",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Dinner",
    image: "https://i.imgur.com/aHMkyJB.png",
    totalTime: 375,
    tags: ["fall", "comfort-food", "slow-cooker", "dinner"],
    nutrition: {
      calories: 420,
      protein: 42,
      carbs: 28,
      fat: 14,
      fiber: 2,
      sugar: 18,
      servingSize: "1 sandwich"
    },
    ingredients: [
      { amount: "4", unit: "lbs", item: "pork shoulder" },
      { amount: "2", unit: "cups", item: "apple cider" },
      { amount: "1", unit: "cup", item: "BBQ sauce" },
      { amount: "2", unit: "", item: "apples, sliced" },
      { amount: "1", unit: "large", item: "onion, sliced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "brown sugar" },
      { amount: "1", unit: "tbsp", item: "apple cider vinegar" },
      { amount: "8", unit: "", item: "brioche buns" }
    ],
    instructions: [
      "Season pork shoulder generously with salt, pepper, and brown sugar.",
      "Place pork in slow cooker with onions and garlic.",
      "Pour apple cider over pork. Add apple slices around sides.",
      "Cook on low 6-8 hours until pork is fork-tender.",
      "Remove pork and shred with two forks.",
      "Mix shredded pork with BBQ sauce and 1/2 cup cooking liquid.",
      "Serve on toasted brioche buns with coleslaw."
    ]
  },
  {
    id: "cranberry-brie-bites",
    name: "Cranberry Brie Bites",
    description: "Elegant appetizer with melted brie and cranberry. Party perfect.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 24,
    cuisine: "Fall Favorites",
    image: cranberryBrieBitesImg,
    totalTime: 25,
    tags: ["fall", "appetizer", "party", "vegetarian", "glutenfree"],
    nutrition: {
      calories: 85,
      protein: 3,
      carbs: 8,
      fat: 5,
      fiber: 0,
      sugar: 3,
      servingSize: "1 bite"
    },
    ingredients: [
      { amount: "2", unit: "sheets", item: "puff pastry, thawed" },
      { amount: "8", unit: "oz", item: "brie cheese, cut into small cubes" },
      { amount: "1/2", unit: "cup", item: "cranberry sauce" },
      { amount: "1/4", unit: "cup", item: "chopped pecans" },
      { amount: "2", unit: "tbsp", item: "honey" },
      { amount: "", unit: "", item: "Fresh rosemary for garnish" }
    ],
    instructions: [
      "Preheat oven to 375?F. Grease mini muffin tin.",
      "Cut puff pastry into 24 squares. Press into muffin cups.",
      "Place a cube of brie in each cup.",
      "Top with 1 tsp cranberry sauce and sprinkle of pecans.",
      "Bake 12-15 minutes until pastry is golden and puffed.",
      "Drizzle with honey and garnish with rosemary.",
      "Serve warm."
    ]
  },
  {
    id: "sweet-potato-casserole",
    name: "Sweet Potato Casserole",
    description: "Classic holiday side with marshmallow topping. Family favorite.",
    cookTime: "40 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 10,
    cuisine: "Fall Favorites",
    image: sweetPotatoCasseroleImg,
    totalTime: 60,
    tags: ["fall", "side-dish", "holiday", "comfort-food", "vegetarian", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 4,
      carbs: 58,
      fat: 10,
      fiber: 4,
      sugar: 32,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "lbs", item: "sweet potatoes" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "1/2", unit: "cup", item: "brown sugar" },
      { amount: "2", unit: "", item: "eggs, beaten" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "1/2", unit: "cup", item: "milk" },
      { amount: "3", unit: "cups", item: "mini marshmallows" },
      { amount: "1/2", unit: "cup", item: "chopped pecans" }
    ],
    instructions: [
      "Preheat oven to 350?F. Grease 9x13 baking dish.",
      "Boil sweet potatoes until tender, about 20 minutes. Drain and peel.",
      "Mash sweet potatoes until smooth.",
      "Mix in butter, brown sugar, eggs, vanilla, and milk.",
      "Spread mixture in prepared dish.",
      "Top with marshmallows and pecans.",
      "Bake 25-30 minutes until marshmallows are golden brown.",
      "Let cool 5 minutes before serving."
    ]
  },
  {
    id: "harvest-chicken-vegetables",
    name: "Harvest Chicken with Root Vegetables",
    description: "One-pan roasted chicken with fall vegetables. Simple and delicious.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Fall Favorites",
    image: harvestChickenVegetablesImg,
    totalTime: 60,
    tags: ["fall", "one-pan", "chicken", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 36,
      carbs: 28,
      fat: 14,
      fiber: 5,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "6", unit: "", item: "chicken thighs" },
      { amount: "3", unit: "", item: "carrots, cut into chunks" },
      { amount: "2", unit: "", item: "parsnips, cut into chunks" },
      { amount: "1", unit: "", item: "turnip, cubed" },
      { amount: "1", unit: "large", item: "red onion, quartered" },
      { amount: "4", unit: "cloves", item: "garlic, whole" },
      { amount: "3", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "tbsp", item: "fresh thyme" },
      { amount: "1", unit: "tbsp", item: "fresh rosemary" }
    ],
    instructions: [
      "Preheat oven to 425?F.",
      "Toss all vegetables with 2 tbsp olive oil, salt, and pepper. Spread on large baking sheet.",
      "Season chicken with salt, pepper, thyme, and rosemary. Rub with remaining oil.",
      "Place chicken on top of vegetables.",
      "Roast 40-45 minutes until chicken reaches 165?F and vegetables are tender.",
      "Let rest 5 minutes before serving."
    ]
  },
  {
    id: "pecan-crusted-pork",
    name: "Pecan Crusted Pork Tenderloin",
    description: "Elegant pork with crunchy pecan coating. Perfect for dinner parties.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: pecanCrustedPorkImg,
    totalTime: 40,
    tags: ["fall", "elegant", "dinner", "protein"],
    nutrition: {
      calories: 420,
      protein: 42,
      carbs: 12,
      fat: 22,
      fiber: 2,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "pork tenderloin" },
      { amount: "1", unit: "cup", item: "pecans, finely chopped" },
      { amount: "1/4", unit: "cup", item: "panko breadcrumbs" },
      { amount: "2", unit: "tbsp", item: "Dijon mustard" },
      { amount: "2", unit: "tbsp", item: "maple syrup" },
      { amount: "2", unit: "tbsp", item: "butter, melted" },
      { amount: "1", unit: "tsp", item: "fresh thyme" },
      { amount: "1/2", unit: "tsp", item: "garlic powder" }
    ],
    instructions: [
      "Preheat oven to 400?F. Line baking sheet with foil.",
      "Season pork with salt and pepper.",
      "Mix pecans, panko, thyme, and garlic powder in shallow dish.",
      "Combine mustard and maple syrup. Brush all over pork.",
      "Press pork into pecan mixture, coating all sides.",
      "Drizzle with melted butter.",
      "Roast 20-25 minutes until internal temp reaches 145?F.",
      "Let rest 5 minutes before slicing."
    ]
  },
  {
    id: "caramel-apple-nachos",
    name: "Caramel Apple Nachos",
    description: "Fun fall dessert with apple slices and sweet toppings. Kids love it.",
    cookTime: "0 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Desserts",
    image: caramelAppleNachosImg,
    totalTime: 10,
    tags: ["fall", "dessert", "no-bake", "kid-friendly", "glutenfree"],
    nutrition: {
      calories: 280,
      protein: 4,
      carbs: 48,
      fat: 10,
      fiber: 4,
      sugar: 36,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "", item: "apples, sliced" },
      { amount: "1/2", unit: "cup", item: "caramel sauce" },
      { amount: "1/4", unit: "cup", item: "chocolate chips, melted" },
      { amount: "1/4", unit: "cup", item: "chopped peanuts" },
      { amount: "2", unit: "tbsp", item: "mini chocolate chips" },
      { amount: "2", unit: "tbsp", item: "granola" },
      { amount: "1", unit: "tbsp", item: "cinnamon sugar" }
    ],
    instructions: [
      "Arrange apple slices on large serving platter in overlapping pattern.",
      "Warm caramel sauce slightly in microwave for easy drizzling.",
      "Drizzle caramel sauce over apples.",
      "Drizzle melted chocolate in opposite direction.",
      "Sprinkle with peanuts, mini chocolate chips, and granola.",
      "Dust with cinnamon sugar.",
      "Serve immediately with toothpicks."
    ]
  },
  {
    id: "pumpkin-risotto",
    name: "Pumpkin Risotto",
    description: "Creamy Italian rice with pumpkin and sage. Fall comfort food.",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Italian",
    image: pumpkinRisottoImg,
    totalTime: 40,
    tags: ["fall", "vegetarian", "italian", "comfort-food", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 12,
      carbs: 58,
      fat: 12,
      fiber: 3,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "cups", item: "arborio rice" },
      { amount: "1", unit: "cup", item: "pumpkin puree" },
      { amount: "5", unit: "cups", item: "vegetable broth, warm" },
      { amount: "1", unit: "", item: "onion, finely chopped" },
      { amount: "2", unit: "cloves", item: "garlic, minced" },
      { amount: "1/2", unit: "cup", item: "white wine" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese, grated" },
      { amount: "3", unit: "tbsp", item: "butter" },
      { amount: "10", unit: "", item: "sage leaves" },
      { amount: "1/4", unit: "cup", item: "pumpkin seeds" }
    ],
    instructions: [
      "In large saucepan, melt 2 tbsp butter. Saut? onion until soft.",
      "Add garlic and rice. Toast 2 minutes, stirring constantly.",
      "Add wine and stir until absorbed.",
      "Add warm broth one ladle at a time, stirring frequently. Wait until absorbed before adding more.",
      "After 15 minutes, stir in pumpkin puree.",
      "Continue adding broth until rice is creamy and al dente, about 20 minutes total.",
      "Stir in parmesan and remaining butter.",
      "In small pan, fry sage leaves in butter until crispy.",
      "Serve risotto topped with crispy sage and toasted pumpkin seeds."
    ]
  },
  {
    id: "autumn-harvest-salad",
    name: "Autumn Harvest Salad",
    description: "Colorful salad with roasted squash and candied pecans. Healthy and delicious.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/IN6gTJm.png",
    totalTime: 35,
    tags: ["fall", "salad", "vegetarian", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 8,
      carbs: 36,
      fat: 18,
      fiber: 6,
      sugar: 14,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "6", unit: "cups", item: "mixed greens" },
      { amount: "2", unit: "cups", item: "butternut squash, cubed and roasted" },
      { amount: "1/2", unit: "cup", item: "dried cranberries" },
      { amount: "1/2", unit: "cup", item: "candied pecans" },
      { amount: "4", unit: "oz", item: "goat cheese, crumbled" },
      { amount: "1", unit: "", item: "pear, sliced" },
      { amount: "1/4", unit: "cup", item: "balsamic vinegar" },
      { amount: "1/2", unit: "cup", item: "olive oil" },
      { amount: "1", unit: "tbsp", item: "maple syrup" },
      { amount: "1", unit: "tsp", item: "Dijon mustard" }
    ],
    instructions: [
      "Toss squash cubes with olive oil, salt, and pepper. Roast at 400?F for 20 minutes.",
      "Make dressing: whisk balsamic vinegar, olive oil, maple syrup, and mustard.",
      "In large bowl, combine mixed greens with roasted squash.",
      "Add cranberries, pecans, goat cheese, and pear slices.",
      "Drizzle with dressing and toss gently.",
      "Serve immediately."
    ]
  },
  {
    id: "lemon-herb-chicken",
    name: "Lemon Herb Roasted Chicken Thighs",
    description: "Crispy skin chicken with roasted potatoes.",
    cookTime: "40 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Mediterranean",
    image: lemonHerbChickenThighsImg,
    totalTime: 50,
    tags: ["roasted", "glutenfree", "meal-prep", "dinner"],
    nutrition: {
      calories: 445,
      protein: 42,
      carbs: 24,
      fat: 22,
      fiber: 4,
      sugar: 3,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "8", unit: "", item: "chicken thighs, bone-in skin-on" },
      { amount: "2", unit: "", item: "lemons, zested and juiced" },
      { amount: "3", unit: "tbsp", item: "olive oil" },
      { amount: "6", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "fresh rosemary, chopped" },
      { amount: "2", unit: "tbsp", item: "fresh thyme" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "1.5", unit: "lbs", item: "baby potatoes" }
    ],
    instructions: [
      "Preheat oven to 425?F.",
      "Mix lemon zest, juice, olive oil, garlic, herbs, paprika, salt, and pepper.",
      "Rub mixture all over chicken thighs, including under the skin.",
      "Toss baby potatoes in remaining marinade.",
      "Arrange chicken and potatoes in a roasting pan.",
      "Roast 35-40 minutes until chicken reaches 165?F and skin is crispy.",
      "Let rest 5 minutes before serving.",
      "Serve with a green salad."
    ]
  },
  {
    id: "bbq-meatloaf",
    name: "Classic BBQ Meatloaf",
    description: "Comfort food classic with tangy BBQ glaze.",
    cookTime: "60 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Dinner",
    image: "https://i.imgur.com/cZ6DgEY.png",
    totalTime: 75,
    tags: ["comfort-food", "american", "kid-friendly", "dinner"],
    nutrition: {
      calories: 425,
      protein: 32,
      carbs: 28,
      fat: 20,
      fiber: 1,
      sugar: 14,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "ground beef" },
      { amount: "1/2", unit: "lb", item: "ground pork" },
      { amount: "3/4", unit: "cup", item: "breadcrumbs" },
      { amount: "1/2", unit: "cup", item: "milk" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "", item: "onion, finely diced" },
      { amount: "3/4", unit: "cup", item: "BBQ sauce" },
      { amount: "2", unit: "tbsp", item: "Worcestershire sauce" },
      { amount: "1", unit: "tsp", item: "garlic powder" }
    ],
    instructions: [
      "Preheat oven to 375?F.",
      "Soak breadcrumbs in milk for 5 minutes.",
      "Mix beef, pork, breadcrumb mixture, eggs, onion, 1/4 cup BBQ sauce, Worcestershire, garlic powder, salt, and pepper.",
      "Form mixture into a loaf shape in a baking dish.",
      "Bake 45 minutes.",
      "Brush remaining BBQ sauce on top and bake 15 more minutes.",
      "Let rest 10 minutes before slicing.",
      "Serve with mashed potatoes and green beans."
    ]
  },
  {
    id: "mediterranean-chicken",
    name: "Mediterranean Chicken and Rice",
    description: "One-pan Greek-inspired chicken with feta and olives.",
    cookTime: "40 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Mediterranean",
    image: "https://i.imgur.com/Aip9ult.png",
    totalTime: 50,
    tags: ["mediterranean", "one-pan", "healthy", "dinner", "glutenfree"],
    nutrition: {
      calories: 465,
      protein: 44,
      carbs: 42,
      fat: 14,
      fiber: 3,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "lbs", item: "chicken thighs, boneless" },
      { amount: "1.5", unit: "cups", item: "long-grain rice" },
      { amount: "2.5", unit: "cups", item: "chicken broth" },
      { amount: "2", unit: "cups", item: "cherry tomatoes" },
      { amount: "1/2", unit: "cup", item: "Kalamata olives" },
      { amount: "1/2", unit: "cup", item: "feta cheese, crumbled" },
      { amount: "3", unit: "tbsp", item: "lemon juice" },
      { amount: "2", unit: "tsp", item: "oregano" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "3", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Season chicken with oregano, salt, and pepper.",
      "Heat olive oil in a large oven-safe skillet. Brown chicken 3 minutes per side.",
      "Remove chicken and set aside.",
      "Add garlic and rice, toast 2 minutes.",
      "Add broth, tomatoes, olives, and lemon juice. Stir well.",
      "Nestle chicken on top, cover, and bake at 375?F for 30 minutes.",
      "Remove from oven and let rest 5 minutes.",
      "Top with feta cheese and serve."
    ]
  },
  {
    id: "cajun-pasta",
    name: "Cajun Chicken Pasta",
    description: "Spicy creamy pasta with Cajun-seasoned chicken.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/NiKttHP.png",
    totalTime: 30,
    tags: ["spicy", "creamy", "comfort-food", "dinner", "pasta", "one-pot"],
    nutrition: {
      calories: 625,
      protein: 46,
      carbs: 58,
      fat: 24,
      fiber: 5,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "penne pasta" },
      { amount: "1.5", unit: "lbs", item: "chicken breasts, sliced" },
      { amount: "1.5", unit: "cups", item: "heavy cream" },
      { amount: "1", unit: "can", item: "diced tomatoes (14.5 oz)" },
      { amount: "2", unit: "", item: "bell peppers, sliced" },
      { amount: "1", unit: "", item: "onion, sliced" },
      { amount: "3", unit: "tbsp", item: "Cajun seasoning" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1/2", unit: "cup", item: "Parmesan cheese" }
    ],
    instructions: [
      "Cook pasta according to package directions. Drain and set aside.",
      "Season chicken with 2 tbsp Cajun seasoning.",
      "Heat butter in a large skillet and cook chicken until done. Set aside.",
      "Add peppers and onion, cook until softened, 5 minutes.",
      "Add garlic and remaining Cajun seasoning, cook 1 minute.",
      "Add cream and tomatoes, simmer 5 minutes.",
      "Return chicken to pan along with pasta.",
      "Toss everything together and top with Parmesan.",
      "Serve immediately."
    ]
  },
  {
    id: "korean-beef-bowl",
    name: "Korean Ground Beef Bowl",
    description: "Sweet and spicy beef bowl in under 20 minutes.",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Healthy Bowls",
    image: "https://i.imgur.com/7ukcqyT.png",
    totalTime: 20,
    tags: ["asian", "quick", "budget-friendly", "dinner"],
    nutrition: {
      calories: 485,
      protein: 38,
      carbs: 52,
      fat: 14,
      fiber: 2,
      sugar: 12,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "ground beef" },
      { amount: "1/3", unit: "cup", item: "soy sauce" },
      { amount: "1/4", unit: "cup", item: "brown sugar" },
      { amount: "2", unit: "tbsp", item: "sesame oil" },
      { amount: "1", unit: "tbsp", item: "ginger, grated" },
      { amount: "5", unit: "cloves", item: "garlic, minced" },
      { amount: "1/2", unit: "tsp", item: "red pepper flakes" },
      { amount: "4", unit: "", item: "green onions, sliced" },
      { amount: "", unit: "", item: "sesame seeds for garnish" },
      { amount: "4", unit: "cups", item: "cooked rice" }
    ],
    instructions: [
      "Brown ground beef in a large skillet over medium-high heat. Drain fat.",
      "Mix soy sauce, brown sugar, sesame oil, ginger, garlic, and red pepper flakes.",
      "Pour sauce over beef and simmer 3-4 minutes.",
      "Stir in half the green onions.",
      "Serve over rice and garnish with remaining green onions and sesame seeds.",
      "Add kimchi or fried egg on top if desired."
    ]
  },
  {
    id: "baked-tilapia",
    name: "Garlic Butter Baked Tilapia",
    description: "Light and flaky fish with garlic butter.",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/lpwYHYX.png",
    totalTime: 20,
    tags: ["seafood", "low-carb", "dinner", "lunch", "glutenfree"],
    nutrition: {
      calories: 245,
      protein: 38,
      carbs: 2,
      fat: 10,
      fiber: 0,
      sugar: 0,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "fillets", item: "tilapia fillets (6 oz each)" },
      { amount: "4", unit: "tbsp", item: "butter, melted" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "lemon juice" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "2", unit: "tbsp", item: "fresh parsley, chopped" },
      { amount: "1/4", unit: "cup", item: "Parmesan cheese, grated" }
    ],
    instructions: [
      "Preheat oven to 400?F and line a baking sheet with parchment.",
      "Place tilapia fillets on the baking sheet.",
      "Mix melted butter, garlic, lemon juice, paprika, salt, and pepper.",
      "Brush mixture generously over each fillet.",
      "Sprinkle with Parmesan cheese.",
      "Bake 12-15 minutes until fish flakes easily.",
      "Garnish with fresh parsley and serve with vegetables."
    ]
  },
  {
    id: "turkey-meatballs",
    name: "Italian Turkey Meatballs",
    description: "Healthy baked meatballs in marinara sauce.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Dinner",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468",
    totalTime: 45,
    tags: ["meal-prep", "italian", "dinner"],
    nutrition: {
      calories: 385,
      protein: 36,
      carbs: 28,
      fat: 14,
      fiber: 3,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "lbs", item: "ground turkey" },
      { amount: "1/2", unit: "cup", item: "breadcrumbs" },
      { amount: "1/2", unit: "cup", item: "Parmesan cheese, grated" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/4", unit: "cup", item: "fresh parsley, chopped" },
      { amount: "4", unit: "cups", item: "marinara sauce" }
    ],
    instructions: [
      "Preheat oven to 400?F and line a baking sheet with parchment.",
      "Mix turkey, breadcrumbs, Parmesan, eggs, garlic, Italian seasoning, parsley, salt, and pepper.",
      "Form into 24 meatballs (about 2 tbsp each).",
      "Place on baking sheet and bake 20 minutes.",
      "Heat marinara sauce in a large pot.",
      "Add baked meatballs to sauce and simmer 10 minutes.",
      "Serve over spaghetti or in sub sandwiches."
    ]
  },
  {
    id: "honey-mustard-chicken",
    name: "Sheet Pan Honey Mustard Chicken",
    description: "Easy one-pan dinner with roasted vegetables.",
    cookTime: "35 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Dinner",
    image: honeyMustardChickenImg,
    totalTime: 45,
    tags: ["sheet-pan", "easy-cleanup", "kid-friendly", "dinner", "glutenfree"],
    nutrition: {
      calories: 425,
      protein: 44,
      carbs: 38,
      fat: 12,
      fiber: 6,
      sugar: 16,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" },
      { amount: "1/3", unit: "cup", item: "honey" },
      { amount: "1/4", unit: "cup", item: "Dijon mustard" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "3", unit: "", item: "carrots, sliced" },
      { amount: "2", unit: "cups", item: "Brussels sprouts, halved" },
      { amount: "1", unit: "", item: "red onion, cut in wedges" }
    ],
    instructions: [
      "Preheat oven to 425?F.",
      "Whisk honey, mustard, olive oil, and garlic together.",
      "Place chicken and vegetables on a large sheet pan.",
      "Pour honey mustard mixture over everything and toss to coat.",
      "Season with salt and pepper.",
      "Roast 30-35 minutes until chicken reaches 165?F.",
      "Let rest 5 minutes before serving."
    ]
  },
  {
    id: "chimichurri-steak",
    name: "Grilled Steak with Chimichurri",
    description: "Perfectly grilled steak with fresh herb sauce.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    imageUrl: "https://i.imgur.com/cQ7IJIA.png",
    totalTime: 25,
    tags: ["grilled", "argentinian", "glutenfree", "dinner"],
    nutrition: {
      calories: 485,
      protein: 52,
      carbs: 3,
      fat: 30,
      fiber: 1,
      sugar: 0,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "steaks", item: "ribeye or sirloin steaks (8 oz each)" },
      { amount: "2", unit: "cups", item: "fresh parsley, packed" },
      { amount: "1/4", unit: "cup", item: "fresh oregano" },
      { amount: "6", unit: "cloves", item: "garlic" },
      { amount: "1/4", unit: "cup", item: "red wine vinegar" },
      { amount: "1/2", unit: "cup", item: "olive oil" },
      { amount: "1/2", unit: "tsp", item: "red pepper flakes" }
    ],
    instructions: [
      "Make chimichurri: Finely chop parsley, oregano, and garlic.",
      "Mix with vinegar, olive oil, red pepper flakes, salt, and pepper. Set aside.",
      "Season steaks generously with salt and pepper.",
      "Preheat grill to high heat.",
      "Grill steaks 4-5 minutes per side for medium-rare.",
      "Let rest 5 minutes.",
      "Slice and top with chimichurri sauce.",
      "Serve with roasted potatoes or grilled vegetables."
    ]
  },
  {
    id: "coconut-curry-chicken",
    name: "Thai Coconut Curry Chicken",
    description: "Creamy and spicy Thai curry with vegetables.",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Thai",
    image: "https://i.imgur.com/guDDUks.png",
    totalTime: 40,
    tags: ["thai", "spicy", "curry", "dinner", "glutenfree"],
    nutrition: {
      calories: 485,
      protein: 38,
      carbs: 22,
      fat: 28,
      fiber: 3,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "lbs", item: "chicken thighs, cubed" },
      { amount: "2", unit: "cans", item: "coconut milk (14 oz each)" },
      { amount: "3", unit: "tbsp", item: "red curry paste" },
      { amount: "2", unit: "", item: "bell peppers, sliced" },
      { amount: "1", unit: "can", item: "bamboo shoots (8 oz)" },
      { amount: "2", unit: "tbsp", item: "fish sauce" },
      { amount: "1", unit: "tbsp", item: "brown sugar" },
      { amount: "1/4", unit: "cup", item: "Thai basil leaves" },
      { amount: "2", unit: "tbsp", item: "lime juice" },
      { amount: "2", unit: "tbsp", item: "vegetable oil" }
    ],
    instructions: [
      "Heat oil in a large pot over medium-high heat.",
      "Add curry paste and cook 1 minute until fragrant.",
      "Add chicken and cook until browned, 5 minutes.",
      "Pour in coconut milk and bring to a simmer.",
      "Add bell peppers, bamboo shoots, fish sauce, and brown sugar.",
      "Simmer 20 minutes until chicken is cooked and sauce thickens.",
      "Stir in Thai basil and lime juice.",
      "Serve over jasmine rice."
    ]
  },
  {
    id: "blackened-fish-tacos",
    name: "Blackened Fish Tacos",
    description: "Spicy blackened fish with cool cabbage slaw.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/gb4Inv9.png",
    totalTime: 25,
    tags: ["mexican", "seafood", "dinner"],
    nutrition: {
      calories: 365,
      protein: 38,
      carbs: 36,
      fat: 8,
      fiber: 5,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "white fish fillets (mahi mahi or cod)" },
      { amount: "1", unit: "tbsp", item: "paprika" },
      { amount: "1/2", unit: "tsp", item: "cayenne pepper" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "tsp", item: "onion powder" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "12", unit: "", item: "corn tortillas" },
      { amount: "2", unit: "cups", item: "shredded cabbage" },
      { amount: "1/2", unit: "cup", item: "lime crema" },
      { amount: "", unit: "", item: "fresh cilantro for garnish" }
    ],
    instructions: [
      "Mix paprika, cayenne, garlic powder, onion powder, cumin, salt, and pepper.",
      "Coat fish fillets with spice mixture.",
      "Heat a cast iron skillet over medium-high heat.",
      "Cook fish 3-4 minutes per side until blackened and cooked through.",
      "Break fish into chunks.",
      "Warm tortillas in a dry skillet.",
      "Assemble tacos with fish, cabbage, lime crema, and cilantro.",
      "Serve with lime wedges."
    ]
  },
  {
    id: "beef-enchiladas",
    name: "Cheesy Beef Enchiladas",
    description: "Loaded enchiladas with beef, beans, and cheese.",
    cookTime: "35 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Mexican",
    image: "https://i.imgur.com/u0PK185.png",
    totalTime: 50,
    tags: ["mexican", "comfort-food", "crowd-pleaser", "dinner"],
    nutrition: {
      calories: 525,
      protein: 32,
      carbs: 48,
      fat: 22,
      fiber: 8,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "ground beef" },
      { amount: "3", unit: "cups", item: "enchilada sauce" },
      { amount: "12", unit: "", item: "flour tortillas" },
      { amount: "3", unit: "cups", item: "cheddar cheese, shredded" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "1", unit: "can", item: "black beans, drained (15 oz)" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "chili powder" },
      { amount: "", unit: "", item: "sour cream for serving" },
      { amount: "", unit: "", item: "green onions, sliced for garnish" }
    ],
    instructions: [
      "Preheat oven to 375?F.",
      "Brown beef with onion. Drain fat and add cumin and chili powder.",
      "Stir in black beans and 1/2 cup enchilada sauce.",
      "Spread 1 cup enchilada sauce in a 9x13 baking dish.",
      "Fill each tortilla with beef mixture and 1/4 cup cheese. Roll up.",
      "Place seam-side down in the dish.",
      "Pour remaining sauce over enchiladas and top with remaining cheese.",
      "Bake 25-30 minutes until bubbly.",
      "Garnish with sour cream and green onions."
    ]
  },
  {
    id: "lemon-garlic-shrimp",
    name: "Lemon Garlic Butter Shrimp",
    description: "Quick and elegant shrimp in buttery sauce.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Italian",
    image: "https://i.imgur.com/leXJHoA.png",
    totalTime: 15,
    tags: ["seafood", "quick", "low-carb", "elegant", "dinner", "glutenfree"],
    nutrition: {
      calories: 245,
      protein: 32,
      carbs: 4,
      fat: 12,
      fiber: 0,
      sugar: 1,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "large shrimp, peeled" },
      { amount: "4", unit: "tbsp", item: "butter" },
      { amount: "6", unit: "cloves", item: "garlic, minced" },
      { amount: "3", unit: "tbsp", item: "lemon juice" },
      { amount: "1/4", unit: "cup", item: "white wine" },
      { amount: "1/4", unit: "tsp", item: "red pepper flakes" },
      { amount: "3", unit: "tbsp", item: "fresh parsley, chopped" }
    ],
    instructions: [
      "Melt 2 tbsp butter in a large skillet over medium-high heat.",
      "Add shrimp, season with salt and pepper, and cook 2 minutes per side. Remove.",
      "Add remaining butter and garlic. Cook 30 seconds.",
      "Add lemon juice, wine, and red pepper flakes. Simmer 2 minutes.",
      "Return shrimp to pan and toss to coat.",
      "Garnish with fresh parsley.",
      "Serve over pasta, rice, or with crusty bread."
    ]
  },
  // ========== ONE-POT RECIPES (20) ==========
  {
    id: "jambalaya",
    name: "Cajun Chicken and Sausage Jambalaya",
    description: "Spicy Louisiana one-pot with rice, chicken, and sausage.",
    cookTime: "40 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Cajun",
    image: "https://i.imgur.com/oUgboGs.jpeg",
    totalTime: 55,
    tags: ["cajun", "spicy", "rice-dish", "one-pot", "glutenfree"],
    nutrition: {
      calories: 445,
      protein: 32,
      carbs: 48,
      fat: 14,
      fiber: 3,
      sugar: 5,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "chicken thighs, cubed" },
      { amount: "1", unit: "lb", item: "andouille sausage, sliced" },
      { amount: "2", unit: "cups", item: "long-grain rice" },
      { amount: "4", unit: "cups", item: "chicken broth" },
      { amount: "1", unit: "can", item: "diced tomatoes (14.5 oz)" },
      { amount: "2", unit: "", item: "bell peppers, diced" },
      { amount: "3", unit: "stalks", item: "celery, diced" },
      { amount: "1", unit: "large", item: "onion, diced" },
      { amount: "3", unit: "tbsp", item: "Cajun seasoning" },
      { amount: "5", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "", item: "bay leaves" },
      { amount: "", unit: "", item: "green onions for garnish" }
    ],
    instructions: [
      "Brown chicken in a large Dutch oven. Remove and set aside.",
      "Brown sausage in the same pot. Remove and set aside.",
      "Saut? onion, bell peppers, and celery until softened, 5 minutes.",
      "Add garlic and Cajun seasoning, cook 1 minute.",
      "Add rice and toast 2 minutes.",
      "Pour in broth, tomatoes, bay leaves, chicken, and sausage.",
      "Bring to a boil, reduce heat, cover, and simmer 25 minutes.",
      "Remove bay leaves, fluff with a fork, and garnish with green onions."
    ]
  },
  {
    id: "beef-stroganoff",
    name: "One-Pot Beef Stroganoff",
    description: "Creamy comfort food with tender beef and noodles.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Russian",
    image: "https://i.imgur.com/I4VSQgz.png",
    totalTime: 35,
    tags: ["comfort-food", "creamy", "pasta", "one-pot"],
    nutrition: {
      calories: 485,
      protein: 28,
      carbs: 42,
      fat: 22,
      fiber: 3,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "ground beef" },
      { amount: "12", unit: "oz", item: "egg noodles" },
      { amount: "8", unit: "oz", item: "mushrooms, sliced" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cups", item: "beef broth" },
      { amount: "1", unit: "cup", item: "sour cream" },
      { amount: "2", unit: "tbsp", item: "Worcestershire sauce" },
      { amount: "1", unit: "tbsp", item: "Dijon mustard" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "flour" },
      { amount: "", unit: "", item: "fresh parsley for garnish" }
    ],
    instructions: [
      "Brown ground beef in a large pot or Dutch oven. Drain fat.",
      "Add onion and mushrooms, cook 5 minutes.",
      "Add garlic and cook 1 minute.",
      "Sprinkle flour over meat mixture and stir to coat.",
      "Add broth, Worcestershire, and mustard. Bring to a boil.",
      "Add egg noodles and cook 10-12 minutes until tender.",
      "Remove from heat and stir in sour cream.",
      "Garnish with parsley and serve immediately."
    ]
  },
  {
    id: "chicken-fajita-rice",
    name: "One-Pot Chicken Fajita Rice",
    description: "Mexican-inspired skillet with chicken, peppers, and rice.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Mexican",
    image: chickenFajitaRiceImg,
    totalTime: 35,
    tags: ["mexican", "rice-dish", "family-friendly", "one-pot", "glutenfree"],
    nutrition: {
      calories: 425,
      protein: 36,
      carbs: 48,
      fat: 10,
      fiber: 4,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "chicken breasts, cubed" },
      { amount: "1.5", unit: "cups", item: "long-grain rice" },
      { amount: "3", unit: "cups", item: "chicken broth" },
      { amount: "3", unit: "", item: "bell peppers, sliced" },
      { amount: "1", unit: "", item: "onion, sliced" },
      { amount: "1", unit: "can", item: "diced tomatoes with green chilies (10 oz)" },
      { amount: "3", unit: "tbsp", item: "fajita seasoning" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "tbsp", item: "lime juice" },
      { amount: "1", unit: "cup", item: "shredded cheese" },
      { amount: "", unit: "", item: "cilantro for garnish" }
    ],
    instructions: [
      "Heat olive oil in a large skillet with lid over medium-high heat.",
      "Season chicken with fajita seasoning and cook until browned. Set aside.",
      "Saut? peppers and onion until softened, 5 minutes.",
      "Add rice and toast 2 minutes.",
      "Pour in broth, tomatoes, and lime juice. Stir well.",
      "Nestle chicken on top, bring to a boil, then reduce heat.",
      "Cover and simmer 20 minutes until rice is tender.",
      "Top with cheese, cover until melted, then garnish with cilantro."
    ]
  },
  {
    id: "tuscan-chicken-pasta",
    name: "One-Pot Tuscan Chicken Pasta",
    description: "Creamy Italian pasta with sun-dried tomatoes and spinach.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/BArBYKw.png",
    totalTime: 30,
    tags: ["italian", "creamy", "pasta", "one-pot"],
    nutrition: {
      calories: 565,
      protein: 42,
      carbs: 52,
      fat: 20,
      fiber: 4,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken breasts, cubed" },
      { amount: "12", unit: "oz", item: "penne pasta" },
      { amount: "1.5", unit: "cups", item: "heavy cream" },
      { amount: "2", unit: "cups", item: "chicken broth" },
      { amount: "1/2", unit: "cup", item: "sun-dried tomatoes" },
      { amount: "3", unit: "cups", item: "fresh spinach" },
      { amount: "1", unit: "cup", item: "Parmesan cheese, grated" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Heat olive oil in a large pot over medium-high heat.",
      "Season chicken with Italian seasoning, salt, and pepper. Cook until browned.",
      "Add garlic and sun-dried tomatoes, cook 1 minute.",
      "Add pasta, broth, and cream. Bring to a boil.",
      "Reduce heat and simmer 12-15 minutes, stirring occasionally.",
      "Stir in spinach until wilted.",
      "Add Parmesan and stir until melted and creamy.",
      "Serve immediately."
    ]
  },
  {
    id: "chili-mac",
    name: "One-Pot Chili Mac and Cheese",
    description: "Kid-friendly combo of chili and mac and cheese.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: chiliMacCheeseImg,
    totalTime: 30,
    tags: ["comfort-food", "kid-friendly", "budget-friendly", "one-pot", "glutenfree"],
    nutrition: {
      calories: 525,
      protein: 32,
      carbs: 52,
      fat: 20,
      fiber: 8,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "ground beef" },
      { amount: "2", unit: "cups", item: "elbow macaroni" },
      { amount: "1", unit: "can", item: "diced tomatoes (14.5 oz)" },
      { amount: "1", unit: "can", item: "kidney beans, drained (15 oz)" },
      { amount: "3", unit: "cups", item: "beef broth" },
      { amount: "2", unit: "cups", item: "cheddar cheese, shredded" },
      { amount: "2", unit: "tbsp", item: "chili powder" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" }
    ],
    instructions: [
      "Brown ground beef with onion in a large pot. Drain fat.",
      "Add garlic, chili powder, and cumin. Cook 1 minute.",
      "Add tomatoes, beans, broth, and macaroni.",
      "Bring to a boil, then reduce heat and simmer 12-15 minutes.",
      "Stir occasionally until pasta is tender.",
      "Remove from heat and stir in cheese until melted.",
      "Let sit 5 minutes before serving.",
      "Top with sour cream and green onions if desired."
    ]
  },
  
  // ========== NEW BREAKFAST RECIPES (20) ==========
  {
    id: "breakfast-buttermilk-pancakes",
    name: "Fluffy Buttermilk Pancakes",
    description: "Light and fluffy pancakes with a golden exterior. Perfect classic breakfast.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/Q0VqcLR.png",
    totalTime: 25,
    tags: ["breakfast", "quick-breakfast", "kid-friendly", "vegetarian"],
    ingredients: [
      { amount: "2", unit: "cups", item: "all-purpose flour" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "tbsp", item: "sugar" },
      { amount: "2", unit: "tsp", item: "baking powder" },
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "2", unit: "cups", item: "buttermilk" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1/4", unit: "cup", item: "melted butter" }
    ],
    instructions: [
      "Mix flour, sugar, baking powder, baking soda, and salt in bowl.",
      "Whisk buttermilk, eggs, and melted butter together.",
      "Pour wet into dry ingredients, stir until just combined (lumps okay).",
      "Heat griddle to 350?F, lightly grease.",
      "Pour 1/4 cup batter per pancake.",
      "Cook until bubbles form, flip and cook 1-2 minutes more.",
      "Serve hot with butter and maple syrup."
    ]
  },
  {
    id: "breakfast-belgian-waffles-new",
    name: "Belgian Waffles",
    description: "Crispy outside, fluffy inside waffles with deep pockets. Breakfast perfection.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/HVsCoTv.png",
    totalTime: 25,
    tags: ["breakfast", "kid-friendly", "vegetarian"],
    nutrition: {
      calories: 390,
      protein: 10,
      carbs: 48,
      fat: 18,
      fiber: 2,
      sugar: 10,
      servingSize: "2 waffles"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "all-purpose flour" },
      { amount: "2", unit: "tbsp", item: "sugar" },
      { amount: "1", unit: "tbsp", item: "baking powder" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "2", unit: "", item: "eggs, separated" },
      { amount: "1 3/4", unit: "cups", item: "milk" },
      { amount: "1/2", unit: "cup", item: "melted butter" },
      { amount: "1", unit: "tsp", item: "vanilla extract" }
    ],
    instructions: [
      "Preheat waffle iron to medium-high.",
      "Mix flour, sugar, baking powder, and salt.",
      "Whisk egg yolks, milk, butter, and vanilla together.",
      "Beat egg whites until stiff peaks form.",
      "Combine wet and dry ingredients, fold in egg whites gently.",
      "Pour batter into waffle iron, cook until golden and crispy.",
      "Serve with fresh berries, whipped cream, and maple syrup."
    ]
  },
  {
    id: "breakfast-french-toast-classic",
    name: "Classic French Toast",
    description: "Golden brown custard-soaked bread with cinnamon. Weekend breakfast favorite.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/Nz5IkyW.png",
    totalTime: 15,
    tags: ["breakfast", "quick-breakfast", "kid-friendly", "vegetarian"],
    nutrition: {
      calories: 320,
      protein: 14,
      carbs: 38,
      fat: 12,
      fiber: 2,
      sugar: 8,
      servingSize: "2 slices"
    },
    ingredients: [
      { amount: "8", unit: "slices", item: "thick bread" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1/2", unit: "cup", item: "milk" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "2", unit: "tbsp", item: "butter for cooking" }
    ],
    instructions: [
      "Beat eggs, milk, vanilla, and cinnamon in shallow dish.",
      "Heat butter in skillet over medium heat.",
      "Dip bread slices in egg mixture, coating both sides.",
      "Cook 2-3 minutes per side until golden brown.",
      "Serve hot with powdered sugar, butter, and maple syrup."
    ]
  },
  {
    id: "breakfast-eggs-benedict-classic",
    name: "Eggs Benedict",
    description: "Poached eggs with hollandaise on English muffins. Elegant brunch classic.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/4kOBQRR.png",
    totalTime: 30,
    tags: ["breakfast", "brunch", "elegant"],
    nutrition: {
      calories: 465,
      protein: 22,
      carbs: 30,
      fat: 28,
      fiber: 2,
      sugar: 3,
      servingSize: "2 eggs with muffin"
    },
    ingredients: [
      { amount: "4", unit: "", item: "English muffins, split" },
      { amount: "8", unit: "slices", item: "Canadian bacon" },
      { amount: "8", unit: "", item: "eggs" },
      { amount: "3", unit: "", item: "egg yolks for hollandaise" },
      { amount: "1/2", unit: "cup", item: "melted butter" },
      { amount: "1", unit: "tbsp", item: "lemon juice" },
      { amount: "1", unit: "tbsp", item: "white vinegar for poaching" }
    ],
    instructions: [
      "Toast English muffins, warm Canadian bacon in skillet.",
      "Make hollandaise: Whisk yolks and lemon juice in bowl over simmering water.",
      "Slowly drizzle in melted butter while whisking until thick.",
      "Poach eggs: Bring water with vinegar to gentle simmer.",
      "Crack eggs into water, cook 3-4 minutes.",
      "Assemble: muffin, bacon, poached egg, hollandaise.",
      "Garnish with paprika and chives."
    ]
  },
  {
    id: "breakfast-classic-omelet",
    name: "Classic Three-Egg Omelet",
    description: "Fluffy folded omelet with cheese and vegetables. Protein-packed breakfast.",
    cookTime: "5 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 1,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/tqz1e5T.png",
    totalTime: 10,
    tags: ["breakfast", "quick-breakfast", "protein", "vegetarian", "glutenfree"],
    ingredients: [
      { amount: "3", unit: "", item: "eggs" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "tbsp", item: "milk" },
      { amount: "1", unit: "tbsp", item: "butter" },
      { amount: "1/4", unit: "cup", item: "shredded cheese" },
      { amount: "1/4", unit: "cup", item: "diced vegetables" },
      { amount: "1", unit: "pinch", item: "salt and pepper" }
    ],
    instructions: [
      "Beat eggs with milk, salt, and pepper.",
      "Melt butter in non-stick pan over medium heat.",
      "Pour in eggs, tilt pan to spread evenly.",
      "As eggs set, lift edges to let uncooked egg flow underneath.",
      "When almost set, add cheese and vegetables to one half.",
      "Fold omelet in half, cook 1 minute more.",
      "Slide onto plate and serve immediately."
    ]
  },
  {
    id: "breakfast-burrito-classic",
    name: "Breakfast Burrito",
    description: "Flour tortilla packed with eggs, bacon, cheese, and potatoes. Hearty morning fuel.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/877Y8M2.png",
    totalTime: 25,
    tags: ["breakfast", "portable", "filling"],
    nutrition: {
      calories: 520,
      protein: 28,
      carbs: 42,
      fat: 26,
      fiber: 3,
      sugar: 4,
      servingSize: "1 burrito"
    },
    ingredients: [
      { amount: "4", unit: "large", item: "flour tortillas" },
      { amount: "8", unit: "", item: "eggs, scrambled" },
      { amount: "8", unit: "slices", item: "bacon, cooked and crumbled" },
      { amount: "1", unit: "cup", item: "shredded cheese" },
      { amount: "1", unit: "cup", item: "cooked hash browns" },
      { amount: "1/2", unit: "cup", item: "salsa" },
      { amount: "1/4", unit: "cup", item: "sour cream" }
    ],
    instructions: [
      "Warm tortillas in microwave 30 seconds.",
      "Scramble eggs in buttered pan until fluffy.",
      "Lay tortilla flat, add eggs down center.",
      "Top with bacon, cheese, hash browns, salsa.",
      "Fold sides in, then roll tightly from bottom.",
      "Optional: brown burrito in skillet 2 minutes per side.",
      "Serve with additional salsa and sour cream."
    ]
  },
  {
    id: "breakfast-casserole-classic",
    name: "Breakfast Casserole",
    description: "Baked egg casserole with sausage and bread cubes. Perfect for feeding a crowd.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/jHZeSDI.jpeg",
    totalTime: 60,
    tags: ["breakfast", "make-ahead", "crowd-pleaser"],
    nutrition: {
      calories: 425,
      protein: 24,
      carbs: 26,
      fat: 24,
      fiber: 2,
      sugar: 5,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "breakfast sausage" },
      { amount: "6", unit: "cups", item: "cubed bread" },
      { amount: "2", unit: "cups", item: "shredded cheddar cheese" },
      { amount: "8", unit: "", item: "eggs" },
      { amount: "2", unit: "cups", item: "milk" },
      { amount: "1", unit: "tsp", item: "dry mustard" },
      { amount: "1/2", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Preheat oven to 350?F. Grease 9x13 baking dish.",
      "Brown sausage in skillet, drain fat.",
      "Layer bread cubes, sausage, and cheese in dish.",
      "Whisk eggs, milk, mustard, and salt.",
      "Pour egg mixture over casserole.",
      "Let sit 10 minutes, then bake 45 minutes until golden.",
      "Let rest 5 minutes before serving."
    ]
  },
  {
    id: "breakfast-hashbrown-casserole",
    id: "breakfast-quiche-lorraine",
    name: "Quiche Lorraine",
    description: "Classic French quiche with bacon and Gruyere cheese. Elegant brunch centerpiece.",
    cookTime: "40 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Breakfast",
    image: breakfastQuicheLorraineImg,
    totalTime: 60,
    tags: ["breakfast", "brunch", "elegant", "french", "glutenfree"],
    nutrition: {
      calories: 420,
      protein: 16,
      carbs: 22,
      fat: 30,
      fiber: 1,
      sugar: 3,
      servingSize: "1 slice"
    },
    ingredients: [
      { amount: "1", unit: "", item: "pie crust, unbaked" },
      { amount: "8", unit: "slices", item: "bacon, cooked and crumbled" },
      { amount: "1", unit: "cup", item: "Gruyere cheese, shredded" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1.5", unit: "cups", item: "heavy cream" },
      { amount: "1/4", unit: "tsp", item: "nutmeg" },
      { amount: "1/2", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Preheat oven to 375?F.",
      "Place pie crust in 9-inch pie pan, crimp edges.",
      "Sprinkle bacon and cheese in bottom of crust.",
      "Whisk eggs, cream, nutmeg, and salt.",
      "Pour egg mixture over bacon and cheese.",
      "Bake 40-45 minutes until set and golden.",
      "Cool 10 minutes before slicing."
    ]
  },
  {
    id: "breakfast-biscuits-gravy-classic",
    name: "Biscuits and Gravy",
    description: "Fluffy buttermilk biscuits smothered in creamy sausage gravy. Southern comfort at its best.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/YwZdYog.png",
    totalTime: 35,
    tags: ["breakfast", "southern", "comfort-food"],
    ingredients: [
      { amount: "2", unit: "cups", item: "all-purpose flour" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "tbsp", item: "baking powder" },
      { amount: "1/2", unit: "cup", item: "cold butter" },
      { amount: "3/4", unit: "cup", item: "buttermilk" },
      { amount: "1", unit: "lb", item: "breakfast sausage" },
      { amount: "1/3", unit: "cup", item: "flour for gravy" },
      { amount: "3", unit: "cups", item: "milk" }
    ],
    instructions: [
      "Preheat oven to 450?F. Make biscuits: mix flour and baking powder.",
      "Cut in butter until crumbly, add buttermilk.",
      "Pat into 1-inch thickness, cut biscuits, bake 12 minutes.",
      "Brown sausage in skillet, don't drain.",
      "Sprinkle flour over sausage, stir and cook 1 minute.",
      "Gradually add milk, stirring constantly until thick.",
      "Split biscuits, smother with gravy."
    ]
  },
  {
    id: "breakfast-avocado-toast-classic",
    name: "Avocado Toast",
    description: "Creamy avocado on crispy toast with perfect toppings. Modern breakfast staple.",
    cookTime: "5 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 2,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/T46Ls7V.png",
    totalTime: 10,
    tags: ["breakfast", "quick-breakfast", "vegetarian"],
    nutrition: {
      calories: 380,
      protein: 15,
      carbs: 38,
      fat: 20,
      fiber: 10,
      sugar: 4,
      servingSize: "2 slices"
    },
    ingredients: [
      { amount: "4", unit: "slices", item: "sourdough bread" },
      { amount: "2", unit: "", item: "ripe avocados" },
      { amount: "2", unit: "", item: "eggs for poaching" },
      { amount: "1", unit: "tbsp", item: "lemon juice" },
      { amount: "1/4", unit: "cup", item: "cherry tomatoes, halved" },
      { amount: "1", unit: "tbsp", item: "everything bagel seasoning" }
    ],
    instructions: [
      "Toast bread until golden and crispy.",
      "Mash avocados with lemon juice, salt, and pepper.",
      "Poach eggs in simmering water, 3-4 minutes.",
      "Spread mashed avocado generously on toast.",
      "Top with poached egg, tomatoes, and seasoning.",
      "Serve immediately while toast is still crispy."
    ]
  },
  {
    id: "breakfast-overnight-oats",
    name: "Overnight Oats",
    description: "No-cook oats with yogurt and fresh fruit. Healthy grab-and-go breakfast.",
    cookTime: "0 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 1,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/E8Oav3g.png",
    totalTime: 5,
    tags: ["breakfast", "healthy", "make-ahead", "quick-breakfast", "vegetarian", "glutenfree"],
    nutrition: {
      calories: 285,
      protein: 12,
      carbs: 48,
      fat: 6,
      fiber: 8,
      sugar: 16,
      servingSize: "1 jar"
    },
    ingredients: [
      { amount: "1/2", unit: "cup", item: "rolled oats" },
      { amount: "1/2", unit: "cup", item: "milk" },
      { amount: "1/4", unit: "cup", item: "Greek yogurt" },
      { amount: "1", unit: "tbsp", item: "chia seeds" },
      { amount: "1", unit: "tbsp", item: "honey" },
      { amount: "1/2", unit: "cup", item: "fresh berries" }
    ],
    instructions: [
      "Combine oats, milk, yogurt, chia seeds, and honey in jar.",
      "Stir well to combine all ingredients.",
      "Cover and refrigerate overnight (or minimum 4 hours).",
      "In morning, stir and add more milk if too thick.",
      "Top with fresh berries, nuts, or additional honey.",
      "Enjoy cold straight from the jar."
    ]
  },
  {
    id: "breakfast-scrambled-eggs-bacon",
    name: "Scrambled Eggs with Bacon",
    description: "Perfectly creamy scrambled eggs with crispy bacon. Classic breakfast perfection.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 2,
    cuisine: "Breakfast",
    image: breakfastScrambledEggsBaconImg,
    totalTime: 15,
    tags: ["breakfast", "quick-breakfast", "protein", "classic", "glutenfree"],
    nutrition: {
      calories: 450,
      protein: 28,
      carbs: 28,
      fat: 24,
      fiber: 2,
      sugar: 4,
      servingSize: "1 serving with toast"
    },
    ingredients: [
      { amount: "6", unit: "", item: "eggs" },
      { amount: "2", unit: "tbsp", item: "milk" },
      { amount: "6", unit: "slices", item: "bacon" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "4", unit: "slices", item: "toast" }
    ],
    instructions: [
      "Cook bacon in skillet until crispy, drain on paper towels.",
      "Beat eggs with milk, salt, and pepper.",
      "Melt butter in non-stick pan over medium-low heat.",
      "Pour in eggs, let sit 20 seconds.",
      "Gently push eggs from edges to center with spatula.",
      "Remove from heat when still slightly wet (they'll keep cooking).",
      "Serve immediately with crispy bacon and toast."
    ]
  },
  {
    id: "breakfast-sandwich-classic",
    name: "Breakfast Sandwich",
    description: "Egg, cheese, and sausage on English muffin. Perfect portable breakfast.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Breakfast",
    image: breakfastSandwichClassicImg,
    totalTime: 15,
    tags: ["breakfast", "quick-breakfast", "portable"],
    nutrition: {
      calories: 420,
      protein: 24,
      carbs: 30,
      fat: 22,
      fiber: 2,
      sugar: 3,
      servingSize: "1 sandwich"
    },
    ingredients: [
      { amount: "4", unit: "", item: "English muffins, split" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "4", unit: "slices", item: "American cheese" },
      { amount: "4", unit: "", item: "sausage patties" },
      { amount: "2", unit: "tbsp", item: "butter" }
    ],
    instructions: [
      "Cook sausage patties in skillet until browned, keep warm.",
      "Fry eggs in butter to desired doneness.",
      "Toast English muffins until golden.",
      "Place cheese slice on bottom muffin half.",
      "Top with sausage patty, then fried egg.",
      "Add top muffin half.",
      "Serve hot, wrap in foil for on-the-go."
    ]
  },
  {
    id: "breakfast-smoothie-bowl-classic",
    name: "Smoothie Bowl",
    description: "Thick berry smoothie topped with fresh fruit and granola. Instagram-worthy healthy breakfast.",
    cookTime: "0 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 2,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/nN2h3dC.png",
    totalTime: 10,
    tags: ["breakfast", "healthy", "vegetarian", "quick-breakfast", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 10,
      carbs: 58,
      fat: 7,
      fiber: 9,
      sugar: 28,
      servingSize: "1 bowl"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "frozen mixed berries" },
      { amount: "1", unit: "", item: "frozen banana" },
      { amount: "1/2", unit: "cup", item: "almond milk" },
      { amount: "1/4", unit: "cup", item: "Greek yogurt" },
      { amount: "1/2", unit: "cup", item: "granola for topping" },
      { amount: "1/2", unit: "cup", item: "fresh berries for topping" },
      { amount: "2", unit: "tbsp", item: "chia seeds" }
    ],
    instructions: [
      "Blend frozen berries, banana, almond milk, and yogurt until thick.",
      "Pour into bowls (should be thick enough to eat with spoon).",
      "Arrange fresh berries, banana slices on top.",
      "Sprinkle with granola and chia seeds.",
      "Drizzle with honey if desired.",
      "Serve immediately while cold."
    ]
  },
  {
    id: "breakfast-greek-yogurt-parfait-classic",
    name: "Greek Yogurt Parfait",
    description: "Layers of creamy yogurt, crunchy granola, and fresh berries. Quick healthy breakfast.",
    cookTime: "0 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 2,
    cuisine: "Contemporary",
    image: "https://i.imgur.com/peSQKNd.png",
    totalTime: 5,
    tags: ["breakfast", "healthy", "quick-breakfast", "protein", "vegetarian", "glutenfree"],
    nutrition: {
      calories: 295,
      protein: 18,
      carbs: 42,
      fat: 7,
      fiber: 4,
      sugar: 22,
      servingSize: "1 parfait"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "Greek yogurt" },
      { amount: "1", unit: "cup", item: "granola" },
      { amount: "1", unit: "cup", item: "mixed berries" },
      { amount: "2", unit: "tbsp", item: "honey" },
      { amount: "2", unit: "tbsp", item: "sliced almonds" }
    ],
    instructions: [
      "Spoon layer of yogurt into bottom of glass or bowl.",
      "Add layer of granola.",
      "Add layer of fresh berries.",
      "Repeat layers until glass is full.",
      "Drizzle honey over top.",
      "Garnish with sliced almonds.",
      "Serve immediately or refrigerate up to 4 hours."
    ]
  },
  {
    id: "breakfast-protein-pancakes",
    name: "Protein Pancakes",
    description: "High-protein pancakes with Greek yogurt and oats. Fuel your workout.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/g747BoT.png",
    totalTime: 25,
    tags: ["breakfast", "protein", "fitness"],
    ingredients: [
      { amount: "1", unit: "cup", item: "rolled oats" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "Greek yogurt" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "scoop", item: "protein powder" },
      { amount: "1", unit: "tsp", item: "baking powder" },
      { amount: "1/2", unit: "tsp", item: "cinnamon" },
      { amount: "1/2", unit: "cup", item: "fresh berries" }
    ],
    instructions: [
      "Blend oats into flour consistency.",
      "Mix oat flour, protein powder, baking powder, and cinnamon.",
      "Whisk yogurt and eggs together.",
      "Combine wet and dry ingredients, let sit 5 minutes.",
      "Heat griddle to medium, lightly grease.",
      "Pour 1/4 cup batter per pancake, cook until bubbles form.",
      "Flip and cook 2 more minutes. Serve with berries and Greek yogurt."
    ]
  },
  {
    id: "breakfast-tacos-classic",
    name: "Breakfast Tacos",
    description: "Soft tortillas filled with scrambled eggs, chorizo, and fresh toppings. Texas morning tradition.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/KnY1DpE.png",
    totalTime: 25,
    tags: ["breakfast", "tex-mex", "quick-breakfast"],
    nutrition: {
      calories: 380,
      protein: 22,
      carbs: 32,
      fat: 18,
      fiber: 3,
      sugar: 3,
      servingSize: "2 tacos"
    },
    ingredients: [
      { amount: "8", unit: "", item: "small flour tortillas" },
      { amount: "8", unit: "", item: "eggs" },
      { amount: "1/2", unit: "lb", item: "chorizo" },
      { amount: "1", unit: "cup", item: "shredded cheese" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "1/2", unit: "cup", item: "salsa" },
      { amount: "1/4", unit: "cup", item: "cilantro, chopped" }
    ],
    instructions: [
      "Cook chorizo in skillet, breaking up as it cooks.",
      "Scramble eggs in separate pan until fluffy.",
      "Warm tortillas in dry skillet or microwave.",
      "Fill tortillas with eggs and chorizo.",
      "Top with cheese, avocado, salsa, and cilantro.",
      "Fold and serve immediately.",
      "Offer hot sauce on the side."
    ]
  },
  {
    id: "breakfast-shakshuka-classic",
    name: "Shakshuka",
    description: "Eggs poached in spiced tomato sauce with peppers. Middle Eastern breakfast masterpiece.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Middle Eastern",
    image: breakfastShakshukaClassicImg,
    totalTime: 35,
    tags: ["breakfast", "middle-eastern", "brunch", "healthy", "vegetarian", "glutenfree"],
    nutrition: {
      calories: 240,
      protein: 14,
      carbs: 18,
      fat: 13,
      fiber: 5,
      sugar: 10,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "1", unit: "", item: "bell pepper, diced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "can", item: "crushed tomatoes (28 oz)" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "6", unit: "", item: "eggs" },
      { amount: "1/4", unit: "cup", item: "feta cheese, crumbled" }
    ],
    instructions: [
      "Heat oil in large skillet, saut? onion and pepper until soft.",
      "Add garlic, cumin, and paprika, cook 1 minute.",
      "Pour in crushed tomatoes, simmer 10 minutes until thick.",
      "Make 6 wells in sauce, crack egg into each well.",
      "Cover and cook 5-8 minutes until eggs are set.",
      "Sprinkle with feta and fresh herbs.",
      "Serve with crusty bread for dipping."
    ]
  },
  {
    id: "breakfast-egg-white-wrap",
    name: "Egg White Wrap",
    description: "High-protein egg white wrap with turkey and avocado. Perfect low-carb breakfast on the go!",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 1,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/5skoxCA.png",
    totalTime: 15,
    tags: ["breakfast", "high-protein", "quick-breakfast", "low-carb"],
    nutrition: {
      calories: 250,
      protein: 35,
      carbs: 8,
      fat: 11,
      fiber: 3,
      sugar: 2,
      servingSize: "1 wrap"
    },
    ingredients: [
      { amount: "1", unit: "cup", item: "egg whites (or 4-5 egg whites)" },
      { amount: "1", unit: "spray", item: "cooking spray" },
      { amount: "3", unit: "oz", item: "sliced deli turkey" },
      { amount: "1/4", unit: "", item: "avocado, sliced" },
      { amount: "1", unit: "tbsp", item: "cream cheese (optional)" },
      { amount: "1", unit: "tsp", item: "everything bagel seasoning" },
      { amount: "1", unit: "dash", item: "hot sauce (optional)" }
    ],
    instructions: [
      "Heat non-stick pan over medium heat and spray with cooking spray.",
      "Pour egg whites into pan in a circular shape.",
      "Cook 2-3 minutes until set, then flip and cook 1 more minute.",
      "Remove from heat and spread cream cheese if using.",
      "Add turkey and avocado slices.",
      "Sprinkle with everything bagel seasoning.",
      "Roll up like a burrito and serve immediately.",
      "Add hot sauce if desired for extra flavor!"
    ]
  },
  {
    id: "breakfast-burrito-bowl",
    name: "Breakfast Burrito Bowl",
    description: "Protein-packed breakfast bowl with scrambled eggs, black beans, and all the toppings. Burrito flavor, bowl convenience!",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 2,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/3x2kgjF.png",
    totalTime: 20,
    tags: ["breakfast", "high-protein", "healthy", "tex-mex", "glutenfree"],
    nutrition: {
      calories: 420,
      protein: 34,
      carbs: 22,
      fat: 22,
      fiber: 10,
      sugar: 4,
      servingSize: "1 bowl"
    },
    ingredients: [
      { amount: "6", unit: "large", item: "eggs, scrambled" },
      { amount: "1", unit: "cup", item: "black beans" },
      { amount: "1/2", unit: "cup", item: "shredded cheese" },
      { amount: "1/2", unit: "", item: "avocado, diced" },
      { amount: "1/2", unit: "cup", item: "salsa" },
      { amount: "1/4", unit: "cup", item: "Greek yogurt or sour cream" },
      { amount: "2", unit: "tbsp", item: "fresh cilantro" },
      { amount: "1", unit: "dash", item: "hot sauce (optional)" }
    ],
    instructions: [
      "Scramble eggs in a pan over medium heat until fluffy and cooked through.",
      "Warm black beans in a separate pan or microwave.",
      "Divide scrambled eggs between two bowls as the base.",
      "Top each bowl with warm black beans, shredded cheese, and diced avocado.",
      "Add salsa and a dollop of Greek yogurt or sour cream.",
      "Garnish with fresh cilantro and hot sauce if desired.",
      "Serve immediately and enjoy your protein-packed breakfast!"
    ]
  },
  {
    id: "breakfast-blueberry-muffins",
    name: "Blueberry Muffins",
    description: "Tender bakery-style muffins bursting with fresh blueberries. Perfect grab-and-go breakfast.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/1upf556.png",
    totalTime: 30,
    tags: ["breakfast", "baked", "kid-friendly", "portable", "vegetarian"],
    ingredients: [
      { amount: "2", unit: "cups", item: "all-purpose flour" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "2", unit: "tsp", item: "baking powder" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "1/3", unit: "cup", item: "melted butter" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "milk" },
      { amount: "1.5", unit: "cups", item: "fresh blueberries" }
    ],
    instructions: [
      "Preheat oven to 400?F. Line muffin tin with paper liners.",
      "Mix flour, sugar, baking powder, and salt in large bowl.",
      "Whisk melted butter, eggs, and milk in separate bowl.",
      "Pour wet into dry ingredients, stir until just combined.",
      "Gently fold in blueberries (don't overmix).",
      "Fill muffin cups 3/4 full.",
      "Bake 20-25 minutes until golden brown and toothpick comes clean.",
      "Cool in pan 5 minutes, then transfer to wire rack."
    ]
  },
  {
    id: "protein-baked-chicken-meatballs",
    name: "Baked Chicken Meatballs",
    description: "Juicy baked chicken meatballs packed with 32g protein per serving. Kid-approved and perfect for meal prep.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: bakedChickenMeatballsImg,
    totalTime: 40,
    tags: ["high-protein", "family-friendly", "easy-dinner", "meal-prep"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "ground chicken" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1/2", unit: "cup", item: "breadcrumbs" },
      { amount: "1/4", unit: "cup", item: "grated Parmesan cheese" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "3", unit: "cloves", item: "minced garlic" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "1/4", unit: "tsp", item: "black pepper" },
      { amount: "2", unit: "cups", item: "marinara sauce" }
    ],
    instructions: [
      "Preheat oven to 400?F. Line baking sheet with parchment paper.",
      "Mix ground chicken, breadcrumbs, Parmesan, eggs, garlic, Italian seasoning, salt, and pepper in large bowl.",
      "Form mixture into 20-24 meatballs (about 1.5 inches each).",
      "Place meatballs on prepared baking sheet.",
      "Bake 20-25 minutes until golden brown and cooked through (internal temp 165?F).",
      "Warm marinara sauce in skillet.",
      "Add cooked meatballs to sauce and simmer 5 minutes.",
      "Serve over pasta, zoodles, or with crusty bread."
    ]
  },
  {
    id: "protein-sheet-pan-chicken-vegetables",
    name: "Sheet Pan Chicken and Vegetables",
    description: "One-pan wonder with 35g protein per serving. Perfectly roasted chicken with colorful veggies.",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: sheetPanChickenVegetablesImg,
    totalTime: 40,
    tags: ["high-protein", "family-friendly", "easy-dinner", "meal-prep", "one-pan", "glutenfree"],
    ingredients: [
      { amount: "4", unit: "", item: "boneless chicken breasts" ,
    nutrition: { calories: 198, protein: 14, carbs: 10, fat: 7, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "broccoli florets" },
      { amount: "2", unit: "", item: "bell peppers, chopped" },
      { amount: "2", unit: "cups", item: "baby carrots" },
      { amount: "3", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" }
    ],
    instructions: [
      "Preheat oven to 425?F.",
      "Place chicken breasts on large sheet pan.",
      "Arrange vegetables around chicken.",
      "Drizzle everything with olive oil.",
      "Mix garlic powder, paprika, Italian seasoning, salt, and pepper in small bowl.",
      "Sprinkle seasoning mixture over chicken and vegetables.",
      "Bake 25-30 minutes until chicken reaches 165?F and vegetables are tender.",
      "Let rest 5 minutes before serving."
    ]
  },
  {
    id: "protein-sheet-pan-chicken-fajitas",
    name: "Sheet Pan Chicken Fajitas",
    description: "Sizzling fajitas with 30g protein per serving. Family favorite that's ready in 30 minutes.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Mexican",
    image: sheetPanChickenFajitasImg,
    totalTime: 30,
    tags: ["high-protein", "family-friendly", "easy-dinner", "quick", "one-pan"],
    nutrition: {
      calories: 285,
      protein: 36,
      carbs: 12,
      fat: 10,
      fiber: 3,
      sugar: 5,
      servingSize: "1 serving with tortillas"
    },
    ingredients: [
      { amount: "2", unit: "lbs", item: "chicken breast, sliced" },
      { amount: "3", unit: "", item: "bell peppers, sliced" },
      { amount: "1", unit: "large", item: "onion, sliced" },
      { amount: "3", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "tsp", item: "chili powder" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "12", unit: "", item: "tortillas" }
    ],
    instructions: [
      "Preheat oven to 425?F.",
      "Place sliced chicken, bell peppers, and onion on large sheet pan.",
      "Drizzle with olive oil.",
      "Mix chili powder, cumin, garlic powder, paprika, and salt in small bowl.",
      "Sprinkle seasoning over chicken and vegetables, toss to coat.",
      "Spread in single layer.",
      "Bake 18-20 minutes, stirring halfway through.",
      "Serve with warm tortillas and your favorite toppings."
    ]
  },
  {
    id: "protein-grilled-chicken-caprese",
    name: "Grilled Chicken Caprese",
    description: "Italian-inspired chicken with 38g protein per serving. Fresh mozzarella and tomatoes make it special.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/LsSmGYN.png",
    totalTime: 25,
    tags: ["high-protein", "family-friendly", "easy-dinner", "glutenfree"],
    ingredients: [
      { amount: "4", unit: "", item: "boneless chicken breasts" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" },
      { amount: "8", unit: "oz", item: "fresh mozzarella, sliced" },
      { amount: "2", unit: "large", item: "tomatoes, sliced" },
      { amount: "1/4", unit: "cup", item: "fresh basil leaves" },
      { amount: "2", unit: "tbsp", item: "balsamic glaze" }
    ],
    instructions: [
      "Preheat grill or grill pan to medium-high heat.",
      "Brush chicken with olive oil and season with Italian seasoning, salt, and pepper.",
      "Grill chicken 6-7 minutes per side until internal temp reaches 165?F.",
      "Top each chicken breast with mozzarella slices during last 2 minutes of cooking.",
      "Remove from grill and let rest 5 minutes.",
      "Top with tomato slices and fresh basil.",
      "Drizzle with balsamic glaze.",
      "Serve immediately with side salad or roasted vegetables."
    ]
  },
  {
    id: "protein-slow-cooker-white-chicken-chili",
    name: "Slow Cooker White Chicken Chili",
    description: "Creamy comfort food with 28g protein per serving. Set it and forget it family dinner.",
    cookTime: "4 hours",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/7raEzFt.png",
    totalTime: 255,
    tags: ["high-protein", "family-friendly", "easy-dinner", "slow-cooker", "glutenfree"],
    nutrition: {
      calories: 365,
      protein: 35,
      carbs: 38,
      fat: 8,
      fiber: 9,
      sugar: 4,
      servingSize: "1 bowl"
    },
    ingredients: [
      { amount: "2", unit: "lbs", item: "boneless chicken breasts" },
      { amount: "3", unit: "cans", item: "white beans (15 oz each)" },
      { amount: "4", unit: "cups", item: "chicken broth" },
      { amount: "2", unit: "cans", item: "diced green chilies (4 oz each)" },
      { amount: "1", unit: "large", item: "onion, diced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "oregano" },
      { amount: "1", unit: "cup", item: "sour cream" },
      { amount: "2", unit: "cups", item: "shredded cheese" }
    ],
    instructions: [
      "Place chicken breasts in slow cooker.",
      "Add white beans (drained), chicken broth, green chilies, onion, and garlic.",
      "Stir in cumin and oregano.",
      "Cover and cook on high 4 hours or low 6-7 hours.",
      "Remove chicken and shred with two forks.",
      "Return chicken to slow cooker.",
      "Stir in sour cream.",
      "Serve topped with shredded cheese, cilantro, and tortilla chips."
    ]
  },
  {
    id: "protein-taco-skillet",
    name: "Taco Skillet",
    description: "One-pan taco dinner with 30g protein per serving. Ready in 20 minutes, kids love it!",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Mexican",
    image: tacoSkilletImg,
    totalTime: 20,
    tags: ["high-protein", "family-friendly", "easy-dinner", "quick", "one-pan"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "ground beef (93% lean)" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "packet", item: "taco seasoning" },
      { amount: "1", unit: "cup", item: "water" },
      { amount: "1", unit: "cup", item: "salsa" },
      { amount: "2", unit: "cups", item: "shredded lettuce" },
      { amount: "1", unit: "cup", item: "diced tomatoes" },
      { amount: "2", unit: "cups", item: "shredded cheese" },
      { amount: "1/2", unit: "cup", item: "sour cream" },
      { amount: "1", unit: "cup", item: "crushed tortilla chips" }
    ],
    instructions: [
      "Brown ground beef in large skillet over medium-high heat, breaking up as it cooks (6-8 minutes).",
      "Drain excess fat.",
      "Add taco seasoning and water, simmer 5 minutes until thickened.",
      "Stir in salsa.",
      "Top with shredded cheese, cover and let melt (2 minutes).",
      "Remove from heat.",
      "Top with lettuce, tomatoes, sour cream, and crushed chips.",
      "Serve immediately with optional toppings like guacamole or jalape?os."
    ]
  },
  {
    id: "protein-cheeseburger-bowls",
    name: "Cheeseburger Bowls",
    description: "Low-carb burger bowls with 32g protein per serving. All the flavor without the bun!",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Healthy Bowls",
    image: cheeseburgerBowlsImg,
    totalTime: 25,
    tags: ["high-protein", "family-friendly", "easy-dinner", "low-carb", "bowls", "glutenfree"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "ground beef (90% lean)" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "tsp", item: "onion powder" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" },
      { amount: "4", unit: "cups", item: "shredded lettuce" },
      { amount: "1", unit: "cup", item: "diced tomatoes" },
      { amount: "1/2", unit: "cup", item: "diced pickles" },
      { amount: "2", unit: "cups", item: "shredded cheddar cheese" },
      { amount: "1/2", unit: "cup", item: "burger sauce or thousand island" }
    ],
    instructions: [
      "Brown ground beef in large skillet over medium-high heat (8-10 minutes).",
      "Season with garlic powder, onion powder, salt, and pepper.",
      "Drain excess fat if needed.",
      "Divide lettuce among 4 bowls.",
      "Top each with seasoned ground beef.",
      "Add tomatoes, pickles, and shredded cheese.",
      "Drizzle with burger sauce.",
      "Serve immediately with optional toppings like onions or bacon."
    ]
  },
  {
    id: "protein-one-pan-beef-potatoes",
    name: "One Pan Ground Beef and Potatoes",
    description: "Hearty comfort food with 28g protein per serving. Golden potatoes and seasoned beef in one skillet.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: onePanBeefPotatoesImg,
    totalTime: 35,
    tags: ["high-protein", "family-friendly", "easy-dinner", "one-pan", "glutenfree"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "ground beef" ,
    nutrition: { calories: 168, protein: 12, carbs: 7, fat: 6, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "4", unit: "large", item: "potatoes, diced" },
      { amount: "1", unit: "large", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tsp", item: "paprika" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "tsp", item: "onion powder" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" },
      { amount: "2", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Heat olive oil in large cast iron skillet over medium-high heat.",
      "Add diced potatoes, cook 15 minutes stirring occasionally until golden and crispy.",
      "Push potatoes to sides of skillet.",
      "Add ground beef to center, break up and brown (6-8 minutes).",
      "Add onion and garlic, cook 3 minutes.",
      "Season everything with paprika, garlic powder, onion powder, salt, and pepper.",
      "Mix everything together and cook 2 more minutes.",
      "Serve hot, optionally topped with cheese or green onions."
    ]
  },
  {
    id: "protein-turkey-meatloaf",
    name: "Turkey Meatloaf",
    description: "Lean turkey meatloaf with 35g protein per serving. Moist, flavorful, and kid-approved.",
    cookTime: "50 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Dinner",
    image: turkeyMeatloafImg,
    totalTime: 65,
    tags: ["high-protein", "family-friendly", "easy-dinner", "meal-prep"],
    ingredients: [
      { amount: "2", unit: "lbs", item: "ground turkey (93% lean)" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "breadcrumbs" },
      { amount: "1/2", unit: "cup", item: "milk" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "small", item: "onion, finely diced" },
      { amount: "2", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" },
      { amount: "1/2", unit: "cup", item: "ketchup" },
      { amount: "2", unit: "tbsp", item: "brown sugar" }
    ],
    instructions: [
      "Preheat oven to 375?F.",
      "Mix ground turkey, breadcrumbs, milk, eggs, onion, garlic, salt, and pepper in large bowl.",
      "Form mixture into loaf shape and place in 9x5 inch loaf pan.",
      "Mix ketchup and brown sugar in small bowl.",
      "Spread half the ketchup mixture over top of meatloaf.",
      "Bake 40 minutes.",
      "Spread remaining ketchup mixture on top.",
      "Bake 10 more minutes until internal temp reaches 165?F.",
      "Let rest 10 minutes before slicing."
    ]
  },
  {
    id: "protein-stuffed-bell-peppers",
    name: "Stuffed Bell Peppers",
    description: "Colorful peppers stuffed with beef and rice, 26g protein per serving. Classic family dinner.",
    cookTime: "35 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: stuffedBellPeppersProteinImg,
    totalTime: 50,
    tags: ["high-protein", "family-friendly", "easy-dinner", "glutenfree"],
    ingredients: [
      { amount: "4", unit: "large", item: "bell peppers (any color)" ,
    nutrition: { calories: 196, protein: 13, carbs: 14, fat: 6, fiber: 1, sugar: 4, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1", unit: "cup", item: "cooked rice" },
      { amount: "1", unit: "can", item: "diced tomatoes (14 oz)" },
      { amount: "1", unit: "small", item: "onion, diced" },
      { amount: "2", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" },
      { amount: "1.5", unit: "cups", item: "shredded mozzarella cheese" }
    ],
    instructions: [
      "Preheat oven to 375?F.",
      "Cut tops off peppers and remove seeds.",
      "Brown ground beef with onion and garlic in skillet (8 minutes).",
      "Drain fat.",
      "Stir in cooked rice, diced tomatoes, Italian seasoning, salt, and pepper.",
      "Stuff peppers with beef mixture.",
      "Place in baking dish, add 1/4 inch water to bottom.",
      "Cover with foil, bake 25 minutes.",
      "Remove foil, top with cheese, bake 10 more minutes until cheese melts."
    ]
  },
  {
    id: "protein-baked-salmon-lemon",
    name: "Baked Salmon with Lemon",
    description: "Omega-3 rich salmon with 34g protein per serving. Simple, elegant, and healthy.",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/1vbSH8s.png",
    totalTime: 20,
    tags: ["high-protein", "family-friendly", "easy-dinner", "seafood", "glutenfree"],
    ingredients: [
      { amount: "4", unit: "", item: "salmon fillets (6 oz each)" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "", item: "lemons (1 juiced, 1 sliced)" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "dried dill" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" },
      { amount: "2", unit: "tbsp", item: "fresh parsley, chopped" }
    ],
    instructions: [
      "Preheat oven to 400?F. Line baking sheet with parchment paper.",
      "Place salmon fillets on prepared sheet.",
      "Mix olive oil, lemon juice, garlic, dill, salt, and pepper in small bowl.",
      "Brush mixture over salmon.",
      "Top each fillet with lemon slices.",
      "Bake 12-15 minutes until salmon flakes easily with fork.",
      "Garnish with fresh parsley.",
      "Serve with roasted asparagus or rice."
    ]
  },
  {
    id: "protein-sheet-pan-shrimp-fajitas",
    name: "Sheet Pan Shrimp Fajitas",
    description: "Quick shrimp fajitas with 28g protein per serving. Ready in 20 minutes!",
    cookTime: "10 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Mexican",
    image: sheetPanShrimpFajitasImg,
    totalTime: 20,
    tags: ["high-protein", "family-friendly", "easy-dinner", "quick", "one-pan"],
    nutrition: {
      calories: 270,
      protein: 32,
      carbs: 14,
      fat: 9,
      fiber: 3,
      sugar: 6,
      servingSize: "1 serving with tortillas"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "large shrimp, peeled and deveined" },
      { amount: "3", unit: "", item: "bell peppers, sliced" },
      { amount: "1", unit: "large", item: "onion, sliced" },
      { amount: "3", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "tsp", item: "chili powder" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "2", unit: "", item: "limes" },
      { amount: "8", unit: "", item: "tortillas" }
    ],
    instructions: [
      "Preheat oven to 425?F.",
      "Place shrimp, bell peppers, and onion on large sheet pan.",
      "Drizzle with olive oil.",
      "Mix chili powder, cumin, garlic powder, and salt in small bowl.",
      "Sprinkle seasoning over everything, toss to coat.",
      "Spread in single layer.",
      "Bake 8-10 minutes until shrimp are pink and cooked through.",
      "Squeeze fresh lime juice over top and serve with warm tortillas."
    ]
  },
  {
    id: "protein-pesto-baked-salmon",
    name: "Pesto Baked Salmon",
    description: "Flavorful pesto salmon with 36g protein per serving. Restaurant quality at home.",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Italian",
    image: pestoBakedSalmonImg,
    totalTime: 20,
    tags: ["high-protein", "family-friendly", "easy-dinner", "quick", "glutenfree"],
    ingredients: [
      { amount: "4", unit: "", item: "salmon fillets (6 oz each)" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1/2", unit: "cup", item: "basil pesto" },
      { amount: "1/4", unit: "cup", item: "grated Parmesan cheese" },
      { amount: "2", unit: "tbsp", item: "pine nuts" },
      { amount: "1", unit: "tbsp", item: "olive oil" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "1/4", unit: "tsp", item: "black pepper" },
      { amount: "1", unit: "", item: "lemon, sliced" }
    ],
    instructions: [
      "Preheat oven to 400?F. Line baking sheet with parchment paper.",
      "Place salmon fillets on prepared sheet.",
      "Season with salt and pepper.",
      "Spread pesto evenly over each fillet.",
      "Sprinkle with Parmesan cheese and pine nuts.",
      "Drizzle with olive oil.",
      "Bake 12-15 minutes until salmon flakes easily.",
      "Serve with lemon slices and roasted vegetables."
    ]
  },
  {
    id: "protein-cottage-cheese-baked-ziti",
    name: "Cottage Cheese Baked Ziti",
    description: "Protein-packed pasta with 30g protein per serving thanks to cottage cheese. Family favorite!",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Italian",
    image: cottageCheeseBakedZitiImg,
    totalTime: 45,
    tags: ["high-protein", "family-friendly", "easy-dinner"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ziti pasta" ,
    nutrition: { calories: 160, protein: 6, carbs: 7, fat: 9, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "24", unit: "oz", item: "marinara sauce" },
      { amount: "2", unit: "cups", item: "cottage cheese" },
      { amount: "2", unit: "cups", item: "shredded mozzarella cheese" },
      { amount: "1/2", unit: "cup", item: "grated Parmesan cheese" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" },
      { amount: "1", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Preheat oven to 375?F. Cook pasta according to package directions, drain.",
      "Brown ground beef in large skillet, drain fat.",
      "Stir marinara sauce into beef.",
      "Mix cottage cheese, 1 cup mozzarella, Parmesan, eggs, Italian seasoning, and salt in bowl.",
      "Combine cooked pasta with cottage cheese mixture.",
      "Spread half the pasta in 9x13 baking dish.",
      "Top with half the meat sauce.",
      "Repeat layers.",
      "Top with remaining 1 cup mozzarella.",
      "Cover with foil, bake 20 minutes.",
      "Remove foil, bake 10 more minutes until bubbly and golden."
    ]
  },
  {
    id: "protein-slow-cooker-lasagna",
    name: "Slow Cooker Lasagna",
    description: "Easy slow cooker lasagna with 32g protein per serving. No boiling noodles required!",
    cookTime: "4 hours",
    prepTime: "20 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Italian",
    image: slowCookerLasagnaImg,
    totalTime: 260,
    tags: ["high-protein", "family-friendly", "easy-dinner", "slow-cooker"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "jar", item: "marinara sauce (24 oz)" },
      { amount: "15", unit: "oz", item: "ricotta cheese" },
      { amount: "2", unit: "cups", item: "shredded mozzarella cheese" },
      { amount: "1/2", unit: "cup", item: "grated Parmesan cheese" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "9", unit: "", item: "lasagna noodles (uncooked)" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/2", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Brown ground beef in skillet, drain fat.",
      "Mix ricotta, 1 cup mozzarella, Parmesan, egg, Italian seasoning, and salt in bowl.",
      "Spray slow cooker with cooking spray.",
      "Spread 1/3 of meat sauce in bottom.",
      "Break lasagna noodles to fit, layer 1/3 over sauce.",
      "Spread 1/3 of cheese mixture over noodles.",
      "Repeat layers twice more.",
      "Top with remaining 1 cup mozzarella.",
      "Cover and cook on low 4 hours.",
      "Let rest 15 minutes before serving."
    ]
  },
  {
    id: "protein-beef-stroganoff",
    name: "Beef Stroganoff",
    description: "Creamy beef stroganoff with 30g protein per serving. Comfort food at its finest.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Russian",
    image: beefStroganoffProteinImg,
    totalTime: 35,
    tags: ["high-protein", "family-friendly", "easy-dinner"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "beef sirloin, sliced thin" ,
    nutrition: { calories: 168, protein: 12, carbs: 7, fat: 6, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "8", unit: "oz", item: "mushrooms, sliced" },
      { amount: "1", unit: "medium", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "cups", item: "beef broth" },
      { amount: "1", unit: "cup", item: "sour cream" },
      { amount: "2", unit: "tbsp", item: "flour" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "12", unit: "oz", item: "egg noodles" }
    ],
    instructions: [
      "Cook egg noodles according to package directions.",
      "Season beef with salt and pepper.",
      "Melt butter in large skillet over medium-high heat.",
      "Sear beef in batches, 2-3 minutes per side. Set aside.",
      "Add mushrooms and onion to skillet, cook 5 minutes.",
      "Add garlic, cook 1 minute.",
      "Sprinkle flour over vegetables, stir to coat.",
      "Gradually add beef broth, stirring constantly until thickened.",
      "Stir in paprika and sour cream.",
      "Return beef to skillet, simmer 5 minutes.",
      "Serve over egg noodles."
    ]
  },
  {
    id: "protein-chicken-quesadillas",
    name: "Chicken Quesadillas",
    description: "Crispy quesadillas with 28g protein per serving. Quick weeknight dinner winner.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Mexican",
    image: chickenQuesadillasImg,
    totalTime: 25,
    tags: ["high-protein", "family-friendly", "easy-dinner", "quick", "kid-friendly"],
    ingredients: [
      { amount: "2", unit: "cups", item: "cooked chicken, shredded" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "shredded Mexican cheese blend" },
      { amount: "8", unit: "", item: "flour tortillas (8 inch)" },
      { amount: "1", unit: "", item: "bell pepper, diced" },
      { amount: "1/2", unit: "cup", item: "diced onion" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "chili powder" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "cup", item: "salsa" },
      { amount: "1/2", unit: "cup", item: "sour cream" }
    ],
    instructions: [
      "Mix shredded chicken with bell pepper, onion, cumin, and chili powder.",
      "Heat large skillet over medium heat.",
      "Butter one side of tortilla and place butter-side down in skillet.",
      "Sprinkle 1/4 cup cheese on half the tortilla.",
      "Add 1/2 cup chicken mixture.",
      "Top with another 1/4 cup cheese.",
      "Fold tortilla in half.",
      "Cook 2-3 minutes per side until golden and cheese melts.",
      "Repeat with remaining tortillas.",
      "Cut into triangles and serve with salsa and sour cream."
    ]
  },
  {
    id: "protein-chicken-stir-fry-broccoli",
    name: "Chicken Stir Fry with Broccoli",
    description: "Quick Asian-style stir fry with 32g protein per serving. Better than takeout!",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/NDzyNgr.png",
    totalTime: 25,
    tags: ["high-protein", "family-friendly", "easy-dinner", "quick"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "chicken breast, sliced thin" ,
    nutrition: { calories: 205, protein: 12, carbs: 7, fat: 10, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "4", unit: "cups", item: "broccoli florets" },
      { amount: "1/4", unit: "cup", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "honey" },
      { amount: "2", unit: "tbsp", item: "cornstarch" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "fresh ginger, minced" },
      { amount: "2", unit: "tbsp", item: "vegetable oil" },
      { amount: "1/4", unit: "cup", item: "water" },
      { amount: "4", unit: "cups", item: "cooked rice" }
    ],
    instructions: [
      "Mix soy sauce, honey, cornstarch, and water in small bowl. Set aside.",
      "Heat 1 tbsp oil in large wok or skillet over high heat.",
      "Add chicken, stir fry 5-6 minutes until cooked through. Remove and set aside.",
      "Add remaining 1 tbsp oil to wok.",
      "Add broccoli, stir fry 3-4 minutes until tender-crisp.",
      "Add garlic and ginger, cook 30 seconds.",
      "Return chicken to wok.",
      "Pour sauce over everything, stir to coat.",
      "Cook 2 minutes until sauce thickens.",
      "Serve over rice."
    ]
  },
  {
    id: "protein-bbq-pulled-pork-bowls",
    name: "BBQ Pulled Pork Bowls",
    description: "Tender pulled pork bowls with 35g protein per serving. Meal prep favorite!",
    cookTime: "6 hours",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Healthy Bowls",
    image: "https://i.imgur.com/cMY4vN6.jpeg",
    totalTime: 375,
    tags: ["high-protein", "family-friendly", "easy-dinner", "meal-prep", "slow-cooker", "glutenfree"],
    ingredients: [
      { amount: "3", unit: "lbs", item: "pork shoulder" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "BBQ sauce" },
      { amount: "1/2", unit: "cup", item: "chicken broth" },
      { amount: "1", unit: "tbsp", item: "paprika" },
      { amount: "1", unit: "tbsp", item: "brown sugar" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "tsp", item: "onion powder" },
      { amount: "4", unit: "cups", item: "cooked rice" },
      { amount: "2", unit: "cups", item: "coleslaw" },
      { amount: "1", unit: "cup", item: "corn kernels" }
    ],
    instructions: [
      "Mix paprika, brown sugar, garlic powder, and onion powder.",
      "Rub spice mixture all over pork shoulder.",
      "Place pork in slow cooker.",
      "Pour chicken broth around (not over) pork.",
      "Cover and cook on low 8 hours or high 6 hours until very tender.",
      "Remove pork, shred with two forks.",
      "Discard excess liquid from slow cooker.",
      "Return shredded pork to slow cooker, mix with BBQ sauce.",
      "Assemble bowls with rice, pulled pork, coleslaw, and corn.",
      "Serve with extra BBQ sauce if desired."
    ]
  },
  {
    id: "protein-egg-roll-bowls",
    name: "Egg Roll Bowls",
    description: "Deconstructed egg rolls with 26g protein per serving. All the flavor, none of the frying!",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Healthy Bowls",
    image: "https://i.imgur.com/xK4cZtr.png",
    totalTime: 25,
    tags: ["high-protein", "family-friendly", "easy-dinner", "low-carb", "bowls"],
    nutrition: {
      calories: 295,
      protein: 26,
      carbs: 12,
      fat: 17,
      fiber: 3,
      sugar: 6,
      servingSize: "1 bowl"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "ground pork" },
      { amount: "1", unit: "bag", item: "coleslaw mix (14 oz)" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "fresh ginger, minced" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "sesame oil" },
      { amount: "1", unit: "tsp", item: "sriracha (optional)" },
      { amount: "4", unit: "", item: "green onions, sliced" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" }
    ],
    instructions: [
      "Heat large skillet over medium-high heat.",
      "Add ground pork, break up and cook 6-8 minutes until browned.",
      "Drain excess fat if needed.",
      "Add garlic and ginger, cook 1 minute.",
      "Add coleslaw mix to skillet, stir to combine.",
      "Pour soy sauce and sesame oil over everything.",
      "Cook 5-7 minutes, stirring occasionally, until cabbage is tender.",
      "Stir in sriracha if using.",
      "Serve in bowls topped with green onions and sesame seeds."
    ]
  },
  {
    id: "one-pot-marry-me-chicken-pasta",
    name: "Marry Me Chicken Pasta",
    description: "Creamy sun-dried tomato pasta with tender chicken. So good, it'll make them propose!",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Italian",
    image: "https://i.imgur.com/I5BLPNd.png",
    totalTime: 35,
    tags: ["one-pot", "pasta", "chicken", "creamy"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "chicken breast, cut into pieces" ,
    nutrition: { calories: 162, protein: 11, carbs: 8, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "12", unit: "oz", item: "penne pasta" },
      { amount: "3", unit: "cups", item: "chicken broth" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1/2", unit: "cup", item: "sun-dried tomatoes, chopped" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese, grated" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/4", unit: "cup", item: "fresh basil, chopped" }
    ],
    instructions: [
      "Heat olive oil in large pot over medium-high heat.",
      "Season chicken with salt and pepper, cook until golden, about 5-6 minutes. Remove and set aside.",
      "Add garlic to pot, saut? 1 minute.",
      "Add pasta, chicken broth, and sun-dried tomatoes.",
      "Bring to boil, reduce heat, cover and simmer 12-15 minutes until pasta is tender.",
      "Stir in heavy cream, parmesan, and Italian seasoning.",
      "Return chicken to pot, cook 2-3 minutes until heated through.",
      "Garnish with fresh basil and serve."
    ]
  },
  {
    id: "one-pot-french-onion-pasta",
    name: "One Pot French Onion Pasta",
    description: "All the flavors of French onion soup in a creamy pasta dish. Topped with melted gruyere.",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "French",
    image: "https://i.imgur.com/a4xu44q.png",
    totalTime: 40,
    tags: ["one-pot", "pasta", "vegetarian"],
    ingredients: [
      { amount: "3", unit: "large", item: "onions, thinly sliced" ,
    nutrition: { calories: 291, protein: 15, carbs: 18, fat: 12, fiber: 2, sugar: 5, servingSize: "1 serving (serves 4)" }},
      { amount: "12", unit: "oz", item: "pasta" },
      { amount: "4", unit: "cups", item: "beef or vegetable broth" },
      { amount: "1", unit: "cup", item: "gruyere cheese, shredded" },
      { amount: "3", unit: "tbsp", item: "butter" },
      { amount: "2", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "flour" },
      { amount: "1", unit: "tsp", item: "thyme" },
      { amount: "1/4", unit: "cup", item: "white wine (optional)" }
    ],
    instructions: [
      "Melt butter in large pot over medium heat.",
      "Add onions, cook 15-20 minutes until deeply caramelized, stirring occasionally.",
      "Add garlic and flour, cook 1 minute.",
      "Add wine (if using), cook until reduced by half.",
      "Add pasta, broth, and thyme.",
      "Bring to boil, reduce heat, simmer 10-12 minutes until pasta is tender.",
      "Top with gruyere cheese, cover until melted.",
      "Stir and serve."
    ]
  },
  {
    id: "one-pot-creamy-tomato-beef-pasta",
    name: "Creamy Tomato Beef Pasta",
    description: "Rich and creamy tomato sauce with seasoned ground beef. Comfort food at its finest.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Italian",
    image: onePotCreamyTomatoBeefPastaImg,
    totalTime: 35,
    tags: ["one-pot", "pasta", "beef"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" ,
    nutrition: { calories: 171, protein: 11, carbs: 8, fat: 5, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "12", unit: "oz", item: "penne pasta" },
      { amount: "1", unit: "can", item: "crushed tomatoes (28 oz)" },
      { amount: "2", unit: "cups", item: "beef broth" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1", unit: "onion", item: "diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/4", unit: "cup", item: "fresh basil" }
    ],
    instructions: [
      "Brown ground beef in large pot over medium-high heat, breaking it up. Drain excess fat.",
      "Add onion and garlic, cook 3 minutes until softened.",
      "Add pasta, crushed tomatoes, broth, and Italian seasoning.",
      "Bring to boil, reduce heat, cover and simmer 12-15 minutes until pasta is tender.",
      "Stir in heavy cream and parmesan cheese.",
      "Cook 2-3 minutes until creamy and heated through.",
      "Garnish with fresh basil and serve."
    ]
  },
  {
    id: "one-pot-cajun-shrimp-pasta",
    name: "Cajun Shrimp Pasta",
    description: "Spicy and creamy Cajun pasta with perfectly seasoned shrimp. Restaurant quality at home.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: onePotCajunShrimpPastaImg,
    totalTime: 30,
    tags: ["one-pot", "pasta", "seafood", "spicy", "glutenfree"],
    ingredients: [
      { amount: "1", unit: "lb", item: "large shrimp, peeled and deveined" ,
    nutrition: { calories: 264, protein: 15, carbs: 18, fat: 9, fiber: 2, sugar: 5, servingSize: "1 serving (serves 4)" }},
      { amount: "12", unit: "oz", item: "linguine" },
      { amount: "3", unit: "cups", item: "chicken broth" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1", unit: "bell pepper", item: "diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "Cajun seasoning" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1/4", unit: "cup", item: "parmesan cheese" },
      { amount: "2", unit: "tbsp", item: "fresh parsley" }
    ],
    instructions: [
      "Season shrimp with 1 tbsp Cajun seasoning.",
      "Melt butter in large pot, cook shrimp 2-3 minutes per side. Remove and set aside.",
      "Add bell pepper and garlic to pot, saut? 2 minutes.",
      "Add pasta, broth, and remaining Cajun seasoning.",
      "Bring to boil, reduce heat, simmer 10-12 minutes until pasta is tender.",
      "Stir in heavy cream and parmesan.",
      "Return shrimp to pot, cook 2 minutes until heated through.",
      "Garnish with parsley and serve."
    ]
  },
  {
    id: "one-pot-pasta-puttanesca",
    name: "One Pan Pasta Puttanesca",
    description: "Bold Italian pasta with olives, capers, and anchovies. Packed with flavor!",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/nk3QKxR.png",
    totalTime: 30,
    tags: ["one-pot", "pasta", "vegetarian"],
    nutrition: {
      calories: 420,
      protein: 14,
      carbs: 72,
      fat: 9,
      fiber: 6,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "12", unit: "oz", item: "spaghetti" },
      { amount: "1", unit: "can", item: "crushed tomatoes (28 oz)" },
      { amount: "2", unit: "cups", item: "water" },
      { amount: "1/2", unit: "cup", item: "kalamata olives, pitted and halved" },
      { amount: "1/4", unit: "cup", item: "capers" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "4", unit: "anchovy fillets", item: "chopped (optional)" },
      { amount: "1/4", unit: "cup", item: "olive oil" },
      { amount: "1", unit: "tsp", item: "red pepper flakes" },
      { amount: "1/4", unit: "cup", item: "fresh parsley" }
    ],
    instructions: [
      "Heat olive oil in large pot over medium heat.",
      "Add garlic, anchovies, and red pepper flakes, cook 2 minutes.",
      "Add spaghetti, crushed tomatoes, and water.",
      "Bring to boil, reduce heat, simmer 10-12 minutes, stirring occasionally.",
      "Add olives and capers, cook 2 more minutes.",
      "Garnish with fresh parsley and serve."
    ]
  },
  {
    id: "one-pot-pasta-primavera",
    name: "Pasta Primavera",
    description: "Light and fresh pasta with colorful spring vegetables. Healthy and delicious!",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/v0u8Ney.png",
    totalTime: 30,
    tags: ["one-pot", "pasta", "vegetarian", "healthy"],
    nutrition: {
      calories: 385,
      protein: 14,
      carbs: 68,
      fat: 7,
      fiber: 6,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "12", unit: "oz", item: "penne pasta" },
      { amount: "3", unit: "cups", item: "vegetable broth" },
      { amount: "1", unit: "cup", item: "cherry tomatoes, halved" },
      { amount: "1", unit: "zucchini", item: "diced" },
      { amount: "1", unit: "bell pepper", item: "diced" },
      { amount: "1", unit: "cup", item: "broccoli florets" },
      { amount: "1/2", unit: "cup", item: "peas" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "3", unit: "tbsp", item: "olive oil" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese" },
      { amount: "1/4", unit: "cup", item: "fresh basil" }
    ],
    instructions: [
      "Heat olive oil in large pot over medium heat.",
      "Add garlic, cook 1 minute.",
      "Add pasta, broth, and all vegetables except peas.",
      "Bring to boil, reduce heat, simmer 12-15 minutes until pasta and vegetables are tender.",
      "Stir in peas and parmesan cheese.",
      "Cook 2 minutes until heated through.",
      "Garnish with fresh basil and serve."
    ]
  },
  {
    id: "one-pot-spanish-chicken-rice",
    name: "One Pot Spanish Chicken and Rice",
    description: "Saffron-infused rice with tender chicken, olives, and peppers. Spanish comfort food!",
    cookTime: "35 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Spanish",
    image: "https://i.imgur.com/USR6Rfh.png",
    totalTime: 50,
    tags: ["one-pot", "chicken", "rice", "glutenfree"],
    nutrition: {
      calories: 465,
      protein: 32,
      carbs: 52,
      fat: 14,
      fiber: 3,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "6", unit: "", item: "chicken thighs, bone-in" },
      { amount: "2", unit: "cups", item: "long-grain rice" },
      { amount: "4", unit: "cups", item: "chicken broth" },
      { amount: "1", unit: "bell pepper", item: "diced" },
      { amount: "1", unit: "onion", item: "diced" },
      { amount: "1/2", unit: "cup", item: "green olives" },
      { amount: "1", unit: "cup", item: "peas" },
      { amount: "pinch", unit: "", item: "saffron threads" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tsp", item: "paprika" },
      { amount: "3", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Heat olive oil in large pot or paella pan over medium-high heat.",
      "Season chicken with salt, pepper, and paprika. Brown on both sides, about 5 minutes per side. Remove.",
      "Add onion and bell pepper, saut? 5 minutes.",
      "Add garlic, cook 1 minute.",
      "Add rice, stir to coat with oil.",
      "Add saffron to broth, then pour over rice.",
      "Nestle chicken pieces into rice.",
      "Bring to boil, reduce heat to low, cover and simmer 25-30 minutes.",
      "Add olives and peas in last 5 minutes.",
      "Let rest 5 minutes before serving."
    ]
  },
  {
    id: "one-pot-mexican-chicken-rice",
    name: "Mexican Chicken & Rice",
    description: "Seasoned chicken with rice, black beans, and corn. Topped with cheese and avocado!",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Mexican",
    image: onePotMexicanChickenRiceImg,
    totalTime: 40,
    tags: ["one-pot", "chicken", "rice", "mexican", "glutenfree"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "chicken breast, diced" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "long-grain rice" },
      { amount: "3.5", unit: "cups", item: "chicken broth" },
      { amount: "1", unit: "can", item: "black beans, drained" },
      { amount: "1", unit: "cup", item: "corn kernels" },
      { amount: "1", unit: "can", item: "diced tomatoes with green chiles" },
      { amount: "1", unit: "cup", item: "shredded cheddar cheese" },
      { amount: "2", unit: "tbsp", item: "taco seasoning" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "1/4", unit: "cup", item: "fresh cilantro" }
    ],
    instructions: [
      "Heat olive oil in large pot over medium-high heat.",
      "Season chicken with taco seasoning, cook until browned, about 6-7 minutes.",
      "Add rice, stir to coat.",
      "Add broth, black beans, corn, and diced tomatoes.",
      "Bring to boil, reduce heat to low, cover and simmer 20 minutes.",
      "Sprinkle cheese on top, cover until melted.",
      "Top with avocado slices and cilantro before serving."
    ]
  },
  {
    id: "one-pot-marry-me-chicken",
    name: "Marry Me Chicken",
    description: "The original! Pan-seared chicken in creamy sun-dried tomato sauce. Legendary.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Italian",
    image: "https://i.imgur.com/fzdXOOm.png",
    totalTime: 35,
    tags: ["one-pot", "chicken", "creamy", "glutenfree"],
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1/2", unit: "cup", item: "chicken broth" },
      { amount: "1/2", unit: "cup", item: "sun-dried tomatoes, chopped" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese, grated" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1", unit: "tsp", item: "red pepper flakes" },
      { amount: "1/4", unit: "cup", item: "fresh basil" }
    ],
    instructions: [
      "Heat olive oil in large skillet over medium-high heat.",
      "Season chicken with salt and pepper, cook 5-6 minutes per side until golden. Remove.",
      "Add garlic to skillet, saut? 1 minute.",
      "Add sun-dried tomatoes, chicken broth, and Italian seasoning.",
      "Stir in heavy cream and parmesan, bring to simmer.",
      "Return chicken to skillet, spoon sauce over chicken.",
      "Simmer 10 minutes until chicken is cooked through and sauce thickens.",
      "Garnish with basil and red pepper flakes, serve."
    ]
  },
  {
    id: "one-pot-chicken-garlic-rice",
    name: "One Pot Chicken and Garlic Rice",
    description: "Simple yet flavorful chicken over perfectly cooked garlic-infused rice.",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Asian",
    image: onePotChickenGarlicRiceImg,
    totalTime: 40,
    tags: ["one-pot", "chicken", "rice"],
    ingredients: [
      { amount: "6", unit: "", item: "chicken thighs, bone-in" ,
    nutrition: { calories: 210, protein: 12, carbs: 7, fat: 11, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "jasmine rice" },
      { amount: "3", unit: "cups", item: "chicken broth" },
      { amount: "8", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "sesame oil" },
      { amount: "4", unit: "", item: "green onions, sliced" }
    ],
    instructions: [
      "Heat butter in large pot over medium-high heat.",
      "Season chicken with salt and pepper, brown on both sides. Remove.",
      "Add garlic to pot, saut? 2 minutes until fragrant.",
      "Add rice, stir to coat with garlic butter.",
      "Add chicken broth, soy sauce, and sesame oil.",
      "Nestle chicken pieces into rice.",
      "Bring to boil, reduce heat to low, cover and simmer 25-30 minutes.",
      "Let rest 5 minutes, garnish with green onions and serve."
    ]
  },
  {
    id: "one-pot-chicken-rice-vegetables",
    name: "Chicken and Rice with Vegetables",
    description: "Complete one-pot meal with chicken, rice, and colorful veggies. Healthy and easy!",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: onePotChickenRiceVegetablesImg,
    totalTime: 40,
    tags: ["one-pot", "chicken", "rice", "healthy", "glutenfree"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "chicken breast, diced" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "long-grain rice" },
      { amount: "3.5", unit: "cups", item: "chicken broth" },
      { amount: "2", unit: "cups", item: "broccoli florets" },
      { amount: "2", unit: "", item: "carrots, sliced" },
      { amount: "1", unit: "cup", item: "peas" },
      { amount: "1", unit: "onion", item: "diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "tsp", item: "thyme" }
    ],
    instructions: [
      "Heat olive oil in large pot over medium-high heat.",
      "Season chicken with salt, pepper, and thyme. Cook until browned.",
      "Add onion and garlic, saut? 3 minutes.",
      "Add rice, stir to coat.",
      "Add chicken broth and carrots.",
      "Bring to boil, reduce heat to low, cover and simmer 15 minutes.",
      "Add broccoli and peas, cook 5 more minutes until rice is tender.",
      "Let rest 5 minutes before serving."
    ]
  },
  {
    id: "one-pot-greek-chicken-lemon-rice",
    name: "Greek Chicken and Lemon Rice",
    description: "Bright Mediterranean flavors with lemon, olives, and feta. Transport yourself to Greece!",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Greek",
    image: onePotGreekChickenLemonRiceImg,
    totalTime: 40,
    tags: ["one-pot", "chicken", "rice", "mediterranean", "glutenfree"],
    ingredients: [
      { amount: "6", unit: "", item: "chicken thighs" ,
    nutrition: { calories: 193, protein: 11, carbs: 12, fat: 7, fiber: 1, sugar: 4, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "long-grain rice" },
      { amount: "3.5", unit: "cups", item: "chicken broth" },
      { amount: "1/2", unit: "cup", item: "kalamata olives" },
      { amount: "1/2", unit: "cup", item: "feta cheese, crumbled" },
      { amount: "2", unit: "", item: "lemons (juice and zest)" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "tsp", item: "oregano" },
      { amount: "1/4", unit: "cup", item: "fresh dill" }
    ],
    instructions: [
      "Heat olive oil in large pot over medium-high heat.",
      "Season chicken with oregano, salt, and pepper. Brown on both sides. Remove.",
      "Add garlic, saut? 1 minute.",
      "Add rice, stir to coat.",
      "Add chicken broth, lemon juice, and lemon zest.",
      "Nestle chicken into rice.",
      "Bring to boil, reduce heat to low, cover and simmer 25 minutes.",
      "Add olives in last 5 minutes.",
      "Top with feta and fresh dill before serving."
    ]
  },
  {
    id: "one-pot-chicken-gnocchi-soup",
    name: "Chicken Gnocchi Soup",
    description: "Creamy, comforting soup with pillowy gnocchi and tender chicken. Better than Olive Garden!",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Italian",
    image: "https://i.imgur.com/OGUHsDz.png",
    totalTime: 35,
    tags: ["one-pot", "soup", "chicken", "creamy", "glutenfree"],
    ingredients: [
      { amount: "1", unit: "lb", item: "chicken breast, diced" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "package", item: "potato gnocchi (16 oz)" },
      { amount: "4", unit: "cups", item: "chicken broth" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "2", unit: "cups", item: "fresh spinach" },
      { amount: "2", unit: "", item: "carrots, diced" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "tsp", item: "thyme" }
    ],
    instructions: [
      "Melt butter in large pot over medium heat.",
      "Add chicken, cook until browned. Remove.",
      "Add onion, carrots, and garlic, saut? 5 minutes.",
      "Add chicken broth and thyme, bring to boil.",
      "Add gnocchi, cook 3-4 minutes until they float.",
      "Return chicken to pot.",
      "Stir in heavy cream and spinach, cook until spinach wilts.",
      "Season with salt and pepper, serve hot."
    ]
  },
  {
    id: "one-pot-spinach-beef-soup",
    name: "Spinach Beef Soup",
    description: "Hearty Italian soup with ground beef, fresh spinach, and pasta in rich tomato broth.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Italian",
    image: onePotSpinachBeefSoupImg,
    totalTime: 35,
    tags: ["one-pot", "soup", "beef"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" ,
    nutrition: { calories: 150, protein: 11, carbs: 11, fat: 7, fiber: 1, sugar: 3, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "cup", item: "ditalini or small pasta" },
      { amount: "4", unit: "cups", item: "beef broth" },
      { amount: "1", unit: "can", item: "diced tomatoes (14 oz)" },
      { amount: "4", unit: "cups", item: "fresh spinach" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese" }
    ],
    instructions: [
      "Brown ground beef in large pot over medium-high heat. Drain excess fat.",
      "Add onion and garlic, cook 3 minutes.",
      "Add beef broth, diced tomatoes, and Italian seasoning.",
      "Bring to boil, add pasta.",
      "Reduce heat, simmer 10 minutes until pasta is tender.",
      "Stir in spinach, cook until wilted.",
      "Serve topped with parmesan cheese."
    ]
  },
  {
    id: "one-pot-coconut-curry-lentil-soup",
    name: "Coconut Curry Lentil Soup",
    description: "Creamy and spiced lentil soup with coconut milk. Vegan and absolutely delicious!",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: onePotCoconutCurryLentilSoupImg,
    totalTime: 40,
    tags: ["one-pot", "soup", "vegan", "glutenfree"],
    ingredients: [
      { amount: "1.5", unit: "cups", item: "red lentils" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "1", unit: "can", item: "coconut milk (14 oz)" },
      { amount: "4", unit: "cups", item: "vegetable broth" },
      { amount: "2", unit: "cups", item: "spinach" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tbsp", item: "fresh ginger, minced" },
      { amount: "2", unit: "tbsp", item: "curry powder" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "", item: "lime, juiced" },
      { amount: "1/4", unit: "cup", item: "fresh cilantro" }
    ],
    instructions: [
      "Heat olive oil in large pot over medium heat.",
      "Add onion, garlic, and ginger, saut? 5 minutes.",
      "Add curry powder, cook 1 minute until fragrant.",
      "Add lentils and vegetable broth.",
      "Bring to boil, reduce heat, simmer 20 minutes until lentils are tender.",
      "Stir in coconut milk and spinach, cook until spinach wilts.",
      "Add lime juice, season with salt and pepper.",
      "Garnish with cilantro and serve."
    ]
  },
  {
    id: "one-pot-chicken-pot-pie-chowder",
    name: "Chicken Pot Pie Chowder",
    description: "All the comfort of chicken pot pie in soup form. Topped with flaky pastry!",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: onePotChickenPotPieChowderImg,
    totalTime: 45,
    tags: ["one-pot", "soup", "chicken", "comfort-food"],
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "chicken breast, diced" ,
    nutrition: { calories: 150, protein: 5, carbs: 7, fat: 6, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "4", unit: "cups", item: "chicken broth" },
      { amount: "2", unit: "cups", item: "heavy cream" },
      { amount: "3", unit: "", item: "potatoes, diced" },
      { amount: "2", unit: "", item: "carrots, diced" },
      { amount: "1", unit: "cup", item: "peas" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "3", unit: "tbsp", item: "butter" },
      { amount: "1/4", unit: "cup", item: "flour" },
      { amount: "1", unit: "sheet", item: "puff pastry" },
      { amount: "1", unit: "tsp", item: "thyme" }
    ],
    instructions: [
      "Preheat oven to 400?F. Cut puff pastry into rounds, bake 15 minutes until golden.",
      "Melt butter in large pot over medium heat.",
      "Add chicken, cook until browned. Remove.",
      "Add onion and garlic, saut? 3 minutes.",
      "Sprinkle flour, stir and cook 2 minutes.",
      "Gradually add chicken broth, stirring constantly.",
      "Add potatoes, carrots, and thyme. Simmer 15 minutes until vegetables are tender.",
      "Return chicken to pot, add peas and heavy cream.",
      "Cook 5 minutes until heated through.",
      "Serve in bowls topped with puff pastry rounds."
    ]
  },
  {
    id: "one-pot-braised-short-ribs",
    name: "Braised Short Ribs",
    description: "Fall-off-the-bone tender short ribs in rich red wine sauce. Special occasion worthy!",
    cookTime: "2.5 hours",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "French",
    image: onePotBraisedShortRibsImg,
    totalTime: 170,
    tags: ["one-pot", "beef", "slow-cooked", "glutenfree"],
    ingredients: [
      { amount: "3", unit: "lbs", item: "beef short ribs" ,
    nutrition: { calories: 150, protein: 5, carbs: 6, fat: 3, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "red wine" },
      { amount: "2", unit: "cups", item: "beef broth" },
      { amount: "3", unit: "", item: "carrots, cut into chunks" },
      { amount: "2", unit: "", item: "onions, quartered" },
      { amount: "4", unit: "cloves", item: "garlic, crushed" },
      { amount: "2", unit: "tbsp", item: "tomato paste" },
      { amount: "2", unit: "sprigs", item: "fresh thyme" },
      { amount: "2", unit: "", item: "bay leaves" },
      { amount: "3", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Season short ribs generously with salt and pepper.",
      "Heat olive oil in large Dutch oven over medium-high heat.",
      "Brown short ribs on all sides, about 10 minutes total. Remove.",
      "Add onions and carrots, cook 5 minutes.",
      "Add garlic and tomato paste, cook 2 minutes.",
      "Add red wine, scrape up browned bits, simmer 5 minutes.",
      "Add beef broth, thyme, and bay leaves.",
      "Return ribs to pot, liquid should come halfway up the ribs.",
      "Bring to boil, cover, transfer to 325?F oven or reduce heat to low.",
      "Braise 2.5-3 hours until meat is fall-apart tender.",
      "Remove thyme sprigs and bay leaves before serving."
    ]
  },
  {
    id: "one-pot-sausage-potato-gravy",
    name: "Sausage Bake with Potatoes and Gravy",
    description: "Hearty one-pan dinner with sausages, potatoes, and rich gravy. Pure comfort!",
    cookTime: "40 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "British",
    image: "https://i.imgur.com/YXC8wdT.png",
    totalTime: 55,
    tags: ["one-pot", "sausage", "comfort-food"],
    ingredients: [
      { amount: "6", unit: "", item: "large sausages" ,
    nutrition: { calories: 173, protein: 10, carbs: 6, fat: 8, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "6", unit: "", item: "potatoes, quartered" },
      { amount: "2", unit: "", item: "onions, sliced" },
      { amount: "2", unit: "cups", item: "beef broth" },
      { amount: "2", unit: "tbsp", item: "flour" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "tbsp", item: "Worcestershire sauce" },
      { amount: "2", unit: "tsp", item: "thyme" },
      { amount: "2", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Preheat oven to 400?F.",
      "Heat olive oil in large oven-safe skillet or roasting pan.",
      "Brown sausages on all sides, about 8 minutes. Remove.",
      "Add potatoes and onions to pan, season with salt, pepper, and thyme.",
      "Roast 20 minutes, stirring once.",
      "Return sausages to pan, roast 15 more minutes.",
      "Meanwhile, melt butter in small saucepan, whisk in flour.",
      "Gradually add beef broth, whisking constantly.",
      "Add Worcestershire sauce, simmer until thickened.",
      "Pour gravy over sausages and potatoes, serve hot."
    ]
  },
  {
    id: "one-pot-beef-taco-skillet",
    name: "Beef Taco Skillet",
    description: "One-pan taco night with seasoned beef, rice, beans, and all the toppings!",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Mexican",
    image: onePotBeefTacoSkilletImg,
    totalTime: 35,
    tags: ["one-pot", "beef", "mexican", "easy-dinner", "glutenfree"],
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" ,
    nutrition: { calories: 150, protein: 10, carbs: 6, fat: 4, fiber: 1, sugar: 2, servingSize: "1 serving (serves 4)" }},
      { amount: "2", unit: "cups", item: "long-grain rice" },
      { amount: "3", unit: "cups", item: "beef broth" },
      { amount: "1", unit: "can", item: "black beans, drained" },
      { amount: "1", unit: "can", item: "corn, drained" },
      { amount: "1", unit: "can", item: "diced tomatoes with green chiles" },
      { amount: "2", unit: "cups", item: "shredded cheddar cheese" },
      { amount: "2", unit: "tbsp", item: "taco seasoning" },
      { amount: "1", unit: "cup", item: "lettuce, shredded" },
      { amount: "1", unit: "cup", item: "tomatoes, diced" },
      { amount: "1/2", unit: "cup", item: "sour cream" }
    ],
    instructions: [
      "Brown ground beef in large skillet over medium-high heat. Drain excess fat.",
      "Add taco seasoning, stir to coat beef.",
      "Add rice, stir to coat.",
      "Add beef broth, black beans, corn, and diced tomatoes.",
      "Bring to boil, reduce heat to low, cover and simmer 20 minutes.",
      "Sprinkle cheese on top, cover until melted.",
      "Top with lettuce, tomatoes, and sour cream before serving."
    ]
  },
  
  // ========== VEGETARIAN/VEGAN RECIPES (24) ==========
  // DINNER (13)
  {
    id: "dinner-vegetarian-lasagna",
    name: "Vegetarian Lasagna",
    description: "Layers of pasta with ricotta, vegetables, and melted cheese. Comfort food perfected.",
    cookTime: "45 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Italian",
    image: "https://i.imgur.com/SFu43aU.png",
    totalTime: 75,
    tags: ["dinner", "vegetarian", "italian", "comfort-food", "plant-based"],
    nutrition: {
      calories: 420,
      protein: 22,
      carbs: 48,
      fat: 16,
      fiber: 6,
      sugar: 8,
      servingSize: "1 slice"
    },
    ingredients: [
      { amount: "12", unit: "", item: "lasagna noodles" },
      { amount: "2", unit: "cups", item: "ricotta cheese" },
      { amount: "2", unit: "cups", item: "shredded mozzarella" },
      { amount: "1", unit: "cup", item: "parmesan cheese" },
      { amount: "4", unit: "cups", item: "marinara sauce" },
      { amount: "2", unit: "cups", item: "fresh spinach, chopped" },
      { amount: "1", unit: "", item: "zucchini, sliced" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1/4", unit: "cup", item: "fresh basil, chopped" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" }
    ],
    instructions: [
      "Preheat oven to 375?F. Cook [12 lasagna noodles] according to package.",
      "Mix [2 cups ricotta], [2 eggs], [1/4 cup basil], and [2 tsp Italian seasoning].",
      "Spread 1 cup [marinara sauce] in 9x13 baking dish.",
      "Layer: 4 noodles, half ricotta mixture, [1 cup spinach], [zucchini], [1 cup mozzarella], 1 cup sauce.",
      "Repeat layers once more.",
      "Top with remaining 4 noodles, sauce, [1 cup parmesan].",
      "Cover with foil, bake 30 minutes. Remove foil, bake 15 more minutes until golden.",
      "Let rest 10 minutes before serving."
    ]
  },
  {
    id: "dinner-vegetarian-chili",
    name: "Vegetarian Chili",
    description: "Hearty bean chili packed with vegetables and bold spices. Crowd-pleaser.",
    cookTime: "40 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/StJIBqq.png",
    totalTime: 55,
    tags: ["one-pot", "vegetarian", "comfort-food", "plant-based", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 52,
      fat: 6,
      fiber: 16,
      sugar: 10,
      servingSize: "1.5 cups"
    },
    ingredients: [
      { amount: "2", unit: "cans", item: "kidney beans, drained" },
      { amount: "1", unit: "can", item: "black beans, drained" },
      { amount: "1", unit: "can", item: "diced tomatoes" },
      { amount: "2", unit: "", item: "bell peppers, diced" },
      { amount: "1", unit: "", item: "large onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "chili powder" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "cup", item: "vegetable broth" },
      { amount: "", unit: "", item: "Toppings: sour cream, cilantro, cheese" }
    ],
    instructions: [
      "Saut? [onion] and [bell peppers] in large pot for 5 minutes.",
      "Add [garlic], [2 tbsp chili powder], [1 tsp cumin], cook 1 minute.",
      "Add [kidney beans], [black beans], [tomatoes], [1 cup broth].",
      "Bring to boil, reduce heat, simmer 30 minutes stirring occasionally.",
      "Season with salt and pepper to taste.",
      "Serve hot with [sour cream], [cilantro], and [cheese]."
    ]
  },
  {
    id: "dinner-veggie-burgers",
    name: "Veggie Burgers",
    description: "Homemade veggie patties that actually hold together. Better than store-bought.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Dinner",
    image: "https://i.imgur.com/PdA4c4F.png",
    totalTime: 35,
    tags: ["dinner", "vegetarian", "plant-based"],
    nutrition: {
      calories: 380,
      protein: 16,
      carbs: 48,
      fat: 14,
      fiber: 8,
      sugar: 6,
      servingSize: "1 burger"
    },
    ingredients: [
      { amount: "1", unit: "can", item: "black beans, drained" },
      { amount: "1", unit: "cup", item: "cooked quinoa" },
      { amount: "1/2", unit: "cup", item: "breadcrumbs" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "1/2", unit: "cup", item: "diced onion" },
      { amount: "6", unit: "", item: "burger buns" },
      { amount: "", unit: "", item: "Toppings: lettuce, tomato, onion, pickles" }
    ],
    instructions: [
      "Mash [black beans] in bowl, leave some chunks.",
      "Mix in [1 cup quinoa], [breadcrumbs], [egg], [cumin], [paprika], [onion].",
      "Form into 6 patties. Refrigerate 15 minutes to firm up.",
      "Heat oil in skillet over medium heat.",
      "Cook patties 5-7 minutes per side until golden and crispy.",
      "Toast [buns] if desired.",
      "Serve on buns with [lettuce], [tomato], [onion], and [pickles]."
    ]
  },
  {
    id: "dinner-eggplant-parmesan",
    name: "Eggplant Parmesan",
    description: "Breaded eggplant with marinara and melted cheese. Italian classic.",
    cookTime: "35 mins",
    prepTime: "25 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Italian",
    image: "https://i.imgur.com/wDCEibt.png",
    totalTime: 60,
    tags: ["dinner", "vegetarian", "italian", "comfort-food"],
    nutrition: {
      calories: 390,
      protein: 18,
      carbs: 38,
      fat: 18,
      fiber: 8,
      sugar: 10,
      servingSize: "2 slices"
    },
    ingredients: [
      { amount: "2", unit: "", item: "large eggplants, sliced 1/2 inch" },
      { amount: "2", unit: "cups", item: "breadcrumbs" },
      { amount: "1", unit: "cup", item: "parmesan cheese, divided" },
      { amount: "3", unit: "", item: "eggs, beaten" },
      { amount: "3", unit: "cups", item: "marinara sauce" },
      { amount: "2", unit: "cups", item: "shredded mozzarella" },
      { amount: "1/4", unit: "cup", item: "fresh basil" },
      { amount: "1", unit: "cup", item: "flour" }
    ],
    instructions: [
      "Preheat oven to 400?F. Salt [eggplant slices], let sit 20 minutes, pat dry.",
      "Set up breading station: [flour], [eggs], [breadcrumbs] mixed with [1/2 cup parmesan].",
      "Coat each eggplant slice in flour, egg, then breadcrumb mixture.",
      "Place on baking sheet, bake 20 minutes until golden.",
      "Spread 1 cup [marinara] in baking dish.",
      "Layer eggplant, remaining [marinara], [mozzarella], [1/2 cup parmesan].",
      "Bake 15 minutes until cheese is bubbly and golden.",
      "Garnish with [fresh basil] before serving."
    ]
  },
  {
    id: "dinner-butter-chickpeas",
    name: "Indian Butter Chickpeas",
    description: "Creamy tomato curry with tender chickpeas. Restaurant-quality flavor.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Lunch",
    image: butterChickpeasImg,
    totalTime: 35,
    tags: ["dinner", "vegetarian", "indian", "healthy", "plant-based", "glutenfree"],
    nutrition: {
      calories: 340,
      protein: 14,
      carbs: 42,
      fat: 14,
      fiber: 10,
      sugar: 8,
      servingSize: "1.5 cups"
    },
    ingredients: [
      { amount: "2", unit: "cans", item: "chickpeas, drained" },
      { amount: "1", unit: "can", item: "tomato sauce" },
      { amount: "1", unit: "cup", item: "coconut cream" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "garam masala" },
      { amount: "1", unit: "tsp", item: "turmeric" },
      { amount: "1/4", unit: "cup", item: "cilantro" }
    ],
    instructions: [
      "Melt [2 tbsp butter] in large pan, saut? [onion] until soft.",
      "Add [garlic], [2 tbsp garam masala], [1 tsp turmeric], cook 1 minute.",
      "Pour in [tomato sauce], simmer 5 minutes.",
      "Add [chickpeas] and [coconut cream], stir well.",
      "Simmer 15 minutes until sauce thickens.",
      "Season with salt to taste.",
      "Garnish with [cilantro], serve with rice and naan."
    ]
  },
  {
    id: "dinner-miso-mushroom-rice",
    name: "Miso Mushroom Crispy Rice",
    description: "Pan-fried rice with umami mushrooms. Japanese-inspired perfection.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Japanese",
    image: "https://i.imgur.com/tGfRFTP.png",
    totalTime: 35,
    tags: ["dinner", "vegetarian", "asian", "healthy", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 12,
      carbs: 58,
      fat: 12,
      fiber: 4,
      sugar: 6,
      servingSize: "1.5 cups"
    },
    ingredients: [
      { amount: "3", unit: "cups", item: "cooked rice, day-old preferred" },
      { amount: "8", unit: "oz", item: "mixed mushrooms, sliced" },
      { amount: "3", unit: "tbsp", item: "white miso paste" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "sesame oil" },
      { amount: "2", unit: "", item: "green onions, sliced" },
      { amount: "1", unit: "tbsp", item: "sesame seeds" },
      { amount: "2", unit: "tbsp", item: "vegetable oil" }
    ],
    instructions: [
      "Mix [3 tbsp miso] with [2 tbsp soy sauce] and 2 tbsp water.",
      "Heat [2 tbsp oil] in large skillet over high heat.",
      "Add [rice], press down, cook 5 minutes without stirring until crispy bottom forms.",
      "Add [mushrooms], cook 5 minutes until golden.",
      "Drizzle [sesame oil] and miso mixture, toss to coat.",
      "Cook 2 more minutes until heated through.",
      "Top with [green onions] and [sesame seeds] before serving."
    ]
  },
  {
    id: "dinner-coconut-vegetable-curry",
    name: "Coconut Vegetable Curry",
    description: "Creamy Thai curry with colorful vegetables. Restaurant quality at home.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/JfzSovd.png",
    totalTime: 40,
    tags: ["one-pot", "vegetarian", "vegan", "thai", "plant-based", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 8,
      carbs: 38,
      fat: 16,
      fiber: 6,
      sugar: 10,
      servingSize: "1.5 cups"
    },
    ingredients: [
      { amount: "1", unit: "can", item: "coconut milk" },
      { amount: "2", unit: "tbsp", item: "red curry paste" },
      { amount: "2", unit: "", item: "bell peppers, sliced" },
      { amount: "2", unit: "", item: "carrots, sliced" },
      { amount: "1", unit: "", item: "cauliflower, florets" },
      { amount: "2", unit: "", item: "potatoes, cubed" },
      { amount: "1", unit: "cup", item: "vegetable broth" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "brown sugar" },
      { amount: "1/4", unit: "cup", item: "fresh basil" }
    ],
    instructions: [
      "Heat [curry paste] in large pot for 1 minute until fragrant.",
      "Add [coconut milk], [1 cup broth], [2 tbsp soy sauce], [1 tbsp sugar].",
      "Bring to simmer, add [potatoes], cook 10 minutes.",
      "Add [bell peppers], [carrots], [cauliflower], simmer 15 minutes.",
      "Vegetables should be tender but not mushy.",
      "Stir in [fresh basil].",
      "Serve over jasmine rice."
    ]
  },
  {
    id: "dinner-broccoli-cheddar-chickpea-skillet",
    name: "Broccoli Cheddar Chickpea Skillet",
    description: "One-pan wonder with roasted broccoli and melted cheese. Quick and satisfying.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/6fDz7x6.png",
    totalTime: 30,
    tags: ["one-pot", "vegetarian", "plant-based", "glutenfree"],
    nutrition: {
      calories: 340,
      protein: 18,
      carbs: 32,
      fat: 16,
      fiber: 10,
      sugar: 4,
      servingSize: "1.5 cups"
    },
    ingredients: [
      { amount: "1", unit: "", item: "large head broccoli, florets" },
      { amount: "2", unit: "cans", item: "chickpeas, drained" },
      { amount: "2", unit: "cups", item: "sharp cheddar, shredded" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "tsp", item: "paprika" },
      { amount: "1/2", unit: "tsp", item: "red pepper flakes" }
    ],
    instructions: [
      "Heat [2 tbsp oil] in large oven-safe skillet over medium-high heat.",
      "Add [broccoli] and [chickpeas], season with [paprika] and [pepper flakes].",
      "Cook 10 minutes, stirring occasionally, until broccoli is tender-crisp.",
      "Add [garlic], cook 1 minute.",
      "Top with [cheddar cheese].",
      "Place under broiler 3-5 minutes until cheese is bubbly and golden.",
      "Serve immediately."
    ]
  },
  {
    id: "dinner-mushroom-ramen",
    name: "Mushroom Ramen",
    description: "Rich broth with noodles and umami mushrooms. Comfort in a bowl.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Japanese",
    image: "https://i.imgur.com/oa8u0T4.png",
    totalTime: 40,
    tags: ["dinner", "vegetarian", "asian", "comfort-food"],
    nutrition: {
      calories: 380,
      protein: 16,
      carbs: 52,
      fat: 12,
      fiber: 6,
      sugar: 6,
      servingSize: "1 large bowl"
    },
    ingredients: [
      { amount: "6", unit: "cups", item: "vegetable broth" },
      { amount: "8", unit: "oz", item: "ramen noodles" },
      { amount: "8", unit: "oz", item: "shiitake mushrooms, sliced" },
      { amount: "4", unit: "oz", item: "oyster mushrooms" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "miso paste" },
      { amount: "2", unit: "", item: "green onions, sliced" },
      { amount: "1", unit: "sheet", item: "nori seaweed" }
    ],
    instructions: [
      "Bring [6 cups broth] to boil. Whisk in [2 tbsp miso] and [3 tbsp soy sauce].",
      "Add [mushrooms], simmer 10 minutes.",
      "Cook [ramen noodles] according to package, drain.",
      "Soft boil [eggs] 6 minutes, peel and halve.",
      "Divide noodles into bowls.",
      "Ladle hot broth and mushrooms over noodles.",
      "Top each bowl with [egg], [green onions], and [nori].",
      "Serve immediately."
    ]
  },
  {
    id: "dinner-veggie-stuffed-peppers",
    name: "Veggie Stuffed Peppers",
    description: "Bell peppers filled with quinoa, beans, and melted cheese. Colorful and healthy.",
    cookTime: "40 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Dinner",
      image: "https://i.imgur.com/CVjcutW.png",
    totalTime: 60,
    tags: ["dinner", "vegetarian", "plant-based", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 14,
      carbs: 42,
      fat: 10,
      fiber: 10,
      sugar: 8,
      servingSize: "1 stuffed pepper"
    },
    ingredients: [
      { amount: "6", unit: "", item: "bell peppers, tops removed" },
      { amount: "2", unit: "cups", item: "cooked quinoa" },
      { amount: "1", unit: "can", item: "black beans, drained" },
      { amount: "1", unit: "cup", item: "corn kernels" },
      { amount: "1", unit: "can", item: "diced tomatoes" },
      { amount: "1", unit: "cup", item: "shredded cheddar" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "chili powder" }
    ],
    instructions: [
      "Preheat oven to 375?F. Cut tops off [peppers], remove seeds.",
      "Mix [2 cups quinoa], [black beans], [corn], [tomatoes], [cumin], [chili powder].",
      "Stuff [peppers] with quinoa mixture.",
      "Place in baking dish, add 1/4 cup water to bottom.",
      "Cover with foil, bake 30 minutes.",
      "Remove foil, top with [cheddar].",
      "Bake 10 more minutes until cheese melts.",
      "Let cool 5 minutes before serving."
    ]
  },
  {
    id: "dinner-black-bean-tacos",
    name: "Black Bean Tacos",
    description: "Seasoned black beans with fresh toppings. Mexican street food at home.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch",
    image: "https://i.imgur.com/v0KaPNA.png",
    totalTime: 25,
    tags: ["dinner", "vegetarian", "vegan", "mexican", "quick", "plant-based", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 16,
      carbs: 58,
      fat: 10,
      fiber: 14,
      sugar: 4,
      servingSize: "3 tacos"
    },
    ingredients: [
      { amount: "2", unit: "cans", item: "black beans, drained" },
      { amount: "12", unit: "", item: "corn tortillas" },
      { amount: "1", unit: "cup", item: "pico de gallo" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "1", unit: "cup", item: "shredded lettuce" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "chili powder" },
      { amount: "2", unit: "", item: "limes, cut into wedges" }
    ],
    instructions: [
      "Heat [black beans] in pot with [cumin] and [chili powder].",
      "Mash about half the beans with fork for creamy texture.",
      "Warm [tortillas] in dry skillet or microwave.",
      "Divide bean mixture among tortillas.",
      "Top with [lettuce], [pico de gallo], and [avocado].",
      "Serve with [lime wedges] on the side.",
      "Add hot sauce if desired."
    ]
  },
  {
    id: "dinner-crispy-baked-falafel",
    name: "Crispy Baked Falafel",
    description: "Golden falafel balls with tahini sauce. Middle Eastern classic.",
    cookTime: "25 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Dinner",
    image: "https://i.imgur.com/HvIYVC3.png",
    totalTime: 45,
    tags: ["dinner", "vegetarian", "vegan", "middle-eastern", "plant-based"],
    nutrition: {
      calories: 340,
      protein: 14,
      carbs: 42,
      fat: 14,
      fiber: 10,
      sugar: 4,
      servingSize: "4 falafel"
    },
    ingredients: [
      { amount: "2", unit: "cans", item: "chickpeas, drained" },
      { amount: "1", unit: "", item: "onion, chopped" },
      { amount: "4", unit: "cloves", item: "garlic" },
      { amount: "1", unit: "cup", item: "fresh parsley" },
      { amount: "2", unit: "tsp", item: "cumin" },
      { amount: "1", unit: "tsp", item: "coriander" },
      { amount: "1/4", unit: "cup", item: "flour" },
      { amount: "1/2", unit: "cup", item: "tahini sauce" },
      { amount: "2", unit: "", item: "lemons, juiced" }
    ],
    instructions: [
      "Preheat oven to 400?F. Line baking sheet with parchment.",
      "Pulse [chickpeas], [onion], [garlic], [parsley], [cumin], [coriander] in food processor.",
      "Add [flour], pulse until mixture holds together.",
      "Form into 24 small balls, place on baking sheet.",
      "Brush with oil, bake 25 minutes, flipping halfway, until golden.",
      "Mix [tahini] with [lemon juice] and water for sauce.",
      "Serve falafel with tahini sauce and vegetables."
    ]
  },
  {
    id: "dinner-red-lentil-dahl",
    name: "Red Lentil Dahl",
    description: "Creamy spiced lentils with aromatic flavors. Indian comfort food.",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/O9kDPiC.png",
    totalTime: 40,
    tags: ["one-pot", "vegetarian", "vegan", "indian", "plant-based", "glutenfree"],
    nutrition: {
      calories: 280,
      protein: 16,
      carbs: 46,
      fat: 4,
      fiber: 12,
      sugar: 6,
      servingSize: "1.5 cups"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "red lentils, rinsed" },
      { amount: "4", unit: "cups", item: "vegetable broth" },
      { amount: "1", unit: "can", item: "coconut milk" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tsp", item: "curry powder" },
      { amount: "1", unit: "tsp", item: "turmeric" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1/4", unit: "cup", item: "cilantro" }
    ],
    instructions: [
      "Saut? [onion] in large pot until soft, add [garlic].",
      "Add [curry powder], [turmeric], [cumin], cook 1 minute.",
      "Add [2 cups lentils] and [4 cups broth], bring to boil.",
      "Reduce heat, simmer 20 minutes until lentils are soft.",
      "Stir in [coconut milk], simmer 5 more minutes.",
      "Season with salt and pepper.",
      "Garnish with [cilantro], serve with rice and naan."
    ]
  },
  
  // QUICK AND EASY (1)
  {
    id: "quick-vegan-nachos",
    name: "Vegan Nachos",
    description: "Loaded nachos with vegan cheese and all the toppings. Party-ready.",
    cookTime: "10 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Lunch",
    image: "https://i.imgur.com/pjGelRT.png",
    totalTime: 25,
    tags: ["quick-and-easy", "vegan", "vegetarian", "mexican", "plant-based", "glutenfree"],
    nutrition: {
      calories: 420,
      protein: 12,
      carbs: 52,
      fat: 18,
      fiber: 10,
      sugar: 4,
      servingSize: "1/6 platter"
    },
    ingredients: [
      { amount: "1", unit: "bag", item: "tortilla chips" },
      { amount: "1", unit: "can", item: "black beans, drained" },
      { amount: "1", unit: "cup", item: "vegan cheese sauce" },
      { amount: "1/2", unit: "cup", item: "sliced jalape?os" },
      { amount: "1", unit: "cup", item: "guacamole" },
      { amount: "1", unit: "cup", item: "salsa" },
      { amount: "1/4", unit: "cup", item: "fresh cilantro" },
      { amount: "1", unit: "", item: "lime, cut into wedges" }
    ],
    instructions: [
      "Preheat oven to 350?F. Spread [tortilla chips] on large baking sheet.",
      "Warm [black beans] in microwave.",
      "Scatter [black beans] over chips.",
      "Drizzle [vegan cheese sauce] over everything.",
      "Bake 10 minutes until heated through.",
      "Top with [jalape?os], [guacamole], and [salsa].",
      "Garnish with [cilantro], serve with [lime wedges]."
    ]
  },
  {
    id: "quick-cottage-cheese-flatbread-pizza",
    name: "Cottage Cheese Flatbread Pizza",
    description: "Trending high-protein flatbread base - customizable toppings, crispy and delicious",
    cookTime: "20 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 2,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/OANqrl5.png",
    totalTime: 25,
    tags: ["quick-and-easy", "high-protein", "vegetarian", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 28,
      carbs: 24,
      fat: 14,
      fiber: 3,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "cup", item: "cottage cheese" },
      { amount: "1", unit: "cup", item: "shredded mozzarella cheese" },
      { amount: "1/2", unit: "cup", item: "almond flour" },
      { amount: "1", unit: "large", item: "egg" },
      { amount: "1/2", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/4", unit: "tsp", item: "garlic powder" },
      { amount: "1/2", unit: "cup", item: "marinara sauce" },
      { amount: "1/2", unit: "cup", item: "toppings of choice (pepperoni, veggies, etc.)" }
    ],
    instructions: [
      "Preheat oven to 375?F and line a baking sheet with parchment paper.",
      "In a food processor, blend cottage cheese until smooth.",
      "Add 1/2 cup mozzarella, almond flour, egg, Italian seasoning, and garlic powder. Pulse until combined.",
      "Pour mixture onto prepared baking sheet and spread into a thin rectangle or circle.",
      "Bake for 15 minutes until edges are golden and center is set.",
      "Remove from oven and top with marinara sauce, remaining mozzarella, and your choice of toppings.",
      "Return to oven and bake for 5 more minutes until cheese is melted.",
      "Slice and serve"
    ]
  },

  // LUNCH IDEAS (4)
  {
    id: "lunch-mushroom-walnut-veggie-burger",
    name: "Mushroom Walnut Veggie Burger",
    description: "Gourmet veggie burger with earthy mushrooms and walnuts. Restaurant quality.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch Ideas",
    image: "https://i.imgur.com/Ko1Ux5i.png",
    totalTime: 35,
    tags: ["lunch", "vegetarian", "plant-based"],
    nutrition: {
      calories: 420,
      protein: 18,
      carbs: 46,
      fat: 20,
      fiber: 8,
      sugar: 8,
      servingSize: "1 burger"
    },
    ingredients: [
      { amount: "8", unit: "oz", item: "mushrooms, finely chopped" },
      { amount: "1", unit: "cup", item: "walnuts, chopped" },
      { amount: "1", unit: "cup", item: "breadcrumbs" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "", item: "onion, caramelized" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "4", unit: "", item: "brioche buns" },
      { amount: "", unit: "", item: "Toppings: lettuce, tomato" }
    ],
    instructions: [
      "Saut? [mushrooms] until liquid evaporates, about 8 minutes.",
      "Pulse [walnuts] in food processor until finely ground.",
      "Mix mushrooms, walnuts, [breadcrumbs], [eggs], [soy sauce] in bowl.",
      "Form into 4 patties, refrigerate 15 minutes.",
      "Cook patties in oiled skillet 5 minutes per side until golden.",
      "Toast [buns], top with [caramelized onion].",
      "Serve burgers on buns with [lettuce] and [tomato]."
    ]
  },
  {
    id: "lunch-cauliflower-shawarma",
    name: "Cauliflower Shawarma",
    description: "Roasted spiced cauliflower in pita. Middle Eastern street food magic.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch Ideas",
    image: "https://i.imgur.com/VyEX3Ti.png",
    totalTime: 45,
    tags: ["lunch", "vegetarian", "middle-eastern", "plant-based"],
    nutrition: {
      calories: 340,
      protein: 12,
      carbs: 48,
      fat: 12,
      fiber: 8,
      sugar: 8,
      servingSize: "1 wrap"
    },
    ingredients: [
      { amount: "1", unit: "", item: "large cauliflower, florets" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "2", unit: "tsp", item: "cumin" },
      { amount: "2", unit: "tsp", item: "paprika" },
      { amount: "1", unit: "tsp", item: "turmeric" },
      { amount: "4", unit: "", item: "pita breads" },
      { amount: "1/2", unit: "cup", item: "tahini sauce" },
      { amount: "1", unit: "cup", item: "pickled vegetables" },
      { amount: "1/4", unit: "cup", item: "fresh parsley" }
    ],
    instructions: [
      "Preheat oven to 425?F. Toss [cauliflower] with [2 tbsp oil], [cumin], [paprika], [turmeric].",
      "Spread on baking sheet, roast 30 minutes until golden and tender.",
      "Warm [pita breads].",
      "Spread [tahini sauce] inside each pita.",
      "Fill with roasted cauliflower and [pickled vegetables].",
      "Top with [fresh parsley].",
      "Serve immediately."
    ]
  },
  {
    id: "lunch-sesame-tofu-broccoli",
    name: "Sesame Tofu and Broccoli",
    description: "Crispy tofu with tender broccoli in sesame sauce. Asian takeout at home.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch Ideas",
    image: "https://i.imgur.com/IDF2TKb.png",
    totalTime: 35,
    tags: ["lunch", "vegetarian", "asian", "plant-based"],
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 28,
      fat: 16,
      fiber: 6,
      sugar: 8,
      servingSize: "1.5 cups"
    },
    ingredients: [
      { amount: "14", unit: "oz", item: "firm tofu, cubed" },
      { amount: "1", unit: "", item: "large head broccoli, florets" },
      { amount: "3", unit: "tbsp", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "sesame oil" },
      { amount: "2", unit: "tbsp", item: "honey" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" },
      { amount: "2", unit: "", item: "green onions, sliced" },
      { amount: "2", unit: "tbsp", item: "cornstarch" }
    ],
    instructions: [
      "Press [tofu] to remove excess water, coat in [cornstarch].",
      "Heat oil in large skillet, cook tofu until golden on all sides, about 10 minutes.",
      "Remove tofu, add [broccoli] to pan with 2 tbsp water.",
      "Cook covered 5 minutes until tender-crisp.",
      "Mix [3 tbsp soy sauce], [2 tbsp sesame oil], [2 tbsp honey].",
      "Return tofu to pan, add sauce, toss to coat.",
      "Top with [sesame seeds] and [green onions], serve over rice."
    ]
  },
  {
    id: "lunch-chipotle-portobello-tacos",
    name: "Chipotle Portobello Mushroom Tacos",
    description: "Smoky grilled mushrooms in soft tacos. Mexican street food perfection.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch",
    image: "https://i.imgur.com/owEdge2.png",
    totalTime: 25,
    tags: ["lunch", "vegetarian", "vegan", "mexican", "quick", "plant-based", "glutenfree"],
    nutrition: {
      calories: 280,
      protein: 10,
      carbs: 42,
      fat: 10,
      fiber: 6,
      sugar: 6,
      servingSize: "3 tacos"
    },
    ingredients: [
      { amount: "4", unit: "", item: "portobello mushrooms, sliced" },
      { amount: "2", unit: "tbsp", item: "chipotle sauce" },
      { amount: "12", unit: "", item: "corn tortillas" },
      { amount: "1", unit: "cup", item: "cabbage slaw" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "1/4", unit: "cup", item: "cilantro" },
      { amount: "2", unit: "", item: "limes, cut into wedges" }
    ],
    instructions: [
      "Brush [portobello slices] with [chipotle sauce].",
      "Grill or pan-fry mushrooms 3-4 minutes per side until tender.",
      "Warm [tortillas] in dry skillet.",
      "Divide mushrooms among tortillas.",
      "Top with [cabbage slaw], [avocado], and [cilantro].",
      "Serve with [lime wedges].",
      "Add extra chipotle sauce if desired."
    ]
  },
  
  // ONE POT WONDERS (3)
  {
    id: "one-pot-spiced-carrot-parsnip-soup",
    name: "Spiced Carrot and Parsnip Soup",
    description: "Creamy root vegetable soup with warming spices. Cozy comfort.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/53AWVK3.png",
    totalTime: 45,
    tags: ["one-pot", "vegetarian", "soup", "plant-based", "glutenfree"],
    nutrition: {
      calories: 180,
      protein: 4,
      carbs: 32,
      fat: 6,
      fiber: 8,
      sugar: 14,
      servingSize: "1.5 cups"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "carrots, peeled and chopped" },
      { amount: "1", unit: "lb", item: "parsnips, peeled and chopped" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "4", unit: "cups", item: "vegetable broth" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1/2", unit: "tsp", item: "coriander" },
      { amount: "1/2", unit: "cup", item: "coconut cream" },
      { amount: "2", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Heat [2 tbsp oil] in large pot, saut? [onion] until soft.",
      "Add [cumin] and [coriander], cook 1 minute.",
      "Add [carrots], [parsnips], and [4 cups broth].",
      "Bring to boil, reduce heat, simmer 25 minutes until vegetables are tender.",
      "Blend soup until smooth using immersion blender.",
      "Stir in [coconut cream].",
      "Season with salt and pepper, serve hot."
    ]
  },
  {
    id: "one-pot-vegan-mac-cheese",
    name: "Vegan Mac and Cheese",
    description: "Creamy cashew cheese sauce with tender pasta. Plant-based comfort.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Dinner",
    image: "https://i.imgur.com/CwUaiIk.png",
    totalTime: 25,
    tags: ["one-pot", "vegan", "comfort-food", "quick", "plant-based"],
    nutrition: {
      calories: 380,
      protein: 12,
      carbs: 52,
      fat: 14,
      fiber: 4,
      sugar: 4,
      servingSize: "1.5 cups"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "elbow macaroni" },
      { amount: "1", unit: "cup", item: "raw cashews, soaked" },
      { amount: "1/4", unit: "cup", item: "nutritional yeast" },
      { amount: "2", unit: "cups", item: "vegetable broth" },
      { amount: "2", unit: "tbsp", item: "lemon juice" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1/2", unit: "cup", item: "breadcrumbs" },
      { amount: "2", unit: "tbsp", item: "parsley" }
    ],
    instructions: [
      "Cook [macaroni] according to package, drain.",
      "Blend [cashews], [nutritional yeast], [2 cups broth], [lemon juice], [garlic powder] until smooth.",
      "Return pasta to pot, pour cashew cheese sauce over.",
      "Heat over medium, stirring until sauce thickens, about 5 minutes.",
      "Top with [breadcrumbs] if desired.",
      "Garnish with [parsley].",
      "Serve immediately."
    ]
  },
  {
    id: "one-pot-coconut-milk-tomato-soup",
    name: "Coconut Milk Tomato Soup",
    description: "Creamy tomato soup with coconut milk. Vegan twist on classic.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Dinner",
    image: "https://i.imgur.com/W75HJRD.png",
    totalTime: 30,
    tags: ["one-pot", "vegan", "soup", "quick", "plant-based", "glutenfree"],
    nutrition: {
      calories: 220,
      protein: 4,
      carbs: 24,
      fat: 12,
      fiber: 6,
      sugar: 14,
      servingSize: "1.5 cups"
    },
    ingredients: [
      { amount: "2", unit: "cans", item: "crushed tomatoes" },
      { amount: "1", unit: "can", item: "coconut milk" },
      { amount: "2", unit: "cups", item: "vegetable broth" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "dried basil" },
      { amount: "1/4", unit: "cup", item: "fresh basil" }
    ],
    instructions: [
      "Saut? [onion] in large pot until soft, add [garlic].",
      "Add [crushed tomatoes], [2 cups broth], [dried basil].",
      "Bring to boil, reduce heat, simmer 15 minutes.",
      "Blend soup until smooth using immersion blender.",
      "Stir in [coconut milk], heat through.",
      "Season with salt and pepper.",
      "Garnish with [fresh basil], serve with crusty bread."
    ]
  },
  
  // HEALTHY BOWLS (1)
  {
    id: "bowl-coconut-rice-bowls",
    name: "Coconut Rice Bowls",
    description: "Fluffy coconut rice with colorful vegetables. Tropical and healthy.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Healthy Bowls",
    image: "https://i.imgur.com/crAbv6R.png",
    totalTime: 35,
    tags: ["healthy-bowls", "vegetarian", "asian", "healthy", "plant-based", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 12,
      carbs: 58,
      fat: 12,
      fiber: 8,
      sugar: 6,
      servingSize: "1 bowl"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "jasmine rice" },
      { amount: "1", unit: "can", item: "coconut milk" },
      { amount: "1", unit: "cup", item: "edamame" },
      { amount: "1", unit: "", item: "avocado, sliced" },
      { amount: "1", unit: "cup", item: "shredded carrots" },
      { amount: "1", unit: "cup", item: "cucumber, sliced" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" },
      { amount: "2", unit: "", item: "limes, cut into wedges" }
    ],
    instructions: [
      "Cook [2 cups rice] with [coconut milk] and 1 cup water.",
      "Steam [edamame] according to package.",
      "Divide coconut rice into 4 bowls.",
      "Top each bowl with [edamame], [avocado], [carrots], and [cucumber].",
      "Sprinkle with [sesame seeds].",
      "Serve with [lime wedges].",
      "Drizzle with soy sauce or Asian dressing if desired."
    ]
  },
  {
    id: "bowl-hot-honey-ground-beef",
    name: "Hot Honey Ground Beef Bowls",
    description: "Viral TikTok recipe with sweet potato, lean ground beef, cottage cheese, avocado, and hot honey",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Healthy Bowls",
    image: "https://i.imgur.com/DXxuZFa.png",
    totalTime: 40,
    tags: ["healthy-bowls", "high-protein", "tiktok", "glutenfree"],
    nutrition: {
      calories: 590,
      protein: 55,
      carbs: 47,
      fat: 17,
      fiber: 8,
      sugar: 12,
      servingSize: "1 bowl"
    },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "sweet potato, peeled and diced" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1", unit: "lb", item: "93/7 lean ground beef" },
      { amount: "1", unit: "tbsp", item: "tomato paste" },
      { amount: "1", unit: "tbsp", item: "taco seasoning" },
      { amount: "2", unit: "cups", item: "2% low-fat cottage cheese" },
      { amount: "4", unit: "small", item: "avocados" },
      { amount: "4", unit: "tbsp", item: "hot honey" },
      { amount: "", unit: "to taste", item: "salt and pepper" }
    ],
    instructions: [
      "Preheat oven to 425?F and line a baking sheet with parchment paper.",
      "Add diced sweet potatoes to baking sheet, spray with cooking spray, and season with salt, pepper, and cinnamon. Bake for 30 minutes, flipping halfway through.",
      "While potatoes bake, heat a frying pan on medium-high heat. Add ground beef and cook, breaking it into small pieces until fully cooked (about 5 minutes).",
      "Stir in tomato paste and taco seasoning. Cook for another 2 minutes.",
      "Assemble bowls: divide sweet potatoes among 4 bowls. Top each with seasoned beef, 1/2 cup cottage cheese, sliced avocado, and drizzle with 1 tbsp hot honey.",
      "Serve immediately and enjoy!"
    ]
  },

  // DESSERTS (1)
  {
    id: "dessert-vegan-mug-cakes",
    name: "Vegan Mug Cakes",
    description: "Rich chocolate cake ready in minutes. Single-serve indulgence.",
    cookTime: "2 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 2,
    cuisine: "Desserts",
    image: "https://i.imgur.com/BxsLtJN.png",
    totalTime: 7,
    tags: ["dessert", "vegan", "quick", "plant-based"],
    nutrition: {
      calories: 280,
      protein: 4,
      carbs: 42,
      fat: 12,
      fiber: 3,
      sugar: 24,
      servingSize: "1 mug cake"
    },
    ingredients: [
      { amount: "6", unit: "tbsp", item: "all-purpose flour" },
      { amount: "4", unit: "tbsp", item: "sugar" },
      { amount: "2", unit: "tbsp", item: "cocoa powder" },
      { amount: "1/4", unit: "tsp", item: "baking powder" },
      { amount: "6", unit: "tbsp", item: "plant milk" },
      { amount: "2", unit: "tbsp", item: "vegetable oil" },
      { amount: "1/2", unit: "tsp", item: "vanilla extract" },
      { amount: "", unit: "", item: "Vegan whipped cream and berries for topping" }
    ],
    instructions: [
      "Mix [6 tbsp flour], [4 tbsp sugar], [2 tbsp cocoa], [1/4 tsp baking powder] in bowl.",
      "Add [6 tbsp milk], [2 tbsp oil], [1/2 tsp vanilla], stir until smooth.",
      "Divide batter between 2 microwave-safe mugs.",
      "Microwave each mug 60-90 seconds until cake rises and sets.",
      "Let cool 1 minute.",
      "Top with [vegan whipped cream] and [berries].",
      "Serve immediately."
    ]
  },
  
  // BREAKFAST (1)
  {
    instructions: [
      "Preheat oven to 325?F. Line baking sheet with parchment.",
      "Mix [2 tbsp soy sauce], [1 tbsp maple syrup], [1 tsp liquid smoke], [1/2 tsp paprika].",
      "Toss [2 cups coconut flakes] with sauce mixture.",
      "Spread in single layer on baking sheet.",
      "Bake 12-15 minutes, stirring every 5 minutes, until golden and crispy.",
      "Watch carefully to prevent burning.",
      "Let cool completely to crisp up more. Use as topping for avocado toast, salads, or breakfast bowls."
    ]
  },
  {
    id: "breakfast-cloud-bread-sandwich",
    name: "Cloud Bread Breakfast Sandwich",
    description: "High-protein breakfast with fluffy cloud bread, eggs, cheese, and ham",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 2,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/DYfRt7q.png",
    totalTime: 25,
    tags: ["breakfast", "high-protein", "glutenfree"],
    nutrition: {
      calories: 280,
      protein: 25,
      carbs: 4,
      fat: 18,
      fiber: 0,
      sugar: 2,
      servingSize: "1 sandwich"
    },
    ingredients: [
      { amount: "3", unit: "large", item: "eggs, separated" },
      { amount: "3", unit: "tbsp", item: "cream cheese, softened" },
      { amount: "1/4", unit: "tsp", item: "baking powder" },
      { amount: "1/4", unit: "tsp", item: "garlic powder" },
      { amount: "2", unit: "slices", item: "cheddar cheese" },
      { amount: "2", unit: "slices", item: "deli ham or turkey" },
      { amount: "", unit: "pinch", item: "salt" }
    ],
    instructions: [
      "Preheat oven to 300?F and line a baking sheet with parchment paper.",
      "In a bowl, beat egg whites with salt until stiff peaks form.",
      "In another bowl, mix egg yolks, cream cheese, baking powder, and garlic powder until smooth.",
      "Gently fold egg whites into yolk mixture until combined (don't overmix).",
      "Spoon mixture into 4 equal rounds on the baking sheet.",
      "Bake for 15 minutes until golden and set. Let cool for 5 minutes.",
      "While bread cools, cook eggs to your preference.",
      "Assemble sandwiches: cloud bread, cheese, egg, ham, and top with another cloud bread.",
      "Serve immediately and enjoy!"
    ]
  },

  // ========== FALL FAVORITES (20) ==========
  {
    id: "fall-pumpkin-cream-cheese-muffins",
    name: "Pumpkin Cream Cheese Muffins",
    description: "Moist pumpkin muffins with cream cheese swirl. Perfect fall breakfast treat.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/HMov1N3.png",
    totalTime: 35,
    tags: ["fall", "breakfast", "baking", "pumpkin"],
    nutrition: {
      calories: 220,
      protein: 4,
      carbs: 32,
      fat: 9,
      fiber: 2,
      sugar: 18,
      servingSize: "1 muffin"
    },
    ingredients: [
      { amount: "1.5", unit: "cups", item: "all-purpose flour" },
      { amount: "1", unit: "tsp", item: "baking powder" },
      { amount: "1/2", unit: "tsp", item: "baking soda" },
      { amount: "1", unit: "tsp", item: "pumpkin pie spice" },
      { amount: "1/4", unit: "tsp", item: "salt" },
      { amount: "1", unit: "cup", item: "pumpkin puree" },
      { amount: "1/2", unit: "cup", item: "vegetable oil" },
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "8", unit: "oz", item: "cream cheese, softened" },
      { amount: "1/4", unit: "cup", item: "sugar (for swirl)" }
    ],
    instructions: [
      "Preheat oven to 375?F. Line muffin tin with paper liners.",
      "Mix [1.5 cups flour], [1 tsp baking powder], [1/2 tsp baking soda], [1 tsp pumpkin spice], [1/4 tsp salt].",
      "In separate bowl, whisk [1 cup pumpkin], [1/2 cup oil], [3/4 cup sugar], [2 eggs], [1 tsp vanilla].",
      "Combine wet and dry ingredients, mix until just combined.",
      "Beat [8 oz cream cheese] with [1/4 cup sugar] until smooth.",
      "Fill muffin cups 2/3 full with pumpkin batter.",
      "Add spoonful of cream cheese mixture on top, swirl with toothpick.",
      "Bake 20-22 minutes until toothpick comes out clean. Cool before serving."
    ]
  },
  {
    id: "fall-pumpkin-spice-latte-oats",
    name: "Pumpkin Spice Latte Overnight Oats",
    description: "Creamy overnight oats with pumpkin and coffee. Easy make-ahead breakfast.",
    cookTime: "0 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 2,
    cuisine: "Fall Favorites",
    image: pumpkinSpiceLatteOatsImg,
    totalTime: 5,
    tags: ["fall", "breakfast", "no-cook"],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 42,
      fat: 8,
      fiber: 6,
      sugar: 12,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "cup", item: "rolled oats" },
      { amount: "1", unit: "cup", item: "milk" },
      { amount: "1/2", unit: "cup", item: "pumpkin puree" },
      { amount: "2", unit: "tbsp", item: "maple syrup" },
      { amount: "1", unit: "tsp", item: "pumpkin pie spice" },
      { amount: "1", unit: "shot", item: "espresso or strong coffee" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "", unit: "", item: "whipped cream for topping" }
    ],
    instructions: [
      "In mason jar, combine [1 cup oats], [1 cup milk], [1/2 cup pumpkin puree].",
      "Add [2 tbsp maple syrup], [1 tsp pumpkin spice], [1 shot espresso], [1 tsp vanilla].",
      "Stir well to combine all ingredients.",
      "Cover and refrigerate overnight (at least 6 hours).",
      "In morning, stir and add more milk if needed.",
      "Top with whipped cream and sprinkle of cinnamon before serving."
    ]
  },
  {
    id: "fall-pumpkin-cinnamon-rolls",
    name: "Pumpkin Cinnamon Rolls",
    description: "Fluffy pumpkin rolls with cinnamon swirl and cream cheese frosting.",
    cookTime: "25 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Fall Favorites",
    image: pumpkinCinnamonRollsImg,
    totalTime: 145,
    tags: ["fall", "breakfast", "baking", "pumpkin"],
    nutrition: {
      calories: 320,
      protein: 5,
      carbs: 48,
      fat: 12,
      fiber: 2,
      sugar: 22,
      servingSize: "1 roll"
    },
    ingredients: [
      { amount: "3.5", unit: "cups", item: "all-purpose flour" },
      { amount: "1/4", unit: "cup", item: "sugar" },
      { amount: "1", unit: "packet", item: "instant yeast" },
      { amount: "3/4", unit: "cup", item: "pumpkin puree" },
      { amount: "1/4", unit: "cup", item: "milk, warm" },
      { amount: "1/4", unit: "cup", item: "butter, melted" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1/2", unit: "cup", item: "brown sugar" },
      { amount: "2", unit: "tbsp", item: "cinnamon" },
      { amount: "8", unit: "oz", item: "cream cheese" },
      { amount: "2", unit: "cups", item: "powdered sugar" }
    ],
    instructions: [
      "Mix [3.5 cups flour], [1/4 cup sugar], [1 packet yeast] in bowl.",
      "Add [3/4 cup pumpkin], [1/4 cup warm milk], [1/4 cup melted butter], [1 egg].",
      "Knead until smooth dough forms, let rise 1 hour.",
      "Roll dough into rectangle, brush with melted butter.",
      "Mix [1/2 cup brown sugar] with [2 tbsp cinnamon], sprinkle over dough.",
      "Roll up tightly, cut into 12 rolls.",
      "Place in greased pan, let rise 30 minutes.",
      "Bake at 350?F for 25 minutes. Make frosting with [8 oz cream cheese] and [2 cups powdered sugar]. Frost warm rolls."
    ]
  },
  {
    id: "fall-pumpkin-ravioli",
    name: "Pumpkin Ravioli",
    description: "Homemade ravioli filled with pumpkin ricotta, served with sage butter.",
    cookTime: "8 mins",
    prepTime: "60 mins",
    difficulty: "hard",
    servings: 4,
    cuisine: "Italian",
    image: "https://i.imgur.com/0KKzJWB.png",
    totalTime: 68,
    tags: ["fall", "pasta", "dinner", "pumpkin"],
    nutrition: {
      calories: 480,
      protein: 16,
      carbs: 62,
      fat: 18,
      fiber: 4,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "3", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "pumpkin puree" },
      { amount: "1", unit: "cup", item: "ricotta cheese" },
      { amount: "1/2", unit: "cup", item: "parmesan" },
      { amount: "1/4", unit: "tsp", item: "nutmeg" },
      { amount: "1/2", unit: "cup", item: "butter" },
      { amount: "12", unit: "leaves", item: "fresh sage" },
      { amount: "", unit: "", item: "salt and pepper" }
    ],
    instructions: [
      "Make pasta dough with [2 cups flour] and [3 eggs], rest 30 minutes.",
      "Mix filling: [1 cup pumpkin], [1 cup ricotta], [1/2 cup parmesan], [1/4 tsp nutmeg].",
      "Roll pasta thin, cut into squares.",
      "Place spoonful of filling on half the squares.",
      "Top with remaining squares, seal edges with fork.",
      "Boil ravioli 6-8 minutes until they float.",
      "In pan, brown [1/2 cup butter] with [12 sage leaves].",
      "Toss cooked ravioli in sage butter. Serve with extra parmesan."
    ]
  },
  {
    id: "fall-pumpkin-banana-bread",
    name: "Pumpkin Banana Bread",
    description: "Moist bread combining pumpkin and banana. Best of both worlds.",
    cookTime: "60 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Fall Favorites",
    image: pumpkinBananaBreadImg,
    totalTime: 75,
    tags: ["fall", "breakfast", "baking", "pumpkin"],
    nutrition: {
      calories: 240,
      protein: 4,
      carbs: 38,
      fat: 8,
      fiber: 2,
      sugar: 20,
      servingSize: "1 slice"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "all-purpose flour" },
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "1", unit: "tsp", item: "pumpkin pie spice" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "cup", item: "mashed banana" },
      { amount: "1/2", unit: "cup", item: "pumpkin puree" },
      { amount: "1", unit: "tsp", item: "vanilla" }
    ],
    instructions: [
      "Preheat oven to 350?F. Grease 9x5 loaf pan.",
      "Mix [2 cups flour], [1 tsp baking soda], [1 tsp pumpkin spice], [1/2 tsp salt].",
      "In bowl, whisk [1/2 cup melted butter], [3/4 cup sugar], [2 eggs].",
      "Stir in [1 cup mashed banana], [1/2 cup pumpkin], [1 tsp vanilla].",
      "Fold in dry ingredients until just combined.",
      "Pour into prepared pan.",
      "Bake 60 minutes until toothpick comes out clean.",
      "Cool 10 minutes in pan, then turn out onto rack."
    ]
  },
  {
    id: "fall-apple-pie-egg-rolls",
    name: "Apple Pie Egg Rolls",
    description: "Crispy egg rolls filled with apple pie filling. Fun fall dessert twist.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/AmIc3tS.png",
    totalTime: 35,
    tags: ["fall", "dessert", "fried", "apples"],
    nutrition: {
      calories: 180,
      protein: 3,
      carbs: 28,
      fat: 6,
      fiber: 2,
      sugar: 14,
      servingSize: "1 egg roll"
    },
    ingredients: [
      { amount: "4", unit: "", item: "apples, peeled and diced" },
      { amount: "1/2", unit: "cup", item: "brown sugar" },
      { amount: "2", unit: "tsp", item: "cinnamon" },
      { amount: "1", unit: "tbsp", item: "cornstarch" },
      { amount: "12", unit: "", item: "egg roll wrappers" },
      { amount: "", unit: "", item: "oil for frying" },
      { amount: "1/4", unit: "cup", item: "cinnamon sugar" },
      { amount: "1", unit: "cup", item: "caramel sauce" }
    ],
    instructions: [
      "Cook [4 diced apples], [1/2 cup brown sugar], [2 tsp cinnamon] until soft.",
      "Stir in [1 tbsp cornstarch], cook until thickened. Cool completely.",
      "Place spoonful of filling on [12 egg roll wrappers].",
      "Roll tightly, seal edges with water.",
      "Heat oil to 350?F.",
      "Fry egg rolls 2-3 minutes per side until golden.",
      "Drain on paper towels, roll in [1/4 cup cinnamon sugar].",
      "Serve warm with [1 cup caramel sauce] for dipping."
    ]
  },
  {
    id: "fall-stuffed-baked-apples",
    name: "Stuffed Baked Apples",
    description: "Warm baked apples stuffed with oat crumble. Classic fall comfort dessert.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "Fall Favorites",
    image: stuffedBakedApplesImg,
    totalTime: 60,
    tags: ["fall", "dessert", "baking", "apples"],
    nutrition: {
      calories: 220,
      protein: 2,
      carbs: 42,
      fat: 6,
      fiber: 5,
      sugar: 28,
      servingSize: "1 apple"
    },
    ingredients: [
      { amount: "6", unit: "", item: "large apples" },
      { amount: "1/2", unit: "cup", item: "rolled oats" },
      { amount: "1/4", unit: "cup", item: "brown sugar" },
      { amount: "1/4", unit: "cup", item: "chopped pecans" },
      { amount: "1/4", unit: "cup", item: "raisins" },
      { amount: "2", unit: "tsp", item: "cinnamon" },
      { amount: "1/4", unit: "cup", item: "butter, melted" },
      { amount: "1/2", unit: "cup", item: "apple juice" }
    ],
    instructions: [
      "Preheat oven to 375?F. Core [6 apples], leaving bottom intact.",
      "Mix [1/2 cup oats], [1/4 cup brown sugar], [1/4 cup pecans], [1/4 cup raisins], [2 tsp cinnamon].",
      "Stir in [1/4 cup melted butter].",
      "Stuff mixture into apple centers.",
      "Place apples in baking dish, pour [1/2 cup apple juice] around them.",
      "Cover with foil, bake 30 minutes.",
      "Uncover, bake 15 more minutes until tender.",
      "Serve warm with vanilla ice cream or whipped cream."
    ]
  },
  {
    id: "fall-pumpkin-dump-cake",
    name: "Pumpkin Dump Cake",
    description: "Easy dump cake with pumpkin and cake mix. Minimal effort, maximum flavor.",
    cookTime: "50 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/2k9prsR.png",
    totalTime: 55,
    tags: ["fall", "dessert", "easy", "pumpkin", "glutenfree"],
    nutrition: {
      calories: 340,
      protein: 4,
      carbs: 52,
      fat: 14,
      fiber: 2,
      sugar: 36,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "can", item: "pumpkin puree (15 oz)" },
      { amount: "1", unit: "can", item: "evaporated milk (12 oz)" },
      { amount: "3", unit: "", item: "eggs" },
      { amount: "1.5", unit: "cups", item: "sugar" },
      { amount: "2", unit: "tsp", item: "pumpkin pie spice" },
      { amount: "1", unit: "box", item: "yellow cake mix" },
      { amount: "1", unit: "cup", item: "butter, melted" },
      { amount: "1", unit: "cup", item: "chopped pecans" }
    ],
    instructions: [
      "Preheat oven to 350?F. Grease 9x13 baking dish.",
      "Mix [1 can pumpkin], [1 can evaporated milk], [3 eggs], [1.5 cups sugar], [2 tsp pumpkin spice].",
      "Pour into baking dish.",
      "Sprinkle [1 box cake mix] evenly over pumpkin layer (don't stir).",
      "Drizzle [1 cup melted butter] over cake mix.",
      "Top with [1 cup chopped pecans].",
      "Bake 50 minutes until golden and bubbly.",
      "Serve warm with whipped cream or ice cream."
    ]
  },
  {
    id: "fall-cinnamon-roll-apple-pie",
    name: "Cinnamon Roll Apple Pie",
    description: "Apple pie topped with cinnamon roll dough. Best of both desserts.",
    cookTime: "45 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Fall Favorites",
    image: cinnamonRollApplePieImg,
    totalTime: 75,
    tags: ["fall", "dessert", "baking", "apples"],
    nutrition: {
      calories: 420,
      protein: 5,
      carbs: 64,
      fat: 18,
      fiber: 3,
      sugar: 38,
      servingSize: "1 slice"
    },
    ingredients: [
      { amount: "6", unit: "cups", item: "apples, sliced" },
      { amount: "1/2", unit: "cup", item: "sugar" },
      { amount: "2", unit: "tbsp", item: "flour" },
      { amount: "2", unit: "tsp", item: "cinnamon" },
      { amount: "1", unit: "can", item: "refrigerated cinnamon rolls" },
      { amount: "4", unit: "oz", item: "cream cheese" },
      { amount: "1", unit: "cup", item: "powdered sugar" },
      { amount: "2", unit: "tbsp", item: "milk" }
    ],
    instructions: [
      "Preheat oven to 375?F. Grease 9-inch pie dish.",
      "Mix [6 cups sliced apples], [1/2 cup sugar], [2 tbsp flour], [2 tsp cinnamon].",
      "Pour apple mixture into pie dish.",
      "Separate [1 can cinnamon rolls], arrange on top of apples in spiral pattern.",
      "Bake 45 minutes until cinnamon rolls are golden and apples are tender.",
      "Make frosting: beat [4 oz cream cheese], [1 cup powdered sugar], [2 tbsp milk].",
      "Drizzle frosting over warm pie.",
      "Let cool 15 minutes before serving."
    ]
  },
  {
    id: "fall-apple-crisp-mug",
    name: "Apple Crisp in a Mug",
    description: "Single-serve apple crisp ready in minutes. Perfect fall comfort in a mug.",
    cookTime: "2 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 1,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/A2tJWyl.png",
    totalTime: 7,
    tags: ["fall", "dessert", "microwave", "apples"],
    nutrition: {
      calories: 280,
      protein: 3,
      carbs: 48,
      fat: 10,
      fiber: 4,
      sugar: 32,
      servingSize: "1 mug"
    },
    ingredients: [
      { amount: "1", unit: "", item: "apple, diced" },
      { amount: "1", unit: "tbsp", item: "brown sugar" },
      { amount: "1/2", unit: "tsp", item: "cinnamon" },
      { amount: "3", unit: "tbsp", item: "oats" },
      { amount: "2", unit: "tbsp", item: "flour" },
      { amount: "2", unit: "tbsp", item: "brown sugar (for topping)" },
      { amount: "2", unit: "tbsp", item: "butter, melted" },
      { amount: "", unit: "", item: "vanilla ice cream" }
    ],
    instructions: [
      "In microwave-safe mug, combine [1 diced apple], [1 tbsp brown sugar], [1/2 tsp cinnamon].",
      "In small bowl, mix [3 tbsp oats], [2 tbsp flour], [2 tbsp brown sugar].",
      "Stir in [2 tbsp melted butter] until crumbly.",
      "Sprinkle topping over apple mixture in mug.",
      "Microwave on high 2 minutes until apple is tender.",
      "Let cool 1 minute.",
      "Top with vanilla ice cream and serve immediately."
    ]
  },
  {
    id: "fall-apple-cider-donuts",
    name: "Baked Apple Cider Donuts",
    description: "Soft baked donuts with apple cider and cinnamon sugar. Fall bakery favorite.",
    cookTime: "12 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/B0IuoYu.jpeg",
    totalTime: 27,
    tags: ["fall", "breakfast", "baking", "apples"],
    nutrition: {
      calories: 190,
      protein: 3,
      carbs: 32,
      fat: 6,
      fiber: 1,
      sugar: 18,
      servingSize: "1 donut"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "1", unit: "tsp", item: "baking powder" },
      { amount: "1/2", unit: "tsp", item: "baking soda" },
      { amount: "1.5", unit: "tsp", item: "cinnamon" },
      { amount: "3/4", unit: "cup", item: "apple cider" },
      { amount: "1/3", unit: "cup", item: "butter, melted" },
      { amount: "1/2", unit: "cup", item: "sugar" },
      { amount: "1", unit: "", item: "egg" },
      { amount: "1/2", unit: "cup", item: "cinnamon sugar" }
    ],
    instructions: [
      "Preheat oven to 350?F. Grease donut pan.",
      "Mix [2 cups flour], [1 tsp baking powder], [1/2 tsp baking soda], [1.5 tsp cinnamon].",
      "In bowl, whisk [3/4 cup apple cider], [1/3 cup melted butter], [1/2 cup sugar], [1 egg].",
      "Combine wet and dry ingredients until just mixed.",
      "Pipe batter into donut pan.",
      "Bake 12 minutes until golden.",
      "Cool 2 minutes, remove from pan.",
      "Brush with melted butter, roll in [1/2 cup cinnamon sugar]."
    ]
  },
  {
    id: "fall-honey-crisp-apple-salad",
    name: "Honey Crisp Apple Salad",
    description: "Fresh salad with apples, goat cheese, and candied pecans. Perfect fall lunch.",
    cookTime: "0 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/qhmeyCk.png",
    totalTime: 15,
    tags: ["fall", "salad", "apples", "glutenfree"],
    nutrition: {
      calories: 280,
      protein: 6,
      carbs: 24,
      fat: 18,
      fiber: 4,
      sugar: 16,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "8", unit: "cups", item: "mixed greens" },
      { amount: "2", unit: "", item: "honeycrisp apples, sliced" },
      { amount: "1/2", unit: "cup", item: "dried cranberries" },
      { amount: "1/2", unit: "cup", item: "candied pecans" },
      { amount: "4", unit: "oz", item: "goat cheese, crumbled" },
      { amount: "1/4", unit: "cup", item: "olive oil" },
      { amount: "2", unit: "tbsp", item: "apple cider vinegar" },
      { amount: "1", unit: "tbsp", item: "maple syrup" },
      { amount: "1", unit: "tsp", item: "dijon mustard" }
    ],
    instructions: [
      "In large bowl, combine [8 cups mixed greens], [2 sliced apples].",
      "Add [1/2 cup dried cranberries], [1/2 cup candied pecans], [4 oz goat cheese].",
      "In small jar, shake [1/4 cup olive oil], [2 tbsp apple cider vinegar], [1 tbsp maple syrup], [1 tsp dijon].",
      "Drizzle dressing over salad just before serving.",
      "Toss gently and serve immediately."
    ]
  },
  {
    id: "fall-apple-butter-chicken",
    name: "Apple Butter Chicken",
    description: "Savory chicken with sweet apple butter glaze. Fall dinner with a twist.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/bY5AoqI.png",
    totalTime: 35,
    tags: ["fall", "chicken", "apples", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 36,
      carbs: 28,
      fat: 14,
      fiber: 2,
      sugar: 20,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" },
      { amount: "1", unit: "cup", item: "apple butter" },
      { amount: "1/4", unit: "cup", item: "chicken broth" },
      { amount: "2", unit: "tbsp", item: "apple cider vinegar" },
      { amount: "1", unit: "tsp", item: "thyme" },
      { amount: "2", unit: "", item: "apples, sliced" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "", unit: "", item: "salt and pepper" }
    ],
    instructions: [
      "Season [4 chicken breasts] with salt, pepper.",
      "In pan, brown chicken 5 minutes per side, remove.",
      "Add [2 tbsp butter], saut? [2 sliced apples] until golden.",
      "Mix [1 cup apple butter], [1/4 cup broth], [2 tbsp vinegar], [1 tsp thyme].",
      "Pour sauce over apples, return chicken to pan.",
      "Simmer 10 minutes until chicken reaches 165?F.",
      "Serve chicken topped with caramelized apples and sauce.",
      "Pairs well with rice or roasted vegetables."
    ]
  },

  // ========== NEW FALL FAVORITES (20 additional recipes) ==========
  {
    id: "fall-pumpkin-spice-latte",
    name: "Pumpkin Spice Latte (Starbucks Copycat)",
    description: "Homemade PSL with real pumpkin, warm spices, and espresso. Hot or iced! Better than Starbucks.",
    cookTime: "5 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 2,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/tXvlrBJ.png",
    totalTime: 10,
    tags: ["fall", "drinks", "coffee", "pumpkin", "glutenfree"],
    nutrition: {
      calories: 240,
      protein: 6,
      carbs: 38,
      fat: 8,
      fiber: 1,
      sugar: 32,
      servingSize: "1 drink (16 oz)"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "milk (any kind)" },
      { amount: "2", unit: "tbsp", item: "pumpkin puree" },
      { amount: "2", unit: "tbsp", item: "sugar" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "1/2", unit: "tsp", item: "pumpkin pie spice" },
      { amount: "2", unit: "shots", item: "espresso or 1/2 cup strong coffee" },
      { amount: "", unit: "", item: "whipped cream for topping" }
    ],
    instructions: [
      "In saucepan, whisk [2 cups milk], [2 tbsp pumpkin], [2 tbsp sugar], [1/2 tsp pumpkin spice].",
      "Heat over medium, stirring constantly until steaming (don't boil).",
      "Remove from heat, stir in [1 tsp vanilla].",
      "Brew [2 shots espresso] or make strong coffee.",
      "Divide espresso between 2 mugs, pour pumpkin milk over.",
      "Top with whipped cream and extra pumpkin spice.",
      "For iced: Let mixture cool, pour over ice with espresso."
    ]
  },

  {
    id: "fall-caramel-apple-cider",
    name: "Caramel Apple Cider (Hot & Cold)",
    description: "Sweet caramel apple cider perfect for fall. Serve hot or cold with caramel drizzle.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/NWCPRs1.png",
    totalTime: 15,
    tags: ["fall", "drinks", "apples", "kid-friendly", "glutenfree"],
    nutrition: {
      calories: 180,
      protein: 0,
      carbs: 46,
      fat: 0,
      fiber: 0,
      sugar: 42,
      servingSize: "1 cup"
    },
    ingredients: [
      { amount: "4", unit: "cups", item: "apple cider" },
      { amount: "1/4", unit: "cup", item: "caramel sauce" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "1/4", unit: "tsp", item: "cinnamon" },
      { amount: "", unit: "", item: "whipped cream" },
      { amount: "", unit: "", item: "extra caramel for drizzle" }
    ],
    instructions: [
      "Heat [4 cups cider] in pot over medium heat until warm.",
      "Whisk in [1/4 cup caramel sauce], [1 tsp vanilla], [1/4 tsp cinnamon].",
      "Simmer 5 minutes, stirring occasionally.",
      "Pour into mugs, top with whipped cream.",
      "Drizzle extra caramel on top.",
      "For cold: Let cool completely, serve over ice with whipped cream."
    ]
  },

  {
    id: "fall-maple-brown-butter-cookies",
    name: "Maple Brown Butter Cookies",
    description: "Chewy cookies with nutty brown butter and sweet maple flavor. Fall perfection!",
    cookTime: "12 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 24,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/q1s77eJ.png",
    totalTime: 27,
    tags: ["fall", "dessert", "cookies", "maple"],
    nutrition: {
      calories: 140,
      protein: 2,
      carbs: 18,
      fat: 7,
      fiber: 0,
      sugar: 10,
      servingSize: "1 cookie"
    },
    ingredients: [
      { amount: "1", unit: "cup", item: "butter" },
      { amount: "1", unit: "cup", item: "brown sugar" },
      { amount: "1/2", unit: "cup", item: "sugar" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1/4", unit: "cup", item: "maple syrup" },
      { amount: "2 1/2", unit: "cups", item: "flour" },
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "1/2", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Brown [1 cup butter] in pan over medium heat until golden and nutty, about 5 minutes. Cool 10 minutes.",
      "Beat browned butter with [1 cup brown sugar] and [1/2 cup sugar].",
      "Mix in [2 eggs] and [1/4 cup maple syrup].",
      "In separate bowl, whisk [2 1/2 cups flour], [1 tsp baking soda], [1/2 tsp salt].",
      "Combine wet and dry ingredients.",
      "Drop tablespoon-sized balls onto baking sheet.",
      "Bake at 350?F for 10-12 minutes until edges are golden.",
      "Cool on pan 5 minutes. Enjoy warm!"
    ]
  },

  {
    id: "fall-pumpkin-cheesecake-bars",
    name: "Pumpkin Cheesecake Bars",
    description: "Creamy pumpkin cheesecake bars with graham cracker crust. Perfect for Thanksgiving!",
    cookTime: "50 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 16,
    cuisine: "Fall Favorites",
    image: fallPumpkinCheesecakeBarsNewImg,
    totalTime: 180,
    tags: ["fall", "dessert", "cheesecake", "pumpkin", "glutenfree"],
    nutrition: {
      calories: 310,
      protein: 5,
      carbs: 32,
      fat: 18,
      fiber: 1,
      sugar: 24,
      servingSize: "1 bar"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "graham cracker crumbs" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "16", unit: "oz", item: "cream cheese, softened" },
      { amount: "3/4", unit: "cup", item: "sugar" },
      { amount: "1", unit: "cup", item: "pumpkin puree" },
      { amount: "3", unit: "", item: "eggs" },
      { amount: "1", unit: "tsp", item: "vanilla" },
      { amount: "2", unit: "tsp", item: "pumpkin pie spice" }
    ],
    instructions: [
      "Mix [2 cups graham crumbs] with [1/2 cup melted butter]. Press into 9x13 pan.",
      "Bake crust at 350?F for 8 minutes.",
      "Beat [16 oz cream cheese] with [3/4 cup sugar] until smooth.",
      "Mix in [1 cup pumpkin], [3 eggs], [1 tsp vanilla], [2 tsp pumpkin spice].",
      "Pour over crust. Bake 40-45 minutes until center barely jiggles.",
      "Cool completely, then refrigerate 2 hours.",
      "Cut into 16 bars. Top with whipped cream if desired.",
      "Perfect for Thanksgiving!"
    ]
  },

  {
    id: "fall-chai-hot-chocolate",
    name: "Chai Spiced Hot Chocolate",
    description: "Rich hot chocolate infused with warming chai spices. Cozy fall drink!",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/40b1UDl.png",
    totalTime: 15,
    tags: ["fall", "drinks", "chocolate", "spiced", "glutenfree"],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 42,
      fat: 10,
      fiber: 3,
      sugar: 34,
      servingSize: "1 cup"
    },
    ingredients: [
      { amount: "4", unit: "cups", item: "milk" },
      { amount: "1/2", unit: "cup", item: "chocolate chips" },
      { amount: "2", unit: "tbsp", item: "cocoa powder" },
      { amount: "3", unit: "tbsp", item: "sugar" },
      { amount: "1", unit: "tsp", item: "vanilla" },
      { amount: "1/2", unit: "tsp", item: "cinnamon" },
      { amount: "1/4", unit: "tsp", item: "ginger" },
      { amount: "1/4", unit: "tsp", item: "cardamom" },
      { amount: "1/8", unit: "tsp", item: "cloves" }
    ],
    instructions: [
      "Heat [4 cups milk] in pot over medium heat.",
      "Whisk in [1/2 cup chocolate chips], [2 tbsp cocoa], [3 tbsp sugar].",
      "Add [1/2 tsp cinnamon], [1/4 tsp ginger], [1/4 tsp cardamom], [1/8 tsp cloves].",
      "Simmer 5 minutes, whisking frequently.",
      "Remove from heat, stir in [1 tsp vanilla].",
      "Pour into mugs, top with whipped cream and cinnamon."
    ]
  },


  {
    id: "fall-salted-caramel-apple-bars",
    name: "Salted Caramel Apple Bars",
    description: "Buttery shortbread, spiced apples, and salted caramel. Fall dessert perfection!",
    cookTime: "45 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 16,
    cuisine: "Fall Favorites",
    image: fallCaramelAppleBarsImg,
    totalTime: 65,
    tags: ["fall", "dessert", "baking", "apples", "caramel"],
    nutrition: {
      calories: 280,
      protein: 3,
      carbs: 38,
      fat: 13,
      fiber: 2,
      sugar: 22,
      servingSize: "1 bar"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "1/2", unit: "cup", item: "sugar" },
      { amount: "1", unit: "cup", item: "butter, cold" },
      { amount: "4", unit: "", item: "apples, peeled and diced" },
      { amount: "1/3", unit: "cup", item: "brown sugar" },
      { amount: "2", unit: "tsp", item: "cinnamon" },
      { amount: "1", unit: "cup", item: "caramel sauce" },
      { amount: "1/2", unit: "tsp", item: "sea salt" }
    ],
    instructions: [
      "Mix [2 cups flour] and [1/2 cup sugar]. Cut in [1 cup cold butter] until crumbly.",
      "Press 2/3 of mixture into greased 9x13 pan. Bake at 350?F for 15 minutes.",
      "Toss [4 diced apples] with [1/3 cup brown sugar] and [2 tsp cinnamon].",
      "Spread apples over crust. Drizzle [1 cup caramel sauce] over apples.",
      "Sprinkle remaining crumb mixture on top.",
      "Bake 30 minutes until golden and bubbling.",
      "Cool completely. Sprinkle [1/2 tsp sea salt] over top.",
      "Cut into 16 bars. Serve with ice cream!"
    ]
  },

  {
    id: "fall-mulled-wine",
    name: "Mulled Wine (Slow Cooker)",
    description: "Warm spiced wine with orange and cinnamon. Perfect for fall gatherings!",
    cookTime: "2 hrs",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/R1feMR3.png",
    totalTime: 125,
    tags: ["fall", "drinks", "wine", "slow cooker", "glutenfree"],
    nutrition: {
      calories: 150,
      protein: 0,
      carbs: 18,
      fat: 0,
      fiber: 0,
      sugar: 14,
      servingSize: "1 cup"
    },
    ingredients: [
      { amount: "2", unit: "bottles", item: "red wine (750ml each)" },
      { amount: "1/4", unit: "cup", item: "brandy" },
      { amount: "1/4", unit: "cup", item: "honey" },
      { amount: "1", unit: "", item: "orange, sliced" },
      { amount: "3", unit: "", item: "cinnamon sticks" },
      { amount: "6", unit: "", item: "whole cloves" },
      { amount: "3", unit: "", item: "star anise" },
      { amount: "1", unit: "tsp", item: "vanilla extract" }
    ],
    instructions: [
      "Add [2 bottles red wine], [1/4 cup brandy], [1/4 cup honey] to slow cooker.",
      "Add [1 sliced orange], [3 cinnamon sticks], [6 cloves], [3 star anise].",
      "Cover and cook on LOW 2-3 hours (don't boil).",
      "Stir in [1 tsp vanilla] before serving.",
      "Ladle into mugs, include an orange slice.",
      "Can keep warm in slow cooker on LOW for serving.",
      "Serve hot. Perfect for parties!"
    ]
  },

  {
    id: "fall-apple-butter",
    name: "Apple Butter (Slow Cooker)",
    description: "Rich, spiced apple butter made easy in the slow cooker. Perfect on everything!",
    cookTime: "8 hrs",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 32,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/tqZ4euo.png",
    totalTime: 495,
    tags: ["fall", "spread", "apples", "slow cooker", "glutenfree"],
    nutrition: {
      calories: 50,
      protein: 0,
      carbs: 13,
      fat: 0,
      fiber: 1,
      sugar: 11,
      servingSize: "2 tbsp"
    },
    ingredients: [
      { amount: "6", unit: "lbs", item: "apples, peeled and chopped" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1/2", unit: "cup", item: "brown sugar" },
      { amount: "2", unit: "tsp", item: "cinnamon" },
      { amount: "1/2", unit: "tsp", item: "nutmeg" },
      { amount: "1/4", unit: "tsp", item: "cloves" },
      { amount: "1/4", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Place [6 lbs chopped apples] in slow cooker.",
      "Add [1 cup sugar], [1/2 cup brown sugar], [2 tsp cinnamon], [1/2 tsp nutmeg], [1/4 tsp cloves], [1/4 tsp salt].",
      "Stir well. Cover and cook on LOW 8-10 hours, stirring occasionally.",
      "After cooking, use immersion blender to puree until smooth.",
      "Leave lid slightly open, cook on LOW 1-2 more hours to thicken.",
      "Cool and store in jars. Refrigerate up to 2 weeks.",
      "Perfect on toast, biscuits, or pancakes!"
    ]
  },

  {
    id: "fall-brown-butter-pumpkin-cookies",
    name: "Brown Butter Pumpkin Cookies",
    description: "Soft pumpkin cookies with nutty brown butter flavor. Fall favorite!",
    cookTime: "12 mins",
    prepTime: "20 mins",
    difficulty: "easy",
    servings: 36,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/i2ab90L.png",
    totalTime: 32,
    tags: ["fall", "dessert", "cookies", "pumpkin"],
    nutrition: {
      calories: 120,
      protein: 1,
      carbs: 16,
      fat: 6,
      fiber: 0,
      sugar: 9,
      servingSize: "1 cookie"
    },
    ingredients: [
      { amount: "3/4", unit: "cup", item: "butter" },
      { amount: "1 1/2", unit: "cups", item: "brown sugar" },
      { amount: "1", unit: "cup", item: "pumpkin puree" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "tsp", item: "vanilla" },
      { amount: "3", unit: "cups", item: "flour" },
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "2", unit: "tsp", item: "pumpkin pie spice" },
      { amount: "1/2", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Brown [3/4 cup butter] in saucepan until golden, about 5 minutes. Cool 15 minutes.",
      "Beat browned butter with [1 1/2 cups brown sugar].",
      "Mix in [1 cup pumpkin], [2 eggs], [1 tsp vanilla].",
      "In bowl, whisk [3 cups flour], [1 tsp baking soda], [2 tsp pumpkin spice], [1/2 tsp salt].",
      "Combine wet and dry ingredients.",
      "Drop tablespoon-sized dough onto baking sheets.",
      "Bake at 350?F for 10-12 minutes until edges set.",
      "Cool and enjoy! Store in airtight container."
    ]
  },

  {
    id: "fall-green-bean-casserole",
    name: "Classic Green Bean Casserole",
    description: "Traditional green bean casserole with crispy onions. Perfect for Thanksgiving!",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/UnCwJj5.png",
    totalTime: 40,
    tags: ["fall", "side dish", "casserole", "thanksgiving"],
    nutrition: {
      calories: 180,
      protein: 4,
      carbs: 16,
      fat: 12,
      fiber: 3,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "lbs", item: "fresh green beans, trimmed" },
      { amount: "2", unit: "cans", item: "cream of mushroom soup (10.5 oz each)" },
      { amount: "1", unit: "cup", item: "milk" },
      { amount: "1", unit: "tsp", item: "soy sauce" },
      { amount: "1/4", unit: "tsp", item: "black pepper" },
      { amount: "2 2/3", unit: "cups", item: "french fried onions" },
      { amount: "", unit: "", item: "salt to taste" }
    ],
    instructions: [
      "Boil [2 lbs green beans] in salted water 5 minutes. Drain well.",
      "Mix [2 cans mushroom soup], [1 cup milk], [1 tsp soy sauce], [1/4 tsp pepper].",
      "Stir in beans and 1 1/3 cups [fried onions].",
      "Pour into greased 9x13 baking dish.",
      "Bake at 350?F for 25 minutes.",
      "Top with remaining 1 1/3 cups [fried onions].",
      "Bake 5 more minutes until onions are golden.",
      "Perfect for Thanksgiving!"
    ]
  },

  {
    id: "fall-sweet-potato-casserole",
    name: "Sweet Potato Casserole with Marshmallows",
    description: "Classic sweet potato casserole topped with toasted marshmallows. Perfect for Thanksgiving!",
    cookTime: "30 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 10,
    cuisine: "Fall Favorites",
    image: fallSweetPotatoCasseroleNewImg,
    totalTime: 50,
    tags: ["fall", "side dish", "sweet potatoes", "thanksgiving", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 3,
      carbs: 58,
      fat: 9,
      fiber: 4,
      sugar: 36,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "lbs", item: "sweet potatoes" },
      { amount: "1/2", unit: "cup", item: "butter, melted" },
      { amount: "1/2", unit: "cup", item: "brown sugar" },
      { amount: "1/2", unit: "cup", item: "milk" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "1", unit: "tsp", item: "vanilla" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "4", unit: "cups", item: "mini marshmallows" }
    ],
    instructions: [
      "Bake [4 lbs sweet potatoes] at 400?F for 45 minutes until soft. Cool, peel.",
      "Mash potatoes until smooth.",
      "Mix in [1/2 cup melted butter], [1/2 cup brown sugar], [1/2 cup milk], [2 eggs], [1 tsp vanilla], [1 tsp cinnamon].",
      "Spread into greased 9x13 dish.",
      "Bake at 350?F for 25 minutes.",
      "Top with [4 cups mini marshmallows].",
      "Bake 5 more minutes until marshmallows are golden.",
      "Perfect for Thanksgiving!"
    ]
  },

  {
    id: "fall-herb-butter-turkey-breast",
    name: "Herb Butter Roasted Turkey Breast",
    description: "Juicy herb butter turkey breast. Perfect for small Thanksgiving gatherings!",
    cookTime: "2 hrs",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/z1T0fp8.png",
    totalTime: 135,
    tags: ["fall", "main dish", "turkey", "thanksgiving", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 48,
      carbs: 2,
      fat: 13,
      fiber: 0,
      sugar: 1,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "", item: "turkey breast (5-6 lbs)" },
      { amount: "1/2", unit: "cup", item: "butter, softened" },
      { amount: "2", unit: "tbsp", item: "fresh rosemary, chopped" },
      { amount: "2", unit: "tbsp", item: "fresh thyme, chopped" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" },
      { amount: "1", unit: "cup", item: "chicken broth" }
    ],
    instructions: [
      "Pat [turkey breast] dry. Mix [1/2 cup butter], [2 tbsp rosemary], [2 tbsp thyme], [4 cloves garlic], [1 tsp salt], [1/2 tsp pepper].",
      "Carefully loosen skin from turkey. Spread half of herb butter under skin.",
      "Rub remaining butter over outside of turkey.",
      "Place in roasting pan. Pour [1 cup broth] around turkey.",
      "Roast at 350?F for 1.5-2 hours (20 min per pound) until 165?F internal temp.",
      "Baste every 30 minutes with pan juices.",
      "Let rest 15 minutes before carving.",
      "Perfect for Thanksgiving!"
    ]
  },

  {
    id: "fall-cornbread-stuffing",
    name: "Cornbread Stuffing with Sausage & Sage",
    description: "Classic cornbread stuffing with sausage and fresh herbs. Perfect for Thanksgiving!",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 12,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/5S4HfXR.jpeg",
    totalTime: 60,
    tags: ["fall", "side dish", "stuffing", "thanksgiving"],
    nutrition: {
      calories: 280,
      protein: 10,
      carbs: 32,
      fat: 13,
      fiber: 2,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "", item: "cornbread (9x9 pan), cubed and dried" },
      { amount: "1", unit: "lb", item: "breakfast sausage" },
      { amount: "1", unit: "cup", item: "onion, diced" },
      { amount: "1", unit: "cup", item: "celery, diced" },
      { amount: "2", unit: "tbsp", item: "fresh sage, chopped" },
      { amount: "2", unit: "tbsp", item: "fresh thyme" },
      { amount: "2 1/2", unit: "cups", item: "chicken broth" },
      { amount: "2", unit: "", item: "eggs, beaten" },
      { amount: "1/2", unit: "cup", item: "butter" }
    ],
    instructions: [
      "Cook [1 lb sausage] in large skillet until browned. Remove.",
      "In same pan, saut? [1 cup onion] and [1 cup celery] in [1/2 cup butter] until soft.",
      "Add [2 tbsp sage] and [2 tbsp thyme], cook 1 minute.",
      "In large bowl, combine [cubed cornbread], sausage, veggie mixture.",
      "Pour [2 1/2 cups broth] and [2 beaten eggs] over mixture. Toss gently.",
      "Transfer to greased 9x13 dish.",
      "Bake at 350?F for 40-45 minutes until golden and crispy on top.",
      "Perfect for Thanksgiving!"
    ]
  },

  {
    id: "fall-cranberry-sauce",
    name: "Cranberry Sauce (Fresh & Easy)",
    description: "Homemade cranberry sauce with orange zest. Way better than canned! Perfect for Thanksgiving!",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 10,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/pLemrkw.png",
    totalTime: 20,
    tags: ["fall", "side dish", "cranberries", "thanksgiving", "glutenfree"],
    nutrition: {
      calories: 90,
      protein: 0,
      carbs: 23,
      fat: 0,
      fiber: 2,
      sugar: 20,
      servingSize: "1/4 cup"
    },
    ingredients: [
      { amount: "12", unit: "oz", item: "fresh cranberries" },
      { amount: "1", unit: "cup", item: "sugar" },
      { amount: "1", unit: "cup", item: "water" },
      { amount: "1", unit: "", item: "orange, zested" },
      { amount: "1/4", unit: "cup", item: "orange juice" },
      { amount: "1", unit: "stick", item: "cinnamon" }
    ],
    instructions: [
      "In saucepan, combine [12 oz cranberries], [1 cup sugar], [1 cup water].",
      "Add [orange zest], [1/4 cup orange juice], [cinnamon stick].",
      "Bring to boil, then reduce to simmer.",
      "Cook 10-15 minutes, stirring occasionally, until cranberries burst.",
      "Remove cinnamon stick.",
      "Sauce will thicken as it cools.",
      "Refrigerate at least 2 hours before serving.",
      "Perfect for Thanksgiving!"
    ]
  },

  {
    id: "fall-creamy-mashed-potatoes",
    name: "Creamy Mashed Potatoes with Garlic",
    description: "Ultra creamy garlic mashed potatoes. The perfect side dish for Thanksgiving!",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 10,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/jxpEimT.png",
    totalTime: 35,
    tags: ["fall", "side dish", "potatoes", "thanksgiving", "glutenfree"],
    nutrition: {
      calories: 220,
      protein: 4,
      carbs: 32,
      fat: 9,
      fiber: 3,
      sugar: 2,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "5", unit: "lbs", item: "russet potatoes, peeled and cubed" },
      { amount: "1", unit: "cup", item: "butter" },
      { amount: "1", unit: "cup", item: "heavy cream, warm" },
      { amount: "1/2", unit: "cup", item: "sour cream" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tsp", item: "salt" },
      { amount: "1/2", unit: "tsp", item: "black pepper" }
    ],
    instructions: [
      "Boil [5 lbs cubed potatoes] in salted water 15-20 minutes until fork-tender.",
      "Meanwhile, melt [1 cup butter] with [4 cloves garlic] in small pan. Cook 2 minutes.",
      "Drain potatoes well, return to pot.",
      "Mash potatoes until smooth.",
      "Stir in garlic butter, [1 cup warm cream], [1/2 cup sour cream].",
      "Season with [2 tsp salt] and [1/2 tsp pepper].",
      "Whip with electric mixer until fluffy and creamy.",
      "Perfect for Thanksgiving!"
    ]
  },

  {
    id: "fall-brussels-sprouts-bacon",
    name: "Roasted Brussels Sprouts with Bacon",
    description: "Crispy roasted Brussels sprouts with bacon and balsamic glaze. Perfect for Thanksgiving!",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Fall Favorites",
    image: "https://i.imgur.com/3xtT6yz.png",
    totalTime: 35,
    tags: ["fall", "side dish", "vegetables", "thanksgiving", "glutenfree"],
    nutrition: {
      calories: 180,
      protein: 8,
      carbs: 14,
      fat: 11,
      fiber: 5,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "lbs", item: "Brussels sprouts, halved" },
      { amount: "6", unit: "slices", item: "bacon, chopped" },
      { amount: "3", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1/2", unit: "tsp", item: "salt" },
      { amount: "1/4", unit: "tsp", item: "black pepper" },
      { amount: "2", unit: "tbsp", item: "balsamic glaze" }
    ],
    instructions: [
      "Toss [2 lbs halved Brussels sprouts] with [3 tbsp olive oil], [1 tsp garlic powder], [1/2 tsp salt], [1/4 tsp pepper].",
      "Spread on baking sheet. Scatter [6 slices chopped bacon] over top.",
      "Roast at 400?F for 25 minutes, stirring halfway.",
      "Brussels should be crispy and caramelized, bacon crispy.",
      "Transfer to serving dish.",
      "Drizzle [2 tbsp balsamic glaze] over top.",
      "Serve immediately.",
      "Perfect for Thanksgiving!"
    ]
  },

  {
    id: "fall-butternut-squash-soup",
    name: "Butternut Squash Soup (Creamy)",
    description: "Velvety smooth butternut squash soup with warm spices. Cozy fall comfort! Perfect for Thanksgiving!",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Fall Favorites",
    image: fallButternutSquashSoupNewImg,
    totalTime: 45,
    tags: ["fall", "soup", "vegetarian", "thanksgiving", "glutenfree"],
    nutrition: {
      calories: 180,
      protein: 3,
      carbs: 28,
      fat: 7,
      fiber: 4,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "", item: "butternut squash (3 lbs), peeled and cubed" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "4", unit: "cups", item: "vegetable broth" },
      { amount: "1/2", unit: "cup", item: "heavy cream" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1/2", unit: "tsp", item: "nutmeg" },
      { amount: "1", unit: "tsp", item: "salt" }
    ],
    instructions: [
      "Heat [2 tbsp olive oil] in large pot. Saut? [1 diced onion] until soft, 5 minutes.",
      "Add [3 cloves garlic], cook 1 minute.",
      "Add [3 lbs cubed squash] and [4 cups broth]. Bring to boil.",
      "Reduce heat, simmer 20 minutes until squash is very tender.",
      "Use immersion blender to puree until smooth.",
      "Stir in [1/2 cup cream], [1 tsp cinnamon], [1/2 tsp nutmeg], [1 tsp salt].",
      "Simmer 5 more minutes. Adjust seasoning.",
      "Serve with crusty bread. Perfect for Thanksgiving!"
    ]
  },

  // ========== ONE POT WONDERS (12 additional recipes) ==========
  {
    id: "one-pot-creamy-tortellini-soup",
    name: "Creamy Tortellini Soup",
    description: "One pot soup with cheese tortellini in creamy broth. Easy weeknight dinner.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/hrh2OLA.png",
    totalTime: 30,
    tags: ["one-pot", "soup", "pasta", "comfort-food", "glutenfree"],
    nutrition: {
      calories: 340,
      protein: 14,
      carbs: 38,
      fat: 14,
      fiber: 3,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "6", unit: "cups", item: "chicken broth" },
      { amount: "1", unit: "can", item: "diced tomatoes (14 oz)" },
      { amount: "1", unit: "lb", item: "cheese tortellini" },
      { amount: "2", unit: "cups", item: "spinach" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese" }
    ],
    instructions: [
      "In large pot, heat [2 tbsp olive oil], saut? [1 diced onion] and [3 cloves garlic].",
      "Add [6 cups chicken broth], [1 can diced tomatoes], [1 tsp Italian seasoning].",
      "Bring to boil, add [1 lb cheese tortellini].",
      "Cook 8 minutes until tortellini is tender.",
      "Stir in [2 cups spinach] and [1 cup heavy cream].",
      "Simmer 5 minutes until spinach wilts.",
      "Top with [1/2 cup parmesan cheese].",
      "Serve hot with crusty bread."
    ]
  },
  {
    id: "one-pot-butternut-squash-mac-cheese",
    name: "Butternut Squash Mac and Cheese",
    description: "Creamy mac and cheese with butternut squash. Fall twist on comfort classic.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/ulSUy0m.png",
    totalTime: 35,
    tags: ["One Pot Wonders", "pasta", "vegetarian", "comfort food"],
    nutrition: {
      calories: 420,
      protein: 16,
      carbs: 52,
      fat: 18,
      fiber: 4,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "elbow macaroni" },
      { amount: "2", unit: "cups", item: "butternut squash puree" },
      { amount: "2", unit: "cups", item: "milk" },
      { amount: "2", unit: "cups", item: "cheddar cheese, shredded" },
      { amount: "1", unit: "cup", item: "gruyere cheese, shredded" },
      { amount: "3", unit: "tbsp", item: "butter" },
      { amount: "1/4", unit: "tsp", item: "nutmeg" },
      { amount: "1", unit: "cup", item: "panko breadcrumbs" },
      { amount: "", unit: "", item: "salt and pepper" }
    ],
    instructions: [
      "Cook [1 lb macaroni] according to package, drain.",
      "In same pot, melt [3 tbsp butter], add [2 cups squash puree] and [2 cups milk].",
      "Stir in [2 cups cheddar] and [1 cup gruyere] until melted.",
      "Add [1/4 tsp nutmeg], salt, pepper.",
      "Fold in cooked pasta.",
      "Transfer to baking dish, top with [1 cup panko].",
      "Broil 3 minutes until golden and crispy.",
      "Let stand 5 minutes before serving."
    ]
  },
  {
    id: "one-pot-loaded-baked-potato-soup",
    name: "Loaded Baked Potato Soup",
    description: "Creamy potato soup with bacon and cheese. All the toppings in one pot.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "One Pot Wonders",
    image: loadedBakedPotatoSoupImg,
    totalTime: 45,
    tags: ["One Pot Wonders", "soup", "comfort food", "bacon", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 12,
      carbs: 38,
      fat: 20,
      fiber: 3,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "8", unit: "slices", item: "bacon, chopped" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "6", unit: "", item: "russet potatoes, diced" },
      { amount: "6", unit: "cups", item: "chicken broth" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "2", unit: "cups", item: "cheddar cheese, shredded" },
      { amount: "1/2", unit: "cup", item: "sour cream" },
      { amount: "1/4", unit: "cup", item: "chives, chopped" }
    ],
    instructions: [
      "In large pot, cook [8 slices chopped bacon] until crispy. Remove and set aside.",
      "In bacon fat, saut? [1 diced onion] and [3 cloves garlic].",
      "Add [6 diced potatoes] and [6 cups broth].",
      "Simmer 20 minutes until potatoes are tender.",
      "Mash some potatoes in pot for thickness.",
      "Stir in [1 cup heavy cream], [2 cups cheddar], [1/2 cup sour cream].",
      "Top with reserved bacon and [1/4 cup chives].",
      "Serve hot with extra cheese and sour cream."
    ]
  },
  {
    id: "one-pot-beef-stew-pumpkin",
    name: "Beef Stew in Pumpkin",
    description: "Hearty beef stew served in roasted pumpkin. Showstopping fall presentation.",
    cookTime: "90 mins",
    prepTime: "30 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/qxBUbqT.png",
    totalTime: 120,
    tags: ["One Pot Wonders", "beef", "stew", "fall"],
    nutrition: {
      calories: 420,
      protein: 32,
      carbs: 38,
      fat: 16,
      fiber: 6,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "", item: "large pumpkin (8-10 lbs)" },
      { amount: "2", unit: "lbs", item: "beef stew meat" },
      { amount: "3", unit: "tbsp", item: "flour" },
      { amount: "2", unit: "tbsp", item: "oil" },
      { amount: "1", unit: "", item: "onion, chopped" },
      { amount: "4", unit: "", item: "carrots, chopped" },
      { amount: "4", unit: "", item: "potatoes, cubed" },
      { amount: "4", unit: "cups", item: "beef broth" },
      { amount: "2", unit: "tsp", item: "thyme" },
      { amount: "2", unit: "", item: "bay leaves" }
    ],
    instructions: [
      "Preheat oven to 350?F. Cut top off [1 large pumpkin], scoop out seeds.",
      "Toss [2 lbs beef] with [3 tbsp flour], salt, pepper.",
      "Heat [2 tbsp oil] in pot, brown beef. Remove.",
      "Saut? [1 onion], [4 carrots], [4 potatoes].",
      "Return beef, add [4 cups broth], [2 tsp thyme], [2 bay leaves].",
      "Simmer 1 hour until beef is tender.",
      "Place pumpkin on baking sheet, bake 45 minutes until tender.",
      "Ladle stew into pumpkin, serve immediately."
    ]
  },
  {
    id: "one-pot-french-onion-soup-bake",
    name: "French Onion Soup Bake",
    description: "Classic French onion soup transformed into casserole. Cheese-topped perfection.",
    cookTime: "60 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "French",
    image: frenchOnionSoupBakeImg,
    totalTime: 80,
    tags: ["One Pot Wonders", "casserole", "cheese", "comfort food"],
    nutrition: {
      calories: 360,
      protein: 14,
      carbs: 32,
      fat: 18,
      fiber: 3,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "6", unit: "", item: "large onions, thinly sliced" },
      { amount: "1/4", unit: "cup", item: "butter" },
      { amount: "2", unit: "tbsp", item: "brown sugar" },
      { amount: "6", unit: "cups", item: "beef broth" },
      { amount: "1/2", unit: "cup", item: "red wine" },
      { amount: "2", unit: "tsp", item: "thyme" },
      { amount: "1", unit: "loaf", item: "French bread, cubed" },
      { amount: "3", unit: "cups", item: "gruyere cheese, shredded" },
      { amount: "1", unit: "cup", item: "parmesan cheese" }
    ],
    instructions: [
      "In large oven-safe pot, melt [1/4 cup butter], add [6 sliced onions].",
      "Cook 30 minutes, stirring often, until caramelized.",
      "Add [2 tbsp brown sugar], cook 5 more minutes.",
      "Pour in [6 cups broth], [1/2 cup wine], [2 tsp thyme].",
      "Simmer 20 minutes.",
      "Top with [1 loaf bread cubes].",
      "Cover with [3 cups gruyere] and [1 cup parmesan].",
      "Broil until cheese is melted and bubbly. Serve hot."
    ]
  },
  {
    id: "one-pot-chicken-pot-pie-biscuit",
    name: "Chicken Pot Pie with Biscuit Topping",
    description: "One pot chicken pot pie with drop biscuits. Comfort food made easy.",
    cookTime: "35 mins",
    prepTime: "20 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/nlPEgYy.png",
    totalTime: 55,
    tags: ["One Pot Wonders", "chicken", "comfort food", "biscuits"],
    nutrition: {
      calories: 420,
      protein: 28,
      carbs: 38,
      fat: 18,
      fiber: 4,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "3", unit: "tbsp", item: "butter" },
      { amount: "2", unit: "lbs", item: "chicken breast, cubed" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "", item: "carrots, diced" },
      { amount: "2", unit: "cups", item: "frozen peas" },
      { amount: "1/4", unit: "cup", item: "flour" },
      { amount: "3", unit: "cups", item: "chicken broth" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1", unit: "can", item: "refrigerated biscuits (8 count)" }
    ],
    instructions: [
      "In large oven-safe skillet, melt [3 tbsp butter], cook [2 lbs chicken] until done.",
      "Add [1 onion], [3 carrots], saut? 5 minutes.",
      "Sprinkle [1/4 cup flour], cook 2 minutes.",
      "Stir in [3 cups broth] and [1 cup cream], simmer until thick.",
      "Add [2 cups peas], season with salt and pepper.",
      "Top with [1 can biscuits], torn into pieces.",
      "Bake at 375?F for 20 minutes until biscuits are golden.",
      "Let cool 5 minutes before serving."
    ]
  },
  {
    id: "one-pot-sausage-kale-soup",
    name: "Sausage and Kale Soup",
    description: "Italian sausage and kale in hearty broth. Tuscan-inspired one pot meal.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: sausageKaleSoupImg,
    totalTime: 35,
    tags: ["one-pot", "soup", "sausage"],
    nutrition: {
      calories: 340,
      protein: 18,
      carbs: 28,
      fat: 16,
      fiber: 4,
      sugar: 3,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "Italian sausage, sliced" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "6", unit: "cups", item: "chicken broth" },
      { amount: "1", unit: "can", item: "white beans, drained" },
      { amount: "4", unit: "cups", item: "kale, chopped" },
      { amount: "1/2", unit: "tsp", item: "red pepper flakes" },
      { amount: "1/2", unit: "cup", item: "parmesan cheese" },
      { amount: "", unit: "", item: "crusty bread for serving" }
    ],
    instructions: [
      "In large pot, brown [1 lb sliced sausage], remove.",
      "In drippings, saut? [1 onion] and [4 cloves garlic].",
      "Add [6 cups broth], [1 can white beans], [1/2 tsp red pepper flakes].",
      "Bring to boil, simmer 10 minutes.",
      "Return sausage to pot, add [4 cups kale].",
      "Cook 5 minutes until kale wilts.",
      "Serve topped with [1/2 cup parmesan].",
      "Serve with crusty bread for dipping."
    ]
  },
  {
    id: "one-pot-shepherds-pie-twice-baked",
    name: "Shepherd's Pie Twice-Baked Potatoes",
    description: "Individual shepherd's pies in potato boats. Fun twist on classic.",
    cookTime: "75 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "British-American",
    image: shepherdsPieTwiceBakedImg,
    totalTime: 95,
    tags: ["One Pot Wonders", "beef", "potatoes", "comfort food", "glutenfree"],
    nutrition: {
      calories: 420,
      protein: 24,
      carbs: 48,
      fat: 14,
      fiber: 6,
      sugar: 4,
      servingSize: "1 potato"
    },
    ingredients: [
      { amount: "6", unit: "", item: "large russet potatoes" },
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "2", unit: "", item: "carrots, diced" },
      { amount: "1", unit: "cup", item: "frozen peas" },
      { amount: "2", unit: "tbsp", item: "tomato paste" },
      { amount: "1", unit: "cup", item: "beef broth" },
      { amount: "1/2", unit: "cup", item: "cheddar cheese" },
      { amount: "1/4", unit: "cup", item: "butter" }
    ],
    instructions: [
      "Bake [6 potatoes] at 400?F for 60 minutes until tender.",
      "Meanwhile, brown [1 lb ground beef] with [1 onion], [2 carrots].",
      "Add [2 tbsp tomato paste], [1 cup broth], [1 cup peas]. Simmer 10 minutes.",
      "Cut potatoes in half, scoop out centers leaving shell.",
      "Mash potato centers with [1/4 cup butter].",
      "Fill potato shells with beef mixture.",
      "Top with mashed potato and [1/2 cup cheddar].",
      "Bake 15 minutes until cheese melts. Serve hot."
    ]
  },
  {
    id: "one-pot-mushroom-wild-rice-soup",
    name: "Creamy Mushroom Wild Rice Soup",
    description: "Earthy mushrooms and wild rice in creamy broth. Cozy fall soup.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: mushroomWildRiceSoupImg,
    totalTime: 60,
    tags: ["One Pot Wonders", "soup", "vegetarian", "mushrooms", "glutenfree"],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 32,
      fat: 14,
      fiber: 4,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "tbsp", item: "butter" },
      { amount: "1", unit: "lb", item: "mushrooms, sliced" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "cup", item: "wild rice" },
      { amount: "6", unit: "cups", item: "vegetable broth" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "2", unit: "tsp", item: "thyme" },
      { amount: "1/4", unit: "cup", item: "fresh parsley" }
    ],
    instructions: [
      "In large pot, melt [4 tbsp butter], saut? [1 lb mushrooms] until golden.",
      "Add [1 onion] and [3 cloves garlic], cook 5 minutes.",
      "Stir in [1 cup wild rice] and [6 cups broth].",
      "Add [2 tsp thyme], bring to boil.",
      "Reduce heat, simmer 40 minutes until rice is tender.",
      "Stir in [1 cup heavy cream], heat through.",
      "Garnish with [1/4 cup parsley].",
      "Serve hot with crusty bread."
    ]
  },
  {
    id: "one-pot-chili-cheese-fries-casserole",
    name: "Chili Cheese Fries Casserole",
    description: "Loaded fries with chili and cheese baked to perfection. Ultimate comfort food.",
    cookTime: "35 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "Dinner",
    image: chiliCheeseFriesCasseroleImg,
    totalTime: 50,
    tags: ["One Pot Wonders", "casserole", "beef", "cheese", "glutenfree"],
    nutrition: {
      calories: 480,
      protein: 22,
      carbs: 42,
      fat: 24,
      fiber: 4,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "bag", item: "frozen fries (2 lbs)" },
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "1", unit: "can", item: "kidney beans (15 oz)" },
      { amount: "1", unit: "can", item: "diced tomatoes (15 oz)" },
      { amount: "2", unit: "tbsp", item: "chili powder" },
      { amount: "3", unit: "cups", item: "cheddar cheese, shredded" },
      { amount: "1/2", unit: "cup", item: "sour cream" },
      { amount: "1/4", unit: "cup", item: "green onions" }
    ],
    instructions: [
      "Bake [1 bag frozen fries] according to package until crispy.",
      "In skillet, brown [1 lb ground beef] with [1 onion].",
      "Add [1 can beans], [1 can tomatoes], [2 tbsp chili powder]. Simmer 10 minutes.",
      "In 9x13 dish, layer half the fries.",
      "Top with chili, then [2 cups cheddar].",
      "Add remaining fries and [1 cup cheddar].",
      "Bake at 375?F for 15 minutes until cheese melts.",
      "Top with [1/2 cup sour cream] and [1/4 cup green onions]."
    ]
  },
  {
    id: "one-pot-meatball-sub-casserole",
    name: "Meatball Sub Casserole",
    description: "All the flavors of meatball sub in casserole form. Crowd-pleasing dinner.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 8,
    cuisine: "Italian-American",
    image: meatballSubCasseroleImg,
    totalTime: 45,
    tags: ["One Pot Wonders", "casserole", "meatballs", "Italian"],
    nutrition: {
      calories: 420,
      protein: 26,
      carbs: 38,
      fat: 18,
      fiber: 3,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "bag", item: "frozen meatballs (2 lbs)" },
      { amount: "1", unit: "jar", item: "marinara sauce (24 oz)" },
      { amount: "1", unit: "loaf", item: "French bread, cubed" },
      { amount: "2", unit: "cups", item: "mozzarella cheese, shredded" },
      { amount: "1", unit: "cup", item: "parmesan cheese" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/4", unit: "cup", item: "fresh basil, chopped" },
      { amount: "", unit: "", item: "garlic butter for bread" }
    ],
    instructions: [
      "Preheat oven to 375?F. Grease 9x13 baking dish.",
      "Heat [1 bag frozen meatballs] with [1 jar marinara] until warm.",
      "Toast [1 loaf bread cubes] with garlic butter until golden.",
      "Layer half the bread in dish.",
      "Top with meatball mixture and [1 cup mozzarella].",
      "Add remaining bread, [1 cup mozzarella], [1 cup parmesan].",
      "Sprinkle [1 tsp Italian seasoning].",
      "Bake 25 minutes. Garnish with [1/4 cup basil]."
    ]
  },
  {
    id: "one-pot-crack-chicken-noodle-soup",
    name: "Crack Chicken Noodle Soup",
    description: "Addictive soup with chicken, bacon, and ranch. Viral recipe made easy.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 6,
    cuisine: "One Pot Wonders",
    image: crackChickenNoodleSoupImg,
    totalTime: 35,
    tags: ["One Pot Wonders", "soup", "chicken", "bacon"],
    nutrition: {
      calories: 380,
      protein: 28,
      carbs: 32,
      fat: 16,
      fiber: 2,
      sugar: 3,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "8", unit: "slices", item: "bacon, chopped" },
      { amount: "2", unit: "lbs", item: "chicken breast" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "6", unit: "cups", item: "chicken broth" },
      { amount: "8", unit: "oz", item: "egg noodles" },
      { amount: "1", unit: "packet", item: "ranch seasoning" },
      { amount: "8", unit: "oz", item: "cream cheese" },
      { amount: "2", unit: "cups", item: "cheddar cheese, shredded" }
    ],
    instructions: [
      "In large pot, cook [8 slices chopped bacon] until crispy. Remove.",
      "In bacon fat, cook [2 lbs chicken] until done. Shred and set aside.",
      "Saut? [1 onion] and [3 cloves garlic].",
      "Add [6 cups broth], [1 packet ranch seasoning]. Bring to boil.",
      "Add [8 oz noodles], cook 8 minutes.",
      "Stir in [8 oz cream cheese] until melted.",
      "Add shredded chicken, bacon, [2 cups cheddar].",
      "Serve hot with extra cheese and bacon."
    ]
  },
  // ONE POT WONDERS - VEGAN RECIPES
  {
    id: "one-pot-marry-me-tofu",
    name: "Marry Me Tofu",
    description: "TikTok viral! Creamy tomato basil sauce with golden tofu that'll make you propose.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: marryMeTofuImg,
    totalTime: 30,
    tags: ["One Pot Wonders", "vegan", "vegetarian", "viral", "tofu", "glutenfree"],
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 24,
      fat: 16,
      fiber: 4,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "block", item: "extra-firm tofu (14 oz)" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "can", item: "crushed tomatoes (28 oz)" },
      { amount: "1", unit: "cup", item: "coconut cream" },
      { amount: "1/2", unit: "cup", item: "sun-dried tomatoes, chopped" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/4", unit: "cup", item: "fresh basil" },
      { amount: "", unit: "", item: "salt and pepper to taste" }
    ],
    instructions: [
      "Press [14 oz tofu] for 10 minutes, cube, pan-sear in [2 tbsp olive oil] until golden. Remove.",
      "In same pan, saut? [4 cloves garlic] for 30 seconds.",
      "Add [28 oz crushed tomatoes], [1 cup coconut cream], [1/2 cup sun-dried tomatoes].",
      "Stir in [1 tsp Italian seasoning], simmer 10 minutes.",
      "Return tofu to pan, coat with sauce.",
      "Garnish with [1/4 cup basil]. Serve over pasta or rice."
    ]
  },
  {
    id: "one-pot-high-protein-cucumber-salad",
    name: "High-Protein Cucumber Salad",
    description: "Viral recipe with 25g protein! Crunchy cucumbers with chickpeas and edamame.",
    cookTime: "0 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Lunch",
    image: highProteinCucumberSaladImg,
    totalTime: 15,
    tags: ["One Pot Wonders", "vegan", "vegetarian", "no-cook", "high-protein"],
    nutrition: {
      calories: 220,
      protein: 12,
      carbs: 28,
      fat: 8,
      fiber: 8,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "3", unit: "", item: "cucumbers, sliced" },
      { amount: "1", unit: "can", item: "chickpeas, drained (15 oz)" },
      { amount: "1", unit: "cup", item: "edamame, shelled" },
      { amount: "1/2", unit: "", item: "red onion, thinly sliced" },
      { amount: "3", unit: "tbsp", item: "rice vinegar" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "sesame oil" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" },
      { amount: "2", unit: "", item: "green onions, chopped" }
    ],
    instructions: [
      "In large bowl, combine [3 cucumbers], [15 oz chickpeas], [1 cup edamame], [1/2 red onion].",
      "Whisk [3 tbsp rice vinegar], [2 tbsp soy sauce], [1 tbsp sesame oil].",
      "Pour dressing over salad, toss well.",
      "Top with [2 tbsp sesame seeds] and [2 green onions].",
      "Serve immediately or chill 30 minutes."
    ]
  },
  {
    id: "one-pot-lentil-bolognese",
    name: "Lentil Bolognese",
    description: "Hearty vegan twist on Italian classic. Red lentils create meaty texture.",
    cookTime: "30 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Dinner",
    image: "https://i.imgur.com/Uow7fjQ.png",
    totalTime: 40,
    tags: ["One Pot Wonders", "vegan", "vegetarian", "Italian", "pasta"],
    nutrition: {
      calories: 380,
      protein: 16,
      carbs: 62,
      fat: 8,
      fiber: 12,
      sugar: 10,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "cup", item: "red lentils, dried" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "2", unit: "", item: "carrots, diced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "can", item: "crushed tomatoes (28 oz)" },
      { amount: "2", unit: "cups", item: "vegetable broth" },
      { amount: "2", unit: "tbsp", item: "tomato paste" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" },
      { amount: "1", unit: "lb", item: "spaghetti" },
      { amount: "1/4", unit: "cup", item: "fresh basil" }
    ],
    instructions: [
      "Saut? [1 onion], [2 carrots], [4 cloves garlic] in olive oil until soft.",
      "Add [1 cup red lentils], [28 oz crushed tomatoes], [2 cups broth], [2 tbsp tomato paste].",
      "Stir in [2 tsp Italian seasoning], simmer 25 minutes until lentils tender.",
      "Cook [1 lb spaghetti] according to package.",
      "Serve sauce over pasta, top with [1/4 cup basil] and vegan parmesan."
    ]
  },
  {
    id: "one-pot-marry-me-chickpeas",
    name: "Marry Me Chickpeas",
    description: "Viral veggie version! Sun-dried tomato cream sauce with protein-packed chickpeas.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: marryMeChickpeasImg,
    totalTime: 30,
    tags: ["One Pot Wonders", "vegan", "vegetarian", "viral", "Mediterranean", "glutenfree"],
    nutrition: {
      calories: 340,
      protein: 14,
      carbs: 42,
      fat: 14,
      fiber: 10,
      sugar: 6,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "cans", item: "chickpeas, drained (30 oz)" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1/2", unit: "cup", item: "sun-dried tomatoes, chopped" },
      { amount: "1", unit: "can", item: "diced tomatoes (14 oz)" },
      { amount: "1", unit: "cup", item: "coconut cream" },
      { amount: "1/2", unit: "cup", item: "vegetable broth" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/4", unit: "tsp", item: "red pepper flakes" },
      { amount: "1/4", unit: "cup", item: "fresh basil" }
    ],
    instructions: [
      "In large skillet, saut? [4 cloves garlic] until fragrant.",
      "Add [30 oz chickpeas], [1/2 cup sun-dried tomatoes], [14 oz diced tomatoes].",
      "Stir in [1 cup coconut cream], [1/2 cup broth], [2 tsp Italian seasoning], [1/4 tsp red pepper flakes].",
      "Simmer 15 minutes until sauce thickens.",
      "Garnish with [1/4 cup basil]. Serve with crusty bread."
    ]
  },
  {
    id: "one-pot-tofu-scramble",
    name: "Tofu Scramble",
    description: "Better than eggs! Golden turmeric scramble packed with veggies.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/q4YrOgg.png",
    totalTime: 25,
    tags: ["One Pot Wonders", "vegan", "vegetarian", "breakfast", "high-protein", "glutenfree"],
    nutrition: {
      calories: 220,
      protein: 16,
      carbs: 14,
      fat: 12,
      fiber: 4,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "block", item: "extra-firm tofu (14 oz)" },
      { amount: "1", unit: "", item: "bell pepper, diced" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "2", unit: "cups", item: "spinach" },
      { amount: "1", unit: "tsp", item: "turmeric" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1/4", unit: "tsp", item: "black salt (kala namak)" },
      { amount: "2", unit: "tbsp", item: "nutritional yeast" },
      { amount: "", unit: "", item: "salt and pepper to taste" }
    ],
    instructions: [
      "Crumble [14 oz tofu] with hands into scrambled egg-sized pieces.",
      "In large pan, saut? [1 bell pepper] and [1 onion] until soft.",
      "Add crumbled tofu, [1 tsp turmeric], [1 tsp garlic powder], [1/4 tsp black salt].",
      "Cook 5-7 minutes, stirring occasionally.",
      "Add [2 cups spinach], cook until wilted.",
      "Stir in [2 tbsp nutritional yeast]. Season with salt and pepper."
    ]
  },
  {
    id: "one-pot-chickpea-curry",
    name: "Chickpea Curry",
    description: "Creamy coconut curry ready in 25 minutes. Comfort food at its finest.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: chickpeaCurryImg,
    totalTime: 30,
    tags: ["one-pot", "vegan", "vegetarian", "indian", "curry", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 14,
      carbs: 48,
      fat: 16,
      fiber: 12,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "cans", item: "chickpeas, drained (30 oz)" },
      { amount: "1", unit: "can", item: "coconut milk (14 oz)" },
      { amount: "1", unit: "can", item: "diced tomatoes (14 oz)" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tbsp", item: "curry powder" },
      { amount: "1", unit: "tsp", item: "garam masala" },
      { amount: "1", unit: "tsp", item: "ginger, minced" },
      { amount: "1/4", unit: "cup", item: "cilantro" }
    ],
    instructions: [
      "Saut? [1 onion], [4 cloves garlic], [1 tsp ginger] until fragrant.",
      "Add [2 tbsp curry powder] and [1 tsp garam masala], toast 1 minute.",
      "Stir in [30 oz chickpeas], [14 oz coconut milk], [14 oz tomatoes].",
      "Simmer 15 minutes until sauce thickens.",
      "Garnish with [1/4 cup cilantro]. Serve over rice."
    ]
  },
  {
    id: "one-pot-black-bean-rice-bowl",
    name: "Black Bean & Rice Bowl",
    description: "Cilantro-lime rice bowl with black beans, avocado, and fresh salsa.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Healthy Bowls",
    image: "https://i.imgur.com/JXlheZR.png",
    totalTime: 35,
    tags: ["One Pot Wonders", "vegan", "vegetarian", "Mexican", "bowl", "glutenfree"],
    nutrition: {
      calories: 420,
      protein: 14,
      carbs: 68,
      fat: 12,
      fiber: 14,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "white rice" },
      { amount: "1", unit: "can", item: "black beans (15 oz)" },
      { amount: "1", unit: "cup", item: "corn kernels" },
      { amount: "2", unit: "", item: "avocados, sliced" },
      { amount: "1", unit: "cup", item: "cherry tomatoes, halved" },
      { amount: "1/4", unit: "cup", item: "cilantro, chopped" },
      { amount: "2", unit: "", item: "limes, juiced" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "", unit: "", item: "salt to taste" }
    ],
    instructions: [
      "Cook [2 cups rice] according to package. Stir in [2 limes juice] and [1/4 cup cilantro].",
      "Heat [15 oz black beans] with [1 tsp cumin].",
      "Divide rice into 4 bowls.",
      "Top with black beans, [1 cup corn], [2 avocados], [1 cup tomatoes].",
      "Season with salt and extra lime juice."
    ]
  },
  {
    id: "one-pot-vegan-protein-pasta",
    name: "Vegan Protein Pasta",
    description: "Whole wheat pasta with white beans and spinach. 20g protein per serving!",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: veganProteinPastaImg,
    totalTime: 25,
    tags: ["One Pot Wonders", "vegan", "vegetarian", "pasta", "high-protein"],
    nutrition: {
      calories: 420,
      protein: 20,
      carbs: 68,
      fat: 8,
      fiber: 14,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "whole wheat pasta" },
      { amount: "1", unit: "can", item: "white beans, drained (15 oz)" },
      { amount: "4", unit: "cups", item: "spinach" },
      { amount: "1", unit: "cup", item: "cherry tomatoes, halved" },
      { amount: "6", unit: "cloves", item: "garlic, minced" },
      { amount: "1/4", unit: "cup", item: "olive oil" },
      { amount: "1/4", unit: "cup", item: "nutritional yeast" },
      { amount: "1/4", unit: "tsp", item: "red pepper flakes" },
      { amount: "", unit: "", item: "salt and pepper to taste" }
    ],
    instructions: [
      "Cook [1 lb pasta] according to package, reserve 1 cup pasta water.",
      "In large pan, heat [1/4 cup olive oil] with [6 cloves garlic].",
      "Add [15 oz white beans], [1 cup cherry tomatoes], [1/4 tsp red pepper flakes].",
      "Toss in cooked pasta and [4 cups spinach] with reserved pasta water.",
      "Stir in [1/4 cup nutritional yeast]. Season with salt and pepper."
    ]
  },
  // LUNCH IDEAS - VEGAN RECIPES
  {
    id: "lunch-king-oyster-mushroom-tacos",
    name: "King Oyster Mushroom Tacos",
    description: "TikTok sensation! Mushrooms that taste like carnitas. Mind-blowing texture.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/x2aIer5.png",
    totalTime: 35,
    tags: ["Lunch Ideas", "vegan", "vegetarian", "viral", "tacos"],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 42,
      fat: 10,
      fiber: 6,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "king oyster mushrooms" },
      { amount: "2", unit: "tbsp", item: "avocado oil" },
      { amount: "1", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "lime juice" },
      { amount: "1", unit: "tsp", item: "smoked paprika" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "8", unit: "", item: "corn tortillas" },
      { amount: "1", unit: "cup", item: "purple cabbage slaw" },
      { amount: "1/4", unit: "cup", item: "cilantro" }
    ],
    instructions: [
      "Score [1 lb mushrooms] lengthwise, tear into strips.",
      "Mix [2 tbsp oil], [1 tbsp soy sauce], [1 tbsp lime juice], [1 tsp paprika], [1 tsp cumin].",
      "Toss mushrooms in marinade, let sit 10 minutes.",
      "Grill or pan-fry mushrooms until charred and tender, 8-10 minutes.",
      "Warm [8 tortillas], fill with mushrooms, [1 cup slaw], [1/4 cup cilantro]."
    ]
  },
  {
    id: "lunch-oyster-mushroom-fried-chicken",
    name: "Oyster Mushroom Fried 'Chicken'",
    description: "Viral recipe! Crispy breaded mushrooms that fool carnivores every time.",
    cookTime: "20 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: oysterMushroomFriedChickenImg,
    totalTime: 40,
    tags: ["Lunch Ideas", "vegan", "vegetarian", "viral", "fried"],
    nutrition: {
      calories: 340,
      protein: 10,
      carbs: 48,
      fat: 14,
      fiber: 4,
      sugar: 2,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "oyster mushrooms" },
      { amount: "1", unit: "cup", item: "plant milk" },
      { amount: "1", unit: "tbsp", item: "hot sauce" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "1", unit: "cup", item: "panko breadcrumbs" },
      { amount: "1", unit: "tbsp", item: "paprika" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "tsp", item: "onion powder" },
      { amount: "", unit: "", item: "oil for frying" }
    ],
    instructions: [
      "Tear [1 lb mushrooms] into chicken-tender-sized pieces.",
      "Mix [1 cup plant milk] with [1 tbsp hot sauce].",
      "Combine [1 cup flour], [1 cup panko], [1 tbsp paprika], [1 tsp garlic powder], [1 tsp onion powder].",
      "Dip mushrooms in milk, then breadcrumb mixture. Double coat for extra crispy.",
      "Fry in 350?F oil until golden, 3-4 minutes per side.",
      "Serve with vegan ranch and pickles."
    ]
  },
  {
    id: "lunch-vegan-crunchwrap",
    name: "Vegan Crunchwrap",
    description: "TikTok famous! All the layers, all the crunch. Better than the original.",
    cookTime: "15 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Mexican",
    image: "https://i.imgur.com/H81EieO.png",
    totalTime: 30,
    tags: ["Lunch Ideas", "vegan", "vegetarian", "viral", "wrap"],
    nutrition: {
      calories: 480,
      protein: 16,
      carbs: 62,
      fat: 18,
      fiber: 12,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "4", unit: "", item: "large flour tortillas" },
      { amount: "4", unit: "", item: "small flour tortillas" },
      { amount: "1", unit: "lb", item: "seasoned black beans" },
      { amount: "1", unit: "cup", item: "vegan cheese shreds" },
      { amount: "1", unit: "cup", item: "lettuce, shredded" },
      { amount: "1", unit: "cup", item: "tomatoes, diced" },
      { amount: "1/2", unit: "cup", item: "vegan sour cream" },
      { amount: "4", unit: "", item: "tostada shells" }
    ],
    instructions: [
      "On [1 large tortilla], layer [1/4 lb beans], [1/4 cup cheese], [1 tostada shell].",
      "Top with lettuce, tomatoes, vegan sour cream.",
      "Place [1 small tortilla] on top, fold edges of large tortilla over.",
      "Grill seam-side down in hot pan until crispy, 3-4 minutes per side.",
      "Repeat for remaining 3 crunchwraps. Cut in half and serve."
    ]
  },
  {
    id: "lunch-charred-cabbage-coconut-broth",
    name: "Charred Cabbage with Coconut Broth",
    description: "TikTok viral elegance! Restaurant-quality vegan dish that looks stunning.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Asian Fusion",
    image: "https://i.imgur.com/1mzSPC1.png",
    totalTime: 35,
    tags: ["Lunch Ideas", "vegan", "vegetarian", "viral", "elegant"],
    nutrition: {
      calories: 280,
      protein: 6,
      carbs: 24,
      fat: 18,
      fiber: 8,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "head", item: "napa cabbage" },
      { amount: "1", unit: "can", item: "coconut milk (14 oz)" },
      { amount: "2", unit: "cups", item: "vegetable broth" },
      { amount: "2", unit: "tbsp", item: "red curry paste" },
      { amount: "1", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "lime juice" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" },
      { amount: "1/4", unit: "cup", item: "fresh herbs (cilantro, basil)" }
    ],
    instructions: [
      "Cut [1 head cabbage] into 4 wedges, keeping core intact.",
      "Char cabbage wedges in hot pan, 4 minutes per side.",
      "Whisk [14 oz coconut milk], [2 cups broth], [2 tbsp curry paste], [1 tbsp soy sauce].",
      "Simmer broth 10 minutes.",
      "Place charred cabbage in shallow bowls, pour broth around.",
      "Garnish with [1 tbsp lime juice], [2 tbsp sesame seeds], [1/4 cup herbs]."
    ]
  },
  {
    id: "lunch-hot-honey-tofu-tenders",
    name: "Hot Honey Tofu Tenders",
    description: "Sweet, spicy, crispy perfection. Viral recipe that converts tofu skeptics.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: hotHoneyTofuTendersImg,
    totalTime: 40,
    tags: ["Lunch Ideas", "vegan", "vegetarian", "viral", "spicy", "glutenfree"],
    nutrition: {
      calories: 380,
      protein: 18,
      carbs: 46,
      fat: 14,
      fiber: 3,
      sugar: 18,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "block", item: "extra-firm tofu (14 oz)" },
      { amount: "1", unit: "cup", item: "cornstarch" },
      { amount: "1/2", unit: "cup", item: "agave nectar" },
      { amount: "2", unit: "tbsp", item: "hot sauce" },
      { amount: "1", unit: "tbsp", item: "apple cider vinegar" },
      { amount: "1/2", unit: "tsp", item: "cayenne pepper" },
      { amount: "", unit: "", item: "oil for frying" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" }
    ],
    instructions: [
      "Press [14 oz tofu], cut into tender-sized strips.",
      "Toss in [1 cup cornstarch] until fully coated.",
      "Fry in 350?F oil until golden and crispy, 4-5 minutes.",
      "Mix [1/2 cup agave], [2 tbsp hot sauce], [1 tbsp vinegar], [1/2 tsp cayenne].",
      "Toss fried tofu in hot honey sauce.",
      "Sprinkle with [2 tbsp sesame seeds]. Serve with vegan ranch."
    ]
  },
  {
    id: "lunch-turkish-pasta",
    name: "Turkish Pasta",
    description: "Viral TikTok recipe! Angel hair with spiced tomato sauce and yogurt dollops.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: turkishPastaImg,
    totalTime: 30,
    tags: ["Lunch Ideas", "vegan", "vegetarian", "viral", "Turkish"],
    nutrition: {
      calories: 380,
      protein: 12,
      carbs: 64,
      fat: 10,
      fiber: 6,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "angel hair pasta" },
      { amount: "1", unit: "can", item: "tomato sauce (15 oz)" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "2", unit: "tsp", item: "paprika" },
      { amount: "1", unit: "tsp", item: "cumin" },
      { amount: "1/2", unit: "cup", item: "vegan yogurt" },
      { amount: "3", unit: "tbsp", item: "vegan butter" },
      { amount: "1", unit: "tbsp", item: "dried mint" },
      { amount: "1", unit: "tsp", item: "red pepper flakes" }
    ],
    instructions: [
      "Cook [1 lb angel hair] according to package.",
      "Saut? [4 cloves garlic] in oil, add [15 oz tomato sauce], [2 tsp paprika], [1 tsp cumin].",
      "Simmer sauce 10 minutes.",
      "Toss pasta with sauce, divide into bowls.",
      "Top each with dollop of [vegan yogurt].",
      "Brown [3 tbsp butter] with [1 tbsp mint] and [1 tsp red pepper flakes], drizzle over pasta."
    ]
  },
  {
    id: "lunch-vegan-steak-bites",
    name: "Vegan Steak Bites",
    description: "Marinated mushrooms or seitan that taste like real steak. Jaw-dropping texture.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: veganSteakBitesImg,
    totalTime: 35,
    tags: ["Lunch Ideas", "vegan", "vegetarian", "high-protein", "viral"],
    nutrition: {
      calories: 280,
      protein: 24,
      carbs: 18,
      fat: 12,
      fiber: 4,
      sugar: 4,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "lb", item: "king oyster mushrooms or seitan" },
      { amount: "1/4", unit: "cup", item: "soy sauce" },
      { amount: "2", unit: "tbsp", item: "balsamic vinegar" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1", unit: "tsp", item: "smoked paprika" },
      { amount: "1/4", unit: "cup", item: "chimichurri sauce" },
      { amount: "", unit: "", item: "black pepper to taste" }
    ],
    instructions: [
      "Cut [1 lb mushrooms/seitan] into bite-sized chunks.",
      "Mix [1/4 cup soy sauce], [2 tbsp balsamic], [2 tbsp oil], [4 cloves garlic], [1 tsp paprika], pepper.",
      "Marinate 15 minutes minimum.",
      "Thread onto skewers if desired.",
      "Sear in hot pan 3-4 minutes per side until charred.",
      "Drizzle with [1/4 cup chimichurri]. Serve immediately."
    ]
  },
  // QUICK AND EASY - VEGAN RECIPES
  {
    id: "quick-pasta-chips-vegan-feta-dip",
    name: "Pasta Chips with Vegan Feta Dip",
    description: "TikTok's most viral snack! Crispy baked pasta with creamy dip.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/dLr1V8G.png",
    totalTime: 25,
    tags: ["Quick and Easy", "vegan", "vegetarian", "viral", "snack"],
    nutrition: {
      calories: 320,
      protein: 10,
      carbs: 42,
      fat: 14,
      fiber: 3,
      sugar: 3,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "8", unit: "oz", item: "rigatoni or penne, cooked" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "1/4", unit: "cup", item: "parmesan (vegan)" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1", unit: "cup", item: "vegan feta, crumbled" },
      { amount: "1/2", unit: "cup", item: "vegan cream cheese" },
      { amount: "2", unit: "tbsp", item: "lemon juice" },
      { amount: "1/4", unit: "cup", item: "fresh herbs" }
    ],
    instructions: [
      "Toss [8 oz cooked pasta] with [2 tbsp oil], [1/4 cup vegan parm], [1 tsp garlic powder].",
      "Spread on baking sheet, bake at 400?F for 12-15 minutes until crispy.",
      "Blend [1 cup vegan feta], [1/2 cup cream cheese], [2 tbsp lemon juice] until smooth.",
      "Top dip with [1/4 cup herbs] and olive oil.",
      "Serve pasta chips with dip."
    ]
  },
  {
    id: "quick-air-fryer-tofu-bites",
    name: "Air Fryer Tofu Bites",
    description: "Perfectly crispy without the oil! Addictive snack ready in 20 minutes.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/WF94RNF.png",
    totalTime: 25,
    tags: ["quick", "vegan", "vegetarian", "air-fryer", "snack"],
    nutrition: {
      calories: 240,
      protein: 16,
      carbs: 24,
      fat: 10,
      fiber: 2,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "1", unit: "block", item: "extra-firm tofu (14 oz)" },
      { amount: "2", unit: "tbsp", item: "cornstarch" },
      { amount: "2", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tbsp", item: "sesame oil" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1/4", unit: "cup", item: "sweet chili sauce" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" },
      { amount: "2", unit: "", item: "green onions, sliced" }
    ],
    instructions: [
      "Press [14 oz tofu], cube into bite-sized pieces.",
      "Toss with [2 tbsp cornstarch], [2 tbsp soy sauce], [1 tbsp sesame oil], [1 tsp garlic powder].",
      "Air fry at 400?F for 15 minutes, shaking halfway.",
      "Toss with [1/4 cup sweet chili sauce].",
      "Top with [2 tbsp sesame seeds] and [2 green onions]."
    ]
  },
  {
    id: "quick-two-ingredient-pici-pasta",
    name: "Vegan Pici Pasta",
    description: "TikTok viral! Just flour and water make authentic Italian pasta.",
    cookTime: "5 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/SldTS5S.png",
    imageUrl: "https://i.imgur.com/SldTS5S.png",
    totalTime: 25,
    tags: ["Quick and Easy", "vegan", "vegetarian", "viral", "homemade"],
    nutrition: {
      calories: 320,
      protein: 10,
      carbs: 64,
      fat: 2,
      fiber: 3,
      sugar: 2,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "cups", item: "all-purpose flour" },
      { amount: "3/4", unit: "cup", item: "warm water" },
      { amount: "1", unit: "jar", item: "marinara sauce (24 oz)" },
      { amount: "1/4", unit: "cup", item: "fresh basil" },
      { amount: "", unit: "", item: "vegan parmesan" }
    ],
    instructions: [
      "Mix [2 cups flour] and [3/4 cup water] until dough forms.",
      "Knead 5 minutes, rest 10 minutes.",
      "Roll small pieces into thick spaghetti-like strands.",
      "Boil in salted water 3-4 minutes until tender.",
      "Toss with [24 oz marinara], [1/4 cup basil], vegan parmesan."
    ]
  },
  
  {
    id: "quick-korean-corn-cheese",
    name: "Korean Corn Cheese",
    description: "TikTok viral Korean side! Bubbling corn with melty cheese in minutes.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/omVld6i.png",
    totalTime: 15,
    tags: ["Quick and Easy", "vegan", "vegetarian", "viral", "Korean", "glutenfree"],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 38,
      fat: 12,
      fiber: 4,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "3", unit: "cups", item: "corn kernels (frozen or canned)" },
      { amount: "1", unit: "cup", item: "vegan mozzarella, shredded" },
      { amount: "2", unit: "tbsp", item: "vegan mayo" },
      { amount: "1", unit: "tbsp", item: "sugar" },
      { amount: "1/4", unit: "tsp", item: "salt" },
      { amount: "2", unit: "tbsp", item: "parsley, chopped" }
    ],
    instructions: [
      "In cast iron skillet, mix [3 cups corn], [1 cup vegan mozzarella], [2 tbsp mayo], [1 tbsp sugar], [1/4 tsp salt].",
      "Bake at 400?F for 10 minutes until bubbly and golden.",
      "Or broil for 5 minutes watching carefully.",
      "Garnish with [2 tbsp parsley].",
      "Serve hot with spoon."
    ]
  },
  {
    id: "quick-sesame-carrot-ribbons",
    name: "Sesame Carrot Ribbons",
    description: "Elegant side dish ready in 10 minutes. Restaurant-quality presentation.",
    cookTime: "5 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/S8NQ6ue.png",
    totalTime: 15,
    tags: ["Quick and Easy", "vegan", "vegetarian", "side", "elegant"],
    nutrition: {
      calories: 140,
      protein: 3,
      carbs: 18,
      fat: 7,
      fiber: 4,
      sugar: 8,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "6", unit: "", item: "large carrots" },
      { amount: "2", unit: "tbsp", item: "rice vinegar" },
      { amount: "1", unit: "tbsp", item: "sesame oil" },
      { amount: "1", unit: "tbsp", item: "soy sauce" },
      { amount: "1", unit: "tsp", item: "agave nectar" },
      { amount: "2", unit: "tbsp", item: "sesame seeds" },
      { amount: "1/4", unit: "cup", item: "cilantro, chopped" }
    ],
    instructions: [
      "Use vegetable peeler to create ribbons from [6 carrots].",
      "Whisk [2 tbsp rice vinegar], [1 tbsp sesame oil], [1 tbsp soy sauce], [1 tsp agave].",
      "Toss carrot ribbons with dressing.",
      "Top with [2 tbsp sesame seeds] and [1/4 cup cilantro].",
      "Serve immediately or chill."
    ]
  },
  {
    id: "quick-cloud-bread",
    name: "Cloud Bread",
    description: "TikTok viral! Fluffy, airy bread that melts in your mouth. So aesthetic!",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "Quick and Easy",
    image: "https://i.imgur.com/3HAfVoS.png",
    totalTime: 35,
    tags: ["Quick and Easy", "vegan", "vegetarian", "viral", "bread"],
    nutrition: {
      calories: 180,
      protein: 6,
      carbs: 32,
      fat: 4,
      fiber: 2,
      sugar: 8,
      servingSize: "1 piece"
    },
    ingredients: [
      { amount: "3", unit: "tbsp", item: "aquafaba (chickpea liquid)" },
      { amount: "1/4", unit: "tsp", item: "cream of tartar" },
      { amount: "3", unit: "tbsp", item: "sugar" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "1/2", unit: "tsp", item: "baking powder" },
      { amount: "1/4", unit: "cup", item: "plant milk" },
      { amount: "", unit: "", item: "food coloring (optional)" }
    ],
    instructions: [
      "Whip [3 tbsp aquafaba] with [1/4 tsp cream of tartar] to stiff peaks.",
      "Gradually add [3 tbsp sugar], whip until glossy.",
      "Fold in [1 cup flour], [1/2 tsp baking powder], [1/4 cup plant milk].",
      "Add food coloring if desired.",
      "Pipe into rounds on parchment, bake at 300?F for 25 minutes.",
      "Cool completely before eating - they're cloud-light!"
    ]
  },
  {
    id: "quick-vegan-custard-toast",
    name: "Vegan Custard Toast",
    description: "Viral breakfast! Caramelized custard top with fluffy interior. Pure magic.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "medium",
    servings: 2,
    cuisine: "Breakfast",
    image: "https://i.imgur.com/H6WEFFf.png",
    totalTime: 25,
    tags: ["Quick and Easy", "vegan", "vegetarian", "viral", "breakfast"],
    nutrition: {
      calories: 380,
      protein: 8,
      carbs: 56,
      fat: 14,
      fiber: 3,
      sugar: 24,
      servingSize: "1 serving"
    },
    ingredients: [
      { amount: "2", unit: "slices", item: "thick bread" },
      { amount: "1/2", unit: "cup", item: "plant milk" },
      { amount: "2", unit: "tbsp", item: "cornstarch" },
      { amount: "3", unit: "tbsp", item: "sugar" },
      { amount: "1", unit: "tsp", item: "vanilla extract" },
      { amount: "2", unit: "tbsp", item: "vegan butter" },
      { amount: "1/4", unit: "cup", item: "berries" },
      { amount: "", unit: "", item: "powdered sugar" }
    ],
    instructions: [
      "Cut pocket in [2 slices bread], toast lightly.",
      "Whisk [1/2 cup plant milk], [2 tbsp cornstarch], [3 tbsp sugar], [1 tsp vanilla].",
      "Pour custard into bread pockets, press to seal.",
      "Melt [2 tbsp butter] in pan, fry toast until golden and caramelized, 3-4 minutes per side.",
      "Top with [1/4 cup berries] and powdered sugar."
    ]
  },
  
  // Dinner Recipes
  {
    id: "dinner-smash-burger-tacos",
    name: "Smash Burger Tacos",
    description: "Viral TikTok hit! Crispy smashed beef patties in tortillas with all the burger fixings.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "American Fusion",
    image: "https://i.imgur.com/ZjZgGa5.png",
    totalTime: 25,
    tags: ["Dinner", "viral", "beef"],
    nutrition: { calories: 520, protein: 28, carbs: 42, fat: 26, fiber: 3, sugar: 6, servingSize: "2 tacos" },
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "8", unit: "", item: "small flour tortillas" },
      { amount: "8", unit: "slices", item: "American cheese" },
      { amount: "1", unit: "cup", item: "shredded lettuce" },
      { amount: "1", unit: "", item: "tomato, diced" },
      { amount: "1/4", unit: "cup", item: "pickles" },
      { amount: "1/4", unit: "cup", item: "special sauce" },
      { amount: "", unit: "", item: "salt and pepper" }
    ],
    instructions: [
      "Heat skillet over high heat. Form [1 lb ground beef] into 8 balls.",
      "Place ball on [tortilla], smash flat with spatula. Season with salt and pepper.",
      "Cook 2-3 minutes until crispy, flip with tortilla attached.",
      "Add [cheese slice], cook 1 minute more.",
      "Top with [lettuce], [tomato], [pickles], and [special sauce].",
      "Fold and serve immediately while crispy!"
    ]
  },
  {
    id: "dinner-garlic-parm-accordion-potatoes",
    name: "Garlic Parm Accordion Potatoes",
    description: "TikTok viral! Hasselback potatoes loaded with garlic butter and parmesan.",
    cookTime: "50 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/9FybzHI.png",
    totalTime: 65,
    tags: ["Dinner", "viral", "vegetarian", "side dish", "glutenfree"],
    nutrition: { calories: 340, protein: 9, carbs: 48, fat: 14, fiber: 4, sugar: 2, servingSize: "1 potato" },
    ingredients: [
      { amount: "4", unit: "", item: "large russet potatoes" },
      { amount: "4", unit: "tbsp", item: "butter, melted" },
      { amount: "4", unit: "cloves", item: "garlic, minced" },
      { amount: "1/2", unit: "cup", item: "grated parmesan" },
      { amount: "2", unit: "tbsp", item: "fresh parsley" },
      { amount: "", unit: "", item: "salt and pepper" }
    ],
    instructions: [
      "Preheat oven to 425?F. Slice [4 potatoes] thinly but not all the way through.",
      "Mix [4 tbsp butter] with [4 cloves garlic]. Brush over potatoes.",
      "Season with salt and pepper. Bake 45 minutes.",
      "Sprinkle [1/2 cup parmesan] between slices. Bake 5 more minutes.",
      "Garnish with [2 tbsp parsley]. Serve hot!"
    ]
  },
  {
    id: "dinner-corn-ribs-elote",
    name: "Corn Ribs with Elote Sauce",
    description: "Viral corn ribs! Corn cut like ribs, charred and drizzled with creamy elote sauce.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Mexican Fusion",
    image: "https://i.imgur.com/0isFAVr.jpeg",
    totalTime: 35,
    tags: ["Dinner", "viral", "vegetarian", "glutenfree"],
    nutrition: { calories: 280, protein: 7, carbs: 36, fat: 14, fiber: 4, sugar: 8, servingSize: "1 serving" },
    ingredients: [
      { amount: "4", unit: "", item: "corn cobs" },
      { amount: "1/2", unit: "cup", item: "mayo" },
      { amount: "1/4", unit: "cup", item: "sour cream" },
      { amount: "1/4", unit: "cup", item: "cotija cheese" },
      { amount: "1", unit: "tsp", item: "chili powder" },
      { amount: "1", unit: "", item: "lime, juiced" },
      { amount: "2", unit: "tbsp", item: "cilantro" }
    ],
    instructions: [
      "Cut [4 corn cobs] lengthwise into quarters to create 'ribs'.",
      "Brush with oil, air fry at 400?F for 15 minutes until charred.",
      "Mix [1/2 cup mayo], [1/4 cup sour cream], [1 lime juice], [1 tsp chili powder].",
      "Drizzle elote sauce over corn ribs.",
      "Top with [1/4 cup cotija] and [2 tbsp cilantro]. Serve immediately!"
    ]
  },
  {
    id: "dinner-baked-feta-pasta",
    name: "Baked Feta Pasta",
    description: "The viral TikTok recipe! Whole feta block baked with tomatoes creates creamy sauce.",
    cookTime: "30 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Mediterranean",
    image: "https://i.imgur.com/EQtQrk4.png",
    totalTime: 35,
    tags: ["Dinner", "viral", "vegetarian", "pasta"],
    nutrition: { calories: 480, protein: 16, carbs: 54, fat: 22, fiber: 4, sugar: 6, servingSize: "1 serving" },
    ingredients: [
      { amount: "1", unit: "block (8oz)", item: "feta cheese" },
      { amount: "2", unit: "pints", item: "cherry tomatoes" },
      { amount: "1/4", unit: "cup", item: "olive oil" },
      { amount: "4", unit: "cloves", item: "garlic" },
      { amount: "12", unit: "oz", item: "pasta" },
      { amount: "1/4", unit: "cup", item: "fresh basil" },
      { amount: "", unit: "", item: "red pepper flakes" }
    ],
    instructions: [
      "Preheat oven to 400?F. Place [feta block] in center of baking dish.",
      "Surround with [2 pints tomatoes] and [4 cloves garlic]. Drizzle with [1/4 cup olive oil].",
      "Bake 30 minutes until tomatoes burst and feta is golden.",
      "Cook [12 oz pasta] according to package directions.",
      "Mash feta and tomatoes together, mix with pasta.",
      "Top with [fresh basil] and red pepper flakes. Serve warm!"
    ]
  },
  {
    id: "dinner-million-dollar-spaghetti",
    name: "Million Dollar Spaghetti",
    description: "Viral baked pasta! Layered spaghetti with cream cheese and meat sauce.",
    cookTime: "40 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 8,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/cTRKVL8.png",
    totalTime: 60,
    tags: ["Dinner", "viral", "pasta", "casserole"],
    nutrition: { calories: 580, protein: 32, carbs: 48, fat: 28, fiber: 3, sugar: 8, servingSize: "1 serving" },
    ingredients: [
      { amount: "1", unit: "lb", item: "spaghetti" },
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "24", unit: "oz", item: "marinara sauce" },
      { amount: "8", unit: "oz", item: "cream cheese" },
      { amount: "1", unit: "cup", item: "sour cream" },
      { amount: "2", unit: "cups", item: "mozzarella, shredded" },
      { amount: "1/2", unit: "cup", item: "parmesan" }
    ],
    instructions: [
      "Cook [1 lb spaghetti], drain. Brown [1 lb ground beef], add [24 oz marinara].",
      "Mix [8 oz cream cheese] with [1 cup sour cream] until smooth.",
      "Layer half spaghetti in 9x13 dish, spread cream cheese mixture.",
      "Top with remaining spaghetti, then meat sauce.",
      "Sprinkle [2 cups mozzarella] and [1/2 cup parmesan].",
      "Bake at 350?F for 30 minutes until bubbly and golden."
    ]
  },
  {
    id: "dinner-ground-beef-tortellini",
    name: "Ground Beef Tortellini",
    description: "Viral comfort food! Cheese tortellini in rich meat sauce, ready in 20 minutes.",
    cookTime: "15 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/fbicAPJ.png",
    totalTime: 20,
    tags: ["dinner", "one-pot", "pasta", "glutenfree"],
    nutrition: { calories: 520, protein: 28, carbs: 52, fat: 20, fiber: 3, sugar: 6, servingSize: "1 serving" },
    ingredients: [
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "20", unit: "oz", item: "cheese tortellini" },
      { amount: "24", unit: "oz", item: "marinara sauce" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1/2", unit: "cup", item: "parmesan" },
      { amount: "2", unit: "tsp", item: "Italian seasoning" },
      { amount: "1/4", unit: "cup", item: "fresh basil" }
    ],
    instructions: [
      "Brown [1 lb ground beef], drain. Add [24 oz marinara] and [2 tsp Italian seasoning].",
      "Cook [20 oz tortellini] according to package, drain.",
      "Stir [1 cup cream] into meat sauce, simmer 3 minutes.",
      "Add tortellini to sauce, toss to coat.",
      "Top with [1/2 cup parmesan] and [fresh basil]. Serve hot!"
    ]
  },
  {
    id: "dinner-chicken-parmesan",
    name: "Chicken Parmesan",
    description: "Classic Italian-American! Breaded chicken with marinara and melted mozzarella.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Italian-American",
    image: "https://i.imgur.com/hFomm8D.png",
    totalTime: 40,
    tags: ["Dinner", "chicken", "classic"],
    nutrition: { calories: 620, protein: 48, carbs: 42, fat: 28, fiber: 3, sugar: 6, servingSize: "1 serving" },
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" },
      { amount: "1", unit: "cup", item: "breadcrumbs" },
      { amount: "1/2", unit: "cup", item: "parmesan, grated" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "2", unit: "cups", item: "marinara sauce" },
      { amount: "1", unit: "cup", item: "mozzarella, shredded" },
      { amount: "8", unit: "oz", item: "spaghetti" }
    ],
    instructions: [
      "Pound [4 chicken breasts] to even thickness. Mix [1 cup breadcrumbs] and [1/2 cup parmesan].",
      "Dip chicken in [2 beaten eggs], then breadcrumb mixture.",
      "Pan-fry in oil until golden, 4-5 minutes per side.",
      "Top with [marinara] and [mozzarella], broil until melted.",
      "Serve over cooked [spaghetti]. Garnish with basil!"
    ]
  },
  {
    id: "dinner-garden-focaccia",
    name: "Garden Focaccia",
    description: "Viral art bread! Vegetables arranged to look like a garden on fluffy focaccia.",
    cookTime: "25 mins",
    prepTime: "2 hours",
    difficulty: "hard",
    servings: 8,
    cuisine: "Italian",
    image: gardenFocacciaImg,
    totalTime: 145,
    tags: ["Dinner", "viral", "bread", "vegetarian"],
    nutrition: { calories: 280, protein: 7, carbs: 48, fat: 8, fiber: 2, sugar: 2, servingSize: "1 slice" },
    ingredients: [
      { amount: "4", unit: "cups", item: "bread flour" },
      { amount: "2", unit: "tsp", item: "yeast" },
      { amount: "1", unit: "tbsp", item: "honey" },
      { amount: "1/4", unit: "cup", item: "olive oil" },
      { amount: "1", unit: "cup", item: "cherry tomatoes" },
      { amount: "1", unit: "", item: "bell pepper" },
      { amount: "", unit: "", item: "fresh herbs" }
    ],
    instructions: [
      "Mix [4 cups flour], [2 tsp yeast], [1 tbsp honey], water. Let rise 2 hours.",
      "Spread dough in oiled pan, dimple with fingers.",
      "Arrange [tomatoes], [bell pepper], [herbs] in garden design.",
      "Drizzle with [olive oil], season with salt.",
      "Bake at 425?F for 20-25 minutes until golden. Cool and serve!"
    ]
  },
  {
    id: "dinner-turkish-layered-pasta",
    name: "Turkish Layered Pasta",
    description: "Viral Ottoman dish! Layers of pasta, meat sauce, and b?chamel baked to perfection.",
    cookTime: "45 mins",
    prepTime: "30 mins",
    difficulty: "hard",
    servings: 8,
    cuisine: "Turkish",
    image: turkishLayeredPastaImg,
    totalTime: 75,
    tags: ["Dinner", "viral", "pasta"],
    nutrition: { calories: 540, protein: 26, carbs: 54, fat: 24, fiber: 3, sugar: 6, servingSize: "1 serving" },
    ingredients: [
      { amount: "1", unit: "lb", item: "pasta" },
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1", unit: "", item: "onion, diced" },
      { amount: "2", unit: "cups", item: "milk" },
      { amount: "4", unit: "tbsp", item: "butter" },
      { amount: "4", unit: "tbsp", item: "flour" },
      { amount: "2", unit: "cups", item: "mozzarella" }
    ],
    instructions: [
      "Cook [1 lb pasta], drain. Brown [1 lb beef] with [onion].",
      "Make b?chamel: melt [4 tbsp butter], whisk in [4 tbsp flour], add [2 cups milk].",
      "Layer half pasta, all meat, remaining pasta in baking dish.",
      "Pour b?chamel over top, sprinkle with [2 cups mozzarella].",
      "Bake at 375?F for 35-40 minutes until golden. Let rest 10 minutes before serving!"
    ]
  },
  {
    id: "dinner-gigi-hadid-vodka-pasta",
    name: "Gigi Hadid's Vodka Pasta",
    description: "Viral celebrity recipe! Creamy pink vodka sauce that's rich and delicious.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/tcAf1u3.png",
    totalTime: 30,
    tags: ["dinner", "viral", "pasta", "celebrity", "one-pot"],
    nutrition: { calories: 520, protein: 14, carbs: 58, fat: 26, fiber: 3, sugar: 6, servingSize: "1 serving" },
    ingredients: [
      { amount: "1", unit: "lb", item: "penne pasta" },
      { amount: "2", unit: "tbsp", item: "olive oil" },
      { amount: "3", unit: "cloves", item: "garlic, minced" },
      { amount: "1/4", unit: "cup", item: "vodka" },
      { amount: "1", unit: "cup", item: "tomato paste" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1/2", unit: "cup", item: "parmesan" },
      { amount: "", unit: "", item: "red pepper flakes" }
    ],
    instructions: [
      "Cook [1 lb penne] until al dente. Reserve 1 cup pasta water.",
      "Saut? [3 cloves garlic] in [2 tbsp olive oil]. Add [1 cup tomato paste].",
      "Add [1/4 cup vodka], cook 2 minutes. Stir in [1 cup cream].",
      "Add pasta with reserved water, toss until creamy.",
      "Stir in [1/2 cup parmesan]. Top with red pepper flakes and serve!"
    ]
  },
  {
    id: "dinner-one-pan-chicken-gravy",
    name: "One Pan Chicken & Gravy",
    description: "Viral 30-minute meal! Juicy chicken in creamy brown gravy, all in one pan.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: onePanChickenGravyImg,
    totalTime: 30,
    tags: ["dinner", "chicken", "one-pot"],
    nutrition: { calories: 380, protein: 42, carbs: 12, fat: 18, fiber: 1, sugar: 2, servingSize: "1 serving" },
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" },
      { amount: "2", unit: "tbsp", item: "butter" },
      { amount: "2", unit: "tbsp", item: "flour" },
      { amount: "2", unit: "cups", item: "chicken broth" },
      { amount: "1/2", unit: "cup", item: "heavy cream" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "", unit: "", item: "fresh thyme" }
    ],
    instructions: [
      "Season [4 chicken breasts], pan-sear until golden, remove.",
      "Melt [2 tbsp butter], whisk in [2 tbsp flour]. Cook 1 minute.",
      "Slowly add [2 cups broth], whisking constantly.",
      "Stir in [1/2 cup cream] and [1 tsp garlic powder].",
      "Return chicken to pan, simmer 10 minutes. Garnish with [thyme]!"
    ]
  },
  {
    id: "dinner-garlic-parm-chicken-potato-skillet",
    name: "Garlic Parmesan Chicken & Potato Skillet",
    description: "One-pan wonder! Crispy chicken and roasted potatoes in garlic parmesan sauce.",
    cookTime: "30 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/5o0yEyS.png",
    totalTime: 45,
    tags: ["Dinner", "chicken", "one-pot", "glutenfree"],
    nutrition: { calories: 520, protein: 38, carbs: 42, fat: 22, fiber: 4, sugar: 2, servingSize: "1 serving" },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "chicken thighs" },
      { amount: "1", unit: "lb", item: "baby potatoes, halved" },
      { amount: "4", unit: "tbsp", item: "butter" },
      { amount: "6", unit: "cloves", item: "garlic, minced" },
      { amount: "1/2", unit: "cup", item: "parmesan" },
      { amount: "2", unit: "tbsp", item: "fresh parsley" }
    ],
    instructions: [
      "Sear [1.5 lbs chicken] skin-side down until golden, remove.",
      "Add [1 lb potatoes] to skillet, cook until golden.",
      "Melt [4 tbsp butter], add [6 cloves garlic]. Cook 1 minute.",
      "Return chicken, sprinkle [1/2 cup parmesan]. Bake at 400?F for 20 minutes.",
      "Garnish with [2 tbsp parsley]. Serve hot!"
    ]
  },
  {
    id: "dinner-bbq-cheeseburger-sliders",
    name: "BBQ Cheeseburger Sliders",
    description: "Party favorite! Mini burgers on Hawaiian rolls with BBQ sauce and melted cheese.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 12,
    cuisine: "Dinner",
    image: "https://i.imgur.com/BJ1aRuN.png",
    totalTime: 35,
    tags: ["Dinner", "beef", "party food"],
    nutrition: { calories: 340, protein: 18, carbs: 28, fat: 18, fiber: 1, sugar: 8, servingSize: "2 sliders" },
    ingredients: [
      { amount: "12", unit: "", item: "Hawaiian sweet rolls" },
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1/2", unit: "cup", item: "BBQ sauce" },
      { amount: "12", unit: "slices", item: "cheddar cheese" },
      { amount: "1/4", unit: "cup", item: "pickles" },
      { amount: "3", unit: "tbsp", item: "butter, melted" }
    ],
    instructions: [
      "Brown [1 lb ground beef], mix with [1/2 cup BBQ sauce].",
      "Slice [12 Hawaiian rolls] in half, place bottoms in baking dish.",
      "Layer beef mixture, [12 cheese slices], [pickles].",
      "Top with roll tops, brush with [3 tbsp melted butter].",
      "Bake at 350?F for 15 minutes until cheese melts. Serve warm!"
    ]
  },
  {
    id: "dinner-hot-honey-chicken-sheet-pan",
    name: "Hot Honey Chicken Sheet Pan Dinner",
    description: "Sweet and spicy! Crispy chicken with hot honey glaze and roasted vegetables.",
    cookTime: "35 mins",
    prepTime: "15 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/qEkzHQb.png",
    totalTime: 50,
    tags: ["Dinner", "chicken", "sheet pan", "glutenfree"],
    nutrition: { calories: 480, protein: 38, carbs: 42, fat: 18, fiber: 5, sugar: 24, servingSize: "1 serving" },
    ingredients: [
      { amount: "1.5", unit: "lbs", item: "chicken thighs" },
      { amount: "2", unit: "cups", item: "broccoli florets" },
      { amount: "2", unit: "cups", item: "bell peppers, sliced" },
      { amount: "1/3", unit: "cup", item: "honey" },
      { amount: "2", unit: "tbsp", item: "hot sauce" },
      { amount: "2", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Preheat oven to 425?F. Season [1.5 lbs chicken].",
      "Toss [2 cups broccoli] and [2 cups peppers] with [2 tbsp oil].",
      "Arrange chicken and vegetables on sheet pan.",
      "Mix [1/3 cup honey] with [2 tbsp hot sauce], brush on chicken.",
      "Bake 30-35 minutes, brushing with more hot honey halfway. Serve!"
    ]
  },
  {
    id: "dinner-loaded-chicken-twice-baked-potato",
    name: "Loaded Chicken Twice Baked Potato",
    description: "Ultimate comfort! Potato skins filled with creamy mashed potatoes, chicken, cheese, and bacon.",
    cookTime: "1 hour",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/ngLDVRv.png",
    totalTime: 80,
    tags: ["Dinner", "chicken", "comfort food", "glutenfree"],
    nutrition: { calories: 580, protein: 32, carbs: 52, fat: 26, fiber: 5, sugar: 3, servingSize: "1 potato" },
    ingredients: [
      { amount: "4", unit: "", item: "large russet potatoes" },
      { amount: "2", unit: "cups", item: "cooked chicken, shredded" },
      { amount: "1/2", unit: "cup", item: "sour cream" },
      { amount: "4", unit: "tbsp", item: "butter" },
      { amount: "1.5", unit: "cups", item: "cheddar, shredded" },
      { amount: "6", unit: "slices", item: "bacon, cooked" },
      { amount: "1/4", unit: "cup", item: "green onions" }
    ],
    instructions: [
      "Bake [4 potatoes] at 400?F for 50 minutes. Cut in half, scoop out insides.",
      "Mash potato with [4 tbsp butter], [1/2 cup sour cream], [1 cup cheddar].",
      "Mix in [2 cups chicken]. Refill potato skins.",
      "Top with remaining [cheese] and [bacon]. Bake 15 minutes.",
      "Garnish with [green onions]. Serve hot!"
    ]
  },
  {
    id: "dinner-roasted-garlic-parm-chicken",
    name: "Roasted Garlic Parmesan Chicken",
    description: "Herb-crusted perfection! Golden parmesan crust with roasted garlic and fresh herbs.",
    cookTime: "35 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Italian-American",
    image: roastedGarlicParmChickenImg,
    totalTime: 50,
    tags: ["Dinner", "chicken"],
    nutrition: { calories: 420, protein: 46, carbs: 8, fat: 22, fiber: 1, sugar: 1, servingSize: "1 serving" },
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" },
      { amount: "1", unit: "cup", item: "parmesan, grated" },
      { amount: "1/2", unit: "cup", item: "breadcrumbs" },
      { amount: "8", unit: "cloves", item: "garlic, whole" },
      { amount: "2", unit: "tbsp", item: "fresh rosemary" },
      { amount: "3", unit: "tbsp", item: "olive oil" }
    ],
    instructions: [
      "Preheat oven to 400?F. Mix [1 cup parmesan], [1/2 cup breadcrumbs], [2 tbsp rosemary].",
      "Brush [4 chicken breasts] with [3 tbsp oil], coat with parmesan mixture.",
      "Scatter [8 garlic cloves] around chicken in baking dish.",
      "Roast 30-35 minutes until golden and cooked through.",
      "Squeeze roasted garlic over chicken. Serve with fresh herbs!"
    ]
  },
  {
    id: "dinner-easy-chicken-pot-pie",
    name: "Easy Chicken Pot Pie",
    description: "Classic comfort! Creamy chicken and vegetables topped with golden puff pastry.",
    cookTime: "35 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 6,
    cuisine: "Dinner",
    image: "https://i.imgur.com/eS3j8Yc.png",
    totalTime: 55,
    tags: ["Dinner", "chicken", "comfort food", "glutenfree"],
    nutrition: { calories: 520, protein: 28, carbs: 42, fat: 26, fiber: 4, sugar: 4, servingSize: "1 serving" },
    ingredients: [
      { amount: "3", unit: "cups", item: "cooked chicken, diced" },
      { amount: "2", unit: "cups", item: "mixed vegetables" },
      { amount: "1", unit: "can", item: "cream of chicken soup" },
      { amount: "1", unit: "cup", item: "chicken broth" },
      { amount: "1", unit: "sheet", item: "puff pastry" },
      { amount: "2", unit: "tbsp", item: "butter" }
    ],
    instructions: [
      "Preheat oven to 400?F. Mix [3 cups chicken], [2 cups vegetables], [cream soup], [1 cup broth].",
      "Pour into pie dish or casserole.",
      "Top with [puff pastry], cut slits for steam.",
      "Brush with melted [2 tbsp butter].",
      "Bake 30-35 minutes until golden and bubbling. Let rest 10 minutes!"
    ]
  },
  {
    id: "dinner-vodka-tortiglioni-burrata",
    name: "Vodka Tortiglioni & Burrata",
    description: "Restaurant-quality! Creamy vodka sauce with torn burrata and fresh basil.",
    cookTime: "20 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "One Pot Wonders",
    image: "https://i.imgur.com/paEAIDg.png",
    totalTime: 30,
    tags: ["dinner", "pasta", "vegetarian", "one-pot"],
    nutrition: { calories: 580, protein: 18, carbs: 62, fat: 28, fiber: 3, sugar: 6, servingSize: "1 serving" },
    ingredients: [
      { amount: "1", unit: "lb", item: "tortiglioni pasta" },
      { amount: "1/4", unit: "cup", item: "vodka" },
      { amount: "1", unit: "cup", item: "tomato sauce" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "8", unit: "oz", item: "burrata cheese" },
      { amount: "1/4", unit: "cup", item: "fresh basil" },
      { amount: "", unit: "", item: "red pepper flakes" }
    ],
    instructions: [
      "Cook [1 lb tortiglioni] until al dente.",
      "Simmer [1 cup tomato sauce] with [1/4 cup vodka] for 3 minutes.",
      "Stir in [1 cup cream], simmer until thickened.",
      "Toss pasta with sauce.",
      "Tear [8 oz burrata] over top, garnish with [basil] and red pepper flakes!"
    ]
  },
  {
    id: "dinner-pizza-pancakes",
    name: "Pizza Pancakes",
    description: "Viral savory breakfast-for-dinner! Fluffy pancakes with pizza toppings.",
    cookTime: "15 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "American Fusion",
    image: "https://i.imgur.com/PhEaO17.png",
    totalTime: 25,
    tags: ["Dinner", "viral", "fun", "glutenfree"],
    nutrition: { calories: 420, protein: 18, carbs: 48, fat: 18, fiber: 2, sugar: 6, servingSize: "2 pancakes" },
    ingredients: [
      { amount: "2", unit: "cups", item: "pancake mix" },
      { amount: "1", unit: "cup", item: "marinara sauce" },
      { amount: "1", unit: "cup", item: "mozzarella, shredded" },
      { amount: "1/4", unit: "cup", item: "mini pepperoni" },
      { amount: "2", unit: "tbsp", item: "Italian seasoning" },
      { amount: "1/4", unit: "cup", item: "parmesan" }
    ],
    instructions: [
      "Make [pancake mix] batter, stir in [2 tbsp Italian seasoning].",
      "Cook pancakes on griddle until golden.",
      "Top each with [marinara], [mozzarella], and [pepperoni].",
      "Cover and cook until cheese melts.",
      "Stack and serve with [parmesan]!"
    ]
  },
  {
    id: "dinner-fried-chicken-ramen",
    name: "Fried Chicken Ramen",
    description: "Viral upgrade! Crispy fried chicken tops rich ramen with soft-boiled egg.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "medium",
    servings: 2,
    cuisine: "Asian Fusion",
    image: friedChickenRamenImg,
    totalTime: 35,
    tags: ["Dinner", "viral", "ramen", "chicken"],
    nutrition: { calories: 680, protein: 38, carbs: 72, fat: 28, fiber: 4, sugar: 4, servingSize: "1 bowl" },
    ingredients: [
      { amount: "2", unit: "packs", item: "instant ramen" },
      { amount: "2", unit: "", item: "chicken cutlets" },
      { amount: "1", unit: "cup", item: "panko breadcrumbs" },
      { amount: "2", unit: "", item: "soft-boiled eggs" },
      { amount: "1/4", unit: "cup", item: "green onions" },
      { amount: "2", unit: "sheets", item: "nori" }
    ],
    instructions: [
      "Bread [2 chicken cutlets] in [panko], fry until crispy.",
      "Prepare [2 ramen packs] with extra water for broth.",
      "Top ramen with sliced fried chicken, [soft-boiled eggs].",
      "Garnish with [green onions] and [nori].",
      "Serve immediately while chicken is crispy!"
    ]
  },
  {
    id: "dinner-turkey-grilled-cheese",
    name: "Turkey Grilled Cheese",
    description: "Elevated classic! Turkey, cranberry sauce, and melty cheese on sourdough.",
    cookTime: "10 mins",
    prepTime: "5 mins",
    difficulty: "easy",
    servings: 2,
    cuisine: "Fall Favorites",
    image: turkeyGrilledCheeseImg,
    totalTime: 15,
    tags: ["fall", "sandwich", "comfort-food"],
    nutrition: { calories: 520, protein: 32, carbs: 48, fat: 22, fiber: 3, sugar: 12, servingSize: "1 sandwich" },
    ingredients: [
      { amount: "4", unit: "slices", item: "sourdough bread" },
      { amount: "8", unit: "oz", item: "turkey, sliced" },
      { amount: "4", unit: "slices", item: "cheddar cheese" },
      { amount: "1/4", unit: "cup", item: "cranberry sauce" },
      { amount: "2", unit: "tbsp", item: "butter" }
    ],
    instructions: [
      "Spread [cranberry sauce] on 2 slices of [sourdough].",
      "Layer [turkey] and [cheddar] on each.",
      "Top with remaining bread slices.",
      "Butter outside of sandwiches with [2 tbsp butter].",
      "Grill until golden and cheese melts. Cut and serve!"
    ]
  },
  {
    id: "dinner-loaded-ranch-potatoes",
    name: "Loaded Ranch Potatoes",
    description: "Addictive side! Crispy roasted potato wedges loaded with ranch, cheese, and bacon.",
    cookTime: "35 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Dinner",
    image: "https://i.imgur.com/k4dyQvZ.png",
    totalTime: 45,
    tags: ["Dinner", "side dish", "potatoes", "glutenfree"],
    nutrition: { calories: 380, protein: 12, carbs: 48, fat: 18, fiber: 5, sugar: 2, servingSize: "1 serving" },
    ingredients: [
      { amount: "2", unit: "lbs", item: "russet potatoes, cut into wedges" },
      { amount: "3", unit: "tbsp", item: "ranch seasoning" },
      { amount: "3", unit: "tbsp", item: "olive oil" },
      { amount: "1", unit: "cup", item: "cheddar, shredded" },
      { amount: "6", unit: "slices", item: "bacon, cooked" },
      { amount: "1/4", unit: "cup", item: "green onions" }
    ],
    instructions: [
      "Toss [2 lbs potato wedges] with [3 tbsp oil] and [3 tbsp ranch seasoning].",
      "Roast at 425?F for 30-35 minutes until crispy.",
      "Top with [1 cup cheddar], return to oven until melted.",
      "Sprinkle with [bacon] and [green onions].",
      "Serve hot with extra ranch dressing!"
    ]
  },
  {
    id: "dinner-creamy-tuscan-chicken",
    name: "Creamy Tuscan Chicken",
    description: "Restaurant-quality! Chicken in rich cream sauce with sun-dried tomatoes and spinach.",
    cookTime: "25 mins",
    prepTime: "10 mins",
    difficulty: "easy",
    servings: 4,
    cuisine: "Italian",
    image: creamyTuscanChickenImg,
    totalTime: 35,
    tags: ["Dinner", "chicken", "glutenfree"],
    nutrition: { calories: 520, protein: 44, carbs: 14, fat: 34, fiber: 2, sugar: 4, servingSize: "1 serving" },
    ingredients: [
      { amount: "4", unit: "", item: "chicken breasts" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "1/2", unit: "cup", item: "sun-dried tomatoes" },
      { amount: "2", unit: "cups", item: "fresh spinach" },
      { amount: "1/2", unit: "cup", item: "parmesan" },
      { amount: "4", unit: "cloves", item: "garlic, minced" }
    ],
    instructions: [
      "Season and sear [4 chicken breasts], remove.",
      "Saut? [4 cloves garlic] and [sun-dried tomatoes].",
      "Add [1 cup cream] and [1/2 cup parmesan], simmer.",
      "Stir in [2 cups spinach] until wilted.",
      "Return chicken, cook 8-10 minutes. Serve hot!"
    ]
  },
  {
    id: "dinner-stuffed-bell-peppers",
    name: "Stuffed Bell Peppers",
    description: "Classic comfort! Colorful peppers filled with seasoned beef and rice, topped with cheese.",
    cookTime: "40 mins",
    prepTime: "20 mins",
    difficulty: "medium",
    servings: 4,
    cuisine: "Dinner",
    image: stuffedBellPeppersDinnerImg,
    totalTime: 60,
    tags: ["Dinner", "beef", "healthy", "glutenfree"],
    nutrition: { calories: 420, protein: 28, carbs: 42, fat: 16, fiber: 6, sugar: 8, servingSize: "1 pepper" },
    ingredients: [
      { amount: "4", unit: "", item: "large bell peppers" },
      { amount: "1", unit: "lb", item: "ground beef" },
      { amount: "1", unit: "cup", item: "cooked rice" },
      { amount: "1", unit: "can", item: "diced tomatoes" },
      { amount: "1", unit: "cup", item: "mozzarella, shredded" },
      { amount: "1", unit: "tsp", item: "Italian seasoning" }
    ],
    instructions: [
      "Cut tops off [4 peppers], remove seeds.",
      "Brown [1 lb beef], mix with [1 cup rice], [tomatoes], [1 tsp Italian seasoning].",
      "Stuff peppers with beef mixture.",
      "Place in baking dish with 1/2 cup water. Cover with foil.",
      "Bake at 375?F for 35 minutes. Top with [mozzarella], bake 5 more minutes!"
    ]
  },
  
  ...newRecipes
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
  return allRecipes.filter(recipe => 
    recipe.totalTime && 
    recipe.totalTime <= 30 && 
    !recipe.tags?.includes("dessert")
  );
};

export const getLunchRecipes = (): Recipe[] => {
  return allRecipes.filter(recipe => recipe.cuisine === 'Lunch');
};

export const getDinnerRecipes = (): Recipe[] => {
  return allRecipes.filter(recipe => recipe.cuisine === 'Dinner');
};
