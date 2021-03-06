export interface Tournament {
    timestamp: number;
    done: boolean;
    id : string;
    participantsIds: string[];
    stakePerPlayer: number;
    splitPercentages: number[];
    stages?: { [round: string]: string[] };
    mode: 'knockout' | 'league';
    shouldEffectRank: boolean;
    shouldEffectElo: boolean;
    winnerName?: string;
    winnerId?: string;
    games?: string[];
}
