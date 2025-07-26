import { NextResponse } from "next/server";
import { EvaluateRequest, EvaluateResponse } from "@/types";
import { calculateScoreFromSegments } from "@/lib/scoring";

export async function POST(req: Request): Promise<NextResponse<EvaluateResponse>> {
  try {
    const { mostImportantPolicyId, selectedPolicies, segments }: EvaluateRequest = await req.json();

    const { totalScore, segmentScores } = calculateScoreFromSegments(
      selectedPolicies,
      mostImportantPolicyId,
      segments
    );
    return NextResponse.json({ totalScore, segmentScores });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ totalScore: 0, segmentScores: [] }, { status: 500 });
  }
}
