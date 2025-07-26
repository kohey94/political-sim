"use client";

import { useState } from "react";
import { PolicyCard, SelectedPolicy, EvaluateResponse } from "@/types";
import ElectionResult from "../areas/AreaResult";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { useSegmentStore } from "@/stores/segmentStore";

const baseUrl = getBaseUrl();

interface Props {
  selectedCards: PolicyCard[];
}

export default function EvaluateSection({ selectedCards }: Props) {
  const [result, setResult] = useState<EvaluateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { segments } = useSegmentStore();

  const mostImportantPolicyId = selectedCards[0]?.card_id ?? "";

  const toSelectedPolicies: SelectedPolicy[] = selectedCards.map(card => ({
    id: card.card_id,
    title: card.policy_name,
    feasibility: card.feasibility,
    impacts: card.stance_points.reduce(
      (acc, sp) => {
        acc[parseInt(sp.stance_id)] = (acc[parseInt(sp.stance_id)] ?? 0) + sp.point;
        return acc;
      },
      {} as Record<number, number>
    ),
  }));

  const handleEvaluate = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mostImportantPolicyId,
          selectedPolicies: toSelectedPolicies,
          segments,
        }),
      });

      const data: EvaluateResponse = await res.json();
      setResult(data);
    } catch (err) {
      console.error("API呼び出し失敗", err);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 space-y-6">
      {result === null ? (
        <>
          <div className="text-center text-lg font-bold mt-4">政策の選択が完了しました。</div>
          <div className="text-center mt-6">
            <button
              onClick={handleEvaluate}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "選挙中..." : "民意を問う"}
            </button>
          </div>
        </>
      ) : (
        <ElectionResult voteRate={result.totalScore} segmentScores={result.segmentScores} />
      )}
    </div>
  );
}
