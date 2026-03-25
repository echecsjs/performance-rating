import { gamesForPlayer } from './utilities.js';

import type { Game, Player } from './types.js';

import { tournamentPerformanceRating } from './index.js';

function averagePerformanceRatingOfOpponents(
  player: string,
  games: Game[][],
  players: Player[],
): number {
  const otbGames = gamesForPlayer(player, games).filter(
    (g) => g.black !== g.white,
  );
  const tprValues: number[] = [];
  for (const g of otbGames) {
    const opponentId = g.white === player ? g.black : g.white;
    const tpr = tournamentPerformanceRating(opponentId, games, players);
    tprValues.push(tpr);
  }
  if (tprValues.length === 0) {
    return 0;
  }
  return tprValues.reduce((sum, v) => sum + v, 0) / tprValues.length;
}

export {
  averagePerformanceRatingOfOpponents,
  averagePerformanceRatingOfOpponents as tiebreak,
};

export type { GameKind, Result, Game, Player } from './types.js';
