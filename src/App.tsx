import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { ref, get } from "firebase/database";
import { db } from "./firebase";
import {
  GameDefinition,
  GameList,
  Platform,
  TagType,
  Tag,
  Player,
} from "./GameList";
import "./styles.css";

// ─── Config ───────────────────────────────────────────────────────────────────

/** Tag types with more tags than this threshold use a popover instead of pills. */
const POPOVER_THRESHOLD = 6;

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <rect width="34" height="34" rx="9" fill="url(#logo-gradient)" />
      <path
        d="M10 17h4M12 15v4M19 15h5M19 18h4M19 21h5"
        stroke="#0f1316"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="0"
          y1="0"
          x2="34"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#48d9f3" />
          <stop offset="1" stopColor="#6660f5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── ChevronDown ──────────────────────────────────────────────────────────────

function ChevronDown() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── PillBtn ──────────────────────────────────────────────────────────────────

interface PillBtnProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: "cyan" | "purple";
}

function PillBtn({ active, onClick, children, accent = "cyan" }: PillBtnProps) {
  const [hov, setHov] = useState(false);

  const bg = active
    ? accent === "cyan"
      ? "var(--cyan-dim)"
      : "var(--purple-dim)"
    : hov
    ? "#1a2830"
    : "transparent";

  const col = active
    ? accent === "cyan"
      ? "var(--cyan)"
      : "var(--purple)"
    : hov
    ? "var(--text-2)"
    : "var(--text-3)";

  const bor = active
    ? accent === "cyan"
      ? "#48d9f344"
      : "#6660f544"
    : "var(--border)";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "5px 13px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        border: "1px solid",
        borderColor: bor,
        background: bg,
        color: col,
        transition: "all 0.13s",
      }}
    >
      {children}
    </button>
  );
}

// ─── PopoverTagFilter ─────────────────────────────────────────────────────────

interface PopoverTagFilterProps {
  label: string;
  tags: [string, Tag][];
  activeSlug: string;
  onToggle: (slug: string) => void;
}

function PopoverTagFilter({
  label,
  tags,
  activeSlug,
  onToggle,
}: PopoverTagFilterProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const activeName = activeSlug
    ? tags.find(([s]) => s === activeSlug)?.[1]?.name
    : null;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "var(--text-3)",
          fontWeight: 500,
          minWidth: 56,
          letterSpacing: "0.02em",
          flexShrink: 0,
        }}
      >
        {label}
      </span>

      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "5px 13px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 500,
          border: "1px solid",
          borderColor: activeSlug
            ? "#48d9f344"
            : open
            ? "var(--border-hi)"
            : "var(--border)",
          background: activeSlug
            ? "var(--cyan-dim)"
            : open
            ? "#1a2830"
            : "transparent",
          color: activeSlug ? "var(--cyan)" : "var(--text-3)",
          transition: "all 0.13s",
        }}
      >
        {activeName ?? "All"}
        {activeSlug && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onToggle("");
            }}
            style={{ opacity: 0.7, lineHeight: 1, fontSize: 11 }}
          >
            ✕
          </span>
        )}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{ opacity: 0.5 }}
        >
          <path
            d={open ? "M2 6.5L5 3.5l3 3" : "M2 3.5L5 6.5l3-3"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 64,
            zIndex: 200,
            background: "#1a2830",
            border: "1px solid var(--border-hi)",
            borderRadius: 10,
            padding: "12px 14px",
            width: 320,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "var(--text-3)",
              fontWeight: 600,
              letterSpacing: "0.1em",
              marginBottom: 10,
            }}
          >
            SELECT {label.toUpperCase()}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <PillBtn
              active={!activeSlug}
              onClick={() => {
                onToggle("");
                setOpen(false);
              }}
            >
              All
            </PillBtn>
            {tags.map(([slug, tag]) => (
              <PillBtn
                key={slug}
                active={activeSlug === slug}
                onClick={() => {
                  onToggle(slug);
                  setOpen(false);
                }}
              >
                {tag.name}
              </PillBtn>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [platforms, setPlatforms] = useState<Record<string, Platform>>({});
  const [tagTypes, setTagTypes] = useState<Record<string, TagType>>({});
  const [tags, setTags] = useState<Record<string, Tag>>({});
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [allGames, setAllGames] = useState<GameDefinition[]>([]);

  const [activePlatformSlug, setActivePlatformSlug] = useState("");
  const [activeTagPerType, setActiveTagPerType] = useState<
    Record<string, string>
  >({});
  const [gamerFilter, setGamerFilter] = useState("All");
  const [activePlayerSlug, setActivePlayerSlug] = useState("");

  // ── Data fetch ──────────────────────────────────────────────────────────────

  const fetchGamesHandler = useCallback(async () => {
    const [platSnap, tagTypeSnap, tagSnap, playerSnap, gameSnap] =
      await Promise.all([
        get(ref(db, "platforms")),
        get(ref(db, "tagTypes")),
        get(ref(db, "tags")),
        get(ref(db, "players")),
        get(ref(db, "games")),
      ]);

    const loadedPlatforms: Record<string, Platform> = platSnap.val() ?? {};
    setPlatforms(loadedPlatforms);
    setTagTypes(tagTypeSnap.val() ?? {});
    setTags(tagSnap.val() ?? {});
    setPlayers(playerSnap.val() ?? {});

    const rawGames: Record<
      string,
      Omit<GameDefinition, "key">
    > = gameSnap.val() ?? {};
    const loadedGames: GameDefinition[] = Object.entries(rawGames).map(
      ([key, g]) => ({ ...g, key })
    );
    setAllGames(loadedGames);

    const firstPlatformSlug = Object.keys(loadedPlatforms)[1] ?? "";
    setActivePlatformSlug(firstPlatformSlug);
  }, []);

  useEffect(() => {
    fetchGamesHandler();
  }, [fetchGamesHandler]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handlePlatformChange(slug: string) {
    setActivePlatformSlug(slug);
    setActiveTagPerType({});
  }

  function handleTagToggle(typeSlug: string, tagSlug: string) {
    setActiveTagPerType((prev) => ({ ...prev, [typeSlug]: tagSlug }));
  }

  // ── Filtered games ──────────────────────────────────────────────────────────

  const filteredGames = useMemo(() => {
    let result = allGames.filter((g) => g.platformKey === activePlatformSlug);

    for (const [, tagSlug] of Object.entries(activeTagPerType)) {
      if (tagSlug) result = result.filter((g) => g.tags?.[tagSlug] === true);
    }

    if (gamerFilter === "Previous") {
      result = activePlayerSlug
        ? result.filter((g) => g.players?.[activePlayerSlug])
        : result.filter((g) => g.players && Object.keys(g.players).length > 0);
    } else if (gamerFilter === "Unplayed") {
      result = activePlayerSlug
        ? result.filter((g) => !g.players?.[activePlayerSlug])
        : result.filter(
            (g) => !g.players || Object.keys(g.players).length === 0
          );
    }

    return result.sort(
      (a, b) => b.priority - a.priority || (a.name > b.name ? 1 : -1)
    );
  }, [
    allGames,
    activePlatformSlug,
    activeTagPerType,
    gamerFilter,
    activePlayerSlug,
  ]);

  const gameCount = filteredGames.length;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 28px 60px" }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 36,
        }}
      >
        <Logo />
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--text-1)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Brisgames
          </h1>
          <p style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 3 }}>
            What are we playing tonight?
          </p>
        </div>
      </header>

      {/* Platform tabs */}
      <div
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid var(--border)",
          marginBottom: 20,
        }}
      >
        {Object.entries(platforms).map(([slug, p]) => {
          const active = activePlatformSlug === slug;
          return (
            <button
              key={slug}
              onClick={() => handlePlatformChange(slug)}
              style={{
                background: "none",
                border: "none",
                padding: "9px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: active ? "var(--cyan)" : "var(--text-3)",
                borderBottom: "2px solid",
                borderBottomColor: active ? "var(--cyan)" : "transparent",
                marginBottom: -1,
                transition: "all 0.15s",
                letterSpacing: "-0.01em",
              }}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Tag type filters */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {Object.entries(tagTypes).map(([typeSlug, tt]) => {
          const typeTags = Object.entries(tags).filter(
            ([, t]) => t.tagTypeKey === typeSlug
          );
          const usePopover = typeTags.length > POPOVER_THRESHOLD;

          if (usePopover) {
            return (
              <PopoverTagFilter
                key={typeSlug}
                label={tt.name}
                tags={typeTags}
                activeSlug={activeTagPerType[typeSlug] ?? ""}
                onToggle={(slug) => handleTagToggle(typeSlug, slug)}
              />
            );
          }

          return (
            <div
              key={typeSlug}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-3)",
                  fontWeight: 500,
                  minWidth: 56,
                  letterSpacing: "0.02em",
                }}
              >
                {tt.name}
              </span>
              <div style={{ display: "flex", gap: 5 }}>
                <PillBtn
                  active={!activeTagPerType[typeSlug]}
                  onClick={() => handleTagToggle(typeSlug, "")}
                >
                  All
                </PillBtn>
                {typeTags.map(([tagSlug, tag]) => (
                  <PillBtn
                    key={tagSlug}
                    active={activeTagPerType[typeSlug] === tagSlug}
                    onClick={() => handleTagToggle(typeSlug, tagSlug)}
                  >
                    {tag.name}
                  </PillBtn>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gamer filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 24,
          padding: "10px 14px",
          background: "var(--surface)",
          borderRadius: 8,
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", gap: 4 }}>
          {(["All", "Previous", "Unplayed"] as const).map((f) => {
            const labels = {
              All: "All Games",
              Previous: "Previously Played",
              Unplayed: "Unplayed",
            };
            return (
              <PillBtn
                key={f}
                active={gamerFilter === f}
                onClick={() => setGamerFilter(f)}
                accent="purple"
              >
                {labels[f]}
              </PillBtn>
            );
          })}
        </div>

        <div
          style={{
            width: 1,
            height: 18,
            background: "var(--border)",
            margin: "0 4px",
          }}
        />

        <div className="gamer-filter-right">
          {/* Player dropdown */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <select
              value={activePlayerSlug}
              onChange={(e) => setActivePlayerSlug(e.target.value)}
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                background: activePlayerSlug
                  ? "var(--purple-dim)"
                  : "transparent",
                border: "1px solid",
                borderColor: activePlayerSlug ? "#6660f544" : "var(--border)",
                borderRadius: 20,
                color: activePlayerSlug ? "var(--purple)" : "var(--text-3)",
                fontSize: 12,
                fontWeight: 500,
                padding: "5px 28px 5px 13px",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.13s",
                minWidth: 140,
              }}
            >
              <option value="">Filter by player</option>
              {Object.entries(players).map(([slug, p]) => (
                <option key={slug} value={slug}>
                  {p.username}
                </option>
              ))}
            </select>
            <div
              style={{
                position: "absolute",
                right: 10,
                pointerEvents: "none",
                color: activePlayerSlug ? "var(--purple)" : "var(--text-3)",
              }}
            >
              <ChevronDown />
            </div>
          </div>

          {/* Game count */}
          <div
            style={{
              fontSize: 11,
              color: "var(--text-3)",
              fontWeight: 500,
            }}
          >
            {gameCount} {gameCount === 1 ? "game" : "games"}
          </div>
        </div>
      </div>

      {/* Game grid */}
      <GameList games={filteredGames} allTags={tags} />
    </div>
  );
}
