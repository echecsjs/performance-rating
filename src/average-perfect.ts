import { perfectTournamentPerformance } from './perfect.js';
import { BYE_SENTINEL, gamesForPlayer } from './utilities.js';

import type { Game, Player } from './types.js';

function averagePerfectPerformanceOfOpponents(
  player: string,
  games: Game[][],
  players: Player[],
): number {
  const otbGames = gamesForPlayer(player, games).filter(
    (g) => g.black !== BYE_SENTINEL && g.white !== BYE_SENTINEL,
  );
  const ptpValues: number[] = [];
  for (const g of otbGames) {
    const opponentId = g.white === player ? g.black : g.white;
    const ptp = perfectTournamentPerformance(opponentId, games, players);
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

export type { GameKind, Result, Game, Player } from './types.js';
