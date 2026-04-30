// ─── CampaignSelect — authentication helpers ──────────────────────────────────
import { signInWithCustomToken, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "../firebase";
import { PLAYERS, ADMIN_ID } from "./data";
import type { ScreenState } from "./types";

// ── Firebase Auth ─────────────────────────────────────────────────────────────
// Calls the mintAuthToken Cloud Function to validate the magic-link token.
// On success the function returns a Firebase Auth custom token with
// { playerId, isAdmin } claims, which we use to sign in so that the Realtime
// Database security rules can enforce per-player write restrictions.
export async function signInWithMagicToken(
  playerId: string,
  token: string
): Promise<boolean> {
  if (playerId !== ADMIN_ID && !PLAYERS[playerId]) return false;

  try {
    const mintAuthToken = httpsCallable<
      { playerId: string; token: string },
      { customToken: string }
    >(functions, "mintAuthToken");

    const result = await mintAuthToken({ playerId, token });
    await signInWithCustomToken(auth, result.data.customToken);
    return true;
  } catch {
    return false;
  }
}

export async function signOutPlayer(): Promise<void> {
  await signOut(auth);
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
