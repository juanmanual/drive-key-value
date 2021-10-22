import { Injectable } from "@nestjs/common";

import * as Database from 'better-sqlite3';

@Injectable()
export default class DatabaseService {
    instance: any;
    constructor() {
        this.instance = new Database('test.db');
        const createTable = "CREATE TABLE IF NOT EXISTS " +
                    "main('key' varchar PRIMARY KEY, 'value' varchar);"
        this.instance.exec(createTable);
    }
}