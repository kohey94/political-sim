import { SelectedPolicy, EvaluateResponse, SegmentInfo } from "@/types";

// 補正倍率定義（低実現性）
const LOW_FEASIBILITY_MULTIPLIERS: Record<number, number> = {
  1: 0.3, // 保守層
  2: 0.3, // リベラル層
  3: 0.6,
  4: 0.6,
  5: 0.6,
  6: 0.5, // 無党派層
};

// 最高実現性時の条件別倍率設定
const HIGH_FEASIBILITY_CONDITIONS = {
  conservative: { 6: 1.3, 2: 0.7 },
  liberal: { 1: 0.7, 6: 1.3 },
  economic: "boostLowest", // 特別ロジック
  welfare: { 5: 1.2 },
  environmental: { 4: 1.2 },
  independent: {
    6: 0.2,
    others: 1.3,
  },
};
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

  // スコアの初期計算
  let segmentScores = Object.entries(totalImpact).map(([stanceIdStr, val]) => {
    const stanceId = Number(stanceIdStr);
    const score = Math.round((val / 24) * 100);
    return { stance_id: stanceId, score };
  });

  // 実現性に応じた補正処理
  if (feasibilitySum <= 9) {
    // 低実現性 → 定数マップで倍率補正
    segmentScores = segmentScores.map(seg => {
      const multiplier = LOW_FEASIBILITY_MULTIPLIERS[seg.stance_id] ?? 1;
      return {
        stance_id: seg.stance_id,
        score: Math.max(0, Math.min(100, Math.round(seg.score * multiplier))),
      };
    });
  }

  if (feasibilitySum >= 20) {
    // 高実現性 → 支持率最大の層を判定して条件分岐
    const top = [...segmentScores].sort((a, b) => b.score - a.score)[0];

    switch (top.stance_id) {
      case 1: // 保守
        segmentScores = applyMultipliers(segmentScores, HIGH_FEASIBILITY_CONDITIONS.conservative);
        break;
      case 2: // リベラル
        segmentScores = applyMultipliers(segmentScores, HIGH_FEASIBILITY_CONDITIONS.liberal);
        break;
      case 3: {
        // 経済重視 → 最小を強化
        const min = [...segmentScores].sort((a, b) => a.score - b.score)[0];
        segmentScores = segmentScores.map(seg =>
          seg.stance_id === min.stance_id
            ? { ...seg, score: Math.min(100, Math.round(seg.score * 1.15)) }
            : seg
        );
        break;
      }
      case 4:
        segmentScores = applyMultipliers(segmentScores, HIGH_FEASIBILITY_CONDITIONS.welfare);
        break;
      case 5:
        segmentScores = applyMultipliers(segmentScores, HIGH_FEASIBILITY_CONDITIONS.environmental);
        break;
      case 6: {
        segmentScores = segmentScores.map(seg => {
          const multiplier =
            seg.stance_id === 6
              ? HIGH_FEASIBILITY_CONDITIONS.independent[6]
              : HIGH_FEASIBILITY_CONDITIONS.independent.others;
          return {
            stance_id: seg.stance_id,
            score: Math.min(100, Math.round(seg.score * multiplier)),
          };
        });
        break;
      }
    }
  }

  // 合計得点スコア計算
  const totalImpactScore = Object.entries(totalImpact).reduce((sum, [stanceIdStr, val]) => {
    const stanceId = Number(stanceIdStr);
    const ratio = stanceRatioMap[stanceId] ?? 0;
    return sum + val * ratio;
  }, 0);

  const stanceScore = (totalImpactScore / 24) * 100;
  const totalScore = Math.round(Math.max(0, Math.min(100, stanceScore)));

  return { totalScore, segmentScores };
}

// ヘルパー：倍率マップで補正
function applyMultipliers(
  scores: { stance_id: number; score: number }[],
  multipliers: Record<number, number>
): { stance_id: number; score: number }[] {
  return scores.map(seg => {
    const mult = multipliers[seg.stance_id] ?? 1;
    return {
      stance_id: seg.stance_id,
      score: Math.min(100, Math.round(seg.score * mult)),
    };
  });
}
