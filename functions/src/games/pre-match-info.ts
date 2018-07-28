const EloRating = require('elo-rating');

export function preMatchInfo(data) {
    const expectedWinFirstPlayer = Math.round(EloRating.expected(data.firstPlayerEloRank, data.secondPlayerEloRank) * 100);

    const firstPlayerWin = EloRating.calculate(data.firstPlayerEloRank, data.secondPlayerEloRank, true);
    const secondPlayerWin = EloRating.calculate(data.firstPlayerEloRank, data.secondPlayerEloRank, false);


    return {
        firstPlayer: {
            eloIfWin: firstPlayerWin.playerRating,
            eloIfLoss: secondPlayerWin.playerRating,
            winProbability: expectedWinFirstPlayer
        },
        secondPlayer: {
            eloIfWin: secondPlayerWin.opponentRating,
            eloIfLoss: firstPlayerWin.opponentRating,
            winProbability: 100 - expectedWinFirstPlayer
        }
    }
}