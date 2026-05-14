/**
 * Shared application-wide TypeScript types.
 * Import from here rather than defining types in individual components.
 */

/** Firestore Timestamp or compatible object with toDate method */
export type FirestoreTimestamp = {
  toDate: () => Date;
  seconds?: number;
  nanoseconds?: number;
};

/** Timestamp value - can be Firestore Timestamp, object with seconds, ISO string, or epoch ms */
export type TimestampValue = FirestoreTimestamp | { seconds: number; nanoseconds?: number } | string | number;

/** A single clothing item stored in Firestore under users/{uid}/closet/{id}. */
export interface ClosetItem {
  id: string;
  imageUrl: string;
  storagePath?: string;
  category: string;
  colorPalette: string[];
  formalityScore: number;
  season: string;
  vibe: string;
  isDirty: boolean;
  isFavorite: boolean;
  createdAt: TimestampValue;
}

/** A saved outfit stored in Firestore under users/{uid}/outfits/{id}. */
export interface Outfit {
  id: string;
  ownerId: string;
  topId: string;
  bottomId: string;
  footwearId: string;
  stylistNote: string;
  scene: string;
  createdAt: TimestampValue;
}
