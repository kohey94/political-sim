"use client";

import { useState } from "react";
import { PolicyCard, SelectedPolicy } from "@/types";
import ElectionResult from "@/components/evals/ElectionResult";

interface Props {
  selectedCards: PolicyCard[];
}

export default function EvaluateSection({ selectedCards }: Props) {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 最初に選んだ政策を「最重要」と仮定
  const mostImportantPolicyId = selectedCards[0]?.card_id ?? "";

  // 🔽 ここで PolicyCard[] → SelectedPolicy[] に変換
  const toSelectedPolicy: SelectedPolicy[] = selectedCards.map(card => ({
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
    console.log("送信するデータ:", {
      mostImportantPolicyId,
      selectedPolices: toSelectedPolicy,
    });
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mostImportantPolicyId,
          selectedPolicies: toSelectedPolicy,
        }),
      });

      const data = await res.json();
      setScore(data.score);
    } catch (error) {
      console.error("API呼び出し失敗", error);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 space-y-6">
      {score === null ? (
        <>
          <button
            onClick={handleEvaluate}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "選挙中..." : "民意を問う"}
          </button>
        </>
      ) : (
        <ElectionResult voteRate={score} />
      )}
    </div>
  );
}
