import {
    areAllGamesDone,
    calculateNewEloForPlayer,
    calculateNewLeagueWinsForPlayer
} from '../tournament/league-match-update';
import {Game} from '../types/Game';

describe('all games done', () => {

    test('it should return true if all games are done', async () => {
        const games = [{done: true}, {done: true}] as Game[];
        expect(areAllGamesDone(games)).toBe(true);
    });

    test('it should return false if at least one game is not done', async () => {
        const games = [{done: true}, {done: false}] as Game[];
        expect(areAllGamesDone(games)).toBe(false);
    });

});

describe('new elo points', () => {
    test('it should return correct new elo points', () => {
        const tournament = {
            participantsIds: [1, 2, 3, 4],
            stakePerPlayer: 10, //total of 40
            splitPercentages: [50, 30, 20] // 20 - 12 - 8
        };

        const ranking = [{id: 1}, {id: 3}, {id: 2}, {id: 4}];

        const players = [{id: 1, eloRank: 1000}, {id: 2, eloRank: 900}, {id: 3, eloRank: 1200}, {id: 4, eloRank: 1000}];

        // 1000 + 20 won elo - 10 stake = 1010
        expect(calculateNewEloForPlayer(players[0], ranking, tournament)).toBe(1010);

        // 900 + 8 won elo - 10 stake = 898
        expect(calculateNewEloForPlayer(players[1], ranking, tournament)).toBe(898);

        // 1200 + 12 won elo - 10 stake = 1202
        expect(calculateNewEloForPlayer(players[2], ranking, tournament)).toBe(1202);

        // 1000 + 0 won elo - 10 stake = 990
        expect(calculateNewEloForPlayer(players[3], ranking, tournament)).toBe(990);
    });

    test('it should return correct new elo points if winner gets 90 % and loser gets consolation prize ', () => {
        const tournament = {
            participantsIds: [1, 2, 3, 4],
            stakePerPlayer: 20, //total of 80
            splitPercentages: [90, 0, 0, 10] // 72 - 0 - 0 - 8
        };

        const ranking = [{id: 1}, {id: 3}, {id: 2}, {id: 4}];

        const players = [{id: 1, eloRank: 1000}, {id: 2, eloRank: 900}, {id: 3, eloRank: 1200}, {id: 4, eloRank: 1000}];

        // 1000 + 72 won elo - 20 stake = 1052
        expect(calculateNewEloForPlayer(players[0], ranking, tournament)).toBe(1052);

        // 900 + 0 won elo - 20 stake = 880
        expect(calculateNewEloForPlayer(players[1], ranking, tournament)).toBe(880);

        // 1200 + 0 won elo - 20 stake = 1180
        expect(calculateNewEloForPlayer(players[2], ranking, tournament)).toBe(1180);

        // 1000 + 8 won elo - 20 stake = 988
        expect(calculateNewEloForPlayer(players[3], ranking, tournament)).toBe(988);
    });

    test('it should return correct new elo points if winner gets all and rest is not assigned', () => {
        const tournament = {
            participantsIds: [1, 2, 3, 4],
            stakePerPlayer: 20, //total of 80
            splitPercentages: [100] // 80
        };

        const ranking = [{id: 1}, {id: 3}, {id: 2}, {id: 4}];

        const players = [{id: 1, eloRank: 1000}, {id: 2, eloRank: 900}, {id: 3, eloRank: 1200}, {id: 4, eloRank: 1000}];

        // 1000 + 72 won elo - 20 stake = 1060
        expect(calculateNewEloForPlayer(players[0], ranking, tournament)).toBe(1060);

        // 900 + 0 won elo - 20 stake = 880
        expect(calculateNewEloForPlayer(players[1], ranking, tournament)).toBe(880);

        // 1200 + 0 won elo - 20 stake = 1180
        expect(calculateNewEloForPlayer(players[2], ranking, tournament)).toBe(1180);

        // 1000 + 0 won elo - 20 stake = 980
        expect(calculateNewEloForPlayer(players[3], ranking, tournament)).toBe(980);
    })
});

describe('calculate league wins', () => {

    test('it should add one to league wins if league wins are present and league is won', async () => {
        const tournament = {
            participantsIds: [1, 2, 3, 4],
            stakePerPlayer: 20, //total of 80
            splitPercentages: [100] // 80
        };

        const ranking = [{id: 1}, {id: 3}, {id: 2}, {id: 4}];

        const players = [{id: 1, eloRank: 1000, leagueWins: 1}, {id: 2, eloRank: 900}, {id: 3, eloRank: 1200}, {
            id: 4,
            eloRank: 1000
        }];

        expect(calculateNewLeagueWinsForPlayer(players[0], ranking)).toBe(2);

    });

    test('it should return 1 for league wins if league wins are undefined and league is won', async () => {
        const tournament = {
            participantsIds: [1, 2, 3, 4],
            stakePerPlayer: 20, //total of 80
            splitPercentages: [100] // 80
        };

        const ranking = [{id: 1}, {id: 3}, {id: 2}, {id: 4}];

        const players = [{id: 1, eloRank: 1000}, {id: 2, eloRank: 900}, {id: 3, eloRank: 1200}, {
            id: 4,
            eloRank: 1000
        }];

        expect(calculateNewLeagueWinsForPlayer(players[0], ranking)).toBe(1);

    });

    test('it should return 0 for league wins if league wins are undefined and league is not won', async () => {
        const tournament = {
            participantsIds: [1, 2, 3, 4],
            stakePerPlayer: 20, //total of 80
            splitPercentages: [100] // 80
        };

        const ranking = [{id: 1}, {id: 3}, {id: 2}, {id: 4}];

        const players = [{id: 1, eloRank: 1000}, {id: 2, eloRank: 900}, {id: 3, eloRank: 1200}, {
            id: 4,
            eloRank: 1000
        }];

        expect(calculateNewLeagueWinsForPlayer(players[1], ranking)).toBe(0);

    });

    test('it should return old league wins if league wins are present and league is not won', async () => {
        const tournament = {
            participantsIds: [1, 2, 3, 4],
            stakePerPlayer: 20, //total of 80
            splitPercentages: [100] // 80
        };

        const ranking = [{id: 1}, {id: 3}, {id: 2}, {id: 4}];

        const players = [{id: 1, eloRank: 1000}, {id: 2, eloRank: 900, leagueWins: 2}, {id: 3, eloRank: 1200}, {
            id: 4,
            eloRank: 1000
        }];

        expect(calculateNewLeagueWinsForPlayer(players[1], ranking)).toBe(2);

    });

});