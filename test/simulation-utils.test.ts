import { expect } from '@open-wc/testing';
import {
  mean,
  runSimulations,
  aggregateBattleCounts,
} from '../src/shared/simulation-utils.js';

describe('simulation-utils', () => {
  describe('mean', () => {
    it('averages a list of numbers', () => {
      expect(mean([1, 2, 3, 4])).to.equal(2.5);
    });

    it('returns the single value for a one-element array', () => {
      expect(mean([7])).to.equal(7);
    });
  });

  describe('runSimulations', () => {
    it('runs the simulate function once per requested simulation', async () => {
      const seenIds: number[] = [];
      const results = await runSimulations(5, async id => {
        seenIds.push(id);
        return id * 2;
      });

      expect(seenIds).to.deep.equal([0, 1, 2, 3, 4]);
      expect(results).to.deep.equal([0, 2, 4, 6, 8]);
    });
  });

  describe('aggregateBattleCounts', () => {
    it('computes average, max, and min, ignoring zero/falsy entries', () => {
      const stats = aggregateBattleCounts([0, 10, 20, 30]);

      expect(stats.averageBattlesRequired).to.equal(20);
      expect(stats.maxBattlesRequired).to.equal(30);
      expect(stats.minBattlesRequired).to.equal(10);
    });
  });
});
