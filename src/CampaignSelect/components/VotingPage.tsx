// ─── CampaignSelect — VotingPage ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { Logo, Tabs, NewBadge } from "./Shared";
import { RankedList } from "./RankedList";
import { PLAYERS } from "../data";
import { loadCategories, loadVotes, saveVotes } from "../storage";
import type { Category, PlayerVotes, VoteStateResult } from "../types";

interface VotingPageProps {
  playerId: string;
  onBack: () => void;
}

export function VotingPage({ playerId, onBack }: VotingPageProps) {
  const player = PLAYERS[playerId];

  const [categories, setCategories] = useState<Category[]>([]);
  const [votes,      setVotes]      = useState<PlayerVotes>({});
  const [newGameIds, setNewGameIds]  = useState<Record<string, Set<string>>>({});
  const [activeTab,  setActiveTab]   = useState("major");
  const [saveFlash,  setSaveFlash]   = useState(false);
  const [loading,    setLoading]     = useState(true);

  useEffect(() => {
    async function init() {
      const cats = await loadCategories();
      const result: VoteStateResult = await loadVotes(playerId, cats);
      setCategories(cats);
      setVotes(result.votes);
      setNewGameIds(result.newGameIds);
      setLoading(false);
    }
    init();
  }, [playerId]);

  useEffect(() => {
    if (saveFlash) {
      const t = setTimeout(() => setSaveFlash(false), 1800);
      return () => clearTimeout(t);
    }
  }, [saveFlash]);

  function handleChange(catId: string, newCatVotes: PlayerVotes[string]) {
    const next = { ...votes, [catId]: newCatVotes };
    setVotes(next);
    saveVotes(playerId, next);
    setSaveFlash(true);
  }

  function handleClearNew(catId: string) {
    setNewGameIds((prev) => ({ ...prev, [catId]: new Set() }));
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <div style={{ fontSize: 13, color: "var(--text-3)" }}>Loading…</div>
      </div>
    );
  }

  const activeCat  = categories.find((c) => c.id === activeTab)!;
  const catVotes   = votes[activeTab] ?? { order: activeCat.games.map((g) => g.id), hearts: {}, vetoes: {} };
  const heartCount = Object.keys(catVotes.hearts).length;
  const vetoCount  = Object.keys(catVotes.vetoes).length;
  const totalNew   = Object.values(newGameIds).reduce((s, set) => s + set.size, 0);

  const tabBadge = (id: string): string | null => {
    const parts: string[] = [];
    const cv = votes[id];
    if (cv) {
      const h = Object.keys(cv.hearts).length, v = Object.keys(cv.vetoes).length;
      if (h > 0) parts.push(`❤️${h}`);
      if (v > 0) parts.push(`🚫${v}`);
    }
    const nn = newGameIds[id]?.size ?? 0;
    if (nn > 0) parts.push(`${nn} new`);
    return parts.length ? parts.join(" ") : null;
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 24px 80px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
        <Logo />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            Campaign Select
          </h1>
          <p style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 3 }}>
            Rank your picks — drag or ▲▼ to reorder, heart or veto to mark standouts
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 12px 6px 10px", borderRadius: 20,
          background: "var(--card)", border: "1px solid var(--border)",
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: player.color }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-1)" }}>{player.name}</span>
          <button
            onClick={onBack}
            style={{ fontSize: 11, color: "var(--text-3)", background: "none", border: "none", padding: "0 0 0 4px", lineHeight: 1, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      </header>

      {totalNew > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", marginBottom: 14,
          background: "var(--amber-dim)", border: "1px solid rgba(245,166,35,0.25)", borderRadius: 8,
        }}>
          <NewBadge />
          <div style={{ fontSize: 12, color: "var(--amber)", fontWeight: 500, flex: 1 }}>
            {totalNew} new game{totalNew > 1 ? "s have" : " has"} been added since you last visited — check the tabs below.
          </div>
        </div>
      )}

      <Tabs
        tabs={categories.map((c) => ({ id: c.id, label: c.shortLabel }))}
        active={activeTab}
        onSelect={setActiveTab}
        badge={tabBadge}
      />

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 14px", background: "var(--surface)",
        border: "1px solid var(--border)", borderRadius: 8, marginBottom: 14,
      }}>
        <div style={{ fontSize: 11.5, color: "var(--text-3)", flex: 1, lineHeight: 1.55 }}>
          <strong style={{ color: "var(--text-2)" }}>Drag</strong> or use{" "}
          <strong style={{ color: "var(--text-2)" }}>▲▼</strong> to set your preference order — #1 = most wanted.
          {" "}Mark ♡ for must-haves and ⊘ for hard passes.
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700,
          color: saveFlash ? "var(--green)" : "transparent",
          transition: "color 0.3s", flexShrink: 0,
        }}>
          ✓ Saved
        </div>
      </div>

      {(heartCount > 0 || vetoCount > 0) && (
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {heartCount > 0 && (
            <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "var(--red-dim)", border: "1px solid #f3544833", color: "var(--red)" }}>
              ❤️ {heartCount} must-have{heartCount > 1 ? "s" : ""}
            </div>
          )}
          {vetoCount > 0 && (
            <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-3)" }}>
              🚫 {vetoCount} veto{vetoCount > 1 ? "es" : ""}
            </div>
          )}
        </div>
      )}

      <RankedList
        catId={activeTab}
        games={activeCat.games}
        voteData={catVotes}
        newIds={newGameIds[activeTab]}
        onChange={handleChange}
        onClearNew={handleClearNew}
      />
    </div>
  );
}
