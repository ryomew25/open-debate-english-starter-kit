export interface Category {
  id: string;
  label: string;
  emoji: string;
  group: "social" | "entertainment" | "other";
}

export const CATEGORIES: Category[] = [
  // Society and current affairs
  { id: "Society & Politics", label: "Society & Politics", emoji: "🏛️", group: "social" },
  { id: "Business & Economy", label: "Business & Economy", emoji: "💼", group: "social" },
  { id: "Technology", label: "Technology", emoji: "💻", group: "social" },
  { id: "Education & Learning", label: "Education & Learning", emoji: "📚", group: "social" },

  // Entertainment and lifestyle
  { id: "Anime & Manga", label: "Anime & Manga", emoji: "🎌", group: "entertainment" },
  { id: "Gaming", label: "Gaming", emoji: "🎮", group: "entertainment" },
  { id: "Music", label: "Music", emoji: "🎵", group: "entertainment" },
  { id: "Movies & TV", label: "Movies & TV", emoji: "🎬", group: "entertainment" },
  { id: "Sports", label: "Sports", emoji: "⚽", group: "entertainment" },
  { id: "Food & Dining", label: "Food & Dining", emoji: "🍜", group: "entertainment" },
  { id: "Fashion", label: "Fashion", emoji: "👗", group: "entertainment" },
  { id: "Travel", label: "Travel", emoji: "✈️", group: "entertainment" },

  // Other
  { id: "Other", label: "Other", emoji: "💬", group: "other" },
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

// Translate category IDs saved by the earlier Japanese edition so existing
// browser data can still be displayed in English after an upgrade.
const LEGACY_CATEGORY_IDS: Record<string, string> = {
  "社会・政治": "Society & Politics",
  "ビジネス・経済": "Business & Economy",
  "テクノロジー": "Technology",
  "教育・学習": "Education & Learning",
  "アニメ・漫画": "Anime & Manga",
  "ゲーム": "Gaming",
  "音楽": "Music",
  "映画・ドラマ": "Movies & TV",
  "スポーツ": "Sports",
  "グルメ": "Food & Dining",
  "ファッション": "Fashion",
  "旅行": "Travel",
  "その他": "Other",
};

export function getCategoryMeta(id: string): Category {
  const normalizedId = LEGACY_CATEGORY_IDS[id] ?? id;
  return CATEGORIES.find((c) => c.id === normalizedId) ?? { id: normalizedId, label: normalizedId, emoji: "💬", group: "other" };
}
