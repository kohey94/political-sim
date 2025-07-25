import { PolicyCard } from "@/types";

// src/server/sessionMap.ts
export const sessionCardMap: Map<string, { important: PolicyCard[]; others: PolicyCard[] }> =
  new Map();
