"use client";

import { useState } from "react";
import { PolicyCard as RawPolicyCard } from "@/types";
import DisplayPolicyCards from "@/components/DisplayPolicyCards";

interface Props {
  allCards: RawPolicyCard[];
  genreMap: Record<string, string>;
  onSelect: (card: RawPolicyCard, turn: number) => void;
}

export default function SelectPolicy({ allCards, genreMap, onSelect }: Props) {
  const [turn, setTurn] = useState(1);

  // 仮に 1〜3 枚目を候補とする（ジャンルIDによるフィルタは外す）
  const candidateCards = allCards.slice(0, 3);

  const handleCardSelect = (card: RawPolicyCard) => {
    onSelect(card, turn);
    setTurn(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="text-center text-lg font-semibold mb-2">政策を選んでください。</div>
      <div className="text-left text-sm font-bold mb-4">ターン{turn}</div>

      <DisplayPolicyCards
        allCards={candidateCards}
        genreMap={genreMap}
        selectedGenreId={"1"}
        onCardSelect={handleCardSelect}
      />
    </div>
  );
}
