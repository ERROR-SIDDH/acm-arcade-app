import { create } from 'zustand';
import type { Game, Player } from '@shared/types';
export type GameState = {
  game: Game | null;
  player: Player | null;
  setGame: (game: Game) => void;
  setPlayer: (player: Player) => void;
  clearState: () => void;
};
export const useGameStore = create<GameState>((set) => ({
  game: null,
  player: null,
  setGame: (game) => set({ game }),
  setPlayer: (player) => set({ player }),
  clearState: () => set({ game: null, player: null }),
}));