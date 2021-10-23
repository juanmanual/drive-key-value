import { HttpException, HttpStatus, Controller, Delete, Get, Param, Put, Req } from '@nestjs/common';
import StoreService from './store.service';
import * as rawBody from 'raw-body';
import { Request } from 'express';
import { isKeyValueDto } from './dto/key-value-dt';

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

    @Put('/')
    async bulkLoad(@Req() req: Request) {
        if(req.readable) {
            const body = (await rawBody(req)).toString();
            try {
                const parsedBody = JSON.parse(body);
                if(!Array.isArray(parsedBody)) {
                    throw new HttpException('Expected Array-like object', HttpStatus.BAD_REQUEST); 
                } else if(parsedBody.some((element: unknown) => !isKeyValueDto(element))) {
                    throw new HttpException('All array elements should match {"key": "value"} format', HttpStatus.BAD_REQUEST)
                }
                return this.storeService.bulkLoad(parsedBody);
            } catch (e) {
                if(e instanceof SyntaxError) {
                    throw new HttpException('Invalid Json Body', HttpStatus.BAD_REQUEST);
                } else {
                    throw e;
                }
            } 
        }
    }

    @Put(':key')
    async replaceValue(@Param('key') key: string, @Req() req: Request) {
        if(req.readable) {
            return this.storeService.replaceValue(key, (await rawBody(req)).toString());
        }
    }

    @Delete(':key')
    deleteValue(@Param('key') key: string) {
        return this.storeService.deleteValue(key);
    }

}