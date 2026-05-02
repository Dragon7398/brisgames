// ─── CampaignSelect — AdminSnapshots ──────────────────────────────────────────
import { useState, useEffect } from "react";
import { Tabs, SegBtn } from "./Shared";
import { GROUPS, CATEGORIES } from "../data";
import { subscribeAllVotes, saveSnapshot, subscribeSnapshots } from "../storage";
import type { Snapshot, AllVotes, Category } from "../types";

interface AdminSnapshotsProps {
  categories: Category[];
}

function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function computeResults(snapshot: Snapshot, catId: string) {
  const games = snapshot.games[catId] ?? [];
  const n = games.length;
  const activePlayers = GROUPS[snapshot.groupId]?.players ?? [];

  return games
    .map((game) => {
      let score = 0, hearts = 0, vetoes = 0;
      for (const pid of activePlayers) {
        const cv = snapshot.votes[pid]?.[catId];
        if (!cv) continue;
        const rank = (cv.order ?? []).indexOf(game.id);
        const r = rank === -1 ? n - 1 : rank;
        const isHeart = !!((cv.hearts ?? {})[game.id]);
        const isVeto  = !!((cv.vetoes ?? {})[game.id]);
        score += (n - r) + (isHeart ? n / 10 : 0) - (isVeto ? n / 2 : 0);
        if (isHeart) hearts++;
        if (isVeto)  vetoes++;
      }
      return { game, score, hearts, vetoes };
    })
    .sort((a, b) => b.score - a.score);
}

export function AdminSnapshots({ categories }: AdminSnapshotsProps) {
  const [snapshots,  setSnapshots]  = useState<Snapshot[]>([]);
  const [liveVotes,  setLiveVotes]  = useState<AllVotes>({});
  const [saveGroup,  setSaveGroup]  = useState<string>("saturday");
  const [saving,     setSaving]     = useState(false);
  const [selected,   setSelected]   = useState<Snapshot | null>(null);

  useEffect(() => {
    const unsubVotes = subscribeAllVotes(setLiveVotes);
    const unsubSnaps = subscribeSnapshots(setSnapshots);
    return () => { unsubVotes(); unsubSnaps(); };
  }, []);

  async function handleSave() {
    setSaving(true);
    const games: Record<string, typeof categories[0]["games"]> = {};
    categories.forEach((c) => { games[c.id] = c.games; });

    const groupPlayers = GROUPS[saveGroup]?.players ?? [];
    const filteredVotes: AllVotes = {};
    groupPlayers.forEach((pid) => {
      if (liveVotes[pid]) filteredVotes[pid] = liveVotes[pid];
    });

    await saveSnapshot(saveGroup, filteredVotes, games);
    setSaving(false);
  }

  if (selected) {
    return (
      <SnapshotView
        snapshot={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div>
      <div style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "18px 20px", marginBottom: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 12 }}>
          Save current votes as a snapshot
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <SegBtn
            options={[
              { id: "saturday",  label: "Saturday"    },
              { id: "sunday",    label: "Sunday"      },
              { id: "all",       label: "All Players" },
            ]}
            value={saveGroup}
            onChange={setSaveGroup}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "7px 18px", borderRadius: 7, fontSize: 13, fontWeight: 600,
              background: "linear-gradient(135deg,var(--cyan),var(--purple))",
              color: "#0f1316", border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1, transition: "opacity 0.15s",
            }}
          >
            {saving ? "Saving…" : "Save Snapshot"}
          </button>
        </div>
      </div>

      {snapshots.length === 0 ? (
        <div style={{ fontSize: 13, color: "var(--text-3)", padding: "40px 0", textAlign: "center" }}>
          No snapshots saved yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {snapshots.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              style={{
                display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left",
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 9,
                padding: "14px 18px", cursor: "pointer", transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hi)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 3 }}>
                  {formatDateTime(s.createdAt)}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600 }}>
                  {GROUPS[s.groupId]?.label ?? s.groupId}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>View →</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface SnapshotViewProps {
  snapshot: Snapshot;
  onBack: () => void;
}

function SnapshotView({ snapshot, onBack }: SnapshotViewProps) {
  const [activeTab, setActiveTab] = useState("major");

  const tabs = CATEGORIES
    .filter((cat) => (snapshot.games[cat.id] ?? []).length > 0)
    .map((cat) => ({ id: cat.id, label: cat.shortLabel }));

  const results  = computeResults(snapshot, activeTab);
  const maxScore = results[0]?.score || 1;

  function rankStyle(i: number) {
    if (i === 0) return { bg: "var(--cyan-dim)",   color: "var(--cyan)",   border: "#48d9f333" };
    if (i === 1) return { bg: "var(--purple-dim)", color: "var(--purple)", border: "#6660f533" };
    if (i === 2) return { bg: "var(--amber-dim)",  color: "var(--amber)",  border: "#f5a62333" };
    return { bg: "transparent", color: "var(--text-3)", border: "var(--border)" };
  }

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          fontSize: 12, fontWeight: 600, color: "var(--text-2)",
          padding: "6px 13px", borderRadius: 7, marginBottom: 20,
          background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer",
        }}
      >
        ← Snapshots
      </button>

      <div style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "18px 20px", marginBottom: 24,
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.03em", marginBottom: 6 }}>
          {formatDateTime(snapshot.createdAt)}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 600 }}>
          {GROUPS[snapshot.groupId]?.label ?? snapshot.groupId}
        </div>
      </div>

      <Tabs tabs={tabs} active={activeTab} onSelect={setActiveTab} />

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {results.map((r, i) => {
          const rs   = rankStyle(i);
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
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 5, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                  background: rs.bg, color: rs.color,
                  border: "1px solid", borderColor: rs.border,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em" }}>
                  {r.game.name}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {r.hearts > 0 && <span style={{ fontSize: 11, color: "var(--red)",    fontWeight: 700 }}>❤️ {r.hearts}</span>}
                  {r.vetoes > 0 && <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 700 }}>🚫 {r.vetoes}</span>}
                </div>
                <div style={{ width: 90, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden", flexShrink: 0 }}>
                  <div style={{
                    height: "100%", borderRadius: 2, width: `${barW}%`,
                    background: i === 0 ? "linear-gradient(90deg,var(--cyan),var(--purple))" : rs.color,
                    transition: "width 0.4s",
                  }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 700, minWidth: 26, textAlign: "right" }}>
                  {r.score}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
