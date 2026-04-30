// ─── CampaignSelect — AdminManageGames ───────────────────────────────────────
import { useState } from "react";
import type { Category, Game } from "../types";

interface AdminManageGamesProps {
  categories: Category[];
  onCategoriesChange: (updated: Category[]) => void;
}

export function AdminManageGames({ categories, onCategoriesChange }: AdminManageGamesProps) {
  const [newGameName, setNewGameName] = useState<Record<string, string>>({});
  const [expandedGameId, setExpandedGameId] = useState<string | null>(null);
  const [draftDesc, setDraftDesc] = useState<string>("");
  const [draftBggUrl, setDraftBggUrl] = useState<string>("");

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
    if (expandedGameId === gameId) closeEditor();
    onCategoriesChange(
      categories.map((c) =>
        c.id === catId ? { ...c, games: c.games.filter((g) => g.id !== gameId) } : c
      )
    );
  }

  function openEditor(game: Game) {
    setExpandedGameId(game.id);
    setDraftDesc(game.description ?? "");
    setDraftBggUrl(game.bggUrl ?? "");
  }

  function closeEditor() {
    setExpandedGameId(null);
    setDraftDesc("");
    setDraftBggUrl("");
  }

  function saveEditor(catId: string, gameId: string) {
    const desc = draftDesc.trim();
    const url = draftBggUrl.trim();
    onCategoriesChange(
      categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              games: c.games.map((g) =>
                g.id === gameId
                  ? { ...g, description: desc || undefined, bggUrl: url || undefined }
                  : g
              ),
            }
          : c
      )
    );
    closeEditor();
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
            {cat.games.map((game, i) => {
              const isExpanded = expandedGameId === game.id;
              return (
                <div
                  key={game.id}
                  style={{
                    borderRadius: 7, background: "var(--surface)",
                    border: "1px solid", borderColor: isExpanded ? "var(--cyan)" : "var(--border)",
                    overflow: "hidden", transition: "border-color 0.1s",
                  }}
                >
                  {/* Main row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px" }}>
                    <div style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 600, minWidth: 18 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-1)" }}>
                        {game.name}
                      </div>
                      {!isExpanded && (game.description || game.bggUrl) && (
                        <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2, minWidth: 0 }}>
                          {game.description && (
                            <div style={{ fontSize: 11, color: "var(--text-3)", lineHeight: 1.4, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>
                              {game.description}
                            </div>
                          )}
                          {game.bggUrl && (
                            <div style={{ fontSize: 10, color: "var(--cyan)", fontWeight: 600, flexShrink: 0 }}>
                              BGG ✓
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => isExpanded ? closeEditor() : openEditor(game)}
                      title={isExpanded ? "Cancel" : "Edit description & BGG link"}
                      style={{
                        width: 22, height: 22, borderRadius: 5,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isExpanded ? "var(--cyan-dim)" : "transparent",
                        border: "1px solid", borderColor: isExpanded ? "#48d9f344" : "var(--border)",
                        color: isExpanded ? "var(--cyan)" : "var(--text-3)",
                        fontSize: 12, flexShrink: 0, cursor: "pointer",
                      }}
                    >
                      ✎
                    </button>
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

                  {/* Editor panel */}
                  {isExpanded && (
                    <div style={{ padding: "0 10px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
                      <textarea
                        autoFocus
                        value={draftDesc}
                        onChange={(e) => setDraftDesc(e.target.value)}
                        placeholder="Description for players…"
                        rows={3}
                        style={{
                          width: "100%", padding: "7px 10px", borderRadius: 6,
                          fontSize: 12, lineHeight: 1.5,
                          background: "var(--card)", border: "1px solid var(--border)",
                          color: "var(--text-1)", outline: "none", resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, flexShrink: 0 }}>
                          BGG URL
                        </div>
                        <input
                          value={draftBggUrl}
                          onChange={(e) => setDraftBggUrl(e.target.value)}
                          placeholder="https://boardgamegeek.com/boardgame/…"
                          style={{
                            flex: 1, padding: "6px 10px", borderRadius: 6,
                            fontSize: 12, background: "var(--card)",
                            border: "1px solid var(--border)", color: "var(--text-1)", outline: "none",
                          }}
                        />
                        {draftBggUrl.trim() && (
                          <a
                            href={draftBggUrl.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Test link"
                            style={{ fontSize: 11, color: "var(--cyan)", textDecoration: "none", flexShrink: 0 }}
                          >
                            Test ↗
                          </a>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button
                          onClick={closeEditor}
                          style={{
                            padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                            background: "transparent", color: "var(--text-3)",
                            border: "1px solid var(--border)", cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEditor(cat.id, game.id)}
                          style={{
                            padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                            background: "var(--cyan-dim)", color: "var(--cyan)",
                            border: "1px solid #48d9f344", cursor: "pointer",
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
