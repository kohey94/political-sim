"use client";

interface Props {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center  bg-white pt-70">
      <h1 className="text-8xl font-bold mb-8">POLISIM</h1>
      <button
        onClick={onStart}
        className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition"
      >
        始める
      </button>
    </div>
  );
}
