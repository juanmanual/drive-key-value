import {isKeyValueDto} from './key-value-dt';

describe('Key value dto', () => {
    it('accepts key value objects', () => {
        expect(isKeyValueDto({
            key: 'foo',
            value: 'bar'
        })).toBe(true);
    });

    it('rejects non objects', () => {
        expect(isKeyValueDto(true)).toBe(false);
    });


    it('rejects null and undefined', () => {
        expect(isKeyValueDto(null)).toBe(false);
        expect(isKeyValueDto(undefined)).toBe(false);
    });

    it('rejects objects without key', () => {
        expect(isKeyValueDto({ value: 'bar' })).toBe(false);
    });

    it('rejects objects without value', () => {
        expect(isKeyValueDto({ key: 'foo' })).toBe(false);
    });
});