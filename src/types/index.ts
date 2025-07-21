export type PolicyCard = {
  id: string;
  genre: string;
  title: string;
  description: string;
  feasibility: number; // 0〜4
  stance_points: {
    stance_id: string;
    point: number; // -2〜2
  }[];
};

export type VoterSegment = {
  id: string;
  name: string;
  percentage: number;
  stance_weights: {
    stance_id: string;
    weight: number;
  }[];
};

export type PoliticalStance = {
  id: string;
  name: string;
  description: string;
};
