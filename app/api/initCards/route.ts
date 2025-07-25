import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { redis } from "@/lib/redis";
import { parseToPolicyCards } from "@/lib/parsePolicyCards";
import { structuredShuffle } from "@/lib/structuredShuffle";
import cardsData from "@/data/m_policy_cards.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { importantGenreId, selectedCardId } = body;

  if (!importantGenreId || !selectedCardId) {
    return NextResponse.json(
      { error: "importantGenreId and selectedCardId are required" },
      { status: 400 }
    );
  }

  const sessionId = uuidv4();
  const parsedCards = parseToPolicyCards(cardsData);
  const shuffled = structuredShuffle(parsedCards, importantGenreId, selectedCardId);

  // Redis に保存（30分でexpire）
  await redis.setex(`${sessionId}`, 60 * 30, JSON.stringify(shuffled));

  return NextResponse.json({ sessionId });
}
