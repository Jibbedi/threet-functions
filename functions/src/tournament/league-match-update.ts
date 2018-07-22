import {Game} from '../types/Game';
import {
    getGamesForIds,
    getPlayerSnapshotsForIds,
    getTournamentSnapshotForId,
    updatePlayerSnapshot,
    updateTournamentSnapshot
} from '../helper/database';
import {Tournament} from '../types/Tournament';
import {getRanking} from '../helper/ranking';
import {Player} from '../types/Player';
import {RankingItem} from '../types/RankingItem';

async function handleLeagueMatchUpdate(game: Game, stage: string) {

    const tournamentSnapshot = await getTournamentSnapshotForId(game.tournamentId, stage);
    const tournamentData: Tournament = tournamentSnapshot.data() as Tournament;

    const matches = await getGamesForIds(tournamentData.games, stage);


    if (!areAllGamesDone(matches)) {
        console.log('tournament not done');
        return true;
    }

    console.log('tounament done');


    const ranking = getRanking(matches);

    const playerSnapshots = await getPlayerSnapshotsForIds(tournamentData.participantsIds, stage);


    // Update Players Elo + Stats
    const playerUpdates = playerSnapshots.map(snapshot => {
        const player = snapshot.data() as Player;

        return updatePlayerSnapshot(snapshot, {
            eloRank: calculateNewEloForPlayer(player, ranking, tournamentData),
            leagueWins: calculateNewLeagueWinsForPlayer(player, ranking)
        })
    });

    // Update Tournament Data
    const tournamentUpdate = updateTournamentSnapshot(tournamentSnapshot, {
        done: true,
        winnerId: ranking[0].id,
        winnerName: ranking[0].name
    });


    return await Promise.all([...playerUpdates, tournamentUpdate]);

}


export function areAllGamesDone(games: Game[]) {
    return !games.some(match => !match.done);
}

export function getWonEloPerPlace(tournament: Tournament): number[] {
    const totalPot = tournament.participantsIds.length * tournament.stakePerPlayer;
    return tournament.splitPercentages.map(percentage => Math.round(percentage / 100 * totalPot));
}

export function getWonEloForPlace(tournament: Tournament, place: number) {
    return getWonEloPerPlace(tournament)[place] || 0;
}

export function getPlaceForPlayer(player: Player, ranking: RankingItem[]) {
    return ranking.findIndex(r => r.id === player.id);
}

export function calculateNewEloForPlayer(player: Player, ranking: RankingItem[], tournament: Tournament) {
    const wonElo = getWonEloForPlace(tournament, getPlaceForPlayer(player, ranking));
    return player.eloRank + wonElo - tournament.stakePerPlayer;
}

export function calculateNewLeagueWinsForPlayer(player: Player, ranking: RankingItem[]) {
    return playerIsTournamentWinner(player, ranking) ? (player.leagueWins || 0) + 1 : (player.leagueWins || 0);
}

export function playerIsTournamentWinner(player: Player, ranking: RankingItem[]) {
    return getPlaceForPlayer(player, ranking) === 0;
}