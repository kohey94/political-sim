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
  segment_id: string;
  stance_id: string;
  ratio: string;
  description: number;
  segment_color: string;
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

export type VoterSegmentId =
  | "conservative"
  | "liberal"
  | "economic"
  | "welfare"
  | "environment"
  | "independent";

export interface SelectedPolicy {
  id: string;
  title: string;
  feasibility: number;
  impacts: Record<number, number>;
}

export interface EvaluateRequest {
  mostImportantPolicyId: string;
  selectedPolicies: SelectedPolicy[];
}

export interface EvaluateResponse {
  score: number; // 得票率（0〜100）
}

export type SegmentInfo = {
  segment_id: number;
  stance_id: number;
  ratio: number;
};
