// Shared category utilities for consistent category handling across the app

export const CATEGORY_VALUES = [
  'music',
  'gaming',
  'sports',
  'horror',
  'adult',
  'radio',
  'djs',
  'irl',
  'audio_video_podcasts',
  'ppv_events',
] as const;

export type CategoryValue = typeof CATEGORY_VALUES[number];

export interface CategoryMetadata {
  value: CategoryValue;
  label: string;
}

// Canonical mapping of category values to display labels
export const CATEGORY_LABELS: Record<CategoryValue, string> = {
  music: 'Music',
  gaming: 'Gaming',
  sports: 'Sports',
  horror: 'Horror',
  adult: 'Adult',
  radio: 'Radio',
  djs: 'DJs',
  irl: 'IRL',
  audio_video_podcasts: 'Audio & Video Podcasts',
  ppv_events: 'PPV Events',
};

// Get display label for a category value
export function getCategoryLabel(categoryValue: string): string {
  const normalized = categoryValue.toLowerCase() as CategoryValue;
  return CATEGORY_LABELS[normalized] || categoryValue;
}

// Get all categories with metadata for browse UI
export function getAllCategories(): CategoryMetadata[] {
  return CATEGORY_VALUES.map(value => ({
    value,
    label: CATEGORY_LABELS[value],
  }));
}
