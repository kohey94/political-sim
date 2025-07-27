"use client";

import React from "react";
import { useStanceStore } from "@/stores/stanceStore";

interface ElectionResultProps {
  voteRate: number; // 0〜100
  segmentScores: { stance_id: number; score: number }[];
}

export default function ElectionResult({ voteRate, segmentScores }: ElectionResultProps) {
  const { stances } = useStanceStore();

  const getResultText = (rate: number): string => {
    if (rate < 5) return "支持を得られず惨敗...。ほぼ無風の泡沫候補だった。";
    if (rate < 10) return "ごくわずかに支持が集まるが、議席獲得には至らず。";
    if (rate < 15) return "1議席を獲得。個人の発信力が光る。";
    if (rate < 25) return "複数議席を獲得し、存在感を放つ政党に。";
    if (rate < 35) return "政党要件を満たし本格的な政党となる。";
    if (rate < 50) return "世論の支持を得て、中堅政党として影響力を拡大する！";
    if (rate < 66) return "単独過半数で政権獲得！与党第一党に。";
    return "圧勝！安定多数で政権を掌握。改革を思いのままに進められる！";
  };

  const getBarColor = (rate: number): string => {
    if (rate < 25) return "bg-red-500";
    if (rate < 50) return "bg-yellow-400";
    if (rate < 66) return "bg-blue-500";
    return "bg-green-600";
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center mt-10 space-y-6">
      <div className="text-2xl font-semibold">{getResultText(voteRate)}</div>
      <div className="text-2xl font-bold">得票率 {voteRate}%</div>

      <div className="relative h-6 w-full bg-gray-200 rounded">
        <div
          className={`absolute top-0 left-0 h-full rounded ${getBarColor(voteRate)}`}
          style={{ width: `${voteRate}%`, transition: "width 0.5s ease-in-out" }}
        />
      </div>

      <div className="space-y-2 mt-4">
        {segmentScores.map(seg => {
          const label =
            stances.find(st => Number(st.stance_id) === seg.stance_id)?.display_name ??
            `#${seg.stance_id}`;

          return (
            <div key={seg.stance_id} className="text-left">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>{label}</span>
                <span>{seg.score}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded">
                <div
                  className="h-full rounded bg-blue-500 transition-all duration-500"
                  style={{ width: `${seg.score}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
