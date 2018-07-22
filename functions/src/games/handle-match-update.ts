import {Game} from '../types/Game';
import {getPlayerSnapshotById, updatePlayerSnapshot} from '../helper/database';
import {Player} from '../types/Player';
import {calculateStreak} from '../helper/calculate-streak';
import {getLoserScore, getWinnerId, getWinnerScore} from '../helper/game';
import {rewriteHistory} from '../helper/rewrite-history';

const EloRating = require('elo-rating');

export async function handleMatchUpdate(game: Game, stage = '') {

    if (game.shouldEffectRank === false) {
        console.log('should not effect rank');
        return true;
    }


    const [firstPlayerSnapshot, secondPlayerSnapshot] = await Promise.all([getPlayerSnapshotById(game.firstPlayerId, stage),
        getPlayerSnapshotById(game.secondPlayerId, stage)]);

    const firstPlayer = firstPlayerSnapshot.data() as Player;
    const secondPlayer = secondPlayerSnapshot.data() as Player;

    const firstPlayerUpdate = updatePlayerSnapshot(firstPlayerSnapshot, getPlayerUpdateForGame(firstPlayer, secondPlayer, game));
    const secondPlayerUpdate = updatePlayerSnapshot(secondPlayerSnapshot, getPlayerUpdateForGame(secondPlayer, firstPlayer, game));

    return await Promise.all([firstPlayerUpdate, secondPlayerUpdate]);


}


export function getPlayerUpdateForGame(player: Player, opponent: Player, game: Game): Partial<Player> {

    const playerWonGame = getWinnerId(game) === player.id;
    const playerScoreFor = playerWonGame ? getWinnerScore(game) : getLoserScore(game);
    const playerScoreAgainst = playerWonGame ? getLoserScore(game) : getWinnerScore(game);


    // calculate streak
    const streak = calculateStreak(player.streak, playerWonGame);
    const longestNegativeStreak = Math.min(streak, player.longestNegativeStreak || 0);
    const longestPositiveStreak = Math.max(streak, player.longestPositiveStreak || 0);

    // calculate history
    const history = rewriteHistory(player.history, playerWonGame);

    // new elo
    const playerElo = player.eloRank || 1000;
    const opponentElo = opponent.eloRank || 1000;

    const eloRank = game.shouldEffectElo ? EloRating.calculate(playerElo, opponentElo, playerWonGame) : player.eloRank;

    // wins and loses
    const totalWins = playerWonGame ? (player.totalWins || 0) + 1 : (player.totalWins || 0);
    const totalLoses = !playerWonGame ? (player.totalLoses || 0) + 1 : (player.totalLoses || 0);
    const winPercentage = totalWins / (totalWins + totalLoses);


    // score
    const totalScoreFor = (player.totalScoreFor || 0) + playerScoreFor;
    const totalScoreAgainst = (player.totalScoreAgainst || 0) + playerScoreAgainst;
    const totalScoreDiff = totalScoreFor - totalScoreAgainst;

    return {
        streak,
        longestNegativeStreak,
        longestPositiveStreak,
        history,
        eloRank,
        totalWins,
        totalLoses,
        winPercentage,
        totalScoreFor,
        totalScoreAgainst,
        totalScoreDiff
    }
}