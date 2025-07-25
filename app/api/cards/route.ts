import { NextRequest, NextResponse } from "next/server";
import { sessionCardMap } from "@/server/sessionMap";
import { PolicyCard } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const turnStr = searchParams.get("turn");

  if (!sessionId || !turnStr) {
    return NextResponse.json({ error: "sessionId and turn are required" }, { status: 400 });
  }

  const turn = parseInt(turnStr, 10);
  if (isNaN(turn) || turn < 1) {
    return NextResponse.json({ error: "Invalid turn" }, { status: 400 });
  }

  const sessionData = sessionCardMap.get(sessionId);
  if (!sessionData) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { important, others }: { important: PolicyCard[]; others: PolicyCard[] } = sessionData;

  // 推しジャンルから1枚、他ジャンルから2枚をターンに応じて取り出す
  const importantCard = important[turn - 1];
  const otherStart = (turn - 1) * 2;
  const otherCards = others.slice(otherStart, otherStart + 2);

  if (!importantCard || otherCards.length < 2) {
    return NextResponse.json({ error: "Not enough cards for this turn" }, { status: 400 });
  }

  const resultCards = [importantCard, ...otherCards];

  return NextResponse.json(resultCards);
}
