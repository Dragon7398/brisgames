import { Fragment } from "react";

export interface GameDefinition {
  key: string;
  name: string;
  description: string;
  priority: number;
  platformKey: string;
  tags: Record<string, boolean>;
  players: Record<string, boolean>;
}

export interface Platform { name: string; }
export interface TagType { name: string; }
export interface Tag { name: string; tagTypeKey: string; }
export interface Player { username: string; }

interface ComponentProps {
  games?: GameDefinition[];
}

export const GameList: React.FC<ComponentProps> = (props) => {
  return (
    <Fragment>
      <div id="tab-content">
        <ul>
          {props.games?.map((item) => (
            <li key={item.key}>
              {item.name} - {item.description}
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};
