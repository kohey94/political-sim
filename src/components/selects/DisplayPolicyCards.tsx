"use client";

import { PolicyCard as RawPolicyCard } from "@/types";
import PolicyCard from "../cards/PolicyCard";

interface Props {
  allCards?: RawPolicyCard[]; // フィルタ済みカードを渡す
  onCardSelect?: (card: RawPolicyCard) => void; // 選択時に呼び出すコールバック
}

export default function DisplayPolicyCards({ allCards = [], onCardSelect }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`grid gap-4 ${allCards.length > 3 ? "grid-cols-6 grid-rows-1" : "grid-cols-3"}`}
      >
        {allCards.map(card => (
          <PolicyCard
            key={card.card_id}
            card={card}
            isSelected={false}
            onSelect={() => onCardSelect?.(card)}
          />
        ))}
      </div>
    </div>
  );
}
