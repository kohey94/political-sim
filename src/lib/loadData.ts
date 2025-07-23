// loadData.ts
import path from "path";
import { promises as fs } from "fs";
import { PolicyCard, PoliticalStance, VoterSegment, PolicyGenre } from "@/types/index";

const dataPath = path.join(process.cwd(), "public", "data");

export async function loadPolicyGenres(): Promise<PolicyGenre[]> {
  const filePath = path.join(dataPath, "m_policy_genre.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function loadPolicyCards(): Promise<PolicyCard[]> {
  const filePath = path.join(dataPath, "m_policy_cards.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function loadVoterSegments(): Promise<VoterSegment[]> {
  const filePath = path.join(dataPath, "m_voter_segments.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function loadPoliticalStances(): Promise<PoliticalStance[]> {
  const filePath = path.join(dataPath, "m_political_stance.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}
