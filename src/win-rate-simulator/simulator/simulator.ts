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

  let { wins, losses, battles } = originalStats;

  let battleDiff = 0;

  let percent = wins / battles;

  while (
    percent < options.targetPercentage / 100 &&
    battleDiff < options.maxSimulatedBattles
  ) {
    battleDiff += 1;
    battles += 1;
    const rand = Math.random();
    if (rand <= options.averageWinrate / 100) wins += 1;
    else losses += 1;

    percent = wins / battles;
  }

  return {
    originalStats,
    newStats: {
      wins,
      losses,
      ties: originalStats.ties,
      battles,
    },
    sessionStats: {
      wins: wins - originalStats.wins,
      losses: losses - originalStats.losses,
      battles: battleDiff,
    },
    battlesSimulated: battleDiff,
    percent: (percent * 100)?.toFixed(2),
    simulationNumber: simulationId,
    totalTime: Date.now() - startTime,
  } as SingleSimulationResult;
}

function calculateExpectedAverage(
  originalStats: OriginalStats,
  options: Options,
) {
  const { wins, losses } = originalStats;

  const { averageWinrate, targetPercentage } = options;

  const averageWinLossRatio = averageWinrate / (100 - averageWinrate);
  const targetWinLossRatio = targetPercentage / (100 - targetPercentage);

  let winsRequired = targetWinLossRatio * losses - wins;
  winsRequired /= averageWinLossRatio - targetWinLossRatio;
  winsRequired *= averageWinLossRatio;

  const totalBattles = Math.round(winsRequired / (averageWinrate / 100) + 0.5);

  return Math.round(totalBattles);
}

export async function handleEvent(event: SimulationInput) {
  const t0 = Date.now();

  const { wins, battles, averageWinrate, targetPercentage } = event;

  let maxSimulatedBattles = battles * battles;

  if (maxSimulatedBattles < 1000) maxSimulatedBattles = 1000;

  const numSimulations = 1000;

  const losses = battles - wins;

  const options = {
    maxSimulatedBattles,
    averageWinrate,
    targetPercentage,
    averageTierate: 0,
  } as Options;

  const originalStats = {
    wins,
    losses,
    ties: 0,
    battles,
  } as OriginalStats;

  const statistics = await runSimulations(numSimulations, id =>
    simulate(id, originalStats, options),
  );

  const { averageBattlesRequired, maxBattlesRequired, minBattlesRequired } =
    aggregateBattleCounts(statistics.map(stat => stat.battlesSimulated));

  const simTimes = statistics.map(stat => stat.totalTime);

  const averageSimTime = mean(simTimes);

  const averageLosses = Math.round(
    mean(statistics.map(stat => stat.sessionStats.losses)),
  );

  const averageWins = Math.round(
    mean(statistics.map(stat => stat.sessionStats.wins)),
  );

  const expectedBattlesRequired = calculateExpectedAverage(
    originalStats,
    options,
  );

  return {
    totalTime: Date.now() - t0,
    averageSimTime,
    averageLosses,
    averageWins,
    newAverageWinrate: mean(
      statistics.map(stat => Number(stat.percent)),
    ).toFixed(2),
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
