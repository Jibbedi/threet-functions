import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Tournament} from './types/Tournament';
import {createKnockoutTournament} from './tournament/create-knockout';
import {createLeagueTournament} from './tournament/create-league';
import {Game} from './types/Game';
import {onGameUpdate} from './games/on-game-update';
import {preMatchInfo} from './games/pre-match-info';
import {moveTo} from './helper/move-to';
import {createUser} from './helper/auth';


admin.initializeApp(functions.config().firebase);


exports.onGameUpdate = functions.firestore
    .document('games/{gamesId}')
    .onUpdate(event => {
        const game = event.after.data() as Game;
        return onGameUpdate(game);
    });

exports.onGameUpdateDev = functions.firestore
    .document('dev_games/{gamesId}')
    .onUpdate(event => {

        const game = event.after.data() as Game;
        return onGameUpdate(game, 'dev_');
    });

exports.createKnockoutTournamentFunction = functions.https.onCall((data: { tournament: Tournament, stage: string }) => {
    return createKnockoutTournament(data.tournament, data.stage);
});

exports.createLeagueTournamentFunction = functions.https.onCall((data: { tournament: Tournament, stage: string }) => {
    return createLeagueTournament(data.tournament, data.stage);
});

exports.preMatchInfo = functions.https.onCall((data, context) => {
    return preMatchInfo(data);
});

exports.moveTo = functions.https.onCall((data, context) => {
    return moveTo(data);
});

exports.createUser = functions.https.onCall((data, context) => {
    return createUser(data.name, data.email, data.password, data.teamId, data.stage);
});