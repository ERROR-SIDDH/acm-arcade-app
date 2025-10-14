export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Player {
  id: string;
  name: string;
  scores: number[];
  avatar: string;
}
export type GameStatus = 'lobby' | 'playing' | 'finished';
export interface Game {
  id: string;
  status: GameStatus;
  players: Player[];
  puzzleKeys: string[];
  shufflePuzzles: boolean;
  interPuzzleDelay: number; // in seconds
}