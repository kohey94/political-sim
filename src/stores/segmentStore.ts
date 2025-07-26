// stores/segmentStore.ts
import { create } from "zustand";
import { VoterSegment } from "@/types";

interface SegmentStore {
  segments: VoterSegment[];
  segmentMap: Record<string, VoterSegment>;
  segmentLoaded: boolean;
  setSegments: (segments: VoterSegment[]) => void;
}

export const useSegmentStore = create<SegmentStore>(set => ({
  segments: [],
  segmentMap: {},
  segmentLoaded: false,
  setSegments: (segments: VoterSegment[]) => {
    const segmentMap = Object.fromEntries(segments.map(s => [s.segment_id.toString(), s]));
    set({ segments, segmentMap, segmentLoaded: true });
  },
}));
