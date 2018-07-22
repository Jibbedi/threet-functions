import * as database from '../helper/database';
import {Tournament} from '../types/Tournament';
import {Game} from '../types/Game';
import {createKnockoutTournament} from '../tournament/create-knockout';


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

    test('it should call create games 2 times for four players and create tournament', async () => {

        const tournament = {
            participantsIds: [1, 2, 3, 4]
        } as any as Tournament;

        const tournamentId = await createKnockoutTournament(tournament, 'dev_');

        expect(database.writeGameToDatabase).toHaveBeenCalledTimes(2);
        expect(database.getNewTournamentDocument).toHaveBeenCalledWith('dev_');
        expect(database.writeTournamentToDatabase).toHaveBeenLastCalledWith(MOCK_TOURNAMENT_REF, tournament);
        expect(tournament.id).toBe(tournamentId);
        expect(tournament.stages).toBeTruthy();

    });

});