import { useState, useCallback, useEffect } from "react";
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

export default function App() {
  const [platforms, setPlatforms] = useState<Record<string, Platform>>({});
  const [tagTypes, setTagTypes] = useState<Record<string, TagType>>({});
  const [tags, setTags] = useState<Record<string, Tag>>({});
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [allGames, setAllGames] = useState<GameDefinition[]>([]);

  const [activePlatformSlug, setActivePlatformSlug] = useState("");
  const [activeTagPerType, setActiveTagPerType] = useState<Record<string, string>>({});
  const [activePlayerSlug, setActivePlayerSlug] = useState("");
  const [gamerFilter, setGamerFilter] = useState("All");

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

    const rawGames: Record<string, Omit<GameDefinition, "key">> =
      gameSnap.val() ?? {};
    const loadedGames: GameDefinition[] = Object.entries(rawGames).map(
      ([key, g]) => ({ ...g, key })
    );
    setAllGames(loadedGames);

    const firstPlatformSlug = Object.keys(loadedPlatforms)[0] ?? "";
    setActivePlatformSlug(firstPlatformSlug);
  }, []);

  useEffect(() => {
    fetchGamesHandler();
  }, [fetchGamesHandler]);

  function GetGameContent(): GameDefinition[] {
    let result = allGames.filter((g) => g.platformKey === activePlatformSlug);

    for (const [, tagSlug] of Object.entries(activeTagPerType)) {
      if (tagSlug !== "") {
        result = result.filter((g) => g.tags?.[tagSlug] === true);
      }
    }

    if (gamerFilter === "Previous") {
      if (activePlayerSlug !== "") {
        result = result.filter((g) => g.players?.[activePlayerSlug] === true);
      } else {
        result = result.filter(
          (g) => g.players && Object.keys(g.players).length > 0
        );
      }
    } else if (gamerFilter === "Unplayed") {
      if (activePlayerSlug !== "") {
        result = result.filter((g) => !g.players?.[activePlayerSlug]);
      } else {
        result = result.filter(
          (g) => !g.players || Object.keys(g.players).length === 0
        );
      }
    }

    return result.sort(
      (a, b) =>
        b.priority - a.priority || (a.name > b.name ? 1 : -1)
    );
  }

  function handlePlatformChange(slug: string) {
    setActivePlatformSlug(slug);
    setActiveTagPerType({});
  }

  function handleTagToggle(typeSlug: string, tagSlug: string) {
    setActiveTagPerType((prev) => ({ ...prev, [typeSlug]: tagSlug }));
  }

  return (
    <div className="App">
      <div id="tagTypeFilters">
        {Object.entries(tagTypes).map(([typeSlug, tt]) => (
          <div key={typeSlug} id="timeFilters">
            <menu>
              <button
                className={!activeTagPerType[typeSlug] ? "active" : ""}
                onClick={() => handleTagToggle(typeSlug, "")}
              >
                All {tt.name}
              </button>
              {Object.entries(tags)
                .filter(([, t]) => t.tagTypeKey === typeSlug)
                .map(([tagSlug, tag]) => (
                  <button
                    key={tagSlug}
                    className={
                      activeTagPerType[typeSlug] === tagSlug ? "active" : ""
                    }
                    onClick={() => handleTagToggle(typeSlug, tagSlug)}
                  >
                    {tag.name}
                  </button>
                ))}
            </menu>
          </div>
        ))}
      </div>
      <div id="gamerFilters">
        <menu>
          <button
            className={gamerFilter === "All" ? "active" : ""}
            onClick={() => setGamerFilter("All")}
          >
            All Games
          </button>
          <button
            className={gamerFilter === "Previous" ? "active" : ""}
            onClick={() => setGamerFilter("Previous")}
          >
            Previously Played
          </button>
          <button
            className={gamerFilter === "Unplayed" ? "active" : ""}
            onClick={() => setGamerFilter("Unplayed")}
          >
            Unplayed
          </button>
        </menu>
        <div className="select">
          <select
            onChange={(e) => setActivePlayerSlug(e.target.value)}
            value={activePlayerSlug}
          >
            <option value=""> -- Filter by player -- </option>
            {Object.entries(players).map(([slug, p]) => (
              <option value={slug} key={slug}>
                {p.username}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div id="tabs">
        <menu>
          {Object.entries(platforms).map(([slug, p]) => (
            <button
              key={slug}
              className={activePlatformSlug === slug ? "active" : ""}
              onClick={() => handlePlatformChange(slug)}
            >
              {p.name}
            </button>
          ))}
        </menu>
        <GameList games={GetGameContent()} />
      </div>
    </div>
  );
}
