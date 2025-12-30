// Food database with nutritional values per 100g
export interface FoodItem {
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export const FOOD_DATABASE: Record<string, FoodItem> = {
  // Grains & Carbs
  "cous cous": { name: "cous cous", calories: 112, protein: 3.8, carbs: 23.2, fat: 0.16 },
  "couscous": { name: "couscous", calories: 112, protein: 3.8, carbs: 23.2, fat: 0.16 },
  "rice": { name: "rice", calories: 130, protein: 2.7, carbs: 28.2, fat: 0.28 },
  "white rice": { name: "white rice", calories: 130, protein: 2.7, carbs: 28.2, fat: 0.28 },
  "brown rice": { name: "brown rice", calories: 111, protein: 2.6, carbs: 23.0, fat: 0.9 },
  "pasta": { name: "pasta", calories: 131, protein: 5.0, carbs: 25.0, fat: 1.1 },
  "ragù": { name: "ragù", calories: 130, protein: 8.0, carbs: 8.0, fat: 7.0 },
  "ragu": { name: "ragu", calories: 130, protein: 8.0, carbs: 8.0, fat: 7.0 },
  "bolognese": { name: "bolognese", calories: 130, protein: 8.0, carbs: 8.0, fat: 7.0 },
  "pasta with ragù": { name: "pasta with ragù", calories: 131, protein: 5.0, carbs: 25.0, fat: 1.1 },
  "bread": { name: "bread", calories: 265, protein: 9.0, carbs: 49.0, fat: 3.2 },
  "quinoa": { name: "quinoa", calories: 120, protein: 4.4, carbs: 21.3, fat: 1.92 },
  "oats": { name: "oats", calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  
  // Proteins
  "chicken": { name: "chicken", calories: 165, protein: 31.0, carbs: 0, fat: 3.6 },
  "chicken breast": { name: "chicken breast", calories: 165, protein: 31.0, carbs: 0, fat: 3.6 },
  "chicken thigh": { name: "chicken thigh", calories: 209, protein: 26.0, carbs: 0, fat: 10.9 },
  "beef": { name: "beef", calories: 250, protein: 26.0, carbs: 0, fat: 15.0 },
  "ground beef": { name: "ground beef", calories: 250, protein: 26.0, carbs: 0, fat: 15.0 },
  "salmon": { name: "salmon", calories: 208, protein: 20.0, carbs: 0, fat: 13.0 },
  "tuna": { name: "tuna", calories: 144, protein: 30.0, carbs: 0, fat: 1.0 },
  "turkey": { name: "turkey", calories: 189, protein: 29.0, carbs: 0, fat: 7.0 },
  "eggs": { name: "eggs", calories: 155, protein: 13.0, carbs: 1.1, fat: 11.0 },
  "egg": { name: "egg", calories: 155, protein: 13.0, carbs: 1.1, fat: 11.0 },
  
  // Vegetables
  "broccoli": { name: "broccoli", calories: 34, protein: 2.8, carbs: 7.0, fat: 0.4 },
  "spinach": { name: "spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  "carrots": { name: "carrots", calories: 41, protein: 0.9, carbs: 10.0, fat: 0.2 },
  "potato": { name: "potato", calories: 77, protein: 2.0, carbs: 17.0, fat: 0.1 },
  "potatoes": { name: "potatoes", calories: 77, protein: 2.0, carbs: 17.0, fat: 0.1 },
  "sweet potato": { name: "sweet potato", calories: 86, protein: 1.6, carbs: 20.0, fat: 0.1 },
  
  // Fruits
  "banana": { name: "banana", calories: 89, protein: 1.1, carbs: 23.0, fat: 0.3 },
  "apple": { name: "apple", calories: 52, protein: 0.3, carbs: 14.0, fat: 0.2 },
  "orange": { name: "orange", calories: 47, protein: 0.9, carbs: 12.0, fat: 0.1 },
  
  // Dairy
  "milk": { name: "milk", calories: 42, protein: 3.4, carbs: 5.0, fat: 1.0 },
  "greek yogurt": { name: "greek yogurt", calories: 59, protein: 10.0, carbs: 3.6, fat: 0.4 },
  "yogurt": { name: "yogurt", calories: 59, protein: 10.0, carbs: 3.6, fat: 0.4 },
  "cheese": { name: "cheese", calories: 402, protein: 25.0, carbs: 1.3, fat: 33.0 },
  
  // Nuts & Seeds
  "almonds": { name: "almonds", calories: 579, protein: 21.0, carbs: 22.0, fat: 50.0 },
  "peanut butter": { name: "peanut butter", calories: 588, protein: 25.0, carbs: 20.0, fat: 50.0 },
  
  // Fats & Oils
  "olive oil": { name: "olive oil", calories: 884, protein: 0, carbs: 0, fat: 100.0 },
  "avocado": { name: "avocado", calories: 160, protein: 2.0, carbs: 9.0, fat: 15.0 },
};

  // Parse food string and calculate nutrition
export function calculateNutritionFromText(text: string): { calories: number; protein: number; carbs: number; fat: number } {
  const result = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  if (!text || text.trim().length === 0) {
    return result;
  }
  
  // Normalize text: lowercase, remove extra spaces
  const normalizedText = text.toLowerCase().trim();
  
  const matches: Array<{ weight: number; food: string }> = [];
  
  // Split by "and" to handle multiple foods
  const parts = normalizedText.split(/\s+and\s+/);
  
  for (const part of parts) {
    const trimmed = part.trim();
    let matched = false;
    
    // Pattern 1: "Xg food" or "X grams food" (with unit) - REQUIRES explicit quantity
    const weightMatchWithUnit = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:g|grams?|gram)\s+(?:of\s+)?(.+)$/);
    if (weightMatchWithUnit) {
      const weight = parseFloat(weightMatchWithUnit[1]);
      const food = weightMatchWithUnit[2].trim();
      // Try to find the food in database
      if (FOOD_DATABASE[food]) {
        matches.push({ weight, food });
        matched = true;
      } else {
        // Try partial match
        for (const [key] of Object.entries(FOOD_DATABASE)) {
          if (food.includes(key) || key.includes(food)) {
            matches.push({ weight, food: key });
            matched = true;
            break;
          }
        }
      }
      if (matched) continue;
    }
    
    // Pattern 2: "X food" (number followed by food, assume grams) - REQUIRES explicit quantity
    const weightMatchWithoutUnit = trimmed.match(/^(\d+(?:\.\d+)?)\s+(.+)$/);
    if (weightMatchWithoutUnit && !matched) {
      const weight = parseFloat(weightMatchWithoutUnit[1]);
      const food = weightMatchWithoutUnit[2].trim();
      // Only calculate if the number is reasonable (10-2000g) - this means explicit quantity
      if (weight >= 10 && weight <= 2000) {
        // Try to find the food in database
        if (FOOD_DATABASE[food]) {
          matches.push({ weight, food });
          matched = true;
        } else {
          // Try partial match
          for (const [key] of Object.entries(FOOD_DATABASE)) {
            if (food.includes(key) || key.includes(food)) {
              matches.push({ weight, food: key });
              matched = true;
              break;
            }
          }
        }
        if (matched) continue;
      }
    }
    
    // Pattern 3: Try to extract number from anywhere in the string, then find food
    if (!matched) {
      const numMatch = trimmed.match(/(\d+(?:\.\d+)?)/);
      if (numMatch) {
        const weight = parseFloat(numMatch[1]);
        if (weight >= 10 && weight <= 2000) {
          // Remove the number from the string to get the food name
          const food = trimmed.replace(/\d+(?:\.\d+)?\s*/g, '').trim();
          if (FOOD_DATABASE[food]) {
            matches.push({ weight, food });
            matched = true;
          } else {
            // Try partial match
            for (const [key] of Object.entries(FOOD_DATABASE)) {
              if (food.includes(key) || key.includes(food)) {
                matches.push({ weight, food: key });
                matched = true;
                break;
              }
            }
          }
        }
      }
    }
    
    // DO NOT add default weights - only calculate when quantity is explicitly specified
  }
  
  // If still no matches, try the whole string as a single food item (only if it has a number)
  if (matches.length === 0) {
    const numMatch = normalizedText.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) {
      const weight = parseFloat(numMatch[1]);
      if (weight >= 10 && weight <= 2000) {
        // Remove the number to get the food name
        const food = normalizedText.replace(/\d+(?:\.\d+)?\s*/g, '').trim();
        if (FOOD_DATABASE[food]) {
          matches.push({ weight, food });
        } else {
          // Try partial match
          for (const [key] of Object.entries(FOOD_DATABASE)) {
            if (food.includes(key) || key.includes(food)) {
              matches.push({ weight, food: key });
              break;
            }
          }
        }
      }
    }
    // DO NOT add default weights - only calculate when quantity is explicitly specified
  }
  
  // Calculate nutrition for each match
  for (const { weight, food } of matches) {
    // Try exact match first
    let foodItem = FOOD_DATABASE[food];
    
    // Try to find partial match
    if (!foodItem) {
      for (const [key, value] of Object.entries(FOOD_DATABASE)) {
        if (food.includes(key) || key.includes(food)) {
          foodItem = value;
          break;
        }
      }
    }
    
    if (foodItem) {
      const multiplier = weight / 100; // Convert to per 100g basis
      result.calories += Math.round(foodItem.calories * multiplier);
      result.protein += Math.round(foodItem.protein * multiplier * 10) / 10;
      result.carbs += Math.round(foodItem.carbs * multiplier * 10) / 10;
      result.fat += Math.round(foodItem.fat * multiplier * 10) / 10;
    }
  }
  
  return result;
}

