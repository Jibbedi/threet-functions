import * as admin from 'firebase-admin';
import {getPlayerSnapshotById} from './database';

export async function createUser(name: string, email: string, password: string, teamId: string, stage = '') {
    const userRecord = await admin
        .auth()
        .createUser({
            email,
            password
        });

    const userSnapshot = await getPlayerSnapshotById(userRecord.uid, stage);

    return userSnapshot.ref.set({
        name,
        email,
        teamId,
        id : userRecord.uid
    });
}