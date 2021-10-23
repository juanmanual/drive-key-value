import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import KeyValueDto from './dto/key-value-dt';

import DatabaseService from './database.service';

@Injectable()
export default class StoreService {

    constructor(private readonly db: DatabaseService) {}

    bulkLoad(keyValuePairs: KeyValueDto[]) {
        const insert = this.db.instance.prepare('INSERT INTO main (key, value) VALUES (@key, @value);');
        const insertMany = this.db.instance.transaction((keyValuePairs: KeyValueDto[]) => {
            for(const keyValuePair of keyValuePairs) insert.run(keyValuePair);
        })
        insertMany(keyValuePairs);
    }

    getValueByKey(key: string) {
        const statement = this.db.instance.prepare(
            'SELECT value FROM main WHERE key = ?');
        const result = statement.get(key);
        if(result) return result.value;
        throw new HttpException('Key-Value not found', HttpStatus.NOT_FOUND);
    }

    deleteValue(key: string) {
        const statement = this.db.instance.prepare(
            'DELETE FROM main WHERE key = ? LIMIT 1');

        const result = statement.run(key);
        if(result.changes === 0) {
            throw new HttpException('Key-Value not found', HttpStatus.NOT_FOUND);
        }
    }

    replaceValue(key: string, value: string) {
        const statement = this.db.instance.prepare(
            'INSERT INTO main(key,value) ' +
            'Values(?, ?) ' +
            'ON CONFLICT(key) DO UPDATE SET ' +
            'value=excluded.value'
        );
        statement.run(key, value);
    }

    getAllKeys() {
        const statement = this.db.instance.prepare(
            'SELECT DISTINCT key FROM main'
        );
        return statement.all().map(({key}) => key);
    }

}