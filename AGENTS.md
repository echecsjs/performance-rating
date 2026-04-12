# AGENTS.md

Agent guidance for the `@echecs/performance-rating` repository — a TypeScript
library implementing performance-rating tiebreaks following FIDE Tiebreak
Regulations (sections 10.2–10.5).

**See also:** [`REFERENCES.md`](REFERENCES.md) | [`SPEC.md`](SPEC.md)

See the root `AGENTS.md` for workspace-wide conventions.

**Backlog:** tracked in
[GitHub Issues](https://github.com/echecsjs/performance-rating/issues).

---

## Project Overview

Pure calculation library, no runtime dependencies. Exports four functions:

| Function                               | FIDE section | Description                                               |
| -------------------------------------- | ------------ | --------------------------------------------------------- |
| `tournamentPerformanceRating`          | 10.2         | FIDE performance rating via DP_TABLE lookup               |
| `perfectTournamentPerformance`         | 10.3         | Performance for a perfect score (all wins) via PD_TABLE   |
| `averagePerformanceRatingOfOpponents`  | 10.4         | Average performance rating of all opponents faced         |
| `averagePerfectPerformanceOfOpponents` | 10.5         | Average perfect-performance rating of all opponents faced |

All functions conform to the signature:

```ts
(playerId: string, games: Game[][], players: Player[]) => number;
```

`Game[][]` is a round-indexed structure: `games[0]` contains round-1 games,
`games[1]` contains round-2 games, and so on. The `Game` type no longer has a
`round` field — round is determined by array position.

The `Game` type carries an optional `kind?: GameKind` field. When present it
identifies the nature of an unplayed round (e.g. `'half-bye'`, `'full-bye'`,
`'forfeit-win'`, `'forfeit-loss'`, `'zero-bye'`, `'pairing-bye'`). All byes and
forfeits are excluded from performance calculations — only over-the-board games
contribute.

`Player` objects **must** carry a `rating` field (number). Functions return `0`
when no rated opponents have been faced.

FIDE reference: https://handbook.fide.com/chapter/TieBreakRegulations032026
(sections 10.2–10.5 — Performance Rating tiebreaks)

All source lives in `src/index.ts`; tests in `src/__tests__/index.spec.ts`.

---

## Commands

### Build

```bash
pnpm run build          # bundle TypeScript → dist/ via tsdown
```

### Test

```bash
pnpm run test                          # run all tests once
pnpm run test:watch                    # watch mode
pnpm run test:coverage                 # with coverage report

# Run a single test file
pnpm run test src/__tests__/index.spec.ts

# Run a single test by name (substring match)
pnpm run test -- --reporter=verbose -t "tournamentPerformanceRating"
```

### Lint & Format

```bash
pnpm run lint           # ESLint + tsc type-check (auto-fixes style issues)
pnpm run lint:ci        # strict — zero warnings allowed, no auto-fix
pnpm run lint:style     # ESLint only (auto-fixes)
pnpm run lint:types     # tsc --noEmit type-check only
pnpm run format         # Prettier (writes changes)
pnpm run format:ci      # Prettier check only (no writes)
```

### Full pre-PR check

```bash
pnpm lint && pnpm test && pnpm build
```

---

## Architecture Notes

- `tournamentPerformanceRating` computes the average rating of opponents and
  adds/subtracts the DP_TABLE offset corresponding to the player's percentage
  score (points ÷ games). The **`DP_TABLE`** is a module-level constant
  (`SCREAMING_SNAKE_CASE`) embedded directly in `src/index.ts` — do not fetch it
  at runtime.
- `perfectTournamentPerformance` uses the **`PD_TABLE`** (also embedded) to
  compute the performance for a hypothetical 100 % score given the same set of
  opponents. This represents the upper bound used by FIDE when a player scores
  100 %.
- `averagePerformanceRatingOfOpponents` applies `tournamentPerformanceRating` to
  each opponent (using the full `players`/`games` data) and averages the
  results.
- `averagePerfectPerformanceOfOpponents` applies `perfectTournamentPerformance`
  to each opponent and averages the results.
- A `Game` with `black: ''` (empty string) represents a **bye**. Byes are
  excluded from all calculations — there is no rated opponent and no meaningful
  score contribution for performance purposes.
- Both lookup tables (`DP_TABLE`, `PD_TABLE`) must be named with
  `SCREAMING_SNAKE_CASE` (module-level constant convention). Never compute these
  values analytically at runtime — the tables encode FIDE's published values.
- **No runtime dependencies** — keep it that way.
- **ESM-only** — the package ships only ESM. Do not add a CJS build.

---

## Tiebreak Signature

All tiebreak functions consumed by `@echecs/tournament` must conform to:

```typescript
(playerId: string, games: Game[], players: Map<string, Player>) => number;
```

---

## Validation

Input validation is provided by TypeScript's strict type system at compile time.
There is no runtime validation library. Do not add runtime type-checking guards
unless there is an explicit trust boundary (user-supplied strings, external
data).

---

## Error Handling

All functions are pure calculations and do not throw. When no rated opponents
have been faced, functions return `0` rather than throwing. Unlike
`@echecs/elo`'s `performance()`, these tiebreak functions never throw
`RangeError` — edge cases (0 games, 100 % score, 0 % score) are handled via the
PD_TABLE fallback and graceful zero returns.
