import {
  FullSimulationResult,
  Options,
  OriginalStats,
  SimulationInput,
  SingleSimulationResult,
} from '../models/simulator.models.js';

async function simulate(
  simulationId: number,
  originalStats: OriginalStats,
  options: Options,
) {
  const startTime = Date.now();

  const { lowestWn8, highestWn8, targetWn8 } = originalStats;
  let { currentWn8, battles } = originalStats;

  const wn8Diff = highestWn8 - lowestWn8;

  let battleDiff = 0;

  let sessionStats = {
    lowestWn8: Infinity,
    highestWn8: 0,
    targetWn8,
    currentWn8: 0,
    battles: 0,
  } as OriginalStats;

  while (currentWn8 < targetWn8 && battleDiff < options.maxSimulatedBattles) {
    const rand = Math.random();
    const battleWn8 = Math.round(rand * wn8Diff + lowestWn8);

    currentWn8 = (currentWn8 * battles + battleWn8) / (battles + 1);

    battleDiff += 1;
    battles += 1;

    sessionStats = {
      ...sessionStats,
      lowestWn8: Math.min(sessionStats.lowestWn8, battleWn8),
      highestWn8: Math.max(sessionStats.highestWn8, battleWn8),
      currentWn8:
        (sessionStats.currentWn8 * (battleDiff - 1) + battleWn8) / battleDiff,
      battles: battleDiff,
    };
  }

  sessionStats = {
    ...sessionStats,
    lowestWn8: Math.round(sessionStats.lowestWn8),
    highestWn8: Math.round(sessionStats.highestWn8),
    currentWn8: Math.round(sessionStats.currentWn8),
    averageWn8: Math.round(sessionStats.lowestWn8),
  };

  return {
    originalStats,
    newStats: {
      lowestWn8,
      highestWn8,
      targetWn8,
      currentWn8,
      battles,
    },
    sessionStats,
    battlesSimulated: battleDiff,
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

export function calculateExpectedAverage(originalStats: OriginalStats) {
  // Formula is x = battles * (targetWn8 - currentWn8) / (newAverageWn8 - targetWn8)
  const { lowestWn8, highestWn8, battles, targetWn8, currentWn8 } =
    originalStats;

  const averageWn8 = (lowestWn8 + highestWn8) / 2;

  return Math.round(
    (battles * (targetWn8 - currentWn8)) / (averageWn8 - targetWn8) + 0.5,
  );
}

function mean(array: number[]) {
  return array.reduce((acc, v) => acc + v, 0) / array.length;
}

export async function handleEvent(event: SimulationInput) {
  const t0 = Date.now();

  const { battles } = event;

  let maxSimulatedBattles = battles * 10;

  if (maxSimulatedBattles < 1000) maxSimulatedBattles = 1000;

  const numSimulations = 1000;

  const options = {
    maxSimulatedBattles,
  } as Options;

  const originalStats = {
    ...event,
  } as OriginalStats;

  const expectedBattlesRequired = calculateExpectedAverage(originalStats);

  let statistics = [{}] as SingleSimulationResult[];
  const errors = [];

  if (expectedBattlesRequired > maxSimulatedBattles) {
    statistics = [
      {
        originalStats,
        newStats: originalStats,
        sessionStats: originalStats,
        battlesSimulated: 0,
        simulationNumber: 0,
        totalTime: 0,
      },
    ];
    errors.push({
      message: 'The number of expected battles is too high to simulate.',
    });
  } else {
    console.log(`Starting a total of ${numSimulations} threads.`);
    statistics = await runThreads(numSimulations, originalStats, options);
    console.log(`Finished waiting on a total of ${numSimulations} threads.`);
  }

  const numDiffBattles = statistics
    .map(stat => stat.battlesSimulated)
    .filter(stat => !!stat);

  const averageBattlesRequired = Math.round(mean(numDiffBattles));

  const maxBattlesRequired = Math.max(...numDiffBattles);

  const minBattlesRequired = Math.min(...numDiffBattles);

  const simTimes = statistics.map(stat => stat.totalTime);

  const averageSimTime = mean(simTimes);

  return {
    totalTime: Date.now() - t0,
    averageSimTime,
    averageBattlesRequired,
    maxBattlesRequired,
    minBattlesRequired,
    originalInformation: originalStats,
    numSimulations,
    expectedBattlesRequired,
    maxAllowedBattles: maxSimulatedBattles,
    statistics,
    errors,
  } as FullSimulationResult;
}

// handle_event({
//     wins: 10260,
//     battles: 20230,
//     average_winrate: 70,
//     target_percentage: 60
// }).then(data => {
//     console.log(data)
// })
