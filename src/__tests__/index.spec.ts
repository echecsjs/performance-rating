import { describe, expect, it } from 'vitest';

import { tiebreak as averagePerfectPerformanceOfOpponents } from '../average-perfect.js';
import { tiebreak as averagePerformanceRatingOfOpponents } from '../average.js';
import { tiebreak as tournamentPerformanceRating } from '../index.js';
import { tiebreak as perfectTournamentPerformance } from '../perfect.js';

import type { CompletedRound, Player } from '@echecs/tournament';

const PLAYERS: Player[] = [
  { id: 'A', points: 2.5, rank: 1, rating: 2400 },
  { id: 'B', points: 1, rank: 3, rating: 2200 },
  { id: 'C', points: 0, rank: 4, rating: 2000 },
  { id: 'D', points: 2.5, rank: 2, rating: 2100 },
];

const ROUNDS: CompletedRound[] = [
  {
    byes: [],
    games: [
      { black: 'B', result: 'white', white: 'A' },
      { black: 'D', result: 'black', white: 'C' },
    ],
  },
  {
    byes: [],
    games: [
      { black: 'D', result: 'draw', white: 'A' },
      { black: 'B', result: 'black', white: 'C' },
    ],
  },
  {
    byes: [],
    games: [
      { black: 'C', result: 'white', white: 'A' },
      { black: 'B', result: 'white', white: 'D' },
    ],
  },
];

describe('tournamentPerformanceRating', () => {
  it('computes FIDE 10.2 TPR: ARO + DP_TABLE[p*100]', () => {
    expect(tournamentPerformanceRating('A', ROUNDS, PLAYERS)).toBe(2373);
  });

  it('handles player with no games', () => {
    expect(tournamentPerformanceRating('A', [], PLAYERS)).toBe(0);
  });
});

describe('perfectTournamentPerformance', () => {
  it('returns minRating - 800 for zero score', () => {
    expect(perfectTournamentPerformance('C', ROUNDS, PLAYERS)).toBe(1300);
  });

  it('handles player with no games', () => {
    expect(perfectTournamentPerformance('A', [], PLAYERS)).toBe(0);
  });
});

describe('averagePerformanceRatingOfOpponents', () => {
  it('returns average TPR of opponents', () => {
    const result = averagePerformanceRatingOfOpponents('A', ROUNDS, PLAYERS);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });
});

describe('averagePerfectPerformanceOfOpponents', () => {
  it('returns average PTP of opponents', () => {
    const result = averagePerfectPerformanceOfOpponents('A', ROUNDS, PLAYERS);
    expect(typeof result).toBe('number');
  });
});
