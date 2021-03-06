import {Game} from '../types/Game';
import {Player} from '../types/Player';
import {Tournament} from '../types/Tournament';

export function getFirstPlayerWon(game: Game) {
    return game.firstPlayerScore > game.secondPlayerScore;
}

export function getWinnerScore(game: Game): number {
    return getFirstPlayerWon(game) ? game.firstPlayerScore : game.secondPlayerScore;
}

export function getLoserScore(game: Game): number {
    return getFirstPlayerWon(game) ? game.secondPlayerScore : game.firstPlayerScore;
}

export function getWinnerName(game: Game): string | null {
    if (!game.done) {
        return null;
    }

    return getFirstPlayerWon(game) ? game.firstPlayerName : game.secondPlayerName;
}

export function getLoserName(game: Game): string | null {
    if (!game.done) {
        return null;
    }

    return getFirstPlayerWon(game) ? game.secondPlayerName : game.firstPlayerName;
}

export function getWinnerId(game: Game): string | null {
    if (!game.done) {
        return null;
    }

    return getFirstPlayerWon(game) ? game.firstPlayerId : game.secondPlayerId;
}

export function getLoserId(game: Game): string | null {
    if (!game.done) {
        return null;
    }

    return getFirstPlayerWon(game) ? game.secondPlayerId : game.firstPlayerId;
}

export function createGameDataForPlayers(firstPlayer: Player | null, secondPlayer: Player | null, tournament: Tournament): Game {
    return {
        firstPlayerName: firstPlayer ? firstPlayer.name : null,
        firstPlayerId: firstPlayer ? firstPlayer.id : null,
        secondPlayerName: secondPlayer ? secondPlayer.name : null,
        secondPlayerId: secondPlayer ? secondPlayer.id : null,
        firstPlayerScore: 0,
        secondPlayerScore: 0,
        done: false,
        shouldEffectElo: tournament.shouldEffectElo,
        shouldEffectRank: tournament.shouldEffectRank,
        mode: tournament.mode,
        tournamentId: tournament.id,
    };
}
