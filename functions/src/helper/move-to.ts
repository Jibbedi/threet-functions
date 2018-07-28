import * as admin from 'firebase-admin';

export function moveTo(stage : string) {
    const collections = ['games', 'players', 'tournaments'];

    return Promise.all(
        collections.map(collectionName => admin
            .firestore()
            .collection(collectionName)
            .get()
        )
    ).then((collectionSnapshots) => {
        const writes = [];

        collectionSnapshots.forEach((collectionSnapshot, index) => {
            collectionSnapshot.forEach(doc => {
                writes.push(admin.firestore().collection(stage + '_' + collections[index]).doc(doc.id).set(doc.data()));
            });
        });

        return Promise.all(writes);
    })
        .then(writes => {
            return {status: 200};
        });
}