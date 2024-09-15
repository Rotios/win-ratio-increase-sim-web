export interface OriginalStats {
  kills: number;
  deaths: number;
  kdRatio: number;
  averageKillsPerMatch: number;
  matches? : number;
}

export interface Options {
  maxSimulatedBattles: number;
  targetKDRatio: number;
  averageKDRatio: number;
}

export interface SimulationInput {
  kills: number;
  deaths: number;
  targetKDRatio: number;
  averageKDRatio: number;
  averageKillsPerMatch: number;
}

export interface SingleSimulationResult {
  originalStats: OriginalStats;
  newStats: OriginalStats;
  sessionStats: OriginalStats;
  battlesSimulated: number;
  newKDRatio: string;
  simulationNumber: number;
  totalTime: number;
  totalMatches: number;
}

export interface FullSimulationResult {
  totalTime: number;
  averageSimTime: number;
  averageKills: number;
  averageDeaths: number;
  newAverageKDRatio: string;
  averageBattlesRequired: number;
  maxBattlesRequired: number;
  minBattlesRequired: number;
  averageMatchesRequired: number;
  maxMatchesRequired: number;
  minMatchesRequired: number;
  originalInformation: OriginalStats;
  numSimulations: number;
  maxAllowedBattles: number;
  expectedBattlesRequired: number;
  statistics: SingleSimulationResult[];
}
