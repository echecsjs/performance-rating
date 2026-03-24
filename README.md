# Performance Rating

[![npm](https://img.shields.io/npm/v/@echecs/performance-rating)](https://www.npmjs.com/package/@echecs/performance-rating)
[![Test](https://github.com/mormubis/performance-rating/actions/workflows/test.yml/badge.svg)](https://github.com/mormubis/performance-rating/actions/workflows/test.yml)
[![Coverage](https://codecov.io/gh/mormubis/performance-rating/branch/main/graph/badge.svg)](https://codecov.io/gh/mormubis/performance-rating)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Performance Rating** is a TypeScript library implementing performance-rating
tiebreaks for chess tournaments, following the
[FIDE Tiebreak Regulations](https://handbook.fide.com/chapter/TieBreakRegulations032026)
(sections 10.2–10.5). Zero runtime dependencies.

The FIDE `DP_TABLE` and `PD_TABLE` lookup tables are embedded directly — no
runtime fetching required.

## Installation

```bash
npm install @echecs/performance-rating
```

## Quick Start

```typescript
import { tournamentPerformanceRating } from '@echecs/performance-rating';

const players = [
  { id: 'A', rating: 1800 },
  { id: 'B', rating: 1600 },
  { id: 'C', rating: 1700 },
  { id: 'D', rating: 1900 },
];
// games[n] = round n+1; Game has no `round` field
const games = [
  [{ blackId: 'B', result: 1, whiteId: 'A' }], // round 1
  [{ blackId: 'C', result: 0.5, whiteId: 'A' }], // round 2
  [{ blackId: 'A', result: 0, whiteId: 'D' }], // round 3
];

const tpr = tournamentPerformanceRating('A', games, players);
// Returns average opponent rating + DP_TABLE offset for the player's score %
```

## API

All functions require a `players` array whose entries carry a `rating` field and
return `number`. They return `0` when no rated opponents have been faced. Round
is determined by array position: `games[0]` = round 1, `games[1]` = round 2,
etc. The `Game` type has no `round` field.

### `tournamentPerformanceRating(playerId, games, players)`

**FIDE section 10.2** — Tournament Performance Rating (TPR). Computes the
average rating of all opponents faced, then adds the DP_TABLE offset for the
player's percentage score (points ÷ games played). Byes are excluded from both
the opponent average and the score percentage.

```typescript
tournamentPerformanceRating(playerId: string, games: Game[][], players: Player[]): number
```

### `perfectTournamentPerformance(playerId, games, players)`

**FIDE section 10.3** — Perfect Tournament Performance. Computes the performance
rating for a hypothetical scenario where the player scores 100% against the same
set of opponents, using a binary search over the PD_TABLE scoring probability
function. Returns `0` when no games have been played. Returns `minRating - 800`
for a 0% score and `maxRating + 800` for a 100% score.

```typescript
perfectTournamentPerformance(playerId: string, games: Game[][], players: Player[]): number
```

### `averagePerformanceRatingOfOpponents(playerId, games, players)`

**FIDE section 10.4** — Average Performance Rating of Opponents. Applies
`tournamentPerformanceRating` to each opponent of `playerId` (using the full
`players` and `games` data) and returns the arithmetic mean. Returns `0` when no
opponents have been faced.

```typescript
averagePerformanceRatingOfOpponents(playerId: string, games: Game[][], players: Player[]): number
```

### `averagePerfectPerformanceOfOpponents(playerId, games, players)`

**FIDE section 10.5** — Average Perfect Performance of Opponents. Applies
`perfectTournamentPerformance` to each opponent of `playerId` and returns the
arithmetic mean. Returns `0` when no opponents have been faced.

```typescript
averagePerfectPerformanceOfOpponents(playerId: string, games: Game[][], players: Player[]): number
```

## Contributing

Contributions are welcome. Please open an issue at
[github.com/mormubis/performance-rating/issues](https://github.com/mormubis/performance-rating/issues).
