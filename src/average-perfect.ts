import { perfectTournamentPerformance } from './perfect.js';
import { gamesForPlayer } from './utilities.js';

import type { Tiebreak } from '@echecs/tournament';

const averagePerfectPerformanceOfOpponents: Tiebreak = (
  player,
  rounds,
  players,
) => {
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
};

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
