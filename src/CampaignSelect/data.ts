// ─── CampaignSelect — static data ────────────────────────────────────────────
import type { Category, PlayerInfo, GroupInfo } from "./types";

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

// ── Default game list ─────────────────────────────────────────────────────────
// This is the fallback used when Firebase has no data yet.
// In production, write this to ref(db, 'campaignGames') once using the
// admin Manage Games UI or the seed script in scripts/generateTokens.ts.
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "major",
    label: "Major Campaigns",
    shortLabel: "Major",
    games: [
      { id: "m1",  name: "Frosthaven" },
      { id: "m2",  name: "Arydia: The Paths We Dare Tread" },
      { id: "m3",  name: "Stonesaga" },
      { id: "m4",  name: "Gloomhaven: Jaws of the Lion" },
      { id: "m5",  name: "Descent: Legends of the Dark" },
      { id: "m6",  name: "Arkham Horror LCG" },
      { id: "m7",  name: "Spirit Island Campaign" },
      { id: "m8",  name: "Sleeping Gods" },
      { id: "m9",  name: "Tainted Grail: The Fall of Avalon" },
      { id: "m10", name: "Kingdom Death: Monster" },
      { id: "m11", name: "Etherfields" },
      { id: "m12", name: "Dead Reckoning" },
      { id: "m13", name: "Pandemic Legacy Season 3" },
    ],
  },
  {
    id: "minor",
    label: "Minor Campaigns",
    shortLabel: "Minor",
    games: [
      { id: "n1", name: "Flash Point: Golden State Heroes" },
      { id: "n2", name: "Marvel Champions" },
      { id: "n3", name: "Freedom Five" },
      { id: "n4", name: "Pandemic Season 2" },
      { id: "n5", name: "Aeon's End Legacy" },
    ],
  },
  {
    id: "puzzle",
    label: "Puzzle / Escape Room",
    shortLabel: "Puzzle",
    games: [
      { id: "p1", name: "Exit: The Game" },
      { id: "p2", name: "Unlock!" },
      { id: "p3", name: "The Light In The Mist" },
      { id: "p4", name: "Sherlock Holmes Consulting Detective" },
      { id: "p5", name: "Mysterium Park" },
    ],
  },
];

