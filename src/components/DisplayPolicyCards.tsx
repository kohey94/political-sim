"use client";

import { PolicyCard as RawPolicyCard } from "@/types";
import PolicyCard from "./PolicyCard";

interface Props {
  allCards: RawPolicyCard[]; // フィルタ済みカードを渡す
  genreMap: { [genre_id: string]: string };
  onCardSelect?: (card: RawPolicyCard) => void; // 選択時に呼び出すコールバック
}

export default function DisplayPolicyCards({ allCards, genreMap, onCardSelect }: Props) {
  const cards = allCards.slice(0, 6); // 最大6枚まで表示

  return (
    <div className="flex flex-col items-center">
      <div className={`grid gap-4 ${cards.length > 3 ? "grid-cols-3 grid-rows-2" : "grid-cols-3"}`}>
        {cards.map(card => (
          <PolicyCard
            key={card.card_id}
            card={card}
            genreMap={genreMap}
            isSelected={false}
            onSelect={() => onCardSelect?.(card)}
          />
        ))}
      </div>
    </div>
  );
}
