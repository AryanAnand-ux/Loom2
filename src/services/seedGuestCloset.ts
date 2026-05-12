import { db } from "../lib/firebase";
import { collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Pre-populates the guest user's closet with sample clothing items
 * so they can immediately experience the full app (Stylist AI, Lookbook, etc.)
 * Only seeds if the closet is currently empty.
 */

const SAMPLE_ITEMS = [
  {
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
    category: "T-Shirt",
    colorPalette: ["White"],
    formalityScore: 3,
    season: "Summer",
    vibe: "Minimal",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    category: "Jacket",
    colorPalette: ["Beige", "Cream"],
    formalityScore: 6,
    season: "Winter",
    vibe: "Classic",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop",
    category: "Hoodie",
    colorPalette: ["Black"],
    formalityScore: 2,
    season: "Winter",
    vibe: "Streetwear",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=600&h=800&fit=crop",
    category: "Shirt",
    colorPalette: ["Blue", "White"],
    formalityScore: 7,
    season: "All-season",
    vibe: "Smart Casual",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
    category: "Jeans",
    colorPalette: ["Blue", "Indigo"],
    formalityScore: 4,
    season: "All-season",
    vibe: "Casual",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop",
    category: "Pants",
    colorPalette: ["Khaki", "Tan"],
    formalityScore: 6,
    season: "All-season",
    vibe: "Smart Casual",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=800&fit=crop",
    category: "Sneakers",
    colorPalette: ["White", "Grey"],
    formalityScore: 3,
    season: "All-season",
    vibe: "Sporty",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&h=800&fit=crop",
    category: "Boots",
    colorPalette: ["Brown", "Tan"],
    formalityScore: 7,
    season: "Winter",
    vibe: "Rugged",
  },
];

export async function seedGuestCloset(userId: string): Promise<void> {
  try {
    const closetRef = collection(db, `users/${userId}/closet`);
    const existing = await getDocs(closetRef);

    // Only seed if the closet is empty
    if (!existing.empty) return;

    const writes = SAMPLE_ITEMS.map((item) => {
      const itemId = crypto.randomUUID();
      return setDoc(doc(db, `users/${userId}/closet/${itemId}`), {
        ownerId: userId,
        imageUrl: item.imageUrl,
        storagePath: "",
        category: item.category,
        colorPalette: item.colorPalette,
        formalityScore: item.formalityScore,
        season: item.season,
        vibe: item.vibe,
        isDirty: false,
        isFavorite: false,
        createdAt: serverTimestamp(),
      });
    });

    await Promise.all(writes);
    console.info(`Seeded ${SAMPLE_ITEMS.length} sample items for guest user.`);
  } catch (err) {
    // Non-critical — don't block login if seeding fails
    console.warn("Guest closet seeding failed:", err);
  }
}
