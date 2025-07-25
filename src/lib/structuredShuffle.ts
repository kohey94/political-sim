import { PolicyCard } from "@/types";
import { shuffle } from "./shuffle";

// 初期選択されたカード（選ばれた1枚）を除いてシャッフル
export function structuredShuffle(
  cards: PolicyCard[],
  importantGenreId: string,
  selectedCardId: string
): { important: PolicyCard[]; others: PolicyCard[] } {
  const important = shuffle(
    cards.filter(c => c.genre_id === importantGenreId && c.card_id !== selectedCardId)
  );
  const others = shuffle(cards.filter(c => c.genre_id !== importantGenreId));

  return { important, others };
}
