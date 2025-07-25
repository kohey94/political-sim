// app/api/cards/important/route.ts
import { NextRequest, NextResponse } from "next/server";
import cardsData from "@/data/m_policy_cards.json";

export async function GET(req: NextRequest) {
  const genreId = req.nextUrl.searchParams.get("genreId");
  if (!genreId) {
    return NextResponse.json({ error: "genreId is required" }, { status: 400 });
  }

  const filtered = cardsData.filter(card => card.genre_id.toString() === genreId);
  return NextResponse.json(filtered);
}
