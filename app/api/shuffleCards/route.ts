export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PolicyCard } from "@/types";

// JSONファイルを読み込むための関数（Edge環境では不可。Node.js限定）
import cardsData from "@/data/m_policy_cards.json";

type RawPolicyCard = {
  expansion?: string | number;
  card_id: string | number;
  genre_id: string | number;
  policy_name: string;
  description: string;
  feasibility: number;
  stance_points: {
    stance_id: string | number;
    point: number;
  }[];
};

export function parseToPolicyCards(data: RawPolicyCard[]): PolicyCard[] {
  return data.map(
    (card): PolicyCard => ({
      expansion: String(card.expansion ?? "EX01"),
      card_id: String(card.card_id),
      genre_id: String(card.genre_id),
      policy_name: card.policy_name,
      description: card.description,
      feasibility: Number(card.feasibility),
      stance_points: (card.stance_points ?? []).map(
        (sp: { stance_id: string | number; point: number }) => ({
          stance_id: String(sp.stance_id),
          point: Number(sp.point),
        })
      ),
    })
  );
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * 3枚の候補カードを返す
 */
export function getNextPolicyOptions(
  allCards: PolicyCard[],
  importantGenreId: string,
  selectedCardIds: string[],
  turn: number
): PolicyCard[] {
  // ① 最初に選んだジャンルかつ未選択のカード（残り）
  const remainingFromImportantGenre = shuffle(
    allCards.filter(c => c.genre_id === importantGenreId && !selectedCardIds.includes(c.card_id))
  );

  // ② 他ジャンルかつ未選択のカード（残り）
  const remainingFromOtherGenres = shuffle(
    allCards.filter(c => c.genre_id !== importantGenreId && !selectedCardIds.includes(c.card_id))
  );

  // ③ 最終的に1枚 + 2枚で構成
  const selected: PolicyCard[] = [];
  if (remainingFromImportantGenre.length > 0) {
    selected.push(remainingFromImportantGenre[0]);
  }
  selected.push(...remainingFromOtherGenres.slice(0, 2));

  return selected;
}
