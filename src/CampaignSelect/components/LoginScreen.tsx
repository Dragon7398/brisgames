// ─── CampaignSelect — LoginScreen / UnauthorisedScreen ────────────────────────
import { Logo } from "./Shared";

export function LoginScreen() {
  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: "0 28px", textAlign: "center" }}>
      <Logo />
      <div style={{ marginTop: 24, fontSize: 16, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
        Brisgames — Campaign Select
      </div>
      <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-3)", lineHeight: 1.7 }}>
        Access this page using the personal voting link sent to you by the group organiser.
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
