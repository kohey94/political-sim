import { NextResponse } from "next/server";
import { EvaluateRequest, EvaluateResponse, SegmentInfo } from "@/types";
import { calculateScoreFromSegments } from "@/lib/scoring";

export async function POST(req: Request): Promise<NextResponse<EvaluateResponse>> {
  try {
    const { mostImportantPolicyId, selectedPolicies }: EvaluateRequest = await req.json();

    const baseUrl =
      process.env.BASE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${process.env.BASE_URL}`);
    const res = await fetch(`${baseUrl}/api/segments`);
    if (!res.ok) {
      throw new Error("Failed to fetch segments");
    }
    const segmentData: SegmentInfo[] = await res.json();

    const { totalScore, segmentScores } = calculateScoreFromSegments(
      selectedPolicies,
      mostImportantPolicyId,
      segmentData
    );
    return NextResponse.json({ totalScore, segmentScores });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ totalScore: 0, segmentScores: [] }, { status: 500 });
  }
}
