"use client";

import { useEffect, useState } from "react";
import { useGenreStore } from "@/stores/genreStore";
import { useStanceStore } from "@/stores/stanceStore";
import { useSegmentStore } from "@/stores/segmentStore";
import { PolicyCard as RawPolicyCard } from "@/types";
import SelectedPolicyArea from "@/components/SelectedPolicyArea";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import SelectImportantPolicy from "@/components/selects/SelectImportantPolicy";
import SelectPolicy from "@/components/selects/SelectPolicy";
import TitleScreen from "@/components/TitleScreen";
import VoterSegments from "@/components/VoterSegments";
import EvaluateSection from "@/components/evals/EvaluateSection";

export default function CardsPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [candidateCards, setCandidateCards] = useState<RawPolicyCard[]>([]);
  const [confirmedCards, setConfirmedCards] = useState<RawPolicyCard[]>([]);
  const [pendingCard, setPendingCard] = useState<RawPolicyCard | null>(null);
  const [started, setStarted] = useState(false);
  const [turn, setTurn] = useState(1);
  const [importantGenreId, setImportantGenreId] = useState<string | null>(null);
  const { genreLoaded, setGenres } = useGenreStore();
  const { stanceLoaded, setStances } = useStanceStore();
  const { segmentLoaded, setSegments } = useSegmentStore();

  // 初回にジャンルのみ取得(新)
  useEffect(() => {
    if (!genreLoaded) {
      const fetchGenres = async () => {
        const res = await fetch("api/genres");
        const data = await res.json();
        setGenres(data);
      };
      if (!genreLoaded) fetchGenres();
    }
  }, [genreLoaded, setGenres]);

  useEffect(() => {
    const fetchStances = async () => {
      const res = await fetch("/api/stances");
      const data = await res.json();
      setStances(data);
    };
    if (!stanceLoaded) fetchStances();
  }, [stanceLoaded, setStances]);

  useEffect(() => {
    if (!segmentLoaded) {
      const fetchSegments = async () => {
        const res = await fetch("/api/segments");
        const data = await res.json();
        setSegments(data);
      };
      fetchSegments();
    }
  }, [segmentLoaded, setSegments]);

  // 最初の重要カード決定後に呼ばれる
  const handleImportantPolicySelect = async (card: RawPolicyCard, genreId: string) => {
    setConfirmedCards([card]);
    setImportantGenreId(genreId);

    const res = await fetch("/api/initCards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        importantGenreId: genreId,
        selectedCardId: card.card_id,
      }),
    });

    const { sessionId: newSessionId } = await res.json();
    setSessionId(newSessionId);

    // 初回カード3枚を取得（turn=1）
    const nextRes = await fetch(`/api/cards?sessionId=${newSessionId}&turn=1`);

    const nextData = await nextRes.json();
    setCandidateCards(nextData);
    setTurn(1);
  };

  // 2回目以降のカード選択用（turnが進んだとき）
  useEffect(() => {
    const loadTurnCards = async () => {
      if (!sessionId || !importantGenreId) return;
      if (confirmedCards.length === 0 || confirmedCards.length >= 6) return;

      const res = await fetch(`/api/cards?sessionId=${sessionId}&turn=${turn}`);
      const data = await res.json();
      setCandidateCards(data);
    };

    loadTurnCards();
  }, [sessionId, importantGenreId, turn, confirmedCards.length]);

  const confirmSelection = () => {
    if (pendingCard) {
      setConfirmedCards(prev => [...prev, pendingCard]);
    }
    setPendingCard(null);
    setTurn(prev => prev + 1);
  };

  if (!genreLoaded || !stanceLoaded) {
    return <div className="text-center mt-10">loading...</div>;
  }

  return (
    <>
      {!started ? (
        <main className="p-4">
          <TitleScreen onStart={() => setStarted(true)} />
        </main>
      ) : (
        <main className="p-6 mt-25 mb-70">
          {confirmedCards.length === 0 ? (
            <SelectImportantPolicy onConfirm={handleImportantPolicySelect} />
          ) : confirmedCards.length < 6 ? (
            <SelectPolicy
              allCards={candidateCards}
              turn={turn}
              onSelect={card => {
                console.log(`ターン${turn}で選ばれた:`, card);
                setPendingCard(card);
              }}
            />
          ) : (
            <EvaluateSection selectedCards={confirmedCards} />
          )}

          <VoterSegments />

          <SelectedPolicyArea selectedCards={confirmedCards} />

          <ConfirmDialog
            open={!!pendingCard}
            onCancel={() => setPendingCard(null)}
            onConfirm={confirmSelection}
            card={pendingCard}
            isConfirmButtons={false}
          />
        </main>
      )}
    </>
  );
}
