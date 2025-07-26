"use client";

import { useEffect, useState } from "react";
import { PolicyCard } from "@/types";
import DisplayPolicyCards from "./DisplayPolicyCards";
import ConfirmDialog from "./ConfirmDialog";
import { useGenreStore } from "@/stores/genreStore";

interface Props {
  onConfirm: (card: PolicyCard, genreId: string) => void;
}

export default function SelectImportantPolicy({ onConfirm }: Props) {
  const [selectedGenreId, setSelectedGenreId] = useState("1");
  const [cards, setCards] = useState<PolicyCard[]>([]);
  const [pendingCard, setPendingCard] = useState<PolicyCard | null>(null);
  const { genres } = useGenreStore();

  // TODO 全ジャンルのカードをredisに保持してアクセスするほうがいいかも
  useEffect(() => {
    if (selectedGenreId) {
      const fetchCards = async () => {
        const res = await fetch(`/api/cards/important?genreId=${selectedGenreId}`);
        const data = await res.json();
        setCards(data);
      };
      fetchCards();
    }
  }, [selectedGenreId]);

  const handleCardClick = (card: PolicyCard) => {
    setPendingCard(card);
  };

  const confirmSelection = () => {
    if (pendingCard && selectedGenreId) {
      // 上位コンポーネントに通知
      onConfirm(pendingCard, selectedGenreId);
    }
    setPendingCard(null);
  };

  return (
    <div className="space-y-4">
      {/* ジャンル選択 */}
      <div className="text-lg font-semibold text-center">最重要政策を選んでください</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {genres.map(g => (
          <button
            key={g.genre_id}
            onClick={() => setSelectedGenreId(g.genre_id.toString())}
            className={`px-4 py-2 rounded border ${
              selectedGenreId === g.genre_id.toString()
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {g.genre_name}
          </button>
        ))}
      </div>

      {/* 選択ジャンルのカード一覧 */}
      {selectedGenreId && <DisplayPolicyCards allCards={cards} onCardSelect={handleCardClick} />}

      {/* 確認ダイアログ */}
      <ConfirmDialog
        open={!!pendingCard}
        onCancel={() => setPendingCard(null)}
        onConfirm={confirmSelection}
        card={pendingCard}
        isConfirmButtons={false}
      />
    </div>
  );
}
