import {createLeagueTournament, mapPlayerIndicesToGames} from '../tournament/create-league';
import * as database from '../helper/database';
import {Tournament} from '../types/Tournament';
import {Game} from '../types/Game';

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

database.updateTournamentWithGameIds = jest.fn().mockImplementation((tournamentId: string, gameIds: string[]) => Promise.resolve(
    {
        gameIds,
        id: tournamentId
    }
));


describe('create tournament', () => {

    test('it should call create games 6 times for four players games and update database', async () => {

        const tournament = {
            id: 'test',
            participantsIds: [1, 2, 3, 4]
        } as any as Tournament;

        await createLeagueTournament(tournament, 'dev_');

        expect(database.writeGameToDatabase).toHaveBeenCalledTimes(6);
        expect(database.updateTournamentWithGameIds).toHaveBeenCalled();

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