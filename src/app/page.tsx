// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import GenreSelector from "@/components/GenreSelector";

type Genre = {
  genre_id: number;
  genre: string;
};

type PolicyCard = {
  card_id: number;
  title: string;
  description: string;
  genre_id: number;
};

const genres: Genre[] = [
  { genre_id: 1, genre: "統治" },
  { genre_id: 2, genre: "経済" },
  { genre_id: 3, genre: "福祉" },
  { genre_id: 4, genre: "環境" },
  { genre_id: 5, genre: "人権" },
];

const HomePage = () => {
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [candidateCards, setCandidateCards] = useState<PolicyCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<PolicyCard[]>([]);

  const handleCardSelect = (card: PolicyCard) => {
    setSelectedCards(prev => [...prev, card]);
    // 今後: 次の3枚 or 結果画面へ
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">推し政策ジャンルを選んでください</h1>

      <GenreSelector
        genres={genres}
        selectedGenreId={selectedGenreId}
        onSelect={setSelectedGenreId}
      />

      {candidateCards.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-2">政策カードを選んでください</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {candidateCards.map(card => (
              <button
                key={`card-${card.card_id}`}
                onClick={() => handleCardSelect(card)}
                className="p-4 bg-white rounded shadow hover:bg-gray-100 text-left"
              >
                <h3 className="font-bold mb-1">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
