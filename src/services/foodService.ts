
export interface FoodDatabaseItem {
  id: string;
  display_name: string;
  tags: string; // Comma separated for partial matching
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portion_unit: string;
}

const STATIC_FOOD_DATABASE: FoodDatabaseItem[] = [
  // EGGS - Detailed breakdown with macro differences for cooking methods
  { id: "egg_boiled", display_name: "Boiled Egg (Large)", tags: "egg,boiled,breakfast,protein,hard boiled,soft boiled", calories: 72, protein: 6, carbs: 0.5, fats: 5, portion_unit: "1 egg" },
  { id: "egg_poached", display_name: "Poached Egg", tags: "egg,poached,breakfast,protein,plain", calories: 72, protein: 6, carbs: 0.5, fats: 5, portion_unit: "1 egg" },
  { id: "egg_scrambled_no_butter", display_name: "Scrambled Eggs (No Butter)", tags: "egg,scrambled,breakfast,protein,plain,healthy,dry,no fat", calories: 144, protein: 12, carbs: 1, fats: 10, portion_unit: "2 eggs" },
  { id: "egg_scrambled_butter", display_name: "Scrambled Eggs (With Butter)", tags: "egg,scrambled,breakfast,protein,butter,fat", calories: 190, protein: 12, carbs: 1, fats: 15, portion_unit: "2 eggs" },
  { id: "egg_fried_no_oil", display_name: "Fried Egg (No Oil)", tags: "egg,fried,breakfast,protein,plain,healthy,dry fry,no fat", calories: 72, protein: 6, carbs: 0.5, fats: 5, portion_unit: "1 egg" },
  { id: "egg_fried_oil", display_name: "Fried Egg (With Oil/Butter)", tags: "egg,fried,breakfast,protein,oil,greasy,fat", calories: 115, protein: 6, carbs: 0.5, fats: 10, portion_unit: "1 egg" },
  
  // CEREALS & OATS
  { id: "oats_rolled", display_name: "Porridge Oats (Rolled)", tags: "oats,porridge,cereal,oatmeal,breakfast,uk oats", calories: 370, protein: 12, carbs: 60, fats: 8, portion_unit: "100g" },
  { id: "cereal_cornflakes", display_name: "Cornflakes", tags: "cereal,cornflakes,breakfast,kelloggs,plain cereal", calories: 357, protein: 7, carbs: 84, fats: 0.4, portion_unit: "100g" },
  { id: "cereal_cocoa_pops", display_name: "Cocoa Pops", tags: "cereal,chocolate,breakfast,cocoa pops,sugary cereal", calories: 389, protein: 5, carbs: 85, fats: 2.5, portion_unit: "100g" },
  { id: "cereal_granola", display_name: "Granola (Honey & Nut)", tags: "cereal,granola,honey,nut,breakfast,crunchy", calories: 450, protein: 10, carbs: 65, fats: 18, portion_unit: "100g" },

  // FISH
  { id: "fish_salmon", display_name: "Salmon Fillet (Grilled)", tags: "fish,salmon,protein,omega 3,pink fish", calories: 208, protein: 22, carbs: 0, fats: 13, portion_unit: "100g" },
  { id: "fish_prawns", display_name: "King Prawns (Cooked)", tags: "prawns,shrimp,fish,seafood,protein,shellfish", calories: 99, protein: 24, carbs: 0, fats: 0.3, portion_unit: "100g" },
  { id: "fish_tuna", display_name: "Tuna (Canned in Brine)", tags: "fish,tuna,protein,tinned tuna,canned fish", calories: 116, protein: 26, carbs: 0, fats: 1, portion_unit: "100g" },
  { id: "fish_cod", display_name: "Cod Fillet (Baked)", tags: "fish,cod,white fish,lean,protein,atlantic cod", calories: 82, protein: 18, carbs: 0, fats: 0.7, portion_unit: "100g" },

  // INDIAN FOODS
  { id: "indian_chicken_curry", display_name: "Chicken Curry (Home Style)", tags: "indian,curry,chicken,meal,poultry", calories: 420, protein: 35, carbs: 12, fats: 25, portion_unit: "1 portion" },
  { id: "indian_dal_tadka", display_name: "Dal Tadka", tags: "indian,dal,lentils,curry,vegetarian,pulses", calories: 250, protein: 12, carbs: 35, fats: 8, portion_unit: "1 bowl" },
  { id: "indian_basmati_rice", display_name: "Basmati Rice (Boiled)", tags: "indian,rice,white rice,carb,boiled rice", calories: 130, protein: 3, carbs: 28, fats: 0.4, portion_unit: "100g" },
  { id: "indian_roti", display_name: "Roti / Chapati", tags: "indian,roti,chapati,bread,flatbread,wholemeal", calories: 120, protein: 3, carbs: 22, fats: 2, portion_unit: "1 piece" },
  { id: "indian_samosa", display_name: "Vegetable Samosa", tags: "indian,samosa,snack,fried snack", calories: 260, protein: 4, carbs: 30, fats: 14, portion_unit: "1 piece" },

  // WESTERN & FAST FOOD
  { id: "western_pasta", display_name: "Pasta (Penne/Boiled)", tags: "pasta,penne,spaghetti,carb,wheat pasta", calories: 158, protein: 6, carbs: 31, fats: 1, portion_unit: "100g" },
  { id: "western_pizza", display_name: "Margherita Pizza (Medium)", tags: "pizza,cheese,fast food,takeaway,italian", calories: 250, protein: 10, carbs: 30, fats: 9, portion_unit: "1 slice" },
  { id: "western_burger", display_name: "Beef Burger (with bun)", tags: "burger,beef,fast food,hamburger", calories: 550, protein: 28, carbs: 45, fats: 28, portion_unit: "1 burger" },
  { id: "western_chicken_breast", display_name: "Chicken Breast (Grilled)", tags: "chicken,breast,protein,lean,white meat", calories: 165, protein: 31, carbs: 0, fats: 3.6, portion_unit: "100g" }
];

export const searchFoodCsv = (query: string): FoodDatabaseItem[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const terms = q.split(/\s+/);

  return STATIC_FOOD_DATABASE.filter(item => {
    const text = (item.display_name + " " + item.tags).toLowerCase();
    return terms.every(term => text.includes(term));
  }).slice(0, 50);
};
