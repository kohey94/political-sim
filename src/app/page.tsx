"use client";

import { useEffect, useState } from "react";
import PolicyCard from "@/components/PolicyCard";
import { PolicyCard as RawPolicyCard, PolicyGenre } from "@/types";

export default function CardsPage() {
  const [cards, setCards] = useState<RawPolicyCard[]>([]);
  const [genres, setGenres] = useState<PolicyGenre[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const cardRes = await fetch("/data/m_policy_cards.json");
      const genreRes = await fetch("/data/m_policy_genre.json");

      // エラーハンドリングを追加（デバッグしやすくなる）
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

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">政策カード一覧</h1>
      <div className="grid grid-cols-6 gap-6">
        {cards.map(card => {
          const uid = getCardUid(card);
          return (
            <PolicyCard
              key={uid}
              card={card}
              genreMap={genreMap}
              isSelected={selectedCardId === uid}
              onSelect={() => setSelectedCardId(uid)}
            />
          );
        })}
      </div>
    </main>
  );
}
