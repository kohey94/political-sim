"use client";

interface Props {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-3xl font-bold mb-8">政策シミュレーター</h1>
      <button
        onClick={onStart}
        className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition"
      >
        始める
      </button>
    </div>
  );
}
