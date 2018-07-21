import {Game} from '../types/Game';
import {getFirstPlayerWon} from './game.helpers';
import {RankingItem} from '../types/RankingItem';

export function getRanking(games: Game[]): RankingItem[] {

    const ranking = games.reduce((table, game) => {

        const {firstPlayerName, secondPlayerName, firstPlayerId, secondPlayerId} = game;


        if (!table[firstPlayerName]) {
            table[firstPlayerName] = initializePlayer(firstPlayerName, firstPlayerId);
        }

        if (!table[secondPlayerName]) {
            table[secondPlayerName] = initializePlayer(secondPlayerName, secondPlayerId);
        }

        if (game.done) {
            table[firstPlayerName] = updatePlayerStats(table[firstPlayerName], getFirstPlayerWon(game), game.firstPlayerScore, game.secondPlayerScore);
            table[secondPlayerName] = updatePlayerStats(table[secondPlayerName], !getFirstPlayerWon(game), game.secondPlayerScore, game.firstPlayerScore);
        }

        return table;

    }, {});

    return Object.keys(ranking)
        .map(playerKey => ranking[playerKey])
        .sort((a: any, b: any) => b.points !== a.points ? b.points - a.points : (b.scoreFor - b.scoreAgainst) - (a.scoreFor - a.scoreAgainst));
}

function initializePlayer(playerName: string, id): RankingItem {
    return {name: playerName, id, wins: 0, loses: 0, scoreFor: 0, scoreAgainst: 0, points: 0};
}

function updatePlayerStats(rankingItem: RankingItem, won, scoreFor, scoreAgainst): RankingItem {
    rankingItem.wins += won ? 1 : 0;
    rankingItem.loses += !won ? 1 : 0;
    rankingItem.scoreFor += (scoreFor || 0);
    rankingItem.scoreAgainst += (scoreAgainst || 0);
    rankingItem.points = rankingItem.wins * 2;

    return rankingItem;
}