import { Body, Controller, Delete, Get, Param, Put, Req } from '@nestjs/common';
import StoreService from './store.service';
import * as rawBody from 'raw-body';

@Controller('store')
export default class StoreController {
    constructor(
        private readonly storeService: StoreService
    ) {}

    @Get(':key')
    getValueByKey(@Param('key') key: string) {
        return this.storeService.getValueByKey(key);
    }

    @Get('/')
    getAllKeys() {
        return this.storeService.getAllKeys();
    }

    @Put(':key')
    async replaceValue(@Param('key') key: string, @Req() req) {
        if(req.readable) {
            return this.storeService.replaceValue(key, (await rawBody(req)).toString());
        }
    }

    @Delete(':key')
    deleteValue(@Param('key') key: string) {
        return this.storeService.deleteValue(key);
    }

}