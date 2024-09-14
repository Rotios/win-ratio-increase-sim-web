import {
  FullSimulationResult,
  Options,
  OriginalStats,
  SimulationInput,
  SingleSimulationResult,
} from '../models/kd-simulator.models.js';

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

  return {
    originalStats,
    newStats: {
      kills,
      deaths,
      kdRatio: kills / deaths,
    },
    battlesSimulated: numChallenges,
    totalMatches: Math.round(numChallenges / averageKillsPerMatch + 0.5),
    newKDRatio: (kills / deaths).toFixed(5),
    simulationNumber: simulationId,
    totalTime: Date.now() - startTime,
  } as SingleSimulationResult;
}

async function runThreads(
  numSimulations: number,
  originalStats: OriginalStats,
  options: Options,
) {
  const threads = [];
  for (let i = 0; i < numSimulations; i += 1) {
    threads.push(simulate(i, originalStats, options));
  }

  return Promise.all(threads);
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

  console.log(`Expected Matches ${result}`);

  return Math.round(result);
}

function mean(array: number[]) {
  return array.reduce((acc, v) => acc + v, 0) / array.length;
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

  console.log(`Starting a total of ${numSimulations} threads.`);
  const statistics = await runThreads(numSimulations, originalStats, options);
  console.log(`Finished waiting on a total of ${numSimulations} threads.`);

  const numDiffBattles = statistics
    .map(stat => stat.battlesSimulated)
    .filter(stat => !!stat);

  const numMatchesArr = statistics
    .map(stat => stat.totalMatches)
    .filter(stat => !!stat);

  const averageBattlesRequired = Math.round(mean(numDiffBattles));

  const maxBattlesRequired = Math.max(...numDiffBattles);

  const minBattlesRequired = Math.min(...numDiffBattles);

  const averageMatchesRequired = Math.round(mean(numMatchesArr));

  const maxMatchesRequired = Math.max(...numMatchesArr);

  const minMatchesRequired = Math.min(...numMatchesArr);

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
