import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { parseToPolicyCards } from "@/lib/parsePolicyCards";
import { structuredShuffle } from "@/lib/structuredShuffle";
import { sessionCardMap } from "@/server/sessionMap";
import cardsData from "@/data/m_policy_cards.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const importantGenreId = searchParams.get("importantGenreId");
  const selectedCardId = searchParams.get("selectedCardId");

  if (!importantGenreId || !selectedCardId) {
    return NextResponse.json(
      { error: "importantGenreId and selectedCardId are required" },
      { status: 400 }
    );
  }

  const sessionId = uuidv4();
  const parsedCards = parseToPolicyCards(cardsData);

  const shuffled = structuredShuffle(parsedCards, importantGenreId, selectedCardId);
  sessionCardMap.set(sessionId, shuffled);

  return NextResponse.json({ sessionId });
}
