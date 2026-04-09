# Performance Rating

[![npm](https://img.shields.io/npm/v/@echecs/performance-rating)](https://www.npmjs.com/package/@echecs/performance-rating)
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
import type { Game, GameKind } from '@echecs/performance-rating';

const players = [
  { id: 'A', rating: 1800 },
  { id: 'B', rating: 1600 },
  { id: 'C', rating: 1700 },
  { id: 'D', rating: 1900 },
];
// games[n] = round n+1; Game has no `round` field
const games: Game[][] = [
  [{ black: 'B', result: 1, white: 'A' }], // round 1
  [{ black: 'C', result: 0.5, white: 'A' }], // round 2
  [{ black: 'A', result: 0, white: 'D' }], // round 3
  // Byes excluded from performance calculations
  [{ black: '', kind: 'half-bye', result: 0.5, white: 'A' }], // round 4
];

const tpr = tournamentPerformanceRating('A', games, players);
// Returns average opponent rating + DP_TABLE offset for the player's score %
```

## API

All functions share the same signature:

```typescript
(playerId: string, games: Game[][], players: Player[]) => number;
```

They return `0` when no rated opponents have been faced. Round is determined by
array position: `games[0]` = round 1, `games[1]` = round 2, etc. The `Game` type
has no `round` field. The optional `kind?: GameKind` field on `Game` classifies
unplayed rounds; only over-the-board games (where `black !== white`) contribute
to performance calculations.

### Root export — `@echecs/performance-rating`

#### `tournamentPerformanceRating(playerId, games, players)` — FIDE 10.2

Tournament Performance Rating (TPR). Computes the average rating of all
opponents faced, then adds the DP_TABLE offset for the player's percentage score
(points ÷ games played). Byes are excluded from both the opponent average and
the score percentage.

```typescript
import { tournamentPerformanceRating } from '@echecs/performance-rating';
// also exported as `tiebreak`
import { tiebreak } from '@echecs/performance-rating';
```

### Subpath exports

#### `@echecs/performance-rating/perfect` — FIDE 10.3

`perfectTournamentPerformance(playerId, games, players)` — Perfect Tournament
Performance. Computes the performance rating for a hypothetical scenario where
the player scores 100% against the same set of opponents, using a binary search
over the PD_TABLE scoring probability function. Returns `0` when no games have
been played. Returns `minRating - 800` for a 0% score and `maxRating + 800` for
a 100% score.

```typescript
import { perfectTournamentPerformance } from '@echecs/performance-rating/perfect';
// also exported as `tiebreak`
import { tiebreak } from '@echecs/performance-rating/perfect';
```

#### `@echecs/performance-rating/average` — FIDE 10.4

`averagePerformanceRatingOfOpponents(playerId, games, players)` — Average
Performance Rating of Opponents. Applies `tournamentPerformanceRating` to each
opponent of `playerId` (using the full `players` and `games` data) and returns
the arithmetic mean. Returns `0` when no opponents have been faced.

```typescript
import { averagePerformanceRatingOfOpponents } from '@echecs/performance-rating/average';
// also exported as `tiebreak`
import { tiebreak } from '@echecs/performance-rating/average';
```

#### `@echecs/performance-rating/average-perfect` — FIDE 10.5

`averagePerfectPerformanceOfOpponents(playerId, games, players)` — Average
Perfect Performance of Opponents. Applies `perfectTournamentPerformance` to each
opponent of `playerId` and returns the arithmetic mean. Returns `0` when no
opponents have been faced.

```typescript
import { averagePerfectPerformanceOfOpponents } from '@echecs/performance-rating/average-perfect';
// also exported as `tiebreak`
import { tiebreak } from '@echecs/performance-rating/average-perfect';
```

## Types

All types are exported from every subpath (root, `/perfect`, `/average`,
`/average-perfect`).

### `Game`

```typescript
interface Game {
  black: string;
  kind?: GameKind;
  result: Result;
  white: string;
}
```

### `Player`

```typescript
interface Player {
  id: string;
  rating?: number; // optional — unrated players are excluded from calculations
}
```

### `Result`

```typescript
type Result = 0 | 0.5 | 1;
```

### `GameKind`

Classifies unplayed rounds. Games with a `kind` set (or where `black === white`)
are excluded from all performance calculations.

```typescript
type GameKind =
  | 'forfeit-loss'
  | 'forfeit-win'
  | 'full-bye'
  | 'half-bye'
  | 'pairing-bye'
  | 'zero-bye';
```

## Contributing

Contributions are welcome. Please open an issue at
[github.com/mormubis/performance-rating/issues](https://github.com/mormubis/performance-rating/issues).
