"use client";

import { useEffect, useState } from "react";
import PolicyCard from "@/components/PolicyCard";
import { PolicyCard as RawPolicyCard, PolicyGenre } from "@/types";
import SelectedPolicyArea from "@/components/SelectedPolicyArea";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function CardsPage() {
  const [cards, setCards] = useState<RawPolicyCard[]>([]);
  const [genres, setGenres] = useState<PolicyGenre[]>([]);
  const [pendingCard, setPendingCard] = useState<RawPolicyCard | null>(null);
  const [confirmedCards, setConfirmedCards] = useState<RawPolicyCard[]>([]);

  useEffect(() => {
    const load = async () => {
      const cardRes = await fetch("/data/m_policy_cards.json");
      const genreRes = await fetch("/data/m_policy_genre.json");

      if (!cardRes.ok || !genreRes.ok) {
        console.error("ファイルが見つかりません");
        return;
      }

      const cardData = await cardRes.json();
      const genreData = await genreRes.json();
      setCards(cardData);
      setGenres(genreData);
    };

    load();
  }, []);

  const genreMap: Record<string, string> = Object.fromEntries(
    genres.map(g => [g.genre_id.toString(), g.genre_name])
  );

  const getCardUid = (card: RawPolicyCard) =>
    `${card.expansion ?? "EX01"}-${card.card_id.toString().padStart(3, "0")}`;

  // カードクリックで確認ダイアログ
  const handleCardClick = (card: RawPolicyCard) => {
    setPendingCard(card);
  };

  // 確定処理
  const confirmSelection = () => {
    if (pendingCard) {
      setConfirmedCards(prev => {
        if (prev.length >= 6) return prev; // 6件まで
        return [...prev, pendingCard];
      });
    }
    setPendingCard(null);
  };

  return (
    <main className="p-6 mb-48">
      <h1 className="text-xl font-bold mb-4">政策カード一覧</h1>
      <div className="grid grid-cols-6 gap-6">
        {cards.map(card => {
          const uid = getCardUid(card);
          return (
            <PolicyCard
              key={uid}
              card={card}
              genreMap={genreMap}
              isSelected={false}
              onSelect={() => handleCardClick(card)}
            />
          );
        })}
      </div>

      <SelectedPolicyArea selectedCards={confirmedCards} />

      <ConfirmDialog
        open={!!pendingCard}
        onCancel={() => setPendingCard(null)}
        onConfirm={confirmSelection}
      />
    </main>
  );
}
