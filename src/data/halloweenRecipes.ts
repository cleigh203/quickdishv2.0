import { Recipe } from "@/types/recipe";

export const halloweenRecipes: Recipe[] = [
  {
    id: "halloween-vampire-bites",
    name: "Vampire Bite Brownies",
    description: "Fudgy brownies with raspberry 'blood' centers that actually ooze when you bite them. The showstopper dessert that makes people gasp.",
    cookTime: "30 mins",
    prepTime: "20 mins",
    difficulty: "Medium",
    servings: 12,
    cuisine: "Halloween",
    isPremium: false,
    imageUrl: "https://images.pexels.com/photos/1998634/pexels-photo-1998634.jpeg?auto=compress&cs=tinysrgb&w=800",
    ingredients: [
      { amount: "1", unit: "cup", item: "butter" },
      { amount: "2", unit: "cups", item: "dark chocolate chips" },
      { amount: "4", unit: "", item: "eggs" },
      { amount: "1.5", unit: "cups", item: "sugar" },
      { amount: "1", unit: "cup", item: "flour" },
      { amount: "1/2", unit: "cup", item: "cocoa powder" },
      { amount: "1", unit: "cup", item: "raspberry jam" },
      { amount: "2", unit: "tbsp", item: "red food coloring" }
    ],
    instructions: [
      "Preheat oven to 350°F. Line a 9x13 pan with parchment paper.",
      "Melt butter and chocolate together, stirring until smooth.",
      "Mix in eggs and sugar until glossy.",
      "Fold in flour and cocoa powder.",
      "Pour half the batter into pan.",
      "Mix raspberry jam with red food coloring until deep red.",
      "Drop spoonfuls of 'blood' jam over batter.",
      "Cover with remaining batter, leaving some jam visible.",
      "Bake 25-30 minutes. Centers should be slightly gooey.",
      "Cool completely before cutting into bite-sized squares."
    ]
  },
  {
    id: "halloween-black-pasta",
    name: "Black Widow Pasta",
    description: "Jet-black squid ink pasta with garlic shrimp. This dish stops conversations and breaks Instagram. Absolutely viral.",
    cookTime: "20 mins",
    prepTime: "15 mins",
    difficulty: "Medium",
    servings: 4,
    cuisine: "Halloween",
    isPremium: true,
    imageUrl: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=800",
    ingredients: [
      { amount: "1", unit: "lb", item: "squid ink pasta" },
      { amount: "1", unit: "lb", item: "large shrimp" },
      { amount: "6", unit: "cloves", item: "garlic" },
      { amount: "1/2", unit: "cup", item: "white wine" },
      { amount: "1", unit: "cup", item: "cherry tomatoes" },
      { amount: "1/4", unit: "cup", item: "olive oil" },
      { amount: "1", unit: "tsp", item: "red pepper flakes" },
      { amount: "1/4", unit: "cup", item: "parsley" }
    ],
    instructions: [
      "Cook squid ink pasta according to package (it'll turn your water black - that's normal!).",
      "Pat shrimp completely dry.",
      "Heat olive oil in large pan until shimmering.",
      "Sear shrimp 2 minutes per side, remove and set aside.",
      "Add more oil, sauté minced garlic until fragrant (30 seconds).",
      "Add wine, let it reduce by half.",
      "Toss in halved cherry tomatoes and red pepper flakes.",
      "Return shrimp to pan, add drained black pasta.",
      "Toss everything together until pasta is coated.",
      "Garnish with fresh parsley. Serve immediately on white plates for maximum visual impact."
    ]
  },
  {
    id: "halloween-zombie-brain",
    name: "Zombie Brain Dip",
    description: "Whole roasted cauliflower that looks absolutely disturbing but tastes incredible. Buffalo-style with ranch 'veins'. Everyone freaks out then devours it.",
    cookTime: "45 mins",
    prepTime: "15 mins",
    difficulty: "Easy",
    servings: 8,
    cuisine: "Halloween",
    isPremium: false,
    imageUrl: "https://images.pexels.com/photos/4033325/pexels-photo-4033325.jpeg?auto=compress&cs=tinysrgb&w=800",
    ingredients: [
      { amount: "1", unit: "whole", item: "cauliflower" },
      { amount: "1", unit: "cup", item: "buffalo sauce" },
      { amount: "1/2", unit: "cup", item: "melted butter" },
      { amount: "1", unit: "cup", item: "ranch dressing" },
      { amount: "2", unit: "tbsp", item: "paprika" },
      { amount: "1", unit: "tsp", item: "garlic powder" },
      { amount: "1/4", unit: "cup", item: "blue cheese crumbles" }
    ],
    instructions: [
      "Preheat oven to 425°F.",
      "Remove leaves from cauliflower, keep it whole with core intact.",
      "Mix buffalo sauce, melted butter, paprika, and garlic powder.",
      "Brush cauliflower all over with buffalo mixture.",
      "Place in baking dish, cover with foil.",
      "Roast 30 minutes covered.",
      "Remove foil, baste with more sauce, roast 15 more minutes until golden and tender.",
      "Transfer to serving platter.",
      "Drizzle ranch dressing over top to create 'brain vein' effect.",
      "Sprinkle with blue cheese. Serve with celery sticks and more ranch for dipping."
    ]
  },
  {
    id: "halloween-blood-orange-margs",
    name: "Blood Orange Margaritas",
    description: "Crimson margaritas with black salt rim. Optional dry ice for fog effect. The most Instagrammed drink at any Halloween party.",
    cookTime: "5 mins",
    prepTime: "10 mins",
    difficulty: "Easy",
    servings: 4,
    cuisine: "Halloween",
    isPremium: false,
    imageUrl: "https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg?auto=compress&cs=tinysrgb&w=800",
    ingredients: [
      { amount: "1", unit: "cup", item: "tequila" },
      { amount: "1/2", unit: "cup", item: "triple sec" },
      { amount: "1", unit: "cup", item: "fresh blood orange juice" },
      { amount: "1/2", unit: "cup", item: "lime juice" },
      { amount: "2", unit: "tbsp", item: "agave syrup" },
      { amount: "2", unit: "tbsp", item: "activated charcoal powder" },
      { amount: "1/4", unit: "cup", item: "coarse salt" },
      { amount: "", unit: "", item: "ice" },
      { amount: "", unit: "", item: "dry ice (optional)" }
    ],
    instructions: [
      "Mix activated charcoal with coarse salt to create black salt rim.",
      "Run lime wedge around glass rims, dip in black salt.",
      "Juice blood oranges until you have 1 cup (about 4-5 oranges).",
      "In cocktail shaker with ice, combine tequila, triple sec, blood orange juice, lime juice, and agave.",
      "Shake vigorously for 15 seconds.",
      "Strain into prepared glasses filled with ice.",
      "Optional: Add small piece of food-grade dry ice for fog effect (NEVER CONSUME DRY ICE).",
      "Garnish with blood orange wheel.",
      "Serve immediately while fog effect is active."
    ]
  },
  {
    id: "halloween-mummy-dogs",
    name: "Mummy Hot Dogs",
    description: "Crescent-wrapped hot dogs with mustard eyes. Kids go absolutely insane for these. Easy, fast, and genuinely fun.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "Easy",
    servings: 10,
    cuisine: "Halloween",
    isPremium: false,
    imageUrl: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800",
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
      "Place wrapped hot dogs on baking sheet.",
      "Beat egg and brush over dough.",
      "Bake 12-15 minutes until golden brown.",
      "Let cool 5 minutes.",
      "Use mustard to attach candy eyes in the face gap.",
      "Serve with ketchup and extra mustard for dipping."
    ]
  },
  {
    id: "halloween-witches-brew",
    name: "Witch's Brew Soup",
    description: "Bright green broccoli soup served in mini cauldrons. Creamy, healthy, and the color is absolutely perfect. Adults and kids both love it.",
    cookTime: "25 mins",
    prepTime: "15 mins",
    difficulty: "Easy",
    servings: 6,
    cuisine: "Halloween",
    isPremium: false,
    imageUrl: "https://images.pexels.com/photos/1707945/pexels-photo-1707945.jpeg?auto=compress&cs=tinysrgb&w=800",
    ingredients: [
      { amount: "2", unit: "lbs", item: "broccoli florets" },
      { amount: "1", unit: "large", item: "onion" },
      { amount: "3", unit: "cloves", item: "garlic" },
      { amount: "4", unit: "cups", item: "vegetable broth" },
      { amount: "1", unit: "cup", item: "heavy cream" },
      { amount: "2", unit: "cups", item: "spinach" },
      { amount: "1/2", unit: "cup", item: "grated parmesan" },
      { amount: "2", unit: "tbsp", item: "butter" }
    ],
    instructions: [
      "Melt butter in large pot over medium heat.",
      "Sauté diced onion until soft, about 5 minutes.",
      "Add minced garlic, cook 1 minute until fragrant.",
      "Add broccoli florets and vegetable broth.",
      "Bring to boil, then reduce heat and simmer 15 minutes until broccoli is very tender.",
      "Add spinach and cook until wilted, about 2 minutes.",
      "Use immersion blender to puree soup until completely smooth (the spinach makes it extra green!).",
      "Stir in heavy cream and parmesan.",
      "Season with salt and pepper to taste.",
      "Serve in small black cauldrons or bowls. Garnish with pumpkin seeds shaped like 'bugs'."
    ]
  },
  {
    id: "halloween-spider-cookies",
    name: "Spider Web Cookies",
    description: "Chocolate cookies with white chocolate web design. Easier than they look, taste incredible, and photograph perfectly.",
    cookTime: "12 mins",
    prepTime: "30 mins",
    difficulty: "Medium",
    servings: 24,
    cuisine: "Halloween",
    isPremium: true,
    imageUrl: "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=800",
    ingredients: [
      { amount: "2", unit: "cups", item: "flour" },
      { amount: "3/4", unit: "cup", item: "cocoa powder" },
      { amount: "1", unit: "cup", item: "butter" },
      { amount: "1.5", unit: "cups", item: "sugar" },
      { amount: "2", unit: "", item: "eggs" },
      { amount: "2", unit: "tsp", item: "vanilla extract" },
      { amount: "1", unit: "tsp", item: "baking soda" },
      { amount: "1", unit: "cup", item: "white chocolate chips" }
    ],
    instructions: [
      "Beat butter and sugar until fluffy.",
      "Mix in eggs and vanilla.",
      "In separate bowl, whisk flour, cocoa powder, and baking soda.",
      "Gradually add dry ingredients to wet ingredients.",
      "Chill dough 30 minutes.",
      "Preheat oven to 350°F.",
      "Roll dough into balls, place on baking sheet.",
      "Bake 10-12 minutes. Let cool completely.",
      "Melt white chocolate chips.",
      "Transfer to piping bag or ziplock with corner cut off.",
      "Pipe concentric circles on each cookie.",
      "Immediately drag toothpick from center outward 8 times to create web pattern.",
      "Let white chocolate set before serving."
    ]
  },
  {
    id: "halloween-pumpkin-bowls",
    name: "Mini Pumpkin Soup Bowls",
    description: "Creamy soup served inside roasted mini pumpkins. The ultimate presentation piece. People lose their minds over these.",
    cookTime: "45 mins",
    prepTime: "20 mins",
    difficulty: "Medium",
    servings: 6,
    cuisine: "Halloween",
    isPremium: true,
    imageUrl: "https://images.pexels.com/photos/1118874/pexels-photo-1118874.jpeg?auto=compress&cs=tinysrgb&w=800",
    ingredients: [
      { amount: "6", unit: "", item: "mini pumpkins" },
      { amount: "2", unit: "lbs", item: "butternut squash" },
      { amount: "1", unit: "large", item: "onion" },
      { amount: "3", unit: "cloves", item: "garlic" },
      { amount: "4", unit: "cups", item: "vegetable broth" },
      { amount: "1", unit: "cup", item: "coconut cream" },
      { amount: "2", unit: "tbsp", item: "maple syrup" },
      { amount: "1", unit: "tsp", item: "cinnamon" },
      { amount: "1/2", unit: "tsp", item: "nutmeg" }
    ],
    instructions: [
      "Preheat oven to 375°F.",
      "Cut tops off mini pumpkins, scoop out seeds and pulp.",
      "Brush inside with oil, season with salt. Place on baking sheet.",
      "Roast pumpkins 30 minutes until tender but still holding shape.",
      "Meanwhile, dice and roast butternut squash until caramelized.",
      "Sauté diced onion and garlic in large pot.",
      "Add roasted squash, vegetable broth, maple syrup, and spices.",
      "Simmer 15 minutes, then blend until silky smooth.",
      "Stir in coconut cream.",
      "Ladle hot soup into roasted pumpkin bowls.",
      "Garnish with toasted pumpkin seeds and drizzle of cream.",
      "Serve immediately with crusty bread."
    ]
  },
  {
    id: "halloween-candy-corn-bark",
    name: "Candy Corn Bark",
    description: "Three-layer chocolate bark in candy corn colors. Stupid easy to make, looks professional, great for gifts. Make a massive batch.",
    cookTime: "10 mins",
    prepTime: "15 mins",
    difficulty: "Easy",
    servings: 20,
    cuisine: "Halloween",
    isPremium: true,
    imageUrl: "https://images.pexels.com/photos/3776942/pexels-photo-3776942.jpeg?auto=compress&cs=tinysrgb&w=800",
    ingredients: [
      { amount: "12", unit: "oz", item: "white chocolate chips" },
      { amount: "12", unit: "oz", item: "orange chocolate melts" },
      { amount: "12", unit: "oz", item: "yellow chocolate melts" },
      { amount: "1", unit: "tsp", item: "coconut oil per color" },
      { amount: "1", unit: "cup", item: "candy corn" }
    ],
    instructions: [
      "Line large baking sheet with parchment paper.",
      "Melt white chocolate with 1 tsp coconut oil until smooth.",
      "Pour onto baking sheet, spread into even layer. Refrigerate 10 minutes until set.",
      "Melt orange chocolate with coconut oil.",
      "Pour over white layer, spread evenly. Refrigerate 10 minutes.",
      "Melt yellow chocolate with coconut oil.",
      "Pour over orange layer, spread to edges.",
      "Immediately sprinkle candy corn over top.",
      "Refrigerate 30 minutes until completely set.",
      "Break into irregular pieces.",
      "Store in airtight container in cool place for up to 2 weeks."
    ]
  },
  {
    id: "halloween-monster-eyeballs",
    name: "Monster Eyeball Deviled Eggs",
    description: "Classic deviled eggs transformed into bloodshot eyes. Creepy, delicious, and packed with protein. Adults eat them as fast as kids.",
    cookTime: "15 mins",
    prepTime: "20 mins",
    difficulty: "Easy",
    servings: 12,
    cuisine: "Halloween",
    isPremium: true,
    imageUrl: "https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=800",
    ingredients: [
      { amount: "12", unit: "", item: "eggs" },
      { amount: "1/2", unit: "cup", item: "mayonnaise" },
      { amount: "2", unit: "tbsp", item: "dijon mustard" },
      { amount: "1", unit: "tbsp", item: "white vinegar" },
      { amount: "12", unit: "", item: "black olives" },
      { amount: "1", unit: "", item: "small beet" },
      { amount: "1/4", unit: "tsp", item: "paprika" }
    ],
    instructions: [
      "Hard boil eggs: place in pot, cover with cold water, bring to boil, turn off heat, cover and let sit 12 minutes.",
      "Transfer eggs to ice bath, let cool completely.",
      "Peel eggs carefully, cut in half lengthwise.",
      "Remove yolks to bowl, mash with fork.",
      "Mix yolks with mayo, mustard, vinegar, and paprika until creamy.",
      "Pipe or spoon yolk mixture back into egg white halves, creating a mound.",
      "Slice black olives into rounds, place one in center of each as 'pupil'.",
      "Grate raw beet, squeeze juice through cheesecloth.",
      "Use toothpick dipped in beet juice to draw red 'veins' on egg whites.",
      "Refrigerate until serving. Best served within 4 hours."
    ]
  }
];

// Featured recipe for hero section
export const featuredHalloweenRecipe = halloweenRecipes[0]; // Vampire Bite Brownies

// Helper functions
export const getHalloweenRecipes = (isPremiumUser: boolean): Recipe[] => {
  if (isPremiumUser) {
    return halloweenRecipes;
  }
  return halloweenRecipes.filter(recipe => !recipe.isPremium);
};

export const getPremiumHalloweenRecipes = (): Recipe[] => {
  return halloweenRecipes.filter(recipe => recipe.isPremium);
};

export const getFreeHalloweenRecipes = (): Recipe[] => {
  return halloweenRecipes.filter(recipe => !recipe.isPremium);
};

export const halloweenCategories = {
  desserts: ["halloween-vampire-bites", "halloween-spider-cookies", "halloween-candy-corn-bark"],
  mains: ["halloween-black-pasta", "halloween-mummy-dogs"],
  appetizers: ["halloween-zombie-brain", "halloween-monster-eyeballs"],
  drinks: ["halloween-blood-orange-margs"],
  soups: ["halloween-witches-brew", "halloween-pumpkin-bowls"]
};
