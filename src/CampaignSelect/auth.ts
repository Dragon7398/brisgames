// ─── CampaignSelect — authentication helpers ──────────────────────────────────
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import { PLAYERS, PLAYER_TOKENS, ADMIN_ID } from "./data";
import type { ScreenState } from "./types";

// ── Client-side token validation ──────────────────────────────────────────────
// Checks the token against the hardcoded PLAYER_TOKENS map.
// brisbe (admin) is allowed even though they are not in the PLAYERS voting map.
export function validatePlayerLocal(
  playerId: string | null,
  token: string | null
): string | null {
  if (!playerId || !token) return null;
  if (playerId !== ADMIN_ID && !PLAYERS[playerId]) return null;
  if (PLAYER_TOKENS[playerId] !== token) return null;
  return playerId;
}

// ── Firebase token validation (production) ────────────────────────────────────
// Reads token from ref(db, 'campaignTokens/{playerId}') and compares.
// brisbe (admin) is allowed even though they are not in the PLAYERS voting map.
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
    const p = new URLSearchParams(window.location.search);
    const pid = validatePlayerLocal(p.get("player"), p.get("t"));
    if (pid) {
      if (pid === ADMIN_ID) return { view: "admin" };
      return { view: "vote", playerId: pid };
    }
    if (p.get("player")) return { view: "unauth" }; // param present, token wrong
  } catch (e) {}
  return { view: "login" };
}

export function pushUrl(params: Record<string, string>): void {
  try {
    const url = new URL(window.location.href);
    ["player", "t"].forEach((k) => url.searchParams.delete(k));
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    window.history.pushState({}, "", url.toString());
  } catch (e) {}
}

export function buildPlayerLink(playerId: string): string {
  try {
    const url = new URL(window.location.href);
    ["player", "t"].forEach((k) => url.searchParams.delete(k));
    url.searchParams.set("player", playerId);
    url.searchParams.set("t", PLAYER_TOKENS[playerId]);
    return url.toString();
  } catch (e) {
    return `?player=${playerId}&t=${PLAYER_TOKENS[playerId]}`;
  }
}
