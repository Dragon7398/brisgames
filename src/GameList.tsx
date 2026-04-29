import { useState } from "react";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface GameDefinition {
  key: string;
  name: string;
  description: string;
  priority: number;
  platformKey: string;
  tags: Record<string, boolean>;
  players: Record<string, boolean>;
}

export interface Platform  { name: string; }
export interface TagType   { name: string; }
export interface Tag       { name: string; tagTypeKey: string; }
export interface Player    { username: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function priorityBar(priority: number): string {
  if (priority === 3) return "linear-gradient(90deg, #48d9f3, #6660f5)";
  if (priority === 2) return "#6660f5";
  return "transparent";
}

// ─── GameCard ─────────────────────────────────────────────────────────────────

interface GameCardProps {
  game: GameDefinition;
  allTags: Record<string, Tag>;
}

export function GameCard({ game, allTags }: GameCardProps) {
  const [hov, setHov] = useState(false);

  const gameTags = Object.keys(game.tags ?? {}).filter((k) => allTags[k]);
  const wasPlayed = game.players && Object.keys(game.players).length > 0;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "var(--card-hov)" : "var(--card)",
        border: "1px solid",
        borderColor: hov ? "var(--border-hi)" : "var(--border)",
        borderRadius: 10,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {/* Priority bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: priorityBar(game.priority),
          opacity: game.priority === 1 ? 0 : 1,
        }}
      />

      {/* Name + Played badge */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-1)",
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            minWidth: 0,
          }}
        >
          {game.name}
        </div>
        {wasPlayed && (
          <div
            style={{
              flexShrink: 0,
              fontSize: 10,
              fontWeight: 600,
              color: "var(--played-tx)",
              background: "var(--played)",
              padding: "2px 7px",
              borderRadius: 4,
              letterSpacing: "0.02em",
            }}
          >
            Played
          </div>
        )}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 11.5,
          color: "var(--text-3)",
          lineHeight: 1.55,
          flex: 1,
        }}
      >
        {game.description}
      </div>

      {/* Tag pills */}
      {gameTags.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
            marginTop: 2,
          }}
        >
          {gameTags.map((slug) => (
            <span
              key={slug}
              style={{
                fontSize: 10,
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: 4,
                background: "#0f1a1f",
                color: "#2d5060",
                border: "1px solid #192830",
              }}
            >
              {allTags[slug]?.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState() {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 20px",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 32 }}>🎮</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-2)" }}>
        No games match your filters
      </div>
      <div style={{ fontSize: 12, color: "var(--text-3)" }}>
        Try adjusting the filters above
      </div>
    </div>
  );
}

// ─── GameList ─────────────────────────────────────────────────────────────────

interface GameListProps {
  games: GameDefinition[];
  allTags: Record<string, Tag>;
}

export function GameList({ games, allTags }: GameListProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 10,
      }}
    >
      {games.length > 0 ? (
        games.map((g) => <GameCard key={g.key} game={g} allTags={allTags} />)
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
