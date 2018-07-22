import {
    getNewTournamentDocument,
    getPlayersForIds,
    writeGameToDatabase,
    writeTournamentToDatabase
} from '../helper/database';
import {Tournament} from '../types/Tournament';
import {shuffle} from '../helper/array';
import {Player} from '../types/Player';
import {Game} from '../types/Game';
import {createGameDataForPlayers} from '../helper/game';

const robin = require('roundrobin');

export async function createLeagueTournament(tournament: Tournament, stage = '') {
    const players = shuffle(await getPlayersForIds(tournament.participantsIds, stage));


    const tournamentRef = getNewTournamentDocument(stage);
    tournament.id = tournamentRef.id;


    const schedule: Game[] = robin(players.length)
        .reduce((matches: Game[], participantIndices: number[][]) => {
            return [...matches, ...mapPlayerIndicesToGames(participantIndices, players, tournament)];
        }, []);


    tournament.games = await Promise.all(schedule.map(game => writeGameToDatabase(game, stage)));

    return writeTournamentToDatabase(tournamentRef, tournament);
}

export function mapPlayerIndicesToGames(participantIndices: number[][], players: Player[], tournament: Tournament): Game[] {
    return participantIndices.map(pairing => {
        const firstPlayer = players[pairing[0] - 1];
        const secondPlayer = players[pairing[1] - 1];
        return createGameDataForPlayers(firstPlayer, secondPlayer, tournament);
    })
}