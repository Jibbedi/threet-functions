import {
    getNewTournamentDocument,
    getPlayersForIds,
    writeGameToDatabase,
    writeTournamentToDatabase
} from '../helper/database';
import {Tournament} from '../types/Tournament';
import {shuffle} from '../helper/array';
import {createGameDataForPlayers} from '../helper/game';


export async function createKnockoutTournament(tournament: Tournament, stage = '') {

    const players = shuffle(await getPlayersForIds(tournament.participantsIds, stage));


    const tournamentRef = getNewTournamentDocument(stage);
    tournament.id = tournamentRef.id;

    const gameWrites: Promise<string>[] = [];

    for (let i = 0; i < players.length; i += 2) {
        gameWrites.push(
            writeGameToDatabase(
                createGameDataForPlayers(players[i], players[i + 1], tournament), stage)
        );
    }

    tournament.stages = {0: await Promise.all(gameWrites)};

    return writeTournamentToDatabase(tournamentRef, tournament);
}

