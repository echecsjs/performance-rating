import { DP_TABLE, PD_TABLE } from './tables.js';
import { BYE_SENTINEL, gamesForPlayer } from './utilities.js';

import type { Game, Player } from './types.js';

function averageRatingOfOpponents(
  playerId: string,
  games: Game[],
  players: Player[],
): number {
  const opponentRatings: number[] = [];
  for (const g of gamesForPlayer(playerId, games)) {
    if (g.blackId === BYE_SENTINEL || g.whiteId === BYE_SENTINEL) {
      continue;
    }
    const opponentId = g.whiteId === playerId ? g.blackId : g.whiteId;
    const opponent = players.find((p) => p.id === opponentId);
    if (opponent?.rating !== undefined) {
      opponentRatings.push(opponent.rating);
    }
  }
  if (opponentRatings.length === 0) {
    return 0;
  }
  return (
    opponentRatings.reduce((accumulator, r) => accumulator + r, 0) /
    opponentRatings.length
  );
}

function playerScore(playerId: string, games: Game[]): number {
  let sum = 0;
  for (const g of gamesForPlayer(playerId, games)) {
    sum += g.whiteId === playerId ? g.result : 1 - g.result;
  }
  return sum;
}

function scoringProbability(ratingDiff: number): number {
  const absDiff = Math.abs(ratingDiff);
  for (const [maxDiff, pd_h, pd_l] of PD_TABLE) {
    if (absDiff <= maxDiff) {
      return ratingDiff >= 0 ? pd_h : pd_l;
    }
  }
  return ratingDiff >= 0 ? 0.99 : 0.01;
}

function tournamentPerformanceRating(
  playerId: string,
  games: Game[],
  players: Player[],
): number {
  const aro = averageRatingOfOpponents(playerId, games, players);
  const otbGames = gamesForPlayer(playerId, games).filter(
    (g) => g.blackId !== BYE_SENTINEL && g.whiteId !== BYE_SENTINEL,
  );
  if (otbGames.length === 0) {
    return aro;
  }
  const actualScore = playerScore(playerId, otbGames);
  const p = actualScore / otbGames.length;
  const clampedIndex = Math.min(100, Math.max(0, Math.round(p * 100)));
  const dp = DP_TABLE[clampedIndex] ?? 0;
  return aro + dp;
}

function perfectTournamentPerformance(
  playerId: string,
  games: Game[],
  players: Player[],
): number {
  const otbGames = gamesForPlayer(playerId, games).filter(
    (g) => g.blackId !== BYE_SENTINEL && g.whiteId !== BYE_SENTINEL,
  );
  if (otbGames.length === 0) {
    return 0;
  }

  const opponentRatings: number[] = [];
  for (const g of otbGames) {
    const opponentId = g.whiteId === playerId ? g.blackId : g.whiteId;
    const opponent = players.find((p) => p.id === opponentId);
    if (opponent?.rating !== undefined) {
      opponentRatings.push(opponent.rating);
    }
  }

  const actualScore = playerScore(playerId, otbGames);

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

function averagePerformanceRatingOfOpponents(
  playerId: string,
  games: Game[],
  players: Player[],
): number {
  const otbGames = gamesForPlayer(playerId, games).filter(
    (g) => g.blackId !== BYE_SENTINEL && g.whiteId !== BYE_SENTINEL,
  );
  const tprValues: number[] = [];
  for (const g of otbGames) {
    const opponentId = g.whiteId === playerId ? g.blackId : g.whiteId;
    const tpr = tournamentPerformanceRating(opponentId, games, players);
    tprValues.push(tpr);
  }
  if (tprValues.length === 0) {
    return 0;
  }
  return tprValues.reduce((sum, v) => sum + v, 0) / tprValues.length;
}

function averagePerfectPerformanceOfOpponents(
  playerId: string,
  games: Game[],
  players: Player[],
): number {
  const otbGames = gamesForPlayer(playerId, games).filter(
    (g) => g.blackId !== BYE_SENTINEL && g.whiteId !== BYE_SENTINEL,
  );
  const ptpValues: number[] = [];
  for (const g of otbGames) {
    const opponentId = g.whiteId === playerId ? g.blackId : g.whiteId;
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
  averagePerformanceRatingOfOpponents,
  perfectTournamentPerformance,
  tournamentPerformanceRating,
};

export type { Game, Player, Result } from './types.js';
