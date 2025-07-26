import { SelectedPolicy, EvaluateResponse, SegmentInfo } from "@/types";

export function calculateScoreFromSegments(
  policies: SelectedPolicy[],
  mostImportantId: string,
  segments: SegmentInfo[]
): EvaluateResponse {
  // stance_id → ratio（0〜1.0）へ変換
  const stanceRatioMap: Record<number, number> = {};
  for (const seg of segments) {
    stanceRatioMap[seg.stance_id] = seg.ratio / 100;
  }

  const totalImpact: Record<number, number> = {};

  let feasibilitySum = 0;

  for (const policy of policies) {
    const weight = policy.id === mostImportantId ? 1.3 : 1.0;

    for (const stanceIdStr in policy.impacts) {
      const stanceId = Number(stanceIdStr);
      const value = policy.impacts[stanceId] ?? 0;
      totalImpact[stanceId] = (totalImpact[stanceId] ?? 0) + value * weight;
    }

    feasibilitySum += policy.feasibility;
  }

  const segmentScores = Object.entries(totalImpact).map(([stanceIdStr, val]) => {
    const stanceId = Number(stanceIdStr);
    const score = Math.round(((val + 12) / 24) * 100); // -12〜12 → 0〜100
    return { stance_id: stanceId, score };
  });

  const totalImpactScore = Object.entries(totalImpact).reduce((sum, [stanceIdStr, val]) => {
    const stanceId = Number(stanceIdStr);
    const ratio = stanceRatioMap[stanceId] ?? 0;
    return sum + val * ratio;
  }, 0);

  const stanceScore = ((totalImpactScore + 12) / 24) * 75;
  const feasibilityScore = (feasibilitySum / 24) * 25;
  const totalScore = Math.round(Math.max(0, Math.min(100, stanceScore + feasibilityScore)));

  return { totalScore, segmentScores };
}
