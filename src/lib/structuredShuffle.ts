import { PolicyCard } from "@/types";
import { shuffle } from "./shuffle";

// 初期選択されたカード（選ばれた1枚）を除いてシャッフル
export function structuredShuffle(
  cards: PolicyCard[],
  importantGenreId: string,
  selectedCardId: string
): { important: PolicyCard[]; others: PolicyCard[] } {
  console.log("selectedCardId", selectedCardId, typeof selectedCardId);
  cards.forEach(c => {
    console.log("card_id", c.card_id, typeof c.card_id);
    console.log("genre_id", c.genre_id, typeof c.genre_id);
    console.log("match?", String(c.card_id) === selectedCardId);
  });

  const important = shuffle(
    cards.filter(c => c.genre_id === importantGenreId && c.card_id !== selectedCardId.toString())
  );
  const others = shuffle(cards.filter(c => c.genre_id !== importantGenreId));

  return { important, others };
}
