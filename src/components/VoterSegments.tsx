"use client";

import { useStanceStore } from "@/stores/stanceStore";
import { useSegmentStore } from "@/stores/segmentStore";

export default function VoterSegments() {
  const { segments } = useSegmentStore();
  const { stances } = useStanceStore();

  // stance_idに対応したpointを取得するためのmap
  const stanceNameMap = Object.fromEntries(
    stances.map(s => [s.stance_id.toString(), s.display_name])
  );

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b shadow z-50 px-4 py-2">
      <h2 className="font-bold text-center mb-2">有権者層</h2>

      {/* 横幅制限ラッパー */}
      <div className="max-w-4xl mx-auto">
        {/* 割合バー */}
        <div className="w-full border border-gray-300 rounded overflow-hidden h-10 flex">
          {segments.map(segment => (
            <div
              key={segment.segment_id}
              className={`${segment.segment_color} h-full text-xs text-black flex items-center justify-center whitespace-nowrap overflow-hidden`}
              style={{
                width: `${Number(segment.ratio) * 100}%`,
              }}
              title={`${stanceNameMap[segment.stance_id.toString()] ?? "不明"} (${Number(segment.ratio).toFixed(1)}%)`}
            >
              {Number(segment.ratio) > 0.05 &&
                `${stanceNameMap[segment.stance_id.toString()] ?? "不明"}`}
            </div>
          ))}
        </div>

        {/* ラベル一覧 */}
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          {segments.map(segment => (
            <div key={segment.segment_id} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getTailwindColorHex(segment.segment_color) }}
              />
              <span>
                {stanceNameMap[segment.stance_id.toString()] ?? "不明"}:
                {Number(segment.ratio).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Tailwindクラス名（例: bg-red-500）をhexカラーに変換する関数の仮実装
 * 実運用ではカラー定義を事前にマッピングすることを推奨
 */
function getTailwindColorHex(twColor: string): string {
  const colorMap: Record<string, string> = {
    "bg-red-500": "#ef4444",
    "bg-purple-500": "#a855f7",
    "bg-green-500": "#22c55e",
    "bg-yellow-400": "#facc15",
    "bg-blue-500": "#3b82f6",
    "bg-gray-300": "#d1d5db",
    "bg-gray-400": "#9ca3af",
    "bg-gray-500": "#6b7280",
    // 必要に応じて他も追加
  };
  return colorMap[twColor] ?? "#000"; // 不明な場合は黒
}
