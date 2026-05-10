import { perfectTournamentPerformance } from './perfect.js';
import { gamesForPlayer } from './utilities.js';

import type { CompletedRound, Player } from '@echecs/tournament';

function averagePerfectPerformanceOfOpponents(
  player: string,
  rounds: CompletedRound[],
  players: Player[],
): number {
  const otbGames = gamesForPlayer(player, rounds);
  const ptpValues: number[] = [];
  for (const g of otbGames) {
    const opponentId = g.white === player ? g.black : g.white;
    const ptp = perfectTournamentPerformance(opponentId, rounds, players);
    ptpValues.push(ptp);
  }
  if (ptpValues.length === 0) {
    return 0;
  }
  return ptpValues.reduce((sum, v) => sum + v, 0) / ptpValues.length;
}

export {
  averagePerfectPerformanceOfOpponents,
  averagePerfectPerformanceOfOpponents as tiebreak,
};

export type {
  Bye,
  CompletedRound,
  Game,
  Pairing,
  Player,
} from '@echecs/tournament';
