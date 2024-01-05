import { Fragment } from "react";

export interface GameDefinition {
  gameName: string;
  gameDescription: string;
  gameTags: string[];
  gamePriority: number;
  playedWith?: string[]
}

interface ComponentProps {
  games?: GameDefinition[];
}

export const GameList: React.FC<ComponentProps> = (props) => {
  return (
    <Fragment>
      <div id="tab-content">
        <ul>
          {props.games?.map((item) => (
            <li key={item.gameName}>
              {item.gameName} - {item.gameDescription}
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};
