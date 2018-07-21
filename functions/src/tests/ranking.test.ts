import {Game} from '../types/Game';
import {getRanking} from '../helper/ranking';

export const firstPlayer = {name: 'First Player', id: '1'};
export const secondPlayer = {name: 'Second Player', id: '2'};
export const thirdPlayer = {name: 'Third Player', id: '3'};


const firstVsSecondPlayer: Game = {
    firstPlayerScore: 11,
    secondPlayerScore: 9,
    firstPlayerName: firstPlayer.name,
    secondPlayerName: secondPlayer.name,
    firstPlayerId: firstPlayer.id,
    secondPlayerId: secondPlayer.id,
    done: true
};

const firstVsThirdPlayer: Game = {
    firstPlayerScore: 11,
    secondPlayerScore: 0,
    firstPlayerName: firstPlayer.name,
    secondPlayerName: thirdPlayer.name,
    firstPlayerId: firstPlayer.id,
    secondPlayerId: thirdPlayer.id,
    done: true
};

const secondVsThirdPlayerUnplayed: Game = {
    firstPlayerScore: 0,
    secondPlayerScore: 0,
    firstPlayerName: secondPlayer.name,
    secondPlayerName: thirdPlayer.name,
    firstPlayerId: secondPlayer.id,
    secondPlayerId: thirdPlayer.id,
    done: false
};

const secondVsThirdPlayerPlayed: Game = {
    firstPlayerScore: 8,
    secondPlayerScore: 11,
    firstPlayerName: secondPlayer.name,
    secondPlayerName: thirdPlayer.name,
    firstPlayerId: secondPlayer.id,
    secondPlayerId: thirdPlayer.id,
    done: true
};

describe('ranking calculation', () => {

    test('it should add two points per win ', () => {
        const ranking = getRanking([firstVsSecondPlayer, firstVsThirdPlayer]);


        // First vs Second Player: 11 : 9
        // First vs Third Player: 11 : 0

        expect(ranking[0].points).toBe(4);
    });

    test('it should add zero points per lose ', () => {
        const ranking = getRanking([firstVsSecondPlayer, firstVsThirdPlayer]);


        // First vs Second Player: 11 : 9
        // First vs Third Player: 11 : 0

        expect(ranking[1].points).toBe(0);
    });

    test('it should calculate table by sorting points first', () => {
        const ranking = getRanking([firstVsSecondPlayer, firstVsThirdPlayer, secondVsThirdPlayerPlayed]);


        // First vs Second Player: 11 : 9
        // First vs Third Player: 11 : 0
        // Second vs Third Player 8 : 11

        // 1. First Player | Diff + 13 | Points 4
        // 2. Third Player | Diff -8 | Points 2
        // 3. Second Player | Diff -5 | Points 0

        //1st
        expect(ranking[0].name).toBe(firstPlayer.name);
        expect(ranking[0].id).toBe(firstPlayer.id);
        expect(ranking[0].wins).toBe(2);
        expect(ranking[0].loses).toBe(0);
        expect(ranking[0].scoreFor).toBe(22);
        expect(ranking[0].scoreAgainst).toBe(9);
        expect(ranking[0].points).toBe(4);


        //2nd
        expect(ranking[1].name).toBe(thirdPlayer.name);
        expect(ranking[1].id).toBe(thirdPlayer.id);
        expect(ranking[1].wins).toBe(1);
        expect(ranking[1].loses).toBe(1);
        expect(ranking[1].scoreFor).toBe(11);
        expect(ranking[1].scoreAgainst).toBe(19);
        expect(ranking[1].points).toBe(2);


        //3rd
        expect(ranking[2].name).toBe(secondPlayer.name);
        expect(ranking[2].id).toBe(secondPlayer.id);
        expect(ranking[2].wins).toBe(0);
        expect(ranking[2].scoreFor).toBe(17);
        expect(ranking[2].scoreAgainst).toBe(22);
        expect(ranking[2].points).toBe(0);
    });

    test('it should calculate table by score diff if points are equal', () => {
        const ranking = getRanking([firstVsSecondPlayer, firstVsThirdPlayer, secondVsThirdPlayerUnplayed]);


        // First vs Second Player: 11 : 9
        // First vs Third Player: 11 : 0
        // Second vs Third Player not done

        // 1. First Player | Diff + 13 | Points 4
        // 2. Second Player | Diff -2 | Points 0
        // 3. Third Player | Diff -11 | Points 0


        //1st
        expect(ranking[0].name).toBe(firstPlayer.name);
        expect(ranking[0].id).toBe(firstPlayer.id);
        expect(ranking[0].wins).toBe(2);
        expect(ranking[0].loses).toBe(0);
        expect(ranking[0].scoreFor).toBe(22);
        expect(ranking[0].scoreAgainst).toBe(9);
        expect(ranking[0].points).toBe(4);


        //2nd
        expect(ranking[1].name).toBe(secondPlayer.name);
        expect(ranking[1].id).toBe(secondPlayer.id);
        expect(ranking[1].wins).toBe(0);
        expect(ranking[1].loses).toBe(1);
        expect(ranking[1].scoreFor).toBe(9);
        expect(ranking[1].scoreAgainst).toBe(11);
        expect(ranking[1].points).toBe(0);


        //3rd
        expect(ranking[2].name).toBe(thirdPlayer.name);
        expect(ranking[2].id).toBe(thirdPlayer.id);
        expect(ranking[2].wins).toBe(0);
        expect(ranking[2].scoreFor).toBe(0);
        expect(ranking[2].scoreAgainst).toBe(11);
        expect(ranking[2].points).toBe(0);
    });
});

