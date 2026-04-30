// ─── CampaignSelect — AdminResults ────────────────────────────────────────────
import { useState, useEffect } from "react";
import { Tabs, SegBtn, PlayerChip } from "./Shared";
import { PLAYERS, GROUPS } from "../data";
import { subscribeAllVotes } from "../storage";
import type { Category, AllVotes } from "../types";

interface AdminResultsProps {
  categories: Category[];
}

export function AdminResults({ categories }: AdminResultsProps) {
  const [activeTab, setActiveTab] = useState("major");
  const [group,     setGroup]     = useState("all");
  const [allVotes,  setAllVotes]  = useState<AllVotes>({});
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const unsub = subscribeAllVotes((votes) => {
      setAllVotes(votes);
      setLoading(false);
    });
    return unsub;
  }, []);

  function computeResults(catId: string) {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return [];
    const n = cat.games.length;
    const activePlayers = GROUPS[group].players;

    return cat.games
      .map((game) => {
        let score = 0, hearts = 0, vetoes = 0;
        const playerDetails: Record<string, { rank: number; isHeart: boolean; isVeto: boolean }> = {};

        for (const pid of activePlayers) {
          const cv = allVotes[pid]?.[catId];
          if (!cv) continue;
          const rank = (cv.order ?? []).indexOf(game.id);
          const r = rank === -1 ? n - 1 : rank;
          const isHeart = !!((cv.hearts ?? {})[game.id]);
          const isVeto  = !!((cv.vetoes ?? {})[game.id]);
          score += (n - r) + (isHeart ? 4 : 0) - (isVeto ? 4 : 0);
          if (isHeart) hearts++;
          if (isVeto)  vetoes++;
          playerDetails[pid] = { rank: r + 1, isHeart, isVeto };
        }
        return { game, score, hearts, vetoes, playerDetails };
      })
      .sort((a, b) => b.score - a.score);
  }

  const results       = computeResults(activeTab);
  const maxScore      = results[0]?.score || 1;
  const activePlayers = GROUPS[group].players;

  function rankStyle(i: number) {
    if (i === 0) return { bg: "var(--cyan-dim)",   color: "var(--cyan)",   border: "#48d9f333" };
    if (i === 1) return { bg: "var(--purple-dim)", color: "var(--purple)", border: "#6660f533" };
    if (i === 2) return { bg: "var(--amber-dim)",  color: "var(--amber)",  border: "#f5a62333" };
    return { bg: "transparent", color: "var(--text-3)", border: "var(--border)" };
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {activePlayers
            .filter((pid) => PLAYERS[pid])
            .map((pid) => (
              <PlayerChip key={pid} name={PLAYERS[pid].name} color={PLAYERS[pid].color} />
            ))}
        </div>
        <SegBtn
          options={[{ id: "all", label: "All" }, { id: "saturday", label: "Saturday" }, { id: "sunday", label: "Sunday" }]}
          value={group}
          onChange={setGroup}
        />
      </div>

      <Tabs
        tabs={categories.map((c) => ({ id: c.id, label: c.shortLabel }))}
        active={activeTab}
        onSelect={setActiveTab}
      />

      {loading && (
        <div style={{ fontSize: 13, color: "var(--text-3)", padding: "40px 0", textAlign: "center" }}>
          Loading votes…
        </div>
      )}

      {!loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {results.map((r, i) => {
            const rs = rankStyle(i);
            const barW = Math.max(4, (r.score / maxScore) * 100);
            return (
              <div
                key={r.game.id}
                style={{
                  background: "var(--card)", border: "1px solid",
                  borderColor: i < 3 ? rs.border : "var(--border)",
                  borderRadius: 9, padding: "10px 14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: rs.bg, color: rs.color, border: "1px solid", borderColor: rs.border }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>
                    {r.game.name}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {r.hearts > 0 && <span style={{ fontSize: 11, color: "var(--red)", fontWeight: 700 }}>❤️ {r.hearts}</span>}
                    {r.vetoes > 0 && <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 700 }}>🚫 {r.vetoes}</span>}
                  </div>
                  <div style={{ width: 90, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ height: "100%", borderRadius: 2, width: `${barW}%`, background: i === 0 ? "linear-gradient(90deg,var(--cyan),var(--purple))" : rs.color, transition: "width 0.4s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 700, minWidth: 26, textAlign: "right" }}>
                    {r.score}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 5, paddingLeft: 34, flexWrap: "wrap" }}>
                  {activePlayers.filter((pid) => PLAYERS[pid] && r.playerDetails[pid]).map((pid) => {
                    const d = r.playerDetails[pid];
                    return (
                      <div key={pid} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 10 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: PLAYERS[pid].color }} />
                        <span style={{ color: "var(--text-3)", fontWeight: 600 }}>{PLAYERS[pid].name}</span>
                        <span style={{ color: "var(--text-2)", fontWeight: 700 }}>#{d.rank}</span>
                        {d.isHeart && <span>❤️</span>}
                        {d.isVeto  && <span>🚫</span>}
                      </div>
                    );
                  })}
                  {activePlayers.filter((pid) => PLAYERS[pid] && !r.playerDetails[pid]).map((pid) => (
                    <div key={pid} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 10, opacity: 0.4 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: PLAYERS[pid].color }} />
                      <span style={{ color: "var(--text-3)", fontWeight: 600 }}>{PLAYERS[pid].name}</span>
                      <span style={{ color: "var(--text-3)" }}>not voted</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
