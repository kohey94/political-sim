import { NextResponse } from "next/server";
import { EvaluateRequest, EvaluateResponse, SegmentInfo } from "@/types";
import { calculateScoreFromSegments } from "@/lib/scoring";

export async function POST(req: Request): Promise<NextResponse<EvaluateResponse>> {
  const { mostImportantPolicyId, selectedPolicies }: EvaluateRequest = await req.json();

  const baseUrl =
    process.env.BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${process.env.BASE_URL}`);
  const res = await fetch(`${baseUrl}/api/segments`, {
    cache: "no-store",
  });
  const segmentData: SegmentInfo[] = await res.json();

  const score = calculateScoreFromSegments(selectedPolicies, mostImportantPolicyId, segmentData);

  return NextResponse.json({ score });
}
