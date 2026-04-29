// ─── CampaignSelect — shared UI components ────────────────────────────────────

// ── Logo ──────────────────────────────────────────────────────────────────────
export function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect width="34" height="34" rx="9" fill="url(#cs-logo-grad)" />
      <path
        d="M10 17h4M12 15v4M19 15h5M19 18h4M19 21h5"
        stroke="#0f1316"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="cs-logo-grad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#48d9f3" />
          <stop offset="1" stopColor="#6660f5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── DragHandle ─────────────────────────────────────────────────────────────────
export function DragHandle() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="var(--text-3)" style={{ flexShrink: 0, opacity: 0.3 }}>
      <circle cx="3" cy="2.5" r="1.3" /><circle cx="7" cy="2.5" r="1.3" />
      <circle cx="3" cy="7" r="1.3" /><circle cx="7" cy="7" r="1.3" />
      <circle cx="3" cy="11.5" r="1.3" /><circle cx="7" cy="11.5" r="1.3" />
    </svg>
  );
}

// ── NewBadge ───────────────────────────────────────────────────────────────────
export function NewBadge() {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, flexShrink: 0,
      background: "var(--amber-dim)", color: "var(--amber)",
      border: "1px solid rgba(245,166,35,0.3)", letterSpacing: "0.04em", textTransform: "uppercase",
    }}>
      New
    </span>
  );
}

// ── Tabs ───────────────────────────────────────────────────────────────────────
interface Tab { id: string; label: string; }

interface TabsProps {
  tabs: Tab[];
  active: string;
  onSelect: (id: string) => void;
  badge?: (id: string) => string | null;
}

export function Tabs({ tabs, active, onSelect, badge }: TabsProps) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
      {tabs.map((t) => {
        const isActive = active === t.id;
        const b = badge?.(t.id);
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              background: "none", border: "none", padding: "9px 20px",
              fontSize: 13, fontWeight: 600,
              color: isActive ? "var(--cyan)" : "var(--text-3)",
              borderBottom: "2px solid",
              borderBottomColor: isActive ? "var(--cyan)" : "transparent",
              marginBottom: -1, transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: 6, cursor: "pointer",
            }}
          >
            {t.label}
            {b && (
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                background: isActive ? "var(--cyan-dim)" : "var(--surface)",
                color: isActive ? "var(--cyan)" : "var(--text-3)",
                border: "1px solid", borderColor: isActive ? "#48d9f333" : "var(--border)",
              }}>
                {b}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── SegBtn (segmented control) ─────────────────────────────────────────────────
interface SegOption { id: string; label: string; }

interface SegBtnProps {
  options: SegOption[];
  value: string;
  onChange: (id: string) => void;
}

export function SegBtn({ options, value, onChange }: SegBtnProps) {
  return (
    <div style={{
      display: "inline-flex", borderRadius: 8,
      background: "var(--surface)", border: "1px solid var(--border)", padding: 3, gap: 2,
    }}>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
            background: value === o.id ? "var(--card-hov)" : "transparent",
            color: value === o.id ? "var(--text-1)" : "var(--text-3)",
            border: "1px solid", borderColor: value === o.id ? "var(--border-hi)" : "transparent",
            transition: "all 0.13s", cursor: "pointer",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── PlayerChip ─────────────────────────────────────────────────────────────────
interface PlayerChipProps { name: string; color: string; }

export function PlayerChip({ name, color }: PlayerChipProps) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 6,
      background: "var(--card)", border: "1px solid var(--border)",
      fontSize: 11, fontWeight: 600,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      <span style={{ color: "var(--text-2)" }}>{name}</span>
    </div>
  );
}

