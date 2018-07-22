import * as admin from 'firebase-admin';
import {Player} from '../types/Player';
import {Game} from '../types/Game';
import {GAME_COLLECTION, PLAYER_COLLECTION, TOURNAMENT_COLLECTION} from '../constants/collections';
import {Tournament} from '../types/Tournament';


export function getPlayerById(id: string, stage: string): Promise<Player> {
    return admin
        .firestore()
        .collection(stage + PLAYER_COLLECTION)
        .doc(id)
        .get()
        .then(snapshot => snapshot.data() as Player);
}

export function getPlayersForIds(ids: string[], stage): Promise<Player[]> {
    return Promise.all(ids.map(id => getPlayerById(id, stage)));
}

export function getNewTournamentDocument(stage: string) {
    return admin
        .firestore()
        .collection(stage + TOURNAMENT_COLLECTION)
        .doc()
}

export function writeTournamentToDatabase(tournamentRef, tournamentData: Tournament): Promise<string> {
    return tournamentRef
        .set(tournamentData)
        .then(tournamentWrite => tournamentWrite.id);
}

export function writeGameToDatabase(game: Game, stage: string): Promise<string> {
    return admin
        .firestore()
        .collection(stage + GAME_COLLECTION)
        .add(game)
        .then(gameWrite => gameWrite.id);
}