import type { Game } from './types.js';

const BYE_SENTINEL = '';

function gamesForPlayer(playerId: string, games: Game[][]): Game[] {
  return games.flat().filter((g) => g.whiteId === playerId || g.blackId === playerId);
}

export { BYE_SENTINEL, gamesForPlayer };
