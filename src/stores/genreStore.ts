// stores/genreStore.ts
import { create } from "zustand";
import { PolicyGenre } from "@/types";

type GenreMap = Record<string, PolicyGenre>;

type GenreStore = {
  genres: PolicyGenre[];
  genreMap: GenreMap;
  loaded: boolean;
  setGenres: (genres: PolicyGenre[]) => void;
};

export const useGenreStore = create<GenreStore>(set => ({
  genres: [],
  genreMap: {},
  loaded: false,
  setGenres: genres =>
    set({
      genres,
      genreMap: Object.fromEntries(genres.map(g => [g.genre_id.toString(), g])),
      loaded: true,
    }),
}));
