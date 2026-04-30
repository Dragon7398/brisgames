// ─── CampaignSelect — AdminDashboard ─────────────────────────────────────────
import { useState, useEffect } from "react";
import { Logo } from "./Shared";
import { AdminResults } from "./AdminResults";
import { AdminManageGames } from "./AdminManageGames";
import { loadCategories, saveCategories } from "../storage";
import type { Category } from "../types";

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [adminTab,   setAdminTab]   = useState<"results" | "manage">("results");
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    loadCategories().then((cats) => {
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  async function handleCategoriesChange(updated: Category[]) {
    setCategories(updated);
    await saveCategories(updated);
  }

  return (
    <div style={{ maxWidth: 940, margin: "0 auto", padding: "28px 24px 80px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
        <Logo />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            Admin
          </h1>
          <p style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 3 }}>
            Results &amp; game management
          </p>
        </div>
        <button
          onClick={onBack}
          style={{
            fontSize: 11, fontWeight: 600, color: "var(--text-2)",
            padding: "6px 13px", borderRadius: 7,
            background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </header>

      <div style={{
        display: "flex", gap: 4, marginBottom: 28,
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 10, padding: 4, width: "fit-content",
      }}>
        {(["results", "manage"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setAdminTab(t)}
            style={{
              padding: "7px 18px", borderRadius: 7, fontSize: 13, fontWeight: 600,
              background: adminTab === t ? "var(--card-hov)" : "transparent",
              color: adminTab === t ? "var(--text-1)" : "var(--text-3)",
              border: "1px solid", borderColor: adminTab === t ? "var(--border-hi)" : "transparent",
              transition: "all 0.13s", cursor: "pointer",
            }}
          >
            {t === "results" ? "Results" : "Manage Games"}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: "var(--text-3)", padding: "40px 0", textAlign: "center" }}>
          Loading…
        </div>
      ) : adminTab === "results" ? (
        <AdminResults categories={categories} />
      ) : (
        <AdminManageGames categories={categories} onCategoriesChange={handleCategoriesChange} />
      )}
    </div>
  );
}
