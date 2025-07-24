"use client";

import React, { useEffect, useState } from "react";
import { PolicyCard as RawPolicyCard, PoliticalStance } from "@/types";

interface Props {
  card: RawPolicyCard;
  genreMap: { [genre_id: string]: string };
  isSelected?: boolean;
  onSelect?: () => void;
}

const PolicyCard: React.FC<Props> = ({ card, genreMap, isSelected, onSelect }) => {
  const [stanceLabelMap, setStanceLabelMap] = useState<Record<string, string>>({});
  const [stanceIdList, setStanceIdList] = useState<string[]>([]); // 表示順用
  const [stanceMap, setStanceMap] = useState<Record<string, number>>({}); // stance_id → point

  useEffect(() => {
    const loadStances = async () => {
      const res = await fetch("/data/m_political_stance.json");
      const data: PoliticalStance[] = await res.json();

      // stance_id → label
      const labelMap = Object.fromEntries(
        data.map(s => [s.stance_id.toString(), s.display_name_short])
      );

      const idList = data.map(s => s.stance_id.toString());

      // stance_id → point
      const pointMap = Object.fromEntries(
        card.stance_points.map(sp => [sp.stance_id.toString(), sp.point])
      );

      setStanceLabelMap(labelMap);
      setStanceIdList(idList);
      setStanceMap(pointMap);
    };

    loadStances();
  }, [card]);

  const genreColorMap: { [key: string]: string } = {
    "1": "bg-red-500", // 統治
    "2": "bg-green-500", // 経済
    "3": "bg-yellow-400", // 福祉
    "4": "bg-blue-500", // 環境
    "5": "bg-purple-500", // 人権
  };

  return (
    <div
      className={`relative w-64 h-88 rounded-lg border border-gray-400 shadow p-2 space-y-2
      ${genreColorMap[card.genre_id] ?? "bg-white"}
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
          {card.genre_id != null && genreMap?.[card.genre_id.toString()]
            ? genreMap[card.genre_id.toString()]
            : "不明"}
        </span>
        <br />
        {card.description}
      </div>

      {/* スタンス別ポイント */}
      <div className="h-10 border border-gray-300 rounded grid grid-cols-6 text-xs text-center overflow-hidden bg-zinc-200">
        {stanceIdList.map(stanceId => (
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
