import * as admin from 'firebase-admin';
import {Player} from '../types/Player';
import {Game} from '../types/Game';

export function getPlayerById(id: string, stage: string): Promise<Player> {
    return admin
        .firestore()
        .collection(stage + 'players')
        .doc(id)
        .get()
        .then(snapshot => snapshot.data() as Player);
}

export function getPlayersForIds(ids: string[], stage): Promise<Player[]> {
    return Promise.all(ids.map(id => getPlayerById(id, stage)));
}

export function writeGameToDatabase(game: Game, stage: string): Promise<string> {
    return admin
        .firestore()
        .collection(stage + 'games')
        .add(game)
        .then(gameWrite => gameWrite.id);
}

export function updateTournamentWithGameIds(tournamentId: string, gameIds: string[], stage: string) {
    return admin
        .firestore()
        .collection(stage + 'tournaments')
        .doc(tournamentId)
        .update({games: gameIds})
}