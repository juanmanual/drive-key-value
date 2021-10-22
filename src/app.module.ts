import { Module } from '@nestjs/common';
import StoreController from './store.controller';
import StoreService from './store.service';
import DatabaseService from './database.service';

@Module({
  imports: [],
  controllers: [StoreController],
  providers: [StoreService, DatabaseService],
})
export class AppModule {}
