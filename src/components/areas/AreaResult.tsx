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
    if (rate < 10) return "支持を得られず惨敗";
    if (rate < 25) return "議席獲得ならず";
    if (rate < 40) return "一部の支持を得るが届かず";
    if (rate < 51) return "議席を獲得するも過半数に届かず";
    if (rate < 66) return "単独過半数で政権獲得！";
    return "圧勝！安定多数で政権掌握！";
  };

  const getBarColor = (rate: number): string => {
    if (rate < 25) return "bg-red-500";
    if (rate < 50) return "bg-yellow-400";
    if (rate < 66) return "bg-blue-500";
    return "bg-green-600";
  };
  console.log(stances);
  console.log(segmentScores);
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
