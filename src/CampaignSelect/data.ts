// ─── CampaignSelect — static data ────────────────────────────────────────────
import type { Category, PlayerInfo, GroupInfo, AllVotes } from "./types";

// ── Admin identity ────────────────────────────────────────────────────────────
// When a validated token matches this player ID, the app routes to the admin
// dashboard instead of the voting page.
export const ADMIN_ID = "brisbe";

// ── Players ───────────────────────────────────────────────────────────────────
// Keys are used as URL params (?player=tritt).
// Tokens are stored separately in Firebase (campaignTokens/) so they can be
// rotated without a code deploy — see generateTokens.ts.
// These hardcoded tokens are the PROTOTYPE defaults; overwrite them in Firebase.
// Note: brisbe (admin) has a token entry but is NOT in PLAYERS — they don't vote.
export const PLAYER_TOKENS: Record<string, string> = {
  tritt:     "xk3m9p",
  vvolf:     "bw7r2n",
  klsanchez: "qf4h8v",
  panvitae:  "yt6j1c",
  brisbe:    "placeholder", // real token written by scripts/generateTokens.ts
};

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

// ── Mock votes (admin demo only) ──────────────────────────────────────────────
// Replace with a live loadAllVotes() call in AdminResults — see storage.ts.
export const MOCK_VOTES: AllVotes = {
  tritt: {
    major:  { order: ["m1","m3","m2","m8","m4","m5","m6","m9","m7","m11","m12","m10","m13"], hearts: { m1:true, m3:true }, vetoes: { m13:true } },
    minor:  { order: ["n2","n3","n1","n5","n4"], hearts: { n2:true }, vetoes: { n4:true } },
    puzzle: { order: ["p3","p1","p4","p2","p5"], hearts: { p3:true }, vetoes: {} },
  },
  vvolf: {
    major:  { order: ["m2","m1","m4","m3","m7","m6","m5","m8","m11","m9","m10","m12","m13"], hearts: { m2:true, m1:true }, vetoes: { m10:true, m13:true } },
    minor:  { order: ["n1","n2","n4","n3","n5"], hearts: { n1:true }, vetoes: {} },
    puzzle: { order: ["p1","p4","p2","p3","p5"], hearts: { p4:true }, vetoes: { p5:true } },
  },
  klsanchez: {
    major:  { order: ["m8","m2","m1","m5","m9","m3","m4","m6","m12","m11","m7","m10","m13"], hearts: { m8:true, m2:true }, vetoes: { m10:true } },
    minor:  { order: ["n3","n2","n5","n1","n4"], hearts: { n3:true }, vetoes: { n4:true } },
    puzzle: { order: ["p3","p2","p1","p5","p4"], hearts: { p3:true, p2:true }, vetoes: {} },
  },
  panvitae: {
    major:  { order: ["m3","m1","m6","m2","m7","m8","m5","m4","m9","m12","m11","m13","m10"], hearts: { m3:true }, vetoes: { m10:true, m13:true } },
    minor:  { order: ["n2","n1","n3","n4","n5"], hearts: { n2:true, n1:true }, vetoes: {} },
    puzzle: { order: ["p4","p3","p1","p2","p5"], hearts: { p4:true, p3:true }, vetoes: { p5:true } },
  },
};
