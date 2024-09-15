export interface OriginalStats {
  wins: number;
  ties?: number;
  losses: number;
  battles: number;
}

export interface Options {
  maxSimulatedBattles: number;
  averageWinrate: number;
  targetPercentage: number;
  averageTierate: number;
}

export interface SimulationInput {
  wins: number;
  battles: number;
  averageWinrate: number;
  targetPercentage: number;
}

export interface SingleSimulationResult {
  originalStats: OriginalStats;
  newStats: OriginalStats;
  battlesSimulated: number;
  percent: string;
  simulationNumber: number;
  totalTime: number;
}

export interface FullSimulationResult {
  totalTime: number;
  averageSimTime: number;
  averageLosses: number;
  averageWins: number;
  mode: OriginalStats;
  newAverageWinrate: string;
  averageBattlesRequired: number;
  maxBattlesRequired: number;
  minBattlesRequired: number;
  originalInformation: OriginalStats;
  numSimulations: number;
  maxAllowedBattles: number;
  expectedBattlesRequired: number;
  statistics: SingleSimulationResult[];
}
