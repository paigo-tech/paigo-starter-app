import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryEntity } from './entities/query.entity';

@Module({
  controllers: [QueryController],
  providers: [QueryService],
  imports: [TypeOrmModule.forFeature([QueryEntity])],
  exports: [QueryService],
})
export class QueryModule {}
