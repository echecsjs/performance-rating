import { DP_TABLE } from './tables.js';
import {
  averageRatingOfOpponents,
  gamesForPlayer,
  playerScore,
} from './utilities.js';

import type { Game, Player } from './types.js';

function tournamentPerformanceRating(
  player: string,
  games: Game[][],
  players: Player[],
): number {
  const aro = averageRatingOfOpponents(player, games, players);
  const otbGames = gamesForPlayer(player, games).filter(
    (g) => g.black !== g.white,
  );
  if (otbGames.length === 0) {
    return aro;
  }
  const actualScore = playerScore(player, games);
  const p = actualScore / otbGames.length;
  const clampedIndex = Math.min(100, Math.max(0, Math.round(p * 100)));
  const dp = DP_TABLE[clampedIndex] ?? 0;
  return aro + dp;
}

export { tournamentPerformanceRating, tournamentPerformanceRating as tiebreak };

export type { Game, GameKind, Player, Result } from './types.js';
