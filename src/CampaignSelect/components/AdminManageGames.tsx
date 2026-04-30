// ─── CampaignSelect — AdminManageGames ───────────────────────────────────────
import { useState } from "react";
import type { Category } from "../types";

interface AdminManageGamesProps {
  categories: Category[];
  onCategoriesChange: (updated: Category[]) => void;
}

export function AdminManageGames({ categories, onCategoriesChange }: AdminManageGamesProps) {
  const [newGameName, setNewGameName] = useState<Record<string, string>>({});

  function addGame(catId: string) {
    const name = (newGameName[catId] ?? "").trim();
    if (!name) return;
    const id = catId[0] + "x" + Date.now();
    onCategoriesChange(
      categories.map((c) =>
        c.id === catId ? { ...c, games: [...c.games, { id, name }] } : c
      )
    );
    setNewGameName((prev) => ({ ...prev, [catId]: "" }));
  }

  function removeGame(catId: string, gameId: string) {
    onCategoriesChange(
      categories.map((c) =>
        c.id === catId ? { ...c, games: c.games.filter((g) => g.id !== gameId) } : c
      )
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {categories.map((cat) => (
        <div
          key={cat.id}
          style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}
        >
          <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em" }}>
              {cat.label}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600 }}>
              {cat.games.length} game{cat.games.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {cat.games.map((game, i) => (
              <div
                key={game.id}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 7, background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, minWidth: 18 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 12, fontWeight: 500, color: "var(--text-1)" }}>
                  {game.name}
                </div>
                <button
                  onClick={() => removeGame(cat.id, game.id)}
                  title="Remove game"
                  style={{
                    width: 22, height: 22, borderRadius: 5,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "transparent", border: "1px solid var(--border)",
                    color: "var(--text-3)", fontSize: 13, flexShrink: 0, cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            {cat.games.length === 0 && (
              <div style={{ fontSize: 12, color: "var(--text-3)", padding: "12px 0", textAlign: "center" }}>
                No games yet — add one below.
              </div>
            )}
          </div>

          <div style={{ padding: "10px 16px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              value={newGameName[cat.id] ?? ""}
              onChange={(e) => setNewGameName((prev) => ({ ...prev, [cat.id]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && addGame(cat.id)}
              placeholder="Add a game…"
              style={{
                flex: 1, padding: "7px 11px", borderRadius: 7, fontSize: 12,
                background: "var(--surface)", border: "1px solid var(--border)",
                color: "var(--text-1)", outline: "none",
              }}
            />
            <button
              onClick={() => addGame(cat.id)}
              style={{
                padding: "7px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600,
                background: "var(--cyan-dim)", color: "var(--cyan)",
                border: "1px solid #48d9f344", flexShrink: 0, cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
        </div>
      ))}

      <div style={{
        padding: "10px 14px", borderRadius: 8,
        background: "var(--surface)", border: "1px solid var(--border)",
        fontSize: 11, color: "var(--text-3)", lineHeight: 1.65,
      }}>
        Changes write immediately to Firebase. Players see updates on their next page load. Games added while players have existing votes will appear at the bottom of their list with a{" "}
        <strong style={{ color: "var(--amber)" }}>New</strong> badge.
      </div>
    </div>
  );
}
