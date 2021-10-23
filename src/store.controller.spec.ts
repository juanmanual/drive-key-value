import StoreController from './store.controller';
import StoreService from './store.service';
import { Request } from 'express';


jest.mock('raw-body', () => {
    return jest.fn().mockReturnValue('test1');
})

const mockDatabaseService = {
    instance: {}
};

const mockGetValueByKey = jest.fn();
const mockDeleteValue = jest.fn();
const mockReplaceValue = jest.fn();
const mockGetAllKeys = jest.fn();

const mockStoreService = new (class extends StoreService {
    constructor() {
        super(mockDatabaseService);
    }
    getValueByKey = mockGetValueByKey;
    deleteValue = mockDeleteValue;
    replaceValue = mockReplaceValue;
    getAllKeys = mockGetAllKeys;
})();

const storeController = new StoreController(mockStoreService);

describe('Store controller', () => {
    beforeEach(() => {
        mockGetValueByKey.mockClear();
        mockDeleteValue.mockClear();
        mockReplaceValue.mockClear();
        mockGetAllKeys.mockClear();
    });
    it('can get all keys', () => {
        mockGetAllKeys.mockReturnValueOnce(['foo', 'bar', 'baz']);
        expect(storeController.getAllKeys()).toEqual(['foo', 'bar', 'baz']);

    });
    it('can get the value that corresponds to a key', () => {
        mockGetValueByKey.mockReturnValueOnce('bar')
        expect(storeController.getValueByKey('foo')).toBe('bar');
    });

    it('calls delete on storeService with the provided key', () => {
        expect(storeController.deleteValue('foo')).toBeUndefined();
        expect(mockDeleteValue).toHaveBeenCalledWith('foo');
    });
    it('can store a value by key', async () => {
        const mockRequest = {
            readable: true,
        } as Request;
        expect(await storeController.replaceValue('foo', mockRequest)).toBeUndefined();
        expect(mockReplaceValue).toHaveBeenCalledWith('foo', 'test1')
    })
})