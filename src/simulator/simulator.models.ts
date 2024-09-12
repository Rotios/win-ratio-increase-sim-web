export interface OriginalStats {
    wins: number;
    ties: number;
    losses: number;
    battles: number;
}

export interface Options {
    max_simulated_battles: number,
    average_winrate: number,
    target_percentage: number,
    average_tierate: number
}

export interface SimulationInput {
    wins: number;
    battles: number;
    average_winrate: number;
    target_percentage: number;
}