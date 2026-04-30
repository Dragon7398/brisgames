// ─── CampaignSelect — Firebase storage ───────────────────────────────────────
import { ref, get, set, onValue } from "firebase/database";
import { db } from "../firebase";
import { DEFAULT_CATEGORIES } from "./data";
import type { Category, PlayerVotes, AllVotes, VoteStateResult } from "./types";

// ── Game list ─────────────────────────────────────────────────────────────────
// Firebase path: campaignGames/
//   { major: [{id, name}, …], minor: […], puzzle: […] }

export async function loadCategories(): Promise<Category[]> {
  const snap = await get(ref(db, "campaignGames"));
  if (!snap.exists()) return DEFAULT_CATEGORIES;
  const data = snap.val() as Record<string, { id: string; name: string }[]>;
  return DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    games: data[cat.id] ?? cat.games,
  }));
}

export async function saveCategories(categories: Category[]): Promise<void> {
  const data: Record<string, { id: string; name: string }[]> = {};
  categories.forEach((c) => { data[c.id] = c.games; });
  await set(ref(db, "campaignGames"), data);
}

/** Real-time listener — useful in the admin Manage Games tab. */
export function subscribeCampaignGames(
  cb: (cats: Category[]) => void
): () => void {
  return onValue(ref(db, "campaignGames"), (snap) => {
    const data = snap.val() ?? {};
    cb(
      DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        games: data[cat.id] ?? cat.games,
      }))
    );
  });
}

// ── Player votes ──────────────────────────────────────────────────────────────
// Firebase path: campaignVotes/{playerId}/
//   { major: { order: [], hearts: {}, vetoes: {} }, … }

export async function loadVotes(
  playerId: string,
  categories: Category[]
): Promise<VoteStateResult> {
  const newGameIds: Record<string, Set<string>> = {};
  categories.forEach((c) => { newGameIds[c.id] = new Set(); });

  const snap = await get(ref(db, `campaignVotes/${playerId}`));

  if (!snap.exists()) {
    const votes: PlayerVotes = {};
    categories.forEach((c) => {
      votes[c.id] = { order: c.games.map((g) => g.id), hearts: {}, vetoes: {} };
    });
    return { votes, newGameIds };
  }

  const saved = snap.val() as PlayerVotes;

  categories.forEach((c) => {
    if (!saved[c.id]) {
      saved[c.id] = { order: c.games.map((g) => g.id), hearts: {}, vetoes: {} };
      c.games.forEach((g) => newGameIds[c.id].add(g.id));
    } else {
      c.games.forEach((g) => {
        if (!saved[c.id].order.includes(g.id)) {
          saved[c.id].order.push(g.id);
          newGameIds[c.id].add(g.id);
        }
      });
      const validIds = new Set(c.games.map((g) => g.id));
      saved[c.id].order = saved[c.id].order.filter((id) => validIds.has(id));
    }
  });

  return { votes: saved, newGameIds };
}

// Debounced write — avoids hammering Firebase on rapid reorders.
let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function saveVotes(playerId: string, votes: PlayerVotes): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    await set(ref(db, `campaignVotes/${playerId}`), votes);
  }, 500);
}

// ── Player tokens ─────────────────────────────────────────────────────────────
// Firebase path: campaignTokens/{playerId}

export async function loadPlayerTokens(): Promise<Record<string, string>> {
  const snap = await get(ref(db, "campaignTokens"));
  return snap.exists() ? (snap.val() as Record<string, string>) : {};
}

// ── Admin — read all votes ────────────────────────────────────────────────────
// Firebase path: campaignVotes/

export async function loadAllVotes(): Promise<AllVotes> {
  const snap = await get(ref(db, "campaignVotes"));
  return snap.exists() ? (snap.val() as AllVotes) : {};
}

/** Real-time listener for the admin Results tab. */
export function subscribeAllVotes(cb: (votes: AllVotes) => void): () => void {
  return onValue(ref(db, "campaignVotes"), (snap) => {
    cb(snap.exists() ? (snap.val() as AllVotes) : {});
  });
}
