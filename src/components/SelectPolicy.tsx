"use client";

import { PolicyCard as RawPolicyCard } from "@/types";
import DisplayPolicyCards from "@/components/DisplayPolicyCards";

interface Props {
  allCards: RawPolicyCard[];
  turn: number;
  onSelect: (card: RawPolicyCard) => void;
}

export default function SelectPolicy({ allCards, turn, onSelect }: Props) {
  return (
    <div className="p-6">
      <div className="text-center text-lg font-semibold mb-2">政策を選んでください。</div>
      <div className="text-left text-sm font-bold mb-4">ターン{turn}</div>

      <DisplayPolicyCards allCards={allCards} onCardSelect={onSelect} />
    </div>
  );
}
