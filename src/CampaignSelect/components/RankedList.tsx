// ─── CampaignSelect — RankedList ──────────────────────────────────────────────
import { useState } from "react";
import { DragHandle, NewBadge } from "./Shared";
import type { Game, CategoryVotes } from "../types";

interface RankedListProps {
  catId: string;
  games: Game[];
  voteData: CategoryVotes;
  newIds?: Set<string>;
  onChange: (catId: string, votes: CategoryVotes) => void;
  onClearNew: (catId: string) => void;
}

export function RankedList({ catId, games, voteData, newIds, onChange, onClearNew }: RankedListProps) {
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const { order, hearts, vetoes } = voteData;
  const orderedGames = order.map((id) => games.find((g) => g.id === id)).filter(Boolean) as Game[];

  function applyOrder(newOrder: string[]) {
    onChange(catId, { ...voteData, order: newOrder });
    onClearNew(catId);
  }

  function reorder(fromId: string | null, toId: string | null) {
    if (!fromId || !toId || fromId === toId) return;
    const next = [...order];
    const fi = next.indexOf(fromId);
    const ti = next.indexOf(toId);
    next.splice(fi, 1);
    next.splice(ti, 0, fromId);
    applyOrder(next);
  }

  function moveUp(id: string) {
    const idx = order.indexOf(id);
    if (idx <= 0) return;
    const next = [...order];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    applyOrder(next);
  }

  function moveDown(id: string) {
    const idx = order.indexOf(id);
    if (idx >= order.length - 1) return;
    const next = [...order];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    applyOrder(next);
  }

  function toggleHeart(id: string) {
    const h = { ...hearts }, v = { ...vetoes };
    if (h[id]) { delete h[id]; } else { h[id] = true; delete v[id]; }
    onChange(catId, { ...voteData, hearts: h, vetoes: v });
  }

  function toggleVeto(id: string) {
    const h = { ...hearts }, v = { ...vetoes };
    if (v[id]) { delete v[id]; } else { v[id] = true; delete h[id]; }
    onChange(catId, { ...voteData, hearts: h, vetoes: v });
  }

  function rankStyle(i: number) {
    if (i === 0) return { bg: "var(--cyan-dim)",   color: "var(--cyan)",   border: "#48d9f333" };
    if (i === 1) return { bg: "var(--purple-dim)", color: "var(--purple)", border: "#6660f533" };
    if (i === 2) return { bg: "var(--amber-dim)",  color: "var(--amber)",  border: "#f5a62333" };
    return { bg: "transparent", color: "var(--text-3)", border: "var(--border)" };
  }

  return (
    <div
      onDragEnd={() => { reorder(dragFrom, dragOver); setDragFrom(null); setDragOver(null); }}
      style={{ display: "flex", flexDirection: "column", gap: 4 }}
    >
      {orderedGames.map((game, i) => {
        const isHeart = !!hearts[game.id];
        const isVeto  = !!vetoes[game.id];
        const isNew   = newIds?.has(game.id) ?? false;
        const isDragTarget = dragOver === game.id && dragFrom !== game.id;
        const isFirst = i === 0;
        const isLast  = i === orderedGames.length - 1;
        const rs = rankStyle(i);

        return (
          <div
            key={game.id}
            draggable
            onDragStart={() => setDragFrom(game.id)}
            onDragOver={(e) => { e.preventDefault(); setDragOver(game.id); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 10px 9px 13px",
              background: isDragTarget ? "var(--card-hov)" : "var(--card)",
              border: "1px solid",
              borderColor: isDragTarget
                ? "var(--cyan)"
                : isNew    ? "rgba(245,166,35,0.3)"
                : isHeart  ? "#48d9f344"
                : isVeto   ? "#f3544833"
                : "var(--border)",
              borderRadius: 8, transition: "all 0.1s",
              cursor: "grab", userSelect: "none",
              opacity: isDragTarget ? 0.7 : 1,
            }}
          >
            {/* Rank */}
            <div style={{
              width: 22, height: 22, borderRadius: 5, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700,
              background: rs.bg, color: rs.color,
              border: "1px solid", borderColor: rs.border,
            }}>
              {i + 1}
            </div>

            <DragHandle />

            {/* Name */}
            <div style={{
              flex: 1, fontSize: 13, fontWeight: 500,
              letterSpacing: "-0.01em", lineHeight: 1.3,
              color: isVeto ? "var(--text-3)" : "var(--text-1)",
              textDecoration: isVeto ? "line-through" : "none",
            }}>
              {game.name}
            </div>

            {isNew && <NewBadge />}

            {/* Arrow buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 1, flexShrink: 0 }}>
              <button
                onClick={() => moveUp(game.id)}
                disabled={isFirst}
                title="Move up"
                style={{
                  width: 22, height: 18, borderRadius: 4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "1px solid",
                  borderColor: isFirst ? "transparent" : "var(--border)",
                  color: isFirst ? "transparent" : "var(--text-3)",
                  fontSize: 9, fontWeight: 700, lineHeight: 1, transition: "all 0.1s",
                  cursor: isFirst ? "default" : "pointer",
                }}
              >
                ▲
              </button>
              <button
                onClick={() => moveDown(game.id)}
                disabled={isLast}
                title="Move down"
                style={{
                  width: 22, height: 18, borderRadius: 4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "1px solid",
                  borderColor: isLast ? "transparent" : "var(--border)",
                  color: isLast ? "transparent" : "var(--text-3)",
                  fontSize: 9, fontWeight: 700, lineHeight: 1, transition: "all 0.1s",
                  cursor: isLast ? "default" : "pointer",
                }}
              >
                ▼
              </button>
            </div>

            {/* Heart / Veto */}
            <div style={{ display: "flex", gap: 3 }}>
              <button
                onClick={() => toggleHeart(game.id)}
                title="Heart — must-have"
                style={{
                  width: 30, height: 28, borderRadius: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isHeart ? "var(--red-dim)" : "transparent",
                  border: "1px solid", borderColor: isHeart ? "#f3544844" : "var(--border)",
                  fontSize: 14, transition: "all 0.12s", cursor: "pointer",
                }}
              >
                {isHeart ? "❤️" : <span style={{ fontSize: 12, color: "var(--text-3)" }}>♡</span>}
              </button>
              <button
                onClick={() => toggleVeto(game.id)}
                title="Veto — hard no"
                style={{
                  width: 30, height: 28, borderRadius: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isVeto ? "var(--red-dim)" : "transparent",
                  border: "1px solid", borderColor: isVeto ? "#f3544844" : "var(--border)",
                  fontSize: 14, transition: "all 0.12s", cursor: "pointer",
                }}
              >
                {isVeto ? "🚫" : <span style={{ fontSize: 12, color: "var(--text-3)" }}>⊘</span>}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
