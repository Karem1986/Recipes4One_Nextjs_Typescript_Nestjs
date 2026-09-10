import { InvalidQuantityError } from '../shared/domain-error';
import { Quantity } from './quantity';

describe('Quantity', () => {
  describe('creation', () => {
    it('holds an amount and a unit', () => {
      const q = Quantity.of(200, 'g');
      expect(q.amount).toBe(200);
      expect(q.unit.symbol).toBe('g');
    });

    it.each([0, -1, NaN, Infinity])('rejects %p', (bad) => {
      expect(() => Quantity.of(bad, 'g')).toThrow(InvalidQuantityError);
    });
  });

  describe('scaleBy', () => {
    it('scales linearly', () => {
      expect(Quantity.of(200, 'g').scaleBy(0.25).amount).toBe(50);
    });

    it('returns a new instance rather than mutating', () => {
      const original = Quantity.of(200, 'g');
      const scaled = original.scaleBy(2);
      expect(original.amount).toBe(200);
      expect(scaled).not.toBe(original);
    });

    it('does not round -- rounding is a rule about food, not about numbers', () => {
      expect(Quantity.of(1, 'can').scaleBy(0.25).amount).toBe(0.25);
    });

    it.each([0, -1, NaN])('rejects factor %p', (bad) => {
      expect(() => Quantity.of(200, 'g').scaleBy(bad)).toThrow(InvalidQuantityError);
    });
  });

  describe('toBaseUnits', () => {
    it.each([
      [1, 'kg', 1000],
      [1, 'l', 1000],
      [1, 'tbsp', 15],
      [1, 'tsp', 5],
      [200, 'g', 200],
    ] as const)('converts %p %s to %p base units', (amount, symbol, expected) => {
      expect(Quantity.of(amount, symbol).toBaseUnits()).toBe(expected);
    });
  });

  it('knows which units are countable', () => {
    expect(Quantity.of(1, 'can').isCountable).toBe(true);
    expect(Quantity.of(200, 'g').isCountable).toBe(false);
  });
});
