export interface ShoppingListItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  completed: boolean;
  recipeId: string;
}

export interface GroceryStore {
  id: string;
  name: string;
  logo: string;
  url: string;
  deepLink?: string; // Deep link for mobile apps
  available: boolean;
}

export const groceryStores: GroceryStore[] = [
  {
    id: 'walmart',
    name: 'Walmart',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/320px-Walmart_logo.svg.png',
    url: 'https://www.walmart.com/search?q=',
    deepLink: 'walmart://search?query=',
    available: true
  },
  {
    id: 'kroger',
    name: 'Kroger',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Kroger_logo_%282019%29.svg/320px-Kroger_logo_%282019%29.svg.png',
    url: 'https://www.kroger.com/search?query=',
    deepLink: 'kroger://search?query=',
    available: true
  },
  {
    id: 'albertsons',
    name: 'Albertsons',
    logo: 'https://corporate.albertsons.com/content/themes/albertsons/assets/imgs/logo.svg',
    url: 'https://www.albertsons.com/shop/search-results.html?q=',
    deepLink: 'albertsons://search?q=',
    available: true
  },
  {
    id: 'safeway',
    name: 'Safeway',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Safeway_Logo.svg/320px-Safeway_Logo.svg.png',
    url: 'https://www.safeway.com/shop/search-results.html?q=',
    deepLink: 'safeway://search?q=',
    available: true
  },
  {
    id: 'target',
    name: 'Target',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/320px-Target_logo.svg.png',
    url: 'https://www.target.com/s?searchTerm=',
    deepLink: 'target://search?searchTerm=',
    available: true
  },
  {
    id: 'instacart',
    name: 'Instacart',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Instacart_logo.svg/320px-Instacart_logo.svg.png',
    url: 'https://www.instacart.com/store/s?k=',
    deepLink: 'instacart://search?query=',
    available: true
  }
];

