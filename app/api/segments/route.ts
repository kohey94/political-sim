// app/api/segments/route.ts
import { NextResponse } from "next/server";
import segmentsData from "@/data/m_voter_segments.json";

export async function GET() {
  return NextResponse.json(segmentsData);
}
