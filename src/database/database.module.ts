import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongodbService } from './mongodb.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MongodbService],
  exports: [MongodbService],
})
export class DatabaseModule {}