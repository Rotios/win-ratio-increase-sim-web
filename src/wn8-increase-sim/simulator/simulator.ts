import {
  FullSimulationResult,
  Options,
  OriginalStats,
  SimulationInput,
  SingleSimulationResult,
} from '../models/simulator.models.js';
import {
  aggregateBattleCounts,
  mean,
  runSimulations,
} from '../../shared/simulation-utils.js';

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
    averageWn8: Math.round(sessionStats.currentWn8),
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

export function calculateExpectedAverage(originalStats: OriginalStats) {
  // Formula is x = battles * (targetWn8 - currentWn8) / (newAverageWn8 - targetWn8)
  const { lowestWn8, highestWn8, battles, targetWn8, currentWn8 } =
    originalStats;

  const averageWn8 = (lowestWn8 + highestWn8) / 2;

  return Math.round(
    (battles * (targetWn8 - currentWn8)) / (averageWn8 - targetWn8) + 0.5,
  );
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
    statistics = await runSimulations(numSimulations, id =>
      simulate(id, originalStats, options),
    );
  }

  const { averageBattlesRequired, maxBattlesRequired, minBattlesRequired } =
    aggregateBattleCounts(statistics.map(stat => stat.battlesSimulated));

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
