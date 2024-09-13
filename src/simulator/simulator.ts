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
  console.log(`Starting sim ${simulationId}`);
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

  console.log(`Ending sim ${simulationId}`);
  return {
    originalStats,
    newStats: {
      wins,
      losses,
      ties: originalStats.ties,
      battles,
    },
    battlesSimulated: battleDiff,
    percent: (percent * 100)?.toFixed(2),
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
    console.log(`Starting thread ${i} of ${numSimulations} threads.`);

    threads.push(simulate(i, originalStats, options));
  }

  return Promise.all(threads);
}

function mean(array: number[]) {
  return array.reduce((acc, v) => acc + v, 0) / array.length;
}

function findMode(newStats: OriginalStats[]) {
  const mp = {} as any;
  let mx = 0;
  let md = newStats[0];
  for (const stat of newStats) {
    const curNum = mp[stat.battles];
    mp[stat.battles] = curNum ? 1 : curNum + 1;
    const updatedNum = mp[stat.battles];
    if (updatedNum > mx) {
      mx = updatedNum;
      md = stat;
    }
  }

  return md;
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

  console.log(`Starting a total of ${numSimulations} threads.`);
  const statistics = await runThreads(numSimulations, originalStats, options);
  console.log(`Finished waiting on a total of ${numSimulations} threads.`);

  const numDiffBattles = statistics
    .map(stat => stat.battlesSimulated)
    .filter(stat => !!stat);

  const averageBattlesRequired = mean(numDiffBattles);

  const maxBattlesRequired = Math.max(...numDiffBattles);

  const minBattlesRequired = Math.min(...numDiffBattles);

  const simTimes = statistics.map(stat => stat.totalTime);

  const averageSimTime = mean(simTimes);

  const averageLosses = mean(statistics.map(stat => stat.newStats.losses));

  const averageWins = mean(statistics.map(stat => stat.newStats.wins));

  const mode = findMode(statistics.map(stat => stat.newStats));

  return {
    totalTime: Date.now() - t0,
    averageSimTime,
    averageLosses,
    averageWins,
    mode,
    newAverageWinrate: mean(
      statistics.map(stat => Number(stat.percent)),
    ).toFixed(2),
    averageBattlesRequired,
    maxBattlesRequired,
    minBattlesRequired,
    originalInformation: originalStats,
    numSimulations,
    maxAllowedBattles: maxSimulatedBattles,
    statistics,
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
