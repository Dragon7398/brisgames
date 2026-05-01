// ─── CampaignSelect — shared types ───────────────────────────────────────────

export interface Game {
  id: string;
  name: string;
  description?: string;
  bggUrl?: string;
}

export interface Category {
  id: string;
  label: string;
  shortLabel: string;
  games: Game[];
}

export interface CategoryVotes {
  order: string[];
  hearts: Record<string, boolean>;
  vetoes: Record<string, boolean>;
}

/** All votes for a single player, keyed by category id */
export type PlayerVotes = Record<string, CategoryVotes>;

/** All votes across all players, keyed by player id */
export type AllVotes = Record<string, PlayerVotes>;

export interface PlayerInfo {
  name: string;
  color: string;
}

export interface VoteStateResult {
  votes: PlayerVotes;
  /** Games that exist in the current list but were NOT in the player's saved order —
   *  i.e. they were added after the player last voted. Per category. */
  newGameIds: Record<string, Set<string>>;
}

export type GroupId = "all" | "saturday" | "sunday";

export interface GroupInfo {
  label: string;
  players: string[];
}

export interface Snapshot {
  id: string;
  createdAt: number;
  groupId: GroupId;
  votes: AllVotes;
  games: Record<string, Game[]>;
}

export interface ScreenState {
  view: "login" | "vote" | "admin" | "unauth" | "loading";
  playerId?: string;
}
