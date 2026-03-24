import type { Game, Player } from './types.js';

const BYE_SENTINEL = '';

function gamesForPlayer(player: string, games: Game[][]): Game[] {
  return games.flat().filter((g) => g.white === player || g.black === player);
}

function averageRatingOfOpponents(
  player: string,
  games: Game[][],
  players: Player[],
): number {
  const opponentRatings: number[] = [];
  for (const g of gamesForPlayer(player, games)) {
    if (g.black === BYE_SENTINEL || g.white === BYE_SENTINEL) {
      continue;
    }
    const opponentId = g.white === player ? g.black : g.white;
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

function playerScore(player: string, games: Game[][]): number {
  let sum = 0;
  for (const g of gamesForPlayer(player, games)) {
    sum += g.white === player ? g.result : 1 - g.result;
  }
  return sum;
}

export { BYE_SENTINEL, averageRatingOfOpponents, gamesForPlayer, playerScore };
