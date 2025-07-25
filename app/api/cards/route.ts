import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { PolicyCard } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const turnStr = searchParams.get("turn");

  console.log("Received sessionId:", sessionId);
  console.log("Available session keys:", await redis.keys("*"));

  if (!sessionId || !turnStr) {
    return NextResponse.json({ error: "sessionId and turn are required" }, { status: 400 });
  }

  const turn = parseInt(turnStr, 10);
  if (isNaN(turn) || turn < 1) {
    return NextResponse.json({ error: "Invalid turn" }, { status: 400 });
  }

  const sessionDataStr = await redis.get(`${sessionId}`);
  if (!sessionDataStr || typeof sessionDataStr !== "string") {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { important, others }: { important: PolicyCard[]; others: PolicyCard[] } =
    JSON.parse(sessionDataStr);

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
