import { Module } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { PipelineController } from './pipeline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineEntity } from './entities/pipeline.entity';
import { QueryModule } from '../query/query.module';
import { TransformModule } from '../transform/transform.module';
import { LoadModule } from '../load/load.module';

@Module({
  controllers: [PipelineController],
  providers: [PipelineService],
  imports: [
    TypeOrmModule.forFeature([PipelineEntity]),
    QueryModule,
    TransformModule,
    LoadModule,
  ],
})
export class PipelineModule {}
