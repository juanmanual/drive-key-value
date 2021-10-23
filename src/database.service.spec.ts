import DatabaseService from './database.service';
jest.mock('better-sqlite3');

describe('database service', () => {
    it('runs', () => {
        expect(new DatabaseService()).toBeDefined();
    });
});