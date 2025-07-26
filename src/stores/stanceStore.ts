// stores/stanceStore.ts
import { create } from "zustand";
import { PoliticalStance } from "@/types";

type stanceMap = Record<string, string>;

type StanceStore = {
  stances: PoliticalStance[];
  stanceLabelMap: stanceMap;
  stanceOrder: string[];
  stanceLoaded: boolean;
  setStances: (stances: PoliticalStance[]) => void;
};

export const useStanceStore = create<StanceStore>(set => ({
  stances: [],
  stanceLabelMap: {},
  stanceOrder: [],
  stanceLoaded: false,
  setStances: stances =>
    set({
      stances,
      stanceLabelMap: Object.fromEntries(
        stances.map(s => [s.stance_id.toString(), s.display_name_short])
      ),
      stanceOrder: stances.map(s => s.stance_id.toString()),
      stanceLoaded: true,
    }),
}));
