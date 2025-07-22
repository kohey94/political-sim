import React from "react";

export type DisplayPolicyCard = {
  card_id: number;
  title: string;
  description: string;
  genre_id: number;
  feasibility: number;
  stance_points: {
    conservative: number;
    liberal: number;
    economic: number;
    welfare: number;
    environment: number;
    neutral: number;
  };
};

// ジャンルIDを名前に変換（例）
const genreMap: { [key: number]: string } = {
  1: "統治",
  2: "経済",
  3: "福祉",
  4: "環境",
  5: "人権",
};

interface PolicyCardProps {
  card: DisplayPolicyCard;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ card }) => {
  const { title, description, feasibility, stance_points, genre_id } = card;

  return (
    <div className="w-64 rounded-lg border border-gray-400 shadow-md p-4">
      {/* ジャンルと実現性 */}
      <div className="flex justify-between items-center text-sm font-semibold mb-2">
        <span className="text-gray-700">{genreMap[genre_id]}</span>
        <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
          {feasibility}
        </span>
      </div>

      {/* カード名 */}
      <h2 className="text-center font-bold text-lg mb-2">{title}</h2>

      {/* イラストエリア */}
      <div className="w-full h-24 bg-gray-100 flex items-center justify-center mb-2 text-sm text-gray-500">
        イラスト
      </div>

      {/* 説明 */}
      <p className="text-sm text-gray-700 mb-3">{description}</p>

      {/* スタンス別ポイント */}
      <div className="grid grid-cols-6 text-xs text-center gap-1">
        <div>
          <span className="font-semibold">保</span>
          <br />
          {stance_points.conservative}
        </div>
        <div>
          <span className="font-semibold">リ</span>
          <br />
          {stance_points.liberal}
        </div>
        <div>
          <span className="font-semibold">経</span>
          <br />
          {stance_points.economic}
        </div>
        <div>
          <span className="font-semibold">福</span>
          <br />
          {stance_points.welfare}
        </div>
        <div>
          <span className="font-semibold">環</span>
          <br />
          {stance_points.environment}
        </div>
        <div>
          <span className="font-semibold">無</span>
          <br />
          {stance_points.neutral}
        </div>
      </div>
    </div>
  );
};

export default PolicyCard;
