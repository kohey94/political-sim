import { SelectedPolicy } from "@/types";

export type StanceId = number;

export type SegmentInfo = {
  segment_id: number;
  stance_id: StanceId;
  ratio: number; // 単位: %
};

export function calculateScoreFromSegments(
  policies: SelectedPolicy[],
  mostImportantId: string,
  segmentData: SegmentInfo[]
): number {
  // stance_id → ratio（0〜1.0）へ変換
  const stanceRatioMap: Record<StanceId, number> = {};
  for (const seg of segmentData) {
    stanceRatioMap[seg.stance_id] = seg.ratio / 100;
  }

  const totalImpact: Record<StanceId, number> = {};

  let feasibilitySum = 0;

  for (const policy of policies) {
    const weight = policy.id === mostImportantId ? 2.0 : 1.0;

    for (const stanceIdStr in policy.impacts) {
      const stanceId = Number(stanceIdStr);
      const value = policy.impacts[stanceId] ?? 0;
      totalImpact[stanceId] = (totalImpact[stanceId] ?? 0) + value * weight;
    }

    feasibilitySum += policy.feasibility;
  }

  const rawImpact = Object.entries(totalImpact).reduce((sum, [stanceIdStr, val]) => {
    const stanceId = Number(stanceIdStr);
    const ratio = stanceRatioMap[stanceId] ?? 0;
    return sum + val * ratio;
  }, 0);

  const stanceScore = ((rawImpact + 12) / 24) * 75;
  const feasibilityScore = (feasibilitySum / 24) * 25;

  return Math.round(Math.max(0, Math.min(100, stanceScore + feasibilityScore)));
}
