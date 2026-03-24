import { PD_TABLE } from './tables.js';
import { BYE_SENTINEL, gamesForPlayer, playerScore } from './utilities.js';

import type { Game, Player } from './types.js';

function scoringProbability(ratingDiff: number): number {
  const absDiff = Math.abs(ratingDiff);
  for (const [maxDiff, pd_h, pd_l] of PD_TABLE) {
    if (absDiff <= maxDiff) {
      return ratingDiff >= 0 ? pd_h : pd_l;
    }
  }
  return ratingDiff >= 0 ? 0.99 : 0.01;
}

function perfectTournamentPerformance(
  player: string,
  games: Game[][],
  players: Player[],
): number {
  const otbGames = gamesForPlayer(player, games).filter(
    (g) => g.black !== BYE_SENTINEL && g.white !== BYE_SENTINEL,
  );
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

  const actualScore = playerScore(player, games);

  if (actualScore === 0) {
    const minRating = Math.min(...opponentRatings);
    return minRating - 800;
  }

  if (actualScore === otbGames.length) {
    const maxRating = Math.max(...opponentRatings);
    return maxRating + 800;
  }

  // Binary search for R: find lowest R where sum of P(oppRating - R) >= actualScore
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
}

export { perfectTournamentPerformance };
