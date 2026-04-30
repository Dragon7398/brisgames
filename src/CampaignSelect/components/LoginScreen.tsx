// ─── CampaignSelect — LoginScreen ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { Logo } from "./Shared";
import { PLAYERS, ADMIN_ID } from "../data";
import { buildPlayerLink } from "../auth";
import { loadPlayerTokens } from "../storage";

interface LoginScreenProps {
  onOpenPlayer: (playerId: string, token: string) => void;
}

export function LoginScreen({ onOpenPlayer }: LoginScreenProps) {
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

  const linkRowStyle = {
    display: "flex", alignItems: "center", gap: 12,
    background: "var(--card)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "11px 14px",
  } as const;

  const tokenDisplayStyle = {
    fontSize: 10, color: "var(--text-3)", fontFamily: "monospace",
    background: "var(--surface)", padding: "3px 8px", borderRadius: 5,
    flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    border: "1px solid var(--border)",
  } as const;

  function copyBtnStyle(pid: string) {
    return {
      padding: "5px 11px", borderRadius: 6, fontSize: 11, fontWeight: 600,
      background: copied === pid ? "var(--green-dim)" : "var(--surface)",
      color: copied === pid ? "var(--green)" : "var(--text-2)",
      border: "1px solid", borderColor: copied === pid ? "#48f3a044" : "var(--border-hi)",
      transition: "all 0.15s", flexShrink: 0, cursor: "pointer",
    } as const;
  }

  const openBtnStyle = {
    padding: "5px 11px", borderRadius: 6, fontSize: 11, fontWeight: 600,
    background: "var(--cyan-dim)", color: "var(--cyan)",
    border: "1px solid #48d9f344", flexShrink: 0, cursor: "pointer",
  } as const;

  const sectionLabelStyle = {
    fontSize: 11, fontWeight: 700, color: "var(--text-3)",
    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10,
  } as const;

  function tokenLabel(pid: string) {
    const t = tokens[pid];
    return t ? `?player=${pid}&t=${t}` : "loading…";
  }

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", padding: "60px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
        <Logo />
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)" }}>
            Brisgames
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 3 }}>Campaign Select</div>
        </div>
      </div>

      <div style={{ marginBottom: 36, paddingLeft: 48, fontSize: 12, color: "var(--text-3)", lineHeight: 1.6 }}>
        Rank your campaign picks. Each player gets their own unique link — no password needed.
      </div>

      {/* Player links */}
      <div style={sectionLabelStyle}>Player Links</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {Object.entries(PLAYERS).map(([pid, p]) => (
          <div key={pid} style={linkRowStyle}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-1)", minWidth: 86 }}>{p.name}</div>
            <div style={tokenDisplayStyle}>{tokenLabel(pid)}</div>
            <button onClick={() => copyLink(pid)} style={copyBtnStyle(pid)} disabled={!tokens[pid]}>
              {copied === pid ? "✓ Copied" : "Copy"}
            </button>
            <button onClick={() => onOpenPlayer(pid, tokens[pid] ?? "")} style={openBtnStyle}>
              Open →
            </button>
          </div>
        ))}
      </div>

      {/* Admin link */}
      <div style={sectionLabelStyle}>Admin Link</div>
      <div style={{ ...linkRowStyle, marginBottom: 24, border: "1px solid var(--border-hi)" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--purple)", flexShrink: 0 }} />
        <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-1)", minWidth: 86 }}>Brisbe</div>
        <div style={tokenDisplayStyle}>{tokenLabel(ADMIN_ID)}</div>
        <button onClick={() => copyLink(ADMIN_ID)} style={copyBtnStyle(ADMIN_ID)} disabled={!tokens[ADMIN_ID]}>
          {copied === ADMIN_ID ? "✓ Copied" : "Copy"}
        </button>
        <button onClick={() => onOpenPlayer(ADMIN_ID, tokens[ADMIN_ID] ?? "")} style={openBtnStyle}>
          Open →
        </button>
      </div>

      <div style={{
        padding: "11px 14px", borderRadius: 8, background: "var(--surface)",
        border: "1px solid var(--border)", fontSize: 11.5, color: "var(--text-3)",
        lineHeight: 1.65,
      }}>
        Each link contains a unique token. Rankings auto-save — players can return any time with the same URL.
      </div>
    </div>
  );
}

// ── UnauthorisedScreen ─────────────────────────────────────────────────────────
interface UnauthorisedScreenProps { onBack: () => void; }

export function UnauthorisedScreen({ onBack }: UnauthorisedScreenProps) {
  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: "0 28px", textAlign: "center" }}>
      <Logo />
      <div style={{ marginTop: 24, fontSize: 16, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
        Link not recognised
      </div>
      <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-3)", lineHeight: 1.6 }}>
        This link may be incomplete or incorrect. Ask the group organiser to resend your personal voting link.
      </div>
      <button
        onClick={onBack}
        style={{
          marginTop: 20, padding: "7px 16px", borderRadius: 7, fontSize: 12, fontWeight: 600,
          background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-2)",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
    </div>
  );
}
