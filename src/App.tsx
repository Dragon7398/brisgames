import { useState } from "react";
import { GameDefinition, GameList } from "./GameList";
import "./styles.css";

// gamePriority:  0 means 'not currently focused', 1 means 'current focus', 0.5 is typically for evergreens.
// -1 means 'not yet purchased', for games that are being floated as trial balloons.

const PCGameContent: GameDefinition[] = [
  {
    gameName: "20XX / 30XX",
    gameDescription: "Mega Man Roguelite",
    gameTags: ["Platformer", "Roguelike", "Fast-paced"],
    gamePriority: 0.2,
  },
  {
    gameName: "Across the Obelisk",
    gameDescription: "Deck-builder Roguelite",
    gameTags: ["Deck-builder", "Roguelike", "Slow-paced"],
    gamePriority: 0.6,
  },
  {
    gameName: "Borderlands 3",
    gameDescription: "First Person Shooter Campaign",
    gameTags: ["FPS", "Campaign", "Fast-paced"],
    gamePriority: 0,
  },
  {
    gameName: "Civilization [series]",
    gameDescription:
      "4X game series.  Primarily playing Civ 6 and Beyond Earth right now, but Civ 5 is also viable.",
    gameTags: ["4X", "Multi-session", "Slow-paced"],
    gamePriority: 0.5,
  },
  {
    gameName: "Deep Rock Galactic",
    gameDescription: "Dwarven FPS",
    gameTags: ["FPS", "Campaign", "Fast-paced", "Unplayed"],
    gamePriority: 0,
  },
  {
    gameName: "Diablo 4",
    gameDescription: "Diablo-like. :D",
    gameTags: ["Action-RPG", "Campaign", "Fast-paced", "Unplayed"],
    gamePriority: 0,
  },
  {
    gameName: "Divinity Original Sin [series]",
    gameDescription: "RPG Campaign.  Includes either 1 or 2.",
    gameTags: ["RPG", "Campaign", "Slow-paced"],
    gamePriority: 0.2,
  },
  {
    gameName: "Drake Hollow",
    gameDescription: "Survival Sandbox",
    gameTags: ["Survival", "Action-RPG", "Fast-paced", "Unplayed"],
	gamePriority: 0
  },
  {
    gameName: "Ember Knights",
    gameDescription: "Action Adventure Roguelite",
    gameTags: ["Action-RPG", "Roguelike", "Fast-paced"],
	gamePriority: 0.4
  },
];

const FullPCGameTags: string[] = PCGameContent.map((game) => game.gameTags)
  .flat()
  .filter(function (item: string) {
    return (
      item !== "Fast-paced" && item !== "Mid-paced" && item !== "Slow-paced"
    );
  })
  .sort();

const PCGameTags: string[] = [...new Set(FullPCGameTags)];

const SwitchGameContent: GameDefinition[] = [
  {
    gameName: "Final Fantasy Crystal Chronicles",
    gameDescription: "Action RPG",
    gameTags: ["Action-RPG", "Campaign", "Fast-paced"],
    gamePriority: -1,
  },
  {
    gameName: "Kirby Super Star",
    gameDescription: "SNES Platformer",
    gameTags: ["Platformer", "Campaign", "Switch-Subscription", "Fast-paced"],
    gamePriority: 0.2,
  },
  {
    gameName: "Mario Party Superstars",
    gameDescription: "Minigame Board Game",
    gameTags: ["Nintendo", "Board Game", "Minigames", "Mid-paced"],
    gamePriority: 0.5,
  },
  {
    gameName: "Marvel Ultimate Alliance 3",
    gameDescription: "Action RPG",
    gameTags: ["Action-RPG", "Campaign", "Fast-paced"],
    gamePriority: 0,
  },
  {
    gameName: "Pokémon Scarlet / Violet",
    gameDescription: "Cute and fuzzy cockfighting",
    gameTags: ["RPG", "Campaign", "Slow-paced"],
    gamePriority: 0.2,
  },
  {
    gameName: "Risk of Rain Returns",
    gameDescription: "Action Platforming Roguelite",
    gameTags: ["Platformer", "Roguelike", "Slow-paced"],
    gamePriority: 0,
  },
  {
    gameName: "Super Mario Bros Wonder",
    gameDescription: "Mario",
    gameTags: ["Nintendo", "Platformer", "Fast-paced"],
    gamePriority: 1,
  },
  {
    gameName: "Super Mario Party",
    gameDescription: "Minigame Board Game",
    gameTags: ["Nintendo", "Board Game", "Minigames", "Mid-paced"],
    gamePriority: 0.5,
  },
  {
    gameName: "Samurai Warriors 5",
    gameDescription: "Action RPG, Samurai Murder Simulator",
    gameTags: ["Action-RPG", "Campaign", "Fast-paced"],
    gamePriority: -1,
  },
];

const FullSwitchGameTags: string[] = SwitchGameContent.map(
  (game) => game.gameTags
)
  .flat()
  .filter(function (item: string) {
    return (
      item !== "Fast-paced" && item !== "Mid-paced" && item !== "Slow-paced"
    );
  })
  .sort();

/*
arr = arr.filter(function(item) {
    return item !== value
})
*/

const SwitchGameTags: string[] = [...new Set(FullSwitchGameTags)];

export default function App() {
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [includeSlowPaced, setSlowPaced] = useState(true);
  const [includeMidPaced, setMidPaced] = useState(true);
  const [includeFastPaced, setFastPaced] = useState(true);
  const [tagList, setTagList] = useState<string[]>(PCGameTags);
  const [activeTag, setActiveTag] = useState("");

  function GetGameContent() {
    let returnList: GameDefinition[];

    if (activeContentIndex === 0) {
      returnList = PCGameContent;
    } else if (activeContentIndex === 1) {
      returnList = SwitchGameContent;
    } else {
      // Default case, should not happen.
      returnList = PCGameContent;
    }

    if (!includeSlowPaced) {
      returnList = returnList.filter(
        (game) => !game.gameTags.includes("Slow-paced")
      );
    }

    if (!includeMidPaced) {
      returnList = returnList.filter(
        (game) => !game.gameTags.includes("Mid-paced")
      );
    }

    if (!includeFastPaced) {
      returnList = returnList.filter(
        (game) => !game.gameTags.includes("Fast-paced")
      );
    }

    if (activeTag !== "") {
      returnList = returnList.filter((game) =>
        game.gameTags.includes(activeTag)
      );
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
      <div className="select">
        <select onChange={handleFilterChange} value={activeTag}>
          <option value=""> -- Filter by tag -- </option>
          {/* Mapping through each fruit object in our fruits array
              and returning an option element with the appropriate attributes / values.
            */}
          {tagList.map((tag) => (
            <option value={tag} key={tag}>{tag}</option>
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
