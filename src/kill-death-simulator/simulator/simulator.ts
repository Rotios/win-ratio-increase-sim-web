import {
  FullSimulationResult,
  Options,
  OriginalStats,
  SimulationInput,
  SingleSimulationResult,
} from '../models/kd-simulator.models.js';
import {
  aggregateBattleCounts,
  mean,
  runSimulations,
} from '../../shared/simulation-utils.js';

function convertKDRatioToPercent(ratio: number) {
  // ratio = kills/deaths
  const kills = ratio * 100000;
  const deaths = kills / ratio;

  return kills / (deaths + kills);
}

function calculateExpectedChallenges(
  averageKillsPerMatch: number,
  ratio: number,
) {
  // Based on ratio = kills / losses so losses = kills / ratio
  return Math.round(averageKillsPerMatch / ratio) + averageKillsPerMatch;
}

async function simulate(
  simulationId: number,
  originalStats: OriginalStats,
  options: Options,
) {
  const startTime = Date.now();

  let { kills, deaths, kdRatio } = originalStats;

  const { averageKillsPerMatch } = originalStats;

  let numChallenges = 0;
  const percentChallengesWon = convertKDRatioToPercent(options.averageKDRatio);

  const totalChallenges = calculateExpectedChallenges(
    averageKillsPerMatch,
    options.averageKDRatio,
  );

  while (
    kdRatio < options.targetKDRatio &&
    numChallenges < options.maxSimulatedBattles * totalChallenges
  ) {
    numChallenges += 1;
    const rand = Math.random();
    if (rand <= percentChallengesWon) kills += 1;
    else deaths += 1;

    kdRatio = kills / deaths;
  }

  const simulationKills = kills - originalStats.kills;
  const simulationDeaths = deaths - originalStats.deaths;
  const simulationMatches = Math.round(
    simulationKills / averageKillsPerMatch + 0.5,
  );
  const totalMatches = Math.round(kills / averageKillsPerMatch + 0.5);

  return {
    originalStats,
    newStats: {
      kills,
      deaths,
      kdRatio: kills / deaths,
      averageKillsPerMatch: kills / totalMatches,
    },
    sessionStats: {
      kills: simulationKills,
      deaths: simulationDeaths,
      kdRatio: simulationKills / simulationDeaths,
      matches: simulationMatches,
      averageKillsPerMatch: simulationKills / simulationMatches,
    },
    battlesSimulated: numChallenges,
    totalMatches,
    newKDRatio: (kills / deaths).toFixed(5),
    simulationNumber: simulationId,
    totalTime: Date.now() - startTime,
  } as SingleSimulationResult;
}

function calculateExpectedAverage(
  originalStats: OriginalStats,
  options: Options,
) {
  const { kills, deaths } = originalStats;
  const { averageKDRatio, targetKDRatio } = options;

  let result = targetKDRatio * deaths - kills;
  result /= averageKDRatio - targetKDRatio;
  result *= averageKDRatio;

  return Math.round(result);
}

export async function handleEvent(event: SimulationInput) {
  const t0 = Date.now();

  const { kills, deaths, averageKDRatio, targetKDRatio, averageKillsPerMatch } =
    event;

  const maxSimulatedBattles = 100000;

  const numSimulations = 1000;

  const options = {
    maxSimulatedBattles,
    targetKDRatio,
    averageKDRatio,
  } as Options;

  const originalStats = {
    kills,
    deaths,
    kdRatio: kills / deaths,
    averageKillsPerMatch,
  } as OriginalStats;

  const statistics = await runSimulations(numSimulations, id =>
    simulate(id, originalStats, options),
  );

  const numMatchesArr = statistics
    .map(stat => stat.sessionStats.matches)
    .filter(matches => matches !== undefined);

  const { averageBattlesRequired, maxBattlesRequired, minBattlesRequired } =
    aggregateBattleCounts(statistics.map(stat => stat.battlesSimulated));

  const {
    averageBattlesRequired: averageMatchesRequired,
    maxBattlesRequired: maxMatchesRequired,
    minBattlesRequired: minMatchesRequired,
  } = aggregateBattleCounts(numMatchesArr);

  const simTimes = statistics.map(stat => stat.totalTime);

  const averageSimTime = mean(simTimes);

  const averageDeaths = Math.round(
    mean(statistics.map(stat => stat.newStats.deaths)),
  );

  const averageKills = Math.round(
    mean(statistics.map(stat => stat.newStats.kills)),
  );

  const expectedBattlesRequired = calculateExpectedAverage(
    originalStats,
    options,
  );

  return {
    totalTime: Date.now() - t0,
    averageSimTime,
    averageDeaths,
    averageKills,
    averageMatchesRequired,
    minMatchesRequired,
    maxMatchesRequired,
    newAverageKDRatio: mean(
      statistics.map(stat => Number(stat.newKDRatio)),
    ).toFixed(5),
    averageBattlesRequired,
    maxBattlesRequired,
    minBattlesRequired,
    originalInformation: originalStats,
    numSimulations,
    expectedBattlesRequired,
    maxAllowedBattles: maxSimulatedBattles,
    statistics,
  } as FullSimulationResult;
}
