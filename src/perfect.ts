import { PD_TABLE } from './tables.js';
import { gamesForPlayer, playerScore } from './utilities.js';

import type { Tiebreak } from '@echecs/tournament';

function scoringProbability(ratingDiff: number): number {
  const absDiff = Math.abs(ratingDiff);
  for (const [maxDiff, pd_h, pd_l] of PD_TABLE) {
    if (absDiff <= maxDiff) {
      return ratingDiff >= 0 ? pd_h : pd_l;
    }
  }
  return ratingDiff >= 0 ? 0.99 : 0.01;
}

const perfectTournamentPerformance: Tiebreak = (player, rounds, players) => {
  const otbGames = gamesForPlayer(player, rounds);
  if (otbGames.length === 0) {
    return 0;
  }

  const opponentRatings: number[] = [];
  for (const g of otbGames) {
    const opponentId = g.white === player ? g.black : g.white;
    const opponent = players.find((p) => p.id === opponentId);
    if (opponent?.rating !== undefined) {
      opponentRatings.push(opponent.rating);
    }
  }

  const actualScore = playerScore(player, rounds);

  if (actualScore === 0) {
    const minRating = Math.min(...opponentRatings);
    return minRating - 800;
  }

  if (actualScore === otbGames.length) {
    const maxRating = Math.max(...opponentRatings);
    return maxRating + 800;
  }

  let low = -5000;
  let high = 10_000;
  for (let index = 0; index < 100; index++) {
    const mid = (low + high) / 2;
    const expectedScore = opponentRatings.reduce(
      (sum, oppRating) => sum + scoringProbability(oppRating - mid),
      0,
    );
    if (expectedScore >= actualScore) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return Math.round(high);
};

export {
  perfectTournamentPerformance,
  perfectTournamentPerformance as tiebreak,
};

export type {
  Bye,
  CompletedRound,
  Game,
  Pairing,
  Player,
} from '@echecs/tournament';
