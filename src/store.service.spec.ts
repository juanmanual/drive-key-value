import StoreService from './store.service';
// import * as Database from 'better-sqlite3';

const mockStatement = {
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
}

const mockDatabaseService = {
    instance: {
        prepare: jest.fn().mockReturnValue(mockStatement),
    },
}
const storeService = new StoreService(mockDatabaseService);
describe('store service', () => {
    beforeEach(() => {
        mockStatement.get.mockClear();
        mockStatement.run.mockClear();
        mockStatement.all.mockClear();
        mockDatabaseService.instance.prepare.mockClear();
    });

    it('can get values based on key', () => {
        const randomString = 'bar' + Math.random();
        mockStatement.get.mockReturnValueOnce({value: randomString});
        expect(storeService.getValueByKey('foo')).toBe(randomString);
        expect(mockDatabaseService.instance.prepare)
        .toHaveBeenCalledWith('SELECT value FROM main WHERE key = ?');
    });

    it('throws a not found error when getting value if key is not found', () => {
        mockStatement.get.mockReturnValueOnce(undefined);
        expect(() => {storeService.getValueByKey('foo')}).toThrow('Key-Value not found');
    })

    it('can be used to insert values into the main table', ()=> {
        expect(storeService.replaceValue('foo', 'bar')).toBe(undefined);
        expect(mockDatabaseService.instance.prepare)
            .toHaveBeenCalledWith('INSERT INTO main(key,value) Values(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value');
        expect(mockStatement.run).toHaveBeenCalled();
    });

    it('can delete values', () => {
        mockStatement.run.mockReturnValueOnce({changes: 1});
        storeService.deleteValue('foo');
        expect(mockDatabaseService.instance.prepare)
        .toHaveBeenCalledWith('DELETE FROM main WHERE key = ? LIMIT 1');
    });

    it('throws a not found error when deleting if key is not found', () => {
        mockStatement.run.mockReturnValueOnce({changes: 0});
        expect(() => {storeService.deleteValue('foo')}).toThrow('Key-Value not found');
    });

    it('gets all keys', () => {
        mockStatement.all.mockReturnValueOnce([
            { key: 'foo'},
            { key: 'bar'},
            { key: 'baz'}
        ]);
        expect(storeService.getAllKeys()).toStrictEqual(['foo', 'bar', 'baz']);
    })

});