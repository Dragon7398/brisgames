import { useState, useCallback, useEffect } from "react";
import { GameDefinition, GameList } from "./GameList";
import "./styles.css";

export default function App() {
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [includeSlowPaced, setSlowPaced] = useState(true);
  const [includeMidPaced, setMidPaced] = useState(true);
  const [includeFastPaced, setFastPaced] = useState(true);
  const [tagList, setTagList] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState("");
  const [activeGamer, setActiveGamer] = useState("");
  const [gamerFilter, setGamerFilter] = useState("All");
  const [PCGamesList, setPCGamesList] = useState<GameDefinition[]>([]);
  const [PCGameTags, setPCGameTags] = useState<string[]>([]);
  const [SwitchGamesList, setSwitchGamesList] = useState<GameDefinition[]>([]);
  const [SwitchGameTags, setSwitchGameTags] = useState<string[]>([]);
  const [FullGamersList, setFullGamersList] = useState<string[]>([]);

  const fetchGamesHandler = useCallback(async () => {
    const response = await fetch(
      "https://brisgames-3cc42-default-rtdb.firebaseio.com/PCGames.json",
    );
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const data = await response.json();

    const loadedGames: GameDefinition[] = [];

    for (const key in data) {
      loadedGames.push({
        gameName: data[key].gameName,
        gameDescription: data[key].gameDescription,
        gameTags: data[key].gameTags,
        gamePriority: data[key].gamePriority,
        playedWith: data[key].playedWith,
      });
    }

    setPCGamesList(loadedGames);

    const FullPCGameTags: string[] = loadedGames
      .map((game) => game.gameTags)
      .flat()
      .filter(function (item: string) {
        return (
          item !== "Fast-paced" && item !== "Mid-paced" && item !== "Slow-paced"
        );
      })
      .sort();

    setPCGameTags([...new Set(FullPCGameTags)]);

    const PCGamersList: string[] = loadedGames
      .map((game) => (game.playedWith ? game.playedWith : []))
      .flat()
      .sort();

    const response2 = await fetch(
      "https://brisgames-3cc42-default-rtdb.firebaseio.com/SwitchGames.json",
    );
    if (!response2.ok) {
      throw new Error("Something went wrong!");
    }

    const data2 = await response2.json();

    const loadedGames2: GameDefinition[] = [];

    for (const key in data2) {
      loadedGames2.push({
        gameName: data2[key].gameName,
        gameDescription: data2[key].gameDescription,
        gameTags: data2[key].gameTags,
        gamePriority: data2[key].gamePriority,
        playedWith: data2[key].playedWith,
      });
    }

    setSwitchGamesList(loadedGames2);

    const FullSwitchGameTags: string[] = loadedGames2
      .map((game) => game.gameTags)
      .flat()
      .filter(function (item: string) {
        return (
          item !== "Fast-paced" && item !== "Mid-paced" && item !== "Slow-paced"
        );
      })
      .sort();

    setSwitchGameTags([...new Set(FullSwitchGameTags)]);

    const SwitchGamersList: string[] = loadedGames2
      .map((game) => (game.playedWith ? game.playedWith : []))
      .flat()
      .sort();

    const OverFullGamersList: string[] = PCGamersList.concat(SwitchGamersList);

    setTagList([...new Set(FullPCGameTags)]);
    setFullGamersList([...new Set(OverFullGamersList)]);
  }, []);

  useEffect(() => {
    fetchGamesHandler();
  }, [fetchGamesHandler]);

  function GetGameContent() {
    let returnList: GameDefinition[];

    if (activeContentIndex === 0) {
      returnList = PCGamesList;
    } else if (activeContentIndex === 1) {
      returnList = SwitchGamesList;
    } else {
      // Default case, should not happen.
      returnList = PCGamesList;
    }

    if (!includeSlowPaced) {
      returnList = returnList.filter(
        (game) => !game.gameTags.includes("Slow-paced"),
      );
    }

    if (!includeMidPaced) {
      returnList = returnList.filter(
        (game) => !game.gameTags.includes("Mid-paced"),
      );
    }

    if (!includeFastPaced) {
      returnList = returnList.filter(
        (game) => !game.gameTags.includes("Fast-paced"),
      );
    }

    if (activeTag !== "") {
      returnList = returnList.filter((game) =>
        game.gameTags.includes(activeTag),
      );
    }

    if (activeGamer !== "" && gamerFilter !== "") {
      if (gamerFilter == "Previous") {
        returnList = returnList.filter((game) =>
          game.playedWith?.includes(activeGamer),
        );
      } else if (gamerFilter == "Unplayed") {
        returnList = returnList.filter(
          (game) => !game.playedWith?.includes(activeGamer),
        );
      }
    } else if (activeGamer == "" && gamerFilter !== "") {
      if (gamerFilter == "Previous") {
        returnList = returnList.filter((game) => game.playedWith);
      } else if (gamerFilter == "Unplayed") {
        returnList = returnList.filter((game) => !game.playedWith);
      }
    }

    return returnList.sort((a, b) => b.gamePriority - a.gamePriority);
  }

  function ChangeGameList(gameType: number) {
    setActiveContentIndex(gameType);

    if (gameType === 0) {
      setTagList(PCGameTags);
    } else if (gameType === 1) {
      setTagList(SwitchGameTags);
    } else {
      // Default case, should not happen.
      setTagList(PCGameTags);
    }

    setActiveTag("");
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setActiveTag(e.target.value);
  }

  function handleGamerFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setActiveGamer(e.target.value);
  }

  return (
    <div className="App">
      <div id="timeFilters">
        <menu>
          <button
            className={includeSlowPaced ? "active" : ""}
            onClick={() =>
              setSlowPaced((prevState) => {
                return !prevState;
              })
            }
          >
            Slow-paced
          </button>
          <button
            className={includeMidPaced ? "active" : ""}
            onClick={() =>
              setMidPaced((prevState) => {
                return !prevState;
              })
            }
          >
            Mid-paced
          </button>
          <button
            className={includeFastPaced ? "active" : ""}
            onClick={() =>
              setFastPaced((prevState) => {
                return !prevState;
              })
            }
          >
            Fast-paced
          </button>
        </menu>
      </div>
      <div id="gamerFilters">
        <menu>
          <button
            className={gamerFilter == "All" ? "active" : ""}
            onClick={() => setGamerFilter("All")}
          >
            All Games
          </button>
          <button
            className={gamerFilter == "Previous" ? "active" : ""}
            onClick={() => setGamerFilter("Previous")}
          >
            Previously Played
          </button>
          <button
            className={gamerFilter == "Unplayed" ? "active" : ""}
            onClick={() => setGamerFilter("Unplayed")}
          >
            Unplayed
          </button>
        </menu>
        <div className="select">
          <select onChange={handleGamerFilterChange} value={activeGamer}>
            <option value=""> -- Filter by gamer -- </option>
            {FullGamersList.map((gamer) => (
              <option value={gamer} key={gamer}>
                {gamer}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="select">
        <select onChange={handleFilterChange} value={activeTag}>
          <option value=""> -- Filter by tag -- </option>
          {tagList.map((tag) => (
            <option value={tag} key={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <div id="tabs">
        <menu>
          <button
            className={activeContentIndex === 0 ? "active" : ""}
            onClick={() => ChangeGameList(0)}
          >
            PC Games
          </button>
          <button
            className={activeContentIndex === 1 ? "active" : ""}
            onClick={() => ChangeGameList(1)}
          >
            Online Switch Games
          </button>
        </menu>
        <GameList games={GetGameContent()} />
      </div>
    </div>
  );
}
