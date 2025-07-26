// types/index.ts
export type PolicyGenre = {
  genre_id: string;
  genre_name: string;
  genre_color: string;
};

export type PolicyCard = {
  expansion: string;
  card_id: string;
  genre_id: string;
  policy_name: string;
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
  stance_id: string;
  stance_name: string;
  display_name: string;
  display_name_short: string;
};

export type DisplayPolicyCard = {
  expansion: string;
  card_id: string;
  genre_id: string;
  policy_name: string;
  description: string;
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
