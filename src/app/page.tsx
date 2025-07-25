"use client";

import { useEffect, useState } from "react";
import { PolicyCard as RawPolicyCard, PolicyGenre } from "@/types";
import SelectedPolicyArea from "@/components/SelectedPolicyArea";
import ConfirmDialog from "@/components/ConfirmDialog";
import SelectImportantPolicy from "@/components/SelectImportantPolicy";
import SelectPolicy from "@/components/SelectPolicy";
import TitleScreen from "@/components/TitleScreen";

export default function CardsPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [genres, setGenres] = useState<PolicyGenre[]>([]);
  const [candidateCards, setCandidateCards] = useState<RawPolicyCard[]>([]);
  const [confirmedCards, setConfirmedCards] = useState<RawPolicyCard[]>([]);
  const [pendingCard, setPendingCard] = useState<RawPolicyCard | null>(null);
  const [started, setStarted] = useState(false);
  const [turn, setTurn] = useState(1);
  const [importantGenreId, setImportantGenreId] = useState<string | null>(null);

  // 初期化: sessionId取得、ジャンル取得
  useEffect(() => {
    const init = async () => {
      const res = await fetch("/api/initCards");
      const { sessionId } = await res.json();
      setSessionId(sessionId);

      const genreRes = await fetch("/data/m_policy_genre.json");
      const genreData = await genreRes.json();
      setGenres(genreData);
    };

    init();
  }, []);

  // ターンに応じてカード取得
  useEffect(() => {
    const loadTurnCards = async () => {
      if (!sessionId || !importantGenreId || confirmedCards.length >= 6) return;

      const res = await fetch(
        `/api/cards?sessionId=${sessionId}&turn=${turn}&importantGenreId=${importantGenreId}`
      );
      const data = await res.json();
      setCandidateCards(data.cards);
    };

    loadTurnCards();
  }, [sessionId, importantGenreId, turn, confirmedCards.length]);

  const genreMap: Record<string, string> = Object.fromEntries(
    genres.map(g => [g.genre_id.toString(), g.genre_name])
  );

  const confirmSelection = () => {
    if (pendingCard) {
      setConfirmedCards(prev => [...prev, pendingCard]);
    }
    setPendingCard(null);
    setTurn(prev => prev + 1);
  };

  return (
    <>
      {!started ? (
        <TitleScreen onStart={() => setStarted(true)} />
      ) : (
        <main className="p-6 mb-70">
          {confirmedCards.length === 0 ? (
            <SelectImportantPolicy
              allCards={candidateCards}
              genres={genres}
              genreMap={genreMap}
              onConfirm={card => {
                console.log("再重要政策として選ばれたカード:", card);
                setImportantGenreId(card.genre_id);
                setConfirmedCards([card]);
                setTurn(1);
              }}
            />
          ) : confirmedCards.length < 6 ? (
            <SelectPolicy
              allCards={candidateCards}
              genreMap={genreMap}
              turn={turn}
              onSelect={card => {
                console.log(`ターン${turn}で選ばれた:`, card);
                setPendingCard(card);
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
      )}
    </>
  );
}
