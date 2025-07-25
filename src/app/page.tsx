"use client";

import { useEffect, useState } from "react";
import PolicyCard from "@/components/PolicyCard";
import { PolicyCard as RawPolicyCard, PolicyGenre } from "@/types";
import SelectedPolicyArea from "@/components/SelectedPolicyArea";
import ConfirmDialog from "@/components/ConfirmDialog";
import SelectImportantPolicy from "@/components/SelectImportantPolicy";
import SelectPolicy from "@/components/SelectPolicy";

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

  const handleCardClick = (card: RawPolicyCard) => {
    setPendingCard(card);
  };

  const confirmSelection = () => {
    if (pendingCard) {
      setConfirmedCards(prev => {
        if (prev.length >= 6) return prev;
        return [...prev, pendingCard];
      });
    }
    setPendingCard(null);
  };

  return (
    <main className="p-6 mb-70">
      {confirmedCards.length === 0 ? (
        <SelectImportantPolicy
          allCards={cards}
          genres={genres}
          genreMap={genreMap}
          onConfirm={card => {
            console.log("再重要政策として選ばれたカード:", card);
            setConfirmedCards([card]);
          }}
        />
      ) : confirmedCards.length < 6 ? (
        <SelectPolicy
          allCards={cards}
          genreMap={genreMap}
          onSelect={(card, turn) => {
            console.log(`ターン${turn}で選ばれた:`, card);
            setConfirmedCards(prev => [...prev, card]);
          }}
        />
      ) : (
        <>
          <div className="text-center text-lg font-bold mt-4">6枚選択済みです。</div>
          <div className="text-center mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              結果を見る
            </button>
          </div>
        </>
      )}

      <SelectedPolicyArea selectedCards={confirmedCards} genreMap={genreMap} />

      <ConfirmDialog
        open={!!pendingCard}
        onCancel={() => setPendingCard(null)}
        onConfirm={confirmSelection}
        card={pendingCard}
        genreMap={genreMap}
        isConfirmButtons={false}
      />
    </main>
  );
}
