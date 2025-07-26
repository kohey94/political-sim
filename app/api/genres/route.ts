import { NextResponse } from "next/server";
import genreData from "@/data/m_policy_genre.json"; // パスは必要に応じて調整

export async function GET() {
  return NextResponse.json(genreData);
}
