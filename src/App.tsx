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
    playedWith: ["Bolt"],
  },
  {
    gameName: "Across the Obelisk",
    gameDescription: "Deck-builder Roguelite",
    gameTags: ["Deck-builder", "Roguelike", "Slow-paced"],
    gamePriority: 0.6,
    playedWith: ["Artdemissiv", "Bolt", "Panvitae"],
  },
  {
    gameName: "Borderlands 3",
    gameDescription: "First Person Shooter Campaign",
    gameTags: ["FPS", "Campaign", "Fast-paced"],
    gamePriority: 0,
    playedWith: ["Bolt"],
  },
  {
    gameName: "Civilization [series]",
    gameDescription:
      "4X game series.  Primarily playing Civ 6 and Beyond Earth right now, but Civ 5 is also viable.",
    gameTags: ["4X", "Multi-session", "Slow-paced"],
    gamePriority: 0.5,
    playedWith: ["Bolt"],
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
    gameTags: ["Action-RPG", "Campaign", "Fast-paced"],
    gamePriority: 0,
  },
  {
    gameName: "Divinity Original Sin [series]",
    gameDescription: "RPG Campaign.  Includes either 1 or 2.",
    gameTags: ["RPG", "Campaign", "Slow-paced"],
    gamePriority: 0.2,
    playedWith: ["Bolt"],
  },
  {
    gameName: "Drake Hollow",
    gameDescription: "Survival Sandbox",
    gameTags: ["Survival", "Sandbox", "Action-RPG", "Fast-paced", "Unplayed"],
    gamePriority: 0
  },
  {
    gameName: "Ember Knights",
    gameDescription: "Action Adventure Roguelite",
    gameTags: ["Action-RPG", "Roguelike", "Fast-paced"],
    gamePriority: 0.4,
    playedWith: ["Bolt"],
  },
  {
    gameName: "Escape Simulator",
    gameDescription: "Escape Rooms",
    gameTags: ["Escape Room", "Puzzle", "Mid-paced"],
    gamePriority: 0.1,
    playedWith: ["Bolt"],
  },
  {
    gameName: "For the King",
    gameDescription: "Strategy Roguelite",
    gameTags: ["Strategy", "Roguelike", "Slow-paced"],
    gamePriority: 0.2,
    playedWith: ["Bolt"],
  },
  {
    gameName: "Gloomhaven",
    gameDescription: "Strategy Roguelite",
    gameTags: ["Strategy", "Roguelike", "Slow-paced"],
    gamePriority: 0.2,
    playedWith: ["Bolt"],
  },
  {
    gameName: "Hellcard",
    gameDescription: "Deck builder Roguelite",
    gameTags: ["Deck-builder", "Roguelike", "Slow-paced"],
    gamePriority: 0.4,
    playedWith: ["Bolt"],
  },
  {
    gameName: "Heroes of Hammerwatch",
    gameDescription: "Action Adventure Roguelite",
    gameTags: ["Action-RPG", "Roguelike", "Fast-paced", "Unplayed"],
    gamePriority: 0,
  },
  {
    gameName: "Heroes of the Storm",
    gameDescription: "MOBA {or 'hero brawler' if you prefer}",
    gameTags: ["MOBA", "Fast-paced"],
    gamePriority: 0.1,
    playedWith: ["Bolt"],
  },
  {
    gameName: "Inkbound",
    gameDescription: "Roguelite Turn-based RPG",
    gameTags: ["Deck-builder", "Roguelike", "Slow-paced"],
    gamePriority: 0.4,
    playedWith: ["Bolt"],
  },
  {
    gameName: "Jackbox Party Pack [Collection]",
    gameDescription: "Collection of party games such as Blather Round, DodoReMi and more.",
    gameTags: ["Party", "Fast-paced"],
    gamePriority: 0.4,
    playedWith: ["Bolt", "KL", "Panvitae", "Precarious"],
  },
  {
    gameName: "KeyWe",
    gameDescription: "Birb Post Office Chaos",
    gameTags: ["Chaos", "Fast-paced"],
    gamePriority: 0.2,
    playedWith: ["Bolt"],
  },
  {
    gameName: "Killsquad",
    gameDescription: "Top Down Shooter",
    gameTags: ["Action-RPG", "Fast-paced", "Unplayed"],
    gamePriority: 0,
  },
  {
    gameName: "Never Split the Party",
    gameDescription: "Action Adventure Roguelite",
    gameTags: ["Action-RPG", "Roguelike", "Fast-paced", "Unplayed"],
    gamePriority: 0,
  },
  {
    gameName: "Operation Tango",
    gameDescription: "Asymmetric Puzzle / Escape Room",
    gameTags: ["Puzzle", "Escape Room", "Mid-paced"],
    gamePriority: 0.25,
    playedWith: ["Bolt", "Precarious"]
  },
  {
    gameName: "Out of Space",
    gameDescription: "Sci-fi Moving Chaos",
    gameTags: ["Chaos", "Fast-paced"],
    gamePriority: 0.2,
    playedWith: ["Bolt"]
  },
  {
    gameName: "PlateUp!",
    gameDescription: "Restaurant Chaos",
    gameTags: ["Chaos", "Fast-paced"],
    gamePriority: 0.25,
    playedWith: ["Artdemissiv", "Bolt", "Panvitae", "Precarious"]
  },
  {
    gameName: "Runescape",
    gameDescription: "Classic MMO",
    gameTags: ["MMO", "Sandbox", "Mid-paced"],
    gamePriority: 0.3,
	playedWith: ["Bolt"]
  },
  {
    gameName: "Stardew Valley",
    gameDescription: "Farming / Simulation",
    gameTags: ["Sandbox", "Action-RPG", "Mid-paced"],
    gamePriority: 0.9,
	playedWith: ["Bolt", "Precarious", "Score"]
  },
  {
    gameName: "Sun Haven",
    gameDescription: "Farming / Simulation, Stardew-like",
    gameTags: ["Sandbox", "Action-RPG", "Mid-paced"],
    gamePriority: 0
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
    playedWith: ["Bolt"],
  },
  {
    gameName: "Mario Party Superstars",
    gameDescription: "Minigame Board Game",
    gameTags: ["Nintendo", "Board Game", "Minigames", "Mid-paced"],
    gamePriority: 0.5,
    playedWith: ["Bolt"],
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
    playedWith: ["Bolt"],
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
    playedWith: ["Bolt"],
  },
  {
    gameName: "Super Mario Party",
    gameDescription: "Minigame Board Game",
    gameTags: ["Nintendo", "Board Game", "Minigames", "Mid-paced"],
    gamePriority: 0.5,
    playedWith: ["Bolt"],
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

const SwitchGameTags: string[] = [...new Set(FullSwitchGameTags)];

const PCGamersList: string[] = (PCGameContent.map(
  (game) => game.playedWith ? game.playedWith : []
)
.flat()
.sort())

const SwitchGamersList: string[] = (SwitchGameContent.map(
  (game) => game.playedWith ? game.playedWith : []
)
.flat()
.sort())

const OverFullGamersList: string[] = PCGamersList.concat(SwitchGamersList);

const FullGamersList: string[] = [...new Set(OverFullGamersList)];

export default function App() {
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [includeSlowPaced, setSlowPaced] = useState(true);
  const [includeMidPaced, setMidPaced] = useState(true);
  const [includeFastPaced, setFastPaced] = useState(true);
  const [tagList, setTagList] = useState<string[]>(PCGameTags);
  const [activeTag, setActiveTag] = useState("");
  const [activeGamer, setActiveGamer] = useState("");
  const [gamerFilter, setGamerFilter] = useState("All");

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

    if (activeGamer !== "" && gamerFilter !== "") {
      if (gamerFilter == "Previous") {
        returnList = returnList.filter((game) =>
          game.playedWith?.includes(activeGamer)
        );
      }
      else if (gamerFilter == "Unplayed") {
        returnList = returnList.filter((game) =>
          !game.playedWith?.includes(activeGamer)
        );
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
            onClick={() =>
              setGamerFilter("All")
            }
          >
            All Games
          </button>
          <button
            className={gamerFilter == "Previous" ? "active" : ""}
            onClick={() =>
              setGamerFilter("Previous")
            }
          >
            Previously Played
          </button>
          <button
            className={gamerFilter == "Unplayed" ? "active" : ""}
            onClick={() =>
              setGamerFilter("Unplayed")
            }
          >
            Unplayed
          </button>
        </menu>
        <div className="select">
          <select onChange={handleGamerFilterChange} value={activeGamer}>
            <option value=""> -- Filter by gamer -- </option>
            {FullGamersList.map((gamer) => (
              <option value={gamer} key={gamer}>{gamer}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="select">
        <select onChange={handleFilterChange} value={activeTag}>
          <option value=""> -- Filter by tag -- </option>
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
