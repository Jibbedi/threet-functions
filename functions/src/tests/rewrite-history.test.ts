import {rewriteHistory} from '../helper/rewrite-history';

describe('history calculation', () => {
    test('it should add true to history if game was one', () => {
        expect(rewriteHistory([], true)).toEqual([true]);
    });

    test('it should add false to history if game was one', () => {
        expect(rewriteHistory([], false)).toEqual([false]);
    });

    test('it should push data to the array', () => {
        expect(rewriteHistory([true], false)).toEqual([true, false]);
    });

    test('it should remove first entry, when history length is larger than 5', () => {
        expect(rewriteHistory([false, true, true, true, true], false))
            .toEqual([true, true, true, true, false]);
    });
});

