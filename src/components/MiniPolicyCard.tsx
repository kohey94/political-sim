"use client";

import { PolicyCard as RawPolicyCard } from "@/types";

interface Props {
  card: RawPolicyCard;
}

const genreColorMap: { [key: string]: string } = {
  "1": "bg-red-500", // 統治
  "2": "bg-green-500", // 経済
  "3": "bg-yellow-400", // 福祉
  "4": "bg-blue-500", // 環境
  "5": "bg-purple-500", // 人権
};

export default function MiniPolicyCard({ card }: Props) {
  const stanceMap = Object.fromEntries(
    card.stance_points.map(sp => [sp.stance_id.toString(), sp.point])
  );

  const stanceOrder = ["1", "2", "3", "4", "5", "6"]; // 保,リ,経,福,環,無

  return (
    <div
      className={`w-full h-full overflow-hidden border rounded p-1 shadow flex flex-col justify-between items-center text-[10px] ${
        genreColorMap[card.genre_id] ?? "bg-gray-400"
      }`}
    >
      {/* タイトル（省略付き） */}
      <div className="w-full truncate text-center font-bold">{card.policy_name}</div>

      {/* 実現性 */}
      <div className="w-8 h-8 text-[18px] rounded-full bg-zinc-200 flex items-center justify-center font-bold">
        {card.feasibility}
      </div>

      {/* スタンスポイント */}
      <div className="grid grid-cols-3 gap-[2px] w-full text-center">
        {stanceOrder.map((stanceId, i) => (
          <div
            key={i}
            className="border text-[14px] p-[3px] bg-zinc-100 rounded flex items-center justify-center"
          >
            {stanceMap[stanceId] ?? 0}
          </div>
        ))}
      </div>
    </div>
  );
}
