import {Game} from '../types/Game';
import * as handleMatchUpdate from './handle-match-update';
import * as handleKnockoutMatchUpdate from '../tournament/knockout-match-update';
import * as leagueMatchUpdate from '../tournament/league-match-update';

export async function onGameUpdate(game: Game, stage = '') {
    if (!game.done) {
        return true;
    }

    await handleMatchUpdate.handleMatchUpdate(game, stage);


    if (game.mode === 'knockout') {
        await handleKnockoutMatchUpdate.handleKnockoutMatchUpdate(game, stage);
    } else if (game.mode === 'league') {
        await leagueMatchUpdate.handleLeagueMatchUpdate(game, stage);
    }


    return true;

};