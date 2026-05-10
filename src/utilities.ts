import type { CompletedRound, Game, Player } from '@echecs/tournament';

function gamesForPlayer(player: string, rounds: CompletedRound[]): Game[] {
  return rounds
    .flatMap((r) => r.games)
    .filter((g) => g.white === player || g.black === player);
}

function scoreFor(player: string, game: Game): number {
  if (game.result === 'draw') {
    return 0.5;
  }
  if (game.result === 'none') {
    return 0;
  }
  return (game.result === 'white' && game.white === player) ||
    (game.result === 'black' && game.black === player)
    ? 1
    : 0;
}

function averageRatingOfOpponents(
  player: string,
  rounds: CompletedRound[],
  players: Player[],
): number {
  const opponentRatings: number[] = [];
  for (const g of gamesForPlayer(player, rounds)) {
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

function playerScore(player: string, rounds: CompletedRound[]): number {
  let sum = 0;
  for (const g of gamesForPlayer(player, rounds)) {
    sum += scoreFor(player, g);
  }
  return sum;
}

export { averageRatingOfOpponents, gamesForPlayer, playerScore, scoreFor };
