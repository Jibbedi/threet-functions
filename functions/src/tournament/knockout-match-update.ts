import {Game} from '../types/Game';
import {
    getGameSnapshotById,
    getPlayerSnapshotsForIds,
    getTournamentSnapshotForId,
    updateGameSnapshot,
    updatePlayerSnapshot,
    updateTournamentSnapshot,
    writeGameToDatabase
} from '../helper/database';
import {Tournament} from '../types/Tournament';
import {createGameDataForPlayers, getWinnerId, getWinnerName} from '../helper/game';
import {Player} from '../types/Player';

export async function handleKnockoutMatchUpdate(game: Game, stage = '') {

    const tournamentSnapshot = await getTournamentSnapshotForId(game.tournamentId, stage);
    const tournamentData = tournamentSnapshot.data() as Tournament;


    // Game winner
    const winnerId = getWinnerId(game);
    const winnerName = getWinnerName(game);


    // if game was final, tournament is finished
    if (isTournamentFinished(tournamentData, game)) {

        const playerSnapshots = await getPlayerSnapshotsForIds(tournamentData.participantsIds, stage);

        // Update Players Elo + Stats
        const playerUpdates = playerSnapshots.map(snapshot => {
            const player = snapshot.data() as Player;

            return updatePlayerSnapshot(snapshot, {
                eloRank: calculateNewEloForPlayer(player, game, tournamentData),
                tournamentWins: calculateNewTournamentWins(player, game)
            })
        });


        // Update Tournament Data
        const tournamentUpdate = updateTournamentSnapshot(tournamentSnapshot, {
            done: true,
            winnerId: getWinnerId(game),
            winnerName: getWinnerName(game)
        });


        return Promise.all([playerUpdates, tournamentUpdate]);
    }


    // tournament not finished

    const nextRound = getNextRound(tournamentData, game);
    const nextRoundGameData = getNextRoundGameIndex(tournamentData, game);

    const nextRoundGameId = nextRound[nextRoundGameData.gameIndex];


    const winningPlayerCurrentMatch = {id: winnerId, name: winnerName} as Player;

    // check if winning player is first or second player in next round
    const nextMatchFirstPlayer = nextRoundGameData.winningPlayerIsFirstPlayerInNextMatch ? winningPlayerCurrentMatch : null;
    const nextMatchSecondPlayer = !nextRoundGameData.winningPlayerIsFirstPlayerInNextMatch ? winningPlayerCurrentMatch : null;

    // create game if game is not already present for next round
    if (!nextRoundGameId) {
        const newGameId = await writeGameToDatabase(
            createGameDataForPlayers(nextMatchFirstPlayer, nextMatchSecondPlayer, tournamentData), stage
        );

        nextRound[nextRoundGameId] = newGameId;

        return updateTournamentSnapshot(tournamentSnapshot, {
            stages : tournamentData.stages
        })
    }



    // update game with winning player, if game is already present

    const nextGameSnapshot = await getGameSnapshotById(nextRoundGameId, stage);
    let updateData : Partial<Game>;

    // check if winning player is first player in next round
    if (nextMatchFirstPlayer) {
        updateData = {
            firstPlayerName : nextMatchFirstPlayer.name,
            firstPlayerId : nextMatchFirstPlayer.id
        }
    } else {
        updateData = {
            secondPlayerName : nextMatchSecondPlayer.name,
            secondPlayerId : nextMatchFirstPlayer.id
        }
    }

    return updateGameSnapshot(nextGameSnapshot, updateData);
}


export function getNextRoundGameIndex(tournament: Tournament, game: Game): { gameIndex: number, winningPlayerIsFirstPlayerInNextMatch: boolean } {
    const currentRound = getRoundForGame(tournament, game);
    const currentGameIndex = currentRound.indexOf(game.gameId);
    return {gameIndex: Math.floor(currentGameIndex / 2), winningPlayerIsFirstPlayerInNextMatch: currentGameIndex % 2 === 0};
}

export function getNextRound(tournament: Tournament, game: Game) {
    const roundIndexForGame = getRoundIndexForGame(tournament, game);

    // Create next round, if not present
    if (!tournament.stages[roundIndexForGame + 1]) {
        tournament.stages[roundIndexForGame + 1] = [];
    }

    return tournament.stages[roundIndexForGame + 1];
}

export function getSortedStages(tournament: Tournament) {
    return Object.keys(tournament.stages)
        .map(key => parseInt(key, 10))
        .sort((a, b) => a - b)
        .map(key => tournament.stages[key]);
}

export function getRoundForGame(tournament: Tournament, game: Game) {
    return getSortedStages(tournament)
        .find(sortedStage => sortedStage.indexOf(game.gameId) >= 0);
}

export function getRoundIndexForGame(tournament: Tournament, game: Game) {
    return getSortedStages(tournament).indexOf(getRoundForGame(tournament, game));

}

export function isTournamentFinished(tournament: Tournament, game: Game) {
    const totalRoundsInTournament = Math.log2(tournament.participantsIds.length);
    return totalRoundsInTournament === (getRoundIndexForGame(tournament, game) + 1) && game.done;
}

export function calculateNewEloForPlayer(player: Player, game : Game, tournament: Tournament) {
    return getWinnerId(game) === player.id ?
        player.eloRank + (tournament.stakePerPlayer * tournament.participantsIds.length - 1) :
        player.eloRank - tournament.stakePerPlayer;
}

export function calculateNewTournamentWins(player: Player, game : Game) {
    return getWinnerId(game) === player.id ?
        (player.tournamentWins || 0) + 1 :
        (player.tournamentWins || 0)
}