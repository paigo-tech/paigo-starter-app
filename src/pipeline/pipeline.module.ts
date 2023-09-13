import { Module, OnModuleInit } from '@nestjs/common';
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
export class PipelineModule implements OnModuleInit {
  constructor(private pipelineService: PipelineService) {}
  async onModuleInit() {
    const pipelines = await this.pipelineService.findAll();
    pipelines.forEach((pipeline) => {
      if (pipeline.schedule) {
        console.log(
          'registering schedule',
          pipeline?.pipelineId,
          pipeline?.schedule,
        );
        const job = this.pipelineService.createCronJob(
          pipeline?.pipelineId,
          pipeline?.schedule,
        );
        this.pipelineService.registerSchedule(job, pipeline?.pipelineId);
      }
    });
  }
}
