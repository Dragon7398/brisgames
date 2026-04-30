// ─── CampaignSelect — static data ────────────────────────────────────────────
import type { PlayerInfo, GroupInfo } from "./types";

// ── Admin identity ────────────────────────────────────────────────────────────
// When a validated token matches this player ID, the app routes to the admin
// dashboard instead of the voting page.
export const ADMIN_ID = "brisbe";

// ── Players ───────────────────────────────────────────────────────────────────
// Keys are used as URL params (?player=tritt).
// Tokens live in Firebase at campaignTokens/ — see scripts/generateTokens.ts.
// Note: brisbe (admin) has a token entry but is NOT in PLAYERS — they don't vote.
export const PLAYERS: Record<string, PlayerInfo> = {
  tritt:     { name: "Tritt",     color: "#48d9f3" },
  vvolf:     { name: "VVolf",     color: "#6660f5" },
  klsanchez: { name: "KLSanchez", color: "#f5a623" },
  panvitae:  { name: "Panvitae",  color: "#48f3a0" },
};

// ── Groups ────────────────────────────────────────────────────────────────────
export const GROUPS: Record<string, GroupInfo> = {
  all:      { label: "All Players", players: ["tritt", "vvolf", "klsanchez", "panvitae"] },
  saturday: { label: "Saturday",    players: ["tritt", "vvolf", "klsanchez"] },
  sunday:   { label: "Sunday",      players: ["tritt", "klsanchez", "panvitae"] },
};

// ── Category definitions ──────────────────────────────────────────────────────
// Structural metadata for each category. Game lists live in Firebase at
// campaignGames/ and are merged onto these at load time in storage.ts.
export const CATEGORIES: { id: string; label: string; shortLabel: string }[] = [
  { id: "major",  label: "Major Campaigns",     shortLabel: "Major"  },
  { id: "minor",  label: "Minor Campaigns",      shortLabel: "Minor"  },
  { id: "puzzle", label: "Puzzle / Escape Room", shortLabel: "Puzzle" },
];

