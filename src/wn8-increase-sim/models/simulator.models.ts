export interface SimulationInput {
  battles: number;
  lowestWn8: number;
  averageWn8?: number;
  highestWn8: number;
  targetWn8: number;
  currentWn8: number;
}

export interface OriginalStats extends SimulationInput {}

export interface SimulationError {
  message: string;
}

export interface Options {
  maxSimulatedBattles: number;
}

export interface SingleSimulationResult {
  originalStats: OriginalStats;
  newStats: OriginalStats;
  sessionStats: OriginalStats;
  battlesSimulated: number;
  simulationNumber: number;
  totalTime: number;
}

export interface FullSimulationResult {
  totalTime: number;
  averageSimTime: number;
  mode: OriginalStats;
  averageBattlesRequired: number;
  maxBattlesRequired: number;
  minBattlesRequired: number;
  originalInformation: OriginalStats;
  numSimulations: number;
  maxAllowedBattles: number;
  expectedBattlesRequired: number;
  statistics: SingleSimulationResult[];
  errors: SimulationError[];
}
