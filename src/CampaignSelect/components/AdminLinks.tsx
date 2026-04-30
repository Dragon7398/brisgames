// ─── CampaignSelect — AdminLinks ──────────────────────────────────────────────
import { useState, useEffect } from "react";
import { PLAYERS, ADMIN_ID } from "../data";
import { buildPlayerLink } from "../auth";
import { loadPlayerTokens } from "../storage";

export function AdminLinks() {
  const [copied, setCopied] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPlayerTokens().then(setTokens);
  }, []);

  function copyLink(pid: string) {
    const token = tokens[pid] ?? "";
    navigator.clipboard.writeText(buildPlayerLink(pid, token)).then(() => {
      setCopied(pid);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function tokenLabel(pid: string) {
    const t = tokens[pid];
    return t ? `?player=${pid}&t=${t}` : "loading…";
  }

  const allEntries: [string, { name: string; color: string }][] = [
    ...Object.entries(PLAYERS),
    [ADMIN_ID, { name: "Brisbe (Admin)", color: "var(--purple)" }],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 560 }}>
      {allEntries.map(([pid, p]) => {
        const isAdmin = pid === ADMIN_ID;
        return (
          <div
            key={pid}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "var(--card)",
              border: `1px solid ${isAdmin ? "var(--border-hi)" : "var(--border)"}`,
              borderRadius: 10, padding: "11px 14px",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-1)", minWidth: 100 }}>{p.name}</div>
            <div style={{
              fontSize: 10, color: "var(--text-3)", fontFamily: "monospace",
              background: "var(--surface)", padding: "3px 8px", borderRadius: 5,
              flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              border: "1px solid var(--border)",
            }}>
              {tokenLabel(pid)}
            </div>
            <button
              onClick={() => copyLink(pid)}
              disabled={!tokens[pid]}
              style={{
                padding: "5px 11px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: copied === pid ? "var(--green-dim)" : "var(--surface)",
                color: copied === pid ? "var(--green)" : "var(--text-2)",
                border: "1px solid", borderColor: copied === pid ? "#48f3a044" : "var(--border-hi)",
                transition: "all 0.15s", flexShrink: 0, cursor: "pointer",
              }}
            >
              {copied === pid ? "✓ Copied" : "Copy"}
            </button>
            <a
              href={buildPlayerLink(pid, tokens[pid] ?? "")}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "5px 11px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: "var(--cyan-dim)", color: "var(--cyan)",
                border: "1px solid #48d9f344", flexShrink: 0, cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Open ↗
            </a>
          </div>
        );
      })}

      <div style={{
        marginTop: 6, padding: "10px 14px", borderRadius: 8,
        background: "var(--surface)", border: "1px solid var(--border)",
        fontSize: 11, color: "var(--text-3)", lineHeight: 1.65,
      }}>
        Each link contains a unique token. Rankings auto-save — players can return any time with the same URL.
      </div>
    </div>
  );
}
