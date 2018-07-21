import {getPlayersForIds, updateTournamentWithGameIds, writeGameToDatabase} from '../helper/database';
import {Tournament} from '../types/Tournament';
import {shuffle} from '../helper/array';
import {Player} from '../types/Player';
import {Game} from '../types/Game';

const robin = require('roundrobin');

export async function createLeagueTournament(tournament: Tournament, stage = '') {
    const players = shuffle(await getPlayersForIds(tournament.participantsIds, stage));

    const schedule: Game[] = robin(players.length)
        .reduce((matches: Game[], participantIndices: number[][]) => {
            return [...matches, ...mapPlayerIndicesToGames(participantIndices, players, tournament)];
        }, []);


    const gameIds = await Promise.all(schedule.map(game => writeGameToDatabase(game, stage)));


    return updateTournamentWithGameIds(tournament.id, gameIds, stage);
}

export function mapPlayerIndicesToGames(participantIndices: number[][], players: Player[], tournament: Tournament): Game[] {
    return participantIndices.map(pairing => {
        const firstPlayer = players[pairing[0] - 1];
        const secondPlayer = players[pairing[1] - 1];
        return createGameDataForPlayers(firstPlayer, secondPlayer, tournament);
    })
}

export function createGameDataForPlayers(firstPlayer: Player, secondPlayer: Player, tournament: Tournament): Game {
    return {
        firstPlayerName: firstPlayer.name,
        firstPlayerId: firstPlayer.id,
        secondPlayerName: secondPlayer.name,
        secondPlayerId: secondPlayer.id,
        firstPlayerScore: 0,
        secondPlayerScore: 0,
        done: false,
        shouldEffectElo: tournament.shouldEffectElo,
        shouldEffectRank: tournament.shouldEffectRank,
        mode: tournament.mode,
        tournamentId: tournament.id,
    };
}