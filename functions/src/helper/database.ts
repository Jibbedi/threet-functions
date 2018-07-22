import * as admin from 'firebase-admin';
import {Player} from '../types/Player';
import {Game} from '../types/Game';
import {GAME_COLLECTION, PLAYER_COLLECTION, TOURNAMENT_COLLECTION} from '../constants/collections';
import {Tournament} from '../types/Tournament';


export function getPlayerSnapshotById(id: string, stage: string) {
    return admin
        .firestore()
        .collection(stage + PLAYER_COLLECTION)
        .doc(id)
        .get()
}

export function getPlayerSnapshotsForIds(ids: string[], stage) {
    return Promise.all(ids.map(id => getPlayerSnapshotById(id, stage)));
}

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

export function getTournamentSnapshotForId(id: string, stage: string) {
    return admin
        .firestore()
        .collection(stage + TOURNAMENT_COLLECTION)
        .doc(id)
        .get();
}


export function updateGameSnapshot(snapshot, updateData: Partial<Game>) {
    return snapshot
        .ref
        .update(updateData)
}

export function getGameSnapshotById(id: string, stage: string) {
    return admin
        .firestore()
        .collection(stage + GAME_COLLECTION)
        .doc(id)
        .get()
}

export function getGameById(id: string, stage: string): Promise<Game> {
    return admin
        .firestore()
        .collection(stage + GAME_COLLECTION)
        .doc(id)
        .get()
        .then(snapshot => snapshot.data() as Game);
}

export function getGamesForIds(ids: string[], stage): Promise<Game[]> {
    return Promise.all(ids.map(id => getGameById(id, stage)));
}

export function updatePlayerSnapshot(snapshot, updateData: Partial<Player>) {
    return snapshot
        .ref
        .update(updateData)
}

export function updateTournamentSnapshot(snapshot, updateData: Partial<Tournament>) {
    return snapshot
        .ref
        .update(updateData)
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