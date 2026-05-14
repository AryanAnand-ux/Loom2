/**
 * Shared category keywords for wardrobe classification and filtering.
 * Used across ClosetGrid and other components to maintain consistency.
 */

export const CATEGORY_KEYWORDS = {
  topWear: ["t-shirt", "shirt", "hoodie", "sweater", "jacket", "top", "blouse", "coat", "tank top", "sweatshirt"],
  bottomWear: ["jeans", "pants", "shorts", "skirt", "bottom", "trousers", "joggers", "leggings"],
  shoes: ["shoes", "sneakers", "boots", "heels", "sandals", "footwear", "oxfords", "loafers", "trainers"],
  accessories: ["accessory", "accessories", "watch", "watches", "chain", "chains", "bracelet", "bracelets", "necklace", "necklaces", "ring", "rings", "belt", "belts", "bag", "bags", "sunglasses", "glasses", "cap", "hat"],
};

export function classifyItemType(category: string): keyof typeof CATEGORY_KEYWORDS | null {
  const catLower = category.toLowerCase();
  
  if (CATEGORY_KEYWORDS.topWear.some(k => catLower.includes(k)) || catLower.includes("top wear")) {
    return "topWear";
  }
  if (CATEGORY_KEYWORDS.bottomWear.some(k => catLower.includes(k)) || catLower.includes("bottom wear")) {
    return "bottomWear";
  }
  if (CATEGORY_KEYWORDS.shoes.some(k => catLower.includes(k))) {
    return "shoes";
  }
  if (CATEGORY_KEYWORDS.accessories.some(k => catLower.includes(k))) {
    return "accessories";
  }
  
  return null;
}

export function isPresetCategory(category: string): boolean {
  return classifyItemType(category) !== null;
}
