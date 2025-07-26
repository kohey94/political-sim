"use client";

import { useState } from "react";
import { PolicyCard as RawPolicyCard } from "@/types";
import MiniPolicyCard from "./cards/MiniPolicyCard";
import ConfirmDialog from "./dialogs/ConfirmDialog";
import { useStanceStore } from "@/stores/stanceStore";

interface Props {
  selectedCards: RawPolicyCard[];
}

export default function SelectedPolicyArea({ selectedCards }: Props) {
  const [previewCard, setPreviewCard] = useState<RawPolicyCard | null>(null);
  const { stances } = useStanceStore();

  // 合計スタンスと実現性
  const totalPoints = selectedCards.reduce(
    (acc, card) => {
      if (!card) return acc;
      acc.feasibility += card.feasibility;
      card.stance_points.forEach(sp => {
        acc.stances[sp.stance_id] = (acc.stances[sp.stance_id] ?? 0) + sp.point;
      });
      return acc;
    },
    { feasibility: 0, stances: {} as Record<string, number> }
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow p-4 z-50">
      <h2 className="font-bold mb-2 text-center">選択した政策</h2>

      {/* カード6枚表示 */}
      <div className="flex justify-center gap-2 mb-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-[96px] h-[128px] border-2 border-dashed rounded flex items-center justify-center"
            onClick={() => {
              if (selectedCards[i]) setPreviewCard(selectedCards[i]);
            }}
          >
            {selectedCards[i] && <MiniPolicyCard card={selectedCards[i]} />}
          </div>
        ))}
      </div>

      {/* スタンスポイントと実現性 */}
      <div className="flex justify-center items-end gap-2">
        {stances.map(st => (
          <div key={st.stance_id} className="flex flex-col items-center">
            <div className="text-sm font-bold">{st.display_name_short}</div>
            <div className="w-10 h-10 text-sm border rounded flex items-center justify-center">
              {totalPoints.stances[st.stance_id] ?? 0}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-lg font-bold">
          {totalPoints.feasibility}
        </div>
      </div>

      <ConfirmDialog
        open={!!previewCard}
        onCancel={() => setPreviewCard(null)}
        card={previewCard}
        isConfirmButtons={true}
      />
    </div>
  );
}
