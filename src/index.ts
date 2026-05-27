import { DP_TABLE } from './tables.js';
import {
  averageRatingOfOpponents,
  gamesForPlayer,
  playerScore,
} from './utilities.js';

import type { Tiebreak } from '@echecs/tournament';

const tournamentPerformanceRating: Tiebreak = (player, rounds, players) => {
  const aro = averageRatingOfOpponents(player, rounds, players);
  const otbGames = gamesForPlayer(player, rounds);
  if (otbGames.length === 0) {
    return aro;
  }
  const actualScore = playerScore(player, rounds);
  const p = actualScore / otbGames.length;
  const clampedIndex = Math.min(100, Math.max(0, Math.round(p * 100)));
  const dp = DP_TABLE[clampedIndex] ?? 0;
  return aro + dp;
};

export { tournamentPerformanceRating, tournamentPerformanceRating as tiebreak };

export type {
  Bye,
  CompletedRound,
  Game,
  Pairing,
  Player,
} from '@echecs/tournament';
