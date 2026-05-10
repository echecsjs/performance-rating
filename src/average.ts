import { gamesForPlayer } from './utilities.js';

import type { CompletedRound, Player } from '@echecs/tournament';

import { tournamentPerformanceRating } from './index.js';

function averagePerformanceRatingOfOpponents(
  player: string,
  rounds: CompletedRound[],
  players: Player[],
): number {
  const otbGames = gamesForPlayer(player, rounds);
  const tprValues: number[] = [];
  for (const g of otbGames) {
    const opponentId = g.white === player ? g.black : g.white;
    const tpr = tournamentPerformanceRating(opponentId, rounds, players);
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

export type {
  Bye,
  CompletedRound,
  Game,
  Pairing,
  Player,
} from '@echecs/tournament';
