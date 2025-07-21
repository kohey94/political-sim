import path from "path";
import { promises as fs } from "fs";
import { PolicyCard, PoliticalStance, VoterSegment } from "@/types/index";

const dataPath = path.join(process.cwd(), "public", "data");

export async function loadPolicyCards(): Promise<PolicyCard[]> {
  const filePath = path.join(dataPath, "policy_cards.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function loadVoterSegments(): Promise<VoterSegment[]> {
  const filePath = path.join(dataPath, "voter_segments.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function loadPoliticalStances(): Promise<PoliticalStance[]> {
  const filePath = path.join(dataPath, "political_stance.json");
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}
