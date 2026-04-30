// ─── CampaignSelect — authentication helpers ──────────────────────────────────
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import { PLAYERS, ADMIN_ID } from "./data";
import type { ScreenState } from "./types";

// ── Firebase token validation ─────────────────────────────────────────────────
export async function validatePlayerFirebase(
  playerId: string,
  token: string
): Promise<boolean> {
  if (playerId !== ADMIN_ID && !PLAYERS[playerId]) return false;
  const snap = await get(ref(db, `campaignTokens/${playerId}`));
  return snap.exists() && snap.val() === token;
}

// ── URL helpers ───────────────────────────────────────────────────────────────
export function detectInitialScreen(): ScreenState {
  try {
    const playerId = new URLSearchParams(window.location.search).get("player");
    if (playerId) return { view: "loading", playerId };
  } catch { /* ignore URL parse errors */ }
  return { view: "login" };
}

export function pushUrl(params: Record<string, string>): void {
  try {
    const url = new URL(window.location.href);
    ["player", "t"].forEach((k) => url.searchParams.delete(k));
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    window.history.pushState({}, "", url.toString());
  } catch { /* ignore URL parse errors */ }
}

export function buildPlayerLink(playerId: string, token: string): string {
  try {
    const url = new URL(window.location.href);
    ["player", "t"].forEach((k) => url.searchParams.delete(k));
    url.searchParams.set("player", playerId);
    url.searchParams.set("t", token);
    return url.toString();
  } catch {
    return `?player=${playerId}&t=${token}`;
  }
}
