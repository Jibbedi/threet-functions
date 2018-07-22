export interface Game {
    gameId?: string;
    firstPlayerName?: string;
    secondPlayerName?: string;
    firstPlayerId?: string;
    secondPlayerId?: string;
    firstPlayerScore?: number;
    secondPlayerScore?: number;
    done: boolean;
    shouldEffectElo?: boolean;
    shouldEffectRank?: boolean;
    mode?: 'knockout' | 'league';
    tournamentId?: string;
}