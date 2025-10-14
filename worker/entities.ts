import { IndexedEntity } from "./core-utils";
import type { Game } from "@shared/types";
export class GameEntity extends IndexedEntity<Game> {
  static readonly entityName = "game";
  static readonly indexName = "games";
  static readonly initialState: Game = {
    id: "",
    status: 'lobby',
    players: [],
    puzzleKeys: [],
    shufflePuzzles: true,
    interPuzzleDelay: 1,
  };
}