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
