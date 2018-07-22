import {createLeagueTournament, mapPlayerIndicesToGames} from '../tournament/create-league';
import * as database from '../helper/database';
import {Tournament} from '../types/Tournament';
import {Game} from '../types/Game';


const MOCK_TOURNAMENT_ID = 1;
const MOCK_TOURNAMENT_REF = {id: MOCK_TOURNAMENT_ID};

database.getPlayersForIds = jest.fn().mockImplementation((ids) =>
    Promise.all(ids.map(id => {
        return Promise.resolve({
            name: 'Mock Player ' + id,
            id: id
        });
    })));


database.writeGameToDatabase = jest.fn().mockImplementation((game: Game) => Promise.resolve(
    game.firstPlayerName + ' vs ' + game.secondPlayerName
));

database.writeTournamentToDatabase = jest.fn().mockImplementation((tournament: Tournament) => Promise.resolve(
    MOCK_TOURNAMENT_ID
));

database.getNewTournamentDocument = jest.fn().mockImplementation((tournament: Tournament) => {
        return MOCK_TOURNAMENT_REF;
    }
);

describe('create tournament', () => {

    test('it should call create games 6 times for four players and create tournament', async () => {

        const tournament = {
            participantsIds: [1, 2, 3, 4]
        } as any as Tournament;

        const tournamentId = await createLeagueTournament(tournament, 'dev_');

        expect(database.writeGameToDatabase).toHaveBeenCalledTimes(6);
        expect(database.getNewTournamentDocument).toHaveBeenCalledWith('dev_');
        expect(database.writeTournamentToDatabase).toHaveBeenCalledWith(MOCK_TOURNAMENT_REF, tournament);
        expect(tournament.id).toBe(tournamentId);
        expect(tournament.games).toBeTruthy();

    });

});


describe('create gameplan', () => {
    test('it should map indices to games', () => {
        const tournament = {
            tournamentId: 1
        } as any;

        const players = [
            {
                name: 'First Player',
                id: 1
            },
            {
                name: 'Second Player',
                id: 2
            },
            {
                name: 'Third Player',
                id: 3
            },
            {
                name: 'Fourth Player',
                id: 4
            }] as any;

        const matchIndices = [[1, 2], [3, 4]];

        const games = mapPlayerIndicesToGames(matchIndices, players, tournament);

        expect(games[0].firstPlayerName).toEqual(players[0].name);
        expect(games[0].secondPlayerName).toEqual(players[1].name);
        expect(games[1].firstPlayerName).toEqual(players[2].name);
        expect(games[1].secondPlayerName).toEqual(players[3].name);

    })
});