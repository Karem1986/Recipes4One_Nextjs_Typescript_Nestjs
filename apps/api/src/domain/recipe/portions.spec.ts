import { InvalidPortionsError } from '../shared/domain-error';
import { Portions } from './portions';

describe('Portions', () => {
  it.each(Portions.ALLOWED)('accepts %p', (value) => {
    expect(Portions.of(value).value).toBe(value);
  });

  it.each([3, 5, 7, 10, 0, -1, 1.5, NaN, Infinity])('rejects %p', (bad) => {
    expect(() => Portions.of(bad)).toThrow(InvalidPortionsError);
  });

  it('says what was allowed, because this message reaches the API consumer', () => {
    expect(() => Portions.of(3)).toThrow(/1, 2, 4, 8/);
  });

  it('defaults to one -- the whole point of the app', () => {
    expect(Portions.single().value).toBe(1);
    expect(Portions.single().isMealPrep).toBe(false);
  });

  describe('factorTo', () => {
    it('divides down from a 4-serving recipe to 1', () => {
      expect(Portions.of(4).factorTo(Portions.of(1))).toBe(0.25);
    });

    it('multiplies up from 1 to 4', () => {
      expect(Portions.of(1).factorTo(Portions.of(4))).toBe(4);
    });

    it('is 1 when nothing changes', () => {
      expect(Portions.of(4).factorTo(Portions.of(4))).toBe(1);
    });
  });
});
