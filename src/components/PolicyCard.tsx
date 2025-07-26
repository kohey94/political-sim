"use client";

import React, { useEffect, useState } from "react";
import { PolicyCard as RawPolicyCard } from "@/types";
import { useGenreStore } from "@/stores/genreStore";
import { useStanceStore } from "@/stores/stanceStore";

interface Props {
  card: RawPolicyCard;
  isSelected?: boolean;
  onSelect?: () => void;
}

const PolicyCard: React.FC<Props> = ({ card, isSelected, onSelect }) => {
  const [stanceMap, setStanceMap] = useState<Record<string, number>>({}); // stance_id → point
  const { genreMap } = useGenreStore();
  const { stanceLabelMap, stanceOrder } = useStanceStore();

  useEffect(() => {
    // stance_idとpointのマッピング
    const pointMap = Object.fromEntries(
      card.stance_points.map(sp => [sp.stance_id.toString(), sp.point])
    );
    setStanceMap(pointMap);
  }, [card]);

  return (
    <div
      className={`relative w-64 h-88 rounded-lg border border-gray-400 shadow p-2 space-y-2
      ${
        card.genre_id != null && genreMap[card.genre_id.toString()]
          ? genreMap[card.genre_id.toString()]?.genre_color
          : "bg-white"
      }
      ${isSelected ? "outline outline-4 outline-yellow-400 outline-offset-2" : ""}
    `}
      onClick={onSelect}
    >
      {/* カード名 & 丸数字 */}
      <div className="relative h-8 flex items-center justify-center">
        <div className="absolute left-0 w-6 h-6 rounded-full bg-zinc-200 text-sm font-bold flex items-center justify-center text-black">
          政
        </div>
        <div className="h-8 px-2 bg-zinc-200 border border-gray-300 rounded text-center font-bold w-[calc(100%-56px)] mx-[28px] overflow-hidden text-ellipsis whitespace-nowrap flex items-center justify-center text-[15px] leading-none">
          {card.policy_name}
        </div>
        <div className="absolute right-0 w-6 h-6 rounded-full bg-zinc-200 text-sm font-bold flex items-center justify-center text-black">
          {card.feasibility}
        </div>
      </div>

      {/* イラストエリア */}
      <div className="h-30 border border-gray-300 rounded h-24 flex items-center justify-center text-sm text-gray-500 bg-gray-50">
        <img
          src={`/image/policy_card/ex${card.expansion.toString().padStart(2, "0")}-${card.card_id.toString().padStart(3, "0")}.png`}
          alt="イラスト"
          className="object-contain h-full"
        />
      </div>

      {/* 説明文 + ジャンル */}
      <div className="h-28 border border-gray-300 rounded px-2 py-1 text-sm text-gray-700 bg-zinc-200 text-left">
        <span className="text-xs text-gray-500">
          {card.genre_id != null && genreMap[card.genre_id.toString()]
            ? genreMap[card.genre_id.toString()]?.genre_name
            : "不明"}
        </span>
        <br />
        {card.description}
      </div>

      {/* スタンス別ポイント */}
      <div className="h-10 border border-gray-300 rounded grid grid-cols-6 text-xs text-center overflow-hidden bg-zinc-200">
        {stanceOrder.map(stanceId => (
          <div key={stanceId} className="py-1 border-r border-gray-200 last:border-r-0">
            <span className="font-semibold">{stanceLabelMap[stanceId] ?? "?"}</span>
            <br />
            {stanceMap[stanceId] ?? 0}
          </div>
        ))}
      </div>

      {/* カード番号（右下に固定） */}
      <div className="absolute bottom-0 right-2 text-[10px] text-black">
        EX{card.expansion.toString().padStart(2, "0")}-{card.card_id.toString().padStart(3, "0")}
      </div>
    </div>
  );
};

export default PolicyCard;
