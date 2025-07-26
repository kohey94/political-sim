"use client";

import { PolicyCard as RawPolicyCard } from "@/types";
import { useGenreStore } from "@/stores/genreStore";
import { useStanceStore } from "@/stores/stanceStore";

interface Props {
  card: RawPolicyCard;
}

export default function MiniPolicyCard({ card }: Props) {
  const { genreMap } = useGenreStore();
  const { stanceOrder } = useStanceStore();

  // stance_idに対応したpointを取得するためのmap
  const stancePointMap = Object.fromEntries(
    card.stance_points.map(sp => [sp.stance_id.toString(), sp.point])
  );

  return (
    <div
      className={`w-full h-full overflow-hidden border rounded p-1 shadow flex flex-col justify-between items-center text-[10px] ${
        card.genre_id != null && genreMap[card.genre_id.toString()]
          ? genreMap[card.genre_id.toString()]?.genre_color
          : "bg-white"
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
            {stancePointMap[stanceId] ?? 0}
          </div>
        ))}
      </div>
    </div>
  );
}
