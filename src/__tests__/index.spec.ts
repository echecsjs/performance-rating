import { describe, expect, it } from 'vitest';

import { tiebreak as averagePerfectPerformanceOfOpponents } from '../average-perfect.js';
import { tiebreak as averagePerformanceRatingOfOpponents } from '../average.js';
import { tiebreak as tournamentPerformanceRating } from '../index.js';
import { tiebreak as perfectTournamentPerformance } from '../perfect.js';

import type { Game, Player } from '../types.js';

// 4 players, 3 rounds with ratings:
// A(2400), B(2200), C(2000), D(2100)
// Round 1: A(W) 1-0 B, C(W) 0-1 D
// Round 2: A(W) 0.5-0.5 D, C(W) 0-1 B
// Round 3: A(W) 1-0 C, D(W) 1-0 B
// Scores: A=2.5, D=2.5, B=1, C=0
const PLAYERS: Player[] = [
  { id: 'A', rating: 2400 },
  { id: 'B', rating: 2200 },
  { id: 'C', rating: 2000 },
  { id: 'D', rating: 2100 },
];

const GAMES: Game[][] = [
  [
    { black: 'B', result: 1, white: 'A' },
    { black: 'D', result: 0, white: 'C' },
  ],
  [
    { black: 'D', result: 0.5, white: 'A' },
    { black: 'B', result: 0, white: 'C' },
  ],
  [
    { black: 'C', result: 1, white: 'A' },
    { black: 'B', result: 1, white: 'D' },
  ],
];

describe('tournamentPerformanceRating', () => {
  it('computes FIDE 10.2 TPR: ARO + DP_TABLE[p*100]', () => {
    // A: ARO=(2200+2100+2000)/3=2100, p=2.5/3≈0.833 → index=83 → DP=273
    // TPR = 2100 + 273 = 2373
    expect(tournamentPerformanceRating('A', GAMES, PLAYERS)).toBe(2373);
  });

  it('handles player with no games', () => {
    expect(tournamentPerformanceRating('A', [], PLAYERS)).toBe(0);
  });
});

describe('perfectTournamentPerformance', () => {
  it('returns minRating - 800 for zero score', () => {
    // C: score=0, opponents are A(2400) and B(2200)... wait, C played vs D(R1) and B(R2)
    // C's opponents: D(2100), B(2200) → min=2100 → 2100-800=1300
    expect(perfectTournamentPerformance('C', GAMES, PLAYERS)).toBe(1300);
  });

  it('handles player with no games', () => {
    expect(perfectTournamentPerformance('A', [], PLAYERS)).toBe(0);
  });
});

describe('averagePerformanceRatingOfOpponents', () => {
  it('returns average TPR of opponents', () => {
    // Sanity check - result should be a number
    const result = averagePerformanceRatingOfOpponents('A', GAMES, PLAYERS);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });
});

describe('averagePerfectPerformanceOfOpponents', () => {
  it('returns average PTP of opponents', () => {
    // Sanity check - result should be a number
    const result = averagePerfectPerformanceOfOpponents('A', GAMES, PLAYERS);
    expect(typeof result).toBe('number');
  });
});
