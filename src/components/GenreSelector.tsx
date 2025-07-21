// components/GenreSelector.tsx
import React from "react";

type Genre = {
  genre_id: number;
  genre: string;
};

type Props = {
  genres: Genre[];
  selectedGenreId: number | null;
  onSelect: (genreId: number) => void;
};

export default function GenreSelector({ genres, selectedGenreId, onSelect }: Props) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">推し政策ジャンルを選んでください</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {genres.map(g => (
          <button
            key={`genre-${g.genre_id}`}
            onClick={() => onSelect(g.genre_id)}
            className={`p-4 rounded-xl shadow text-lg ${
              selectedGenreId === g.genre_id
                ? "bg-blue-500 text-white"
                : "bg-blue-100 hover:bg-blue-200"
            }`}
          >
            {g.genre}
          </button>
        ))}
      </div>
    </div>
  );
}
