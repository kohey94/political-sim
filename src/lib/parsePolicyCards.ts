import { PolicyCard } from "@/types";

type RawPolicyCard = {
  expansion?: string | number;
  card_id: string | number;
  genre_id: string | number;
  policy_name: string;
  description: string;
  feasibility: number;
  stance_points: {
    stance_id: string | number;
    point: number;
  }[];
};

export function parseToPolicyCards(data: RawPolicyCard[]): PolicyCard[] {
  return data.map(
    (card): PolicyCard => ({
      expansion: String(card.expansion ?? "EX01"),
      card_id: String(card.card_id),
      genre_id: String(card.genre_id),
      policy_name: card.policy_name,
      description: card.description,
      feasibility: Number(card.feasibility),
      stance_points: (card.stance_points ?? []).map(
        (sp: { stance_id: string | number; point: number }) => ({
          stance_id: String(sp.stance_id),
          point: Number(sp.point),
        })
      ),
    })
  );
}
