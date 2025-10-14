import { Hono } from "hono";
import type { Env } from './core-utils';
import { GameEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Player, Game } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // POST /api/games - Create a new game session
  app.post('/api/games', async (c) => {
    let body: {
      puzzleKeys?: string[];
      shufflePuzzles?: boolean;
      interPuzzleDelay?: number;
    } = {};
    try {
      body = await c.req.json();
    } catch (e) {
      return bad(c, 'Invalid request body');
    }
    const { puzzleKeys, shufflePuzzles, interPuzzleDelay } = body;
    if (!Array.isArray(puzzleKeys) || puzzleKeys.length === 0) {
      return bad(c, 'At least one puzzle must be selected.');
    }
    const validatedShuffle = typeof shufflePuzzles === 'boolean' ? shufflePuzzles : true;
    const validatedDelay = typeof interPuzzleDelay === 'number' && interPuzzleDelay >= 0 && interPuzzleDelay <= 5
      ? interPuzzleDelay
      : 1;
    const newGame: Game = {
      id: crypto.randomUUID(),
      status: 'lobby' as const,
      players: [],
      puzzleKeys: puzzleKeys,
      shufflePuzzles: validatedShuffle,
      interPuzzleDelay: validatedDelay,
    };
    const game = await GameEntity.create(c.env, newGame);
    return ok(c, game);
  });
  // GET /api/games/:id - Fetch the current state of a game
  app.get('/api/games/:id', async (c) => {
    const { id } = c.req.param();
    const gameEntity = new GameEntity(c.env, id);
    if (!(await gameEntity.exists())) {
      return notFound(c, 'Game not found');
    }
    const game = await gameEntity.getState();
    return ok(c, game);
  });
  // POST /api/games/:id/players - A new player joins the game
  app.post('/api/games/:id/players', async (c) => {
    const { id: gameId } = c.req.param();
    const { name, avatar } = (await c.req.json()) as { name?: string, avatar?: string };
    if (!isStr(name)) {
      return bad(c, 'Player name is required');
    }
    const gameEntity = new GameEntity(c.env, gameId);
    if (!(await gameEntity.exists())) {
      return notFound(c, 'Game not found');
    }
    let newPlayer: Player | null = null;
    const updatedGame = await gameEntity.mutate(game => {
      if (game.status !== 'lobby') {
        throw new Error('Game has already started');
      }
      if (game.players.some(p => p.name.toLowerCase() === name.trim().toLowerCase())) {
        throw new Error('Player name already taken');
      }
      newPlayer = {
        id: crypto.randomUUID(),
        name: name.trim(),
        scores: [],
        avatar: avatar || '🚀', // Default avatar
      };
      return {
        ...game,
        players: [...game.players, newPlayer],
      };
    });
    return ok(c, { game: updatedGame, player: newPlayer });
  });
  // POST /api/games/:id/start - Admin starts the game
  app.post('/api/games/:id/start', async (c) => {
    const { id: gameId } = c.req.param();
    const gameEntity = new GameEntity(c.env, gameId);
    if (!(await gameEntity.exists())) {
      return notFound(c, 'Game not found');
    }
    const updatedGame = await gameEntity.mutate(game => {
      if (game.status !== 'lobby') {
        throw new Error('Game is not in lobby state');
      }
      return { ...game, status: 'playing' };
    });
    return ok(c, updatedGame);
  });
  // POST /api/games/:id/score - Player submits a score
  app.post('/api/games/:id/score', async (c) => {
    const { id: gameId } = c.req.param();
    const { playerId, score } = (await c.req.json()) as { playerId?: string; score?: number };
    if (!isStr(playerId) || typeof score !== 'number') {
      return bad(c, 'Player ID and score are required');
    }
    const gameEntity = new GameEntity(c.env, gameId);
    if (!(await gameEntity.exists())) {
      return notFound(c, 'Game not found');
    }
    const updatedGame = await gameEntity.mutate(game => {
      if (game.status !== 'playing') {
        throw new Error('Game is not currently in progress.');
      }
      const playerIndex = game.players.findIndex(p => p.id === playerId);
      if (playerIndex === -1) {
        throw new Error('Player not found in this game.');
      }
      const player = game.players[playerIndex];
      if (player.scores.length >= game.puzzleKeys.length) {
        // Already finished, ignore extra submissions
        return game;
      }
      const newPlayers = [...game.players];
      newPlayers[playerIndex] = { ...player, scores: [...player.scores, score] };
      // Check if all players have finished
      const allFinished = newPlayers.every(p => p.scores.length === game.puzzleKeys.length);
      const newStatus = allFinished ? 'finished' : game.status;
      return {
        ...game,
        players: newPlayers,
        status: newStatus,
      };
    });
    return ok(c, updatedGame);
  });
}