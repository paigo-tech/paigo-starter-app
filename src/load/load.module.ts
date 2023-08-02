import { Module } from '@nestjs/common';
import { LoadService } from './load.service';
import { LoadController } from './load.controller';
import { LoadEntity } from './entities/load.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [LoadController],
  providers: [LoadService],
  imports: [TypeOrmModule.forFeature([LoadEntity])],
  exports: [LoadService],
})
export class LoadModule {}
