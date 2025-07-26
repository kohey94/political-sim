"use client";

import React from "react";

interface ElectionResultProps {
  voteRate: number; // 0〜100
}

export default function ElectionResult({ voteRate }: ElectionResultProps) {
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

  return (
    <div className="w-full max-w-2xl mx-auto text-center mt-10 space-y-6">
      <div className="text-2xl font-bold">得票率 {voteRate}%</div>

      <div className="relative h-6 w-full bg-gray-200 rounded">
        <div
          className={`absolute top-0 left-0 h-full rounded ${getBarColor(voteRate)}`}
          style={{ width: `${voteRate}%`, transition: "width 0.5s ease-in-out" }}
        />
      </div>

      <div className="text-lg font-semibold">{getResultText(voteRate)}</div>
    </div>
  );
}
