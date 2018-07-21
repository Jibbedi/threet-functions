import {Game} from '../types/Game';
import {
    getLoserId,
    getLoserName,
    getLoserScore,
    getWinnerId,
    getWinnerName,
    getWinnerScore
} from '../helper/game.helpers';


const firstPlayerWonGame: Game = {
    firstPlayerName: 'First Player',
    firstPlayerId: '1',
    firstPlayerScore: 11,
    secondPlayerName: 'Second Player',
    secondPlayerScore: 0,
    secondPlayerId: '2',
    done: true
};

const secondPlayerWonGame: Game = {
    firstPlayerName: 'First Player',
    firstPlayerId: '1',
    firstPlayerScore: 0,
    secondPlayerName: 'Second Player',
    secondPlayerScore: 11,
    secondPlayerId: '2',
    done: true
};

const notDoneGame: Game = {
    firstPlayerName: 'First Player',
    firstPlayerId: '1',
    firstPlayerScore: 0,
    secondPlayerName: 'Second Player',
    secondPlayerScore: 0,
    secondPlayerId: '2',
    done: false
};

describe('names', () => {
    test('winner name should be first player, loser name should be second player if first player won', () => {
        expect(getWinnerName(firstPlayerWonGame)).toEqual('First Player');
        expect(getLoserName(firstPlayerWonGame)).toEqual('Second Player');
    });

    test('winner name should be second player, loser name should be first player if second player won', () => {
        expect(getWinnerName(secondPlayerWonGame)).toEqual('Second Player');
        expect(getLoserName(secondPlayerWonGame)).toEqual('First Player');
    });

    test('it should return null if game is not done', () => {
        expect(getWinnerName(notDoneGame)).toBe(null);
        expect(getLoserName(notDoneGame)).toBe(null);
    });
});


describe('winner id', () => {
    test('winner id should be first player id, loser id should be second player id if first player won', () => {
        expect(getWinnerId(firstPlayerWonGame)).toEqual('1');
        expect(getLoserId(firstPlayerWonGame)).toEqual('2');
    });

    test('winner id should be second player id, loser id should be first player id if second player won', () => {
        expect(getWinnerId(secondPlayerWonGame)).toEqual('2');
        expect(getLoserId(secondPlayerWonGame)).toEqual('1');
    });

    test('it should return null if game is not done', () => {
        expect(getWinnerId(notDoneGame)).toBe(null);
        expect(getLoserId(notDoneGame)).toBe(null);
    });
});

describe('winner score', () => {
    test('winner score should be first player score, loser score should be second player score if first player won', () => {
        expect(getWinnerScore(firstPlayerWonGame)).toEqual(11);
        expect(getLoserScore(firstPlayerWonGame)).toEqual(0);
    });

    test('winner score should be second player score, loser score should be first player score if second player won', () => {
        expect(getWinnerScore(secondPlayerWonGame)).toEqual(11);
        expect(getLoserScore(secondPlayerWonGame)).toEqual(0);
    });
});

