import { HttpStatus, HttpException, Injectable } from '@nestjs/common';


const Database = require('better-sqlite3');
const createTable = "CREATE TABLE IF NOT EXISTS " +
                    "main('key' varchar PRIMARY KEY, 'value' varchar);"
const db = new Database('test.db');
db.exec(createTable);

@Injectable()
export default class StoreService {

    getValueByKey(key: string) {
        const statement = db.prepare(
            'SELECT value FROM main WHERE key = ?');
        const result = statement.get(key);
        if(result) return result.value;
        throw new HttpException('Key-Value not found', HttpStatus.NOT_FOUND);
    }

    deleteValue(key: string) {
        const statement = db.prepare(
            'DELETE FROM main WHERE key = ? LIMIT 1');

        const result = statement.run(key);
        if(result.changes === 0) {
            throw new HttpException('Key-Value not found', HttpStatus.NOT_FOUND);
        }
    }

    replaceValue(key: string, value: string) {
        const statement = db.prepare(
            'INSERT INTO main(key,value) ' +
            'Values(?, ?) ' +
            'ON CONFLICT(key) DO UPDATE SET ' +
            'value=excluded.value'
        );
        statement.run(key, value);
    }

}