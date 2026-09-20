export function mean(array: number[]): number {
  return array.reduce((acc, v) => acc + v, 0) / array.length;
}

/**
 * Fans a simulation out across `numSimulations` runs. Each run executes as an
 * async microtask on the main thread rather than a real worker thread, so
 * this doesn't parallelize CPU-bound work — it only lets the calls interleave.
 */
export async function runSimulations<T>(
  numSimulations: number,
  simulateOnce: (simulationId: number) => Promise<T>,
): Promise<T[]> {
  const runs = [];
  for (let i = 0; i < numSimulations; i += 1) {
    runs.push(simulateOnce(i));
  }
  return Promise.all(runs);
}

export interface BattleCountStats {
  averageBattlesRequired: number;
  maxBattlesRequired: number;
  minBattlesRequired: number;
}

export function aggregateBattleCounts(
  battlesSimulated: number[],
): BattleCountStats {
  const nonZeroCounts = battlesSimulated.filter(count => !!count);

  return {
    averageBattlesRequired: Math.round(mean(nonZeroCounts)),
    maxBattlesRequired: Math.max(...nonZeroCounts),
    minBattlesRequired: Math.min(...nonZeroCounts),
  };
}
