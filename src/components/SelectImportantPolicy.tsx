"use client";

import { useState } from "react";
import { PolicyCard as RawPolicyCard, PolicyGenre } from "@/types";
import PolicyCardsByGenre from "./DisplayPolicyCards";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  allCards: RawPolicyCard[];
  genres: PolicyGenre[];
  genreMap: Record<string, string>;
  onConfirm: (card: RawPolicyCard) => void; // 親へ通知
}

export default function SelectImportantPolicy({ allCards, genres, genreMap, onConfirm }: Props) {
  const [selectedGenreId, setSelectedGenreId] = useState("1");
  const [pendingCard, setPendingCard] = useState<RawPolicyCard | null>(null);

  return (
    <div className="space-y-4">
      {/* ジャンル選択 */}
      <div className="text-lg font-semibold text-center">ジャンルを選んでください</div>
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
      {selectedGenreId && (
        <PolicyCardsByGenre
          allCards={allCards}
          genreMap={genreMap}
          selectedGenreId={selectedGenreId}
          onCardSelect={card => setPendingCard(card)}
        />
      )}

      {/* 確認ダイアログ */}
      <ConfirmDialog
        open={!!pendingCard}
        onCancel={() => setPendingCard(null)}
        onConfirm={() => {
          if (pendingCard) {
            onConfirm(pendingCard);
          }
          setPendingCard(null);
        }}
        card={pendingCard}
        genreMap={genreMap}
        isConfirmButtons={false}
      />
    </div>
  );
}
