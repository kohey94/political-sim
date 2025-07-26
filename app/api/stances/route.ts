// app/api/stances/route.ts
import { NextResponse } from "next/server";
import stanceData from "@/data/m_political_stance.json";

export async function GET() {
  return NextResponse.json(stanceData);
}
