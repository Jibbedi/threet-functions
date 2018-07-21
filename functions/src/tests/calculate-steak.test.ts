import {calculateStreak} from '../helper/calculate-streak';

describe('streak calculation', () => {
    test('it should add +1 to current streak if game is won and streak was positive', () => {
        expect(calculateStreak(1, true)).toBe(2);
    });

    test('it should return 1 if game is won and streak was negative', () => {
        expect(calculateStreak(-1, true)).toBe(1);
    });

    test('it should return 1 if game is won and streak was 0', () => {
        expect(calculateStreak(0, true)).toBe(1);
    });

    test('it should return -1 if game is lost and streak was 0', () => {
        expect(calculateStreak(0, false)).toBe(-1);
    });

    test('it should return -1 if game is lost and streak was positive', () => {
        expect(calculateStreak(1, false)).toBe(-1);
    });

    test('it should add -1 if game is lost and streak was negative', () => {
        expect(calculateStreak(-1, false)).toBe(-2);
    });
});

