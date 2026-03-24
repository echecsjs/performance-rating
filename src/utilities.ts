import type { Game } from './types.js';

const BYE_SENTINEL = '';

function gamesForPlayer(player: string, games: Game[][]): Game[] {
  return games.flat().filter((g) => g.white === player || g.black === player);
}

export { BYE_SENTINEL, gamesForPlayer };
