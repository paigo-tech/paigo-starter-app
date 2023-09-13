import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { LoadService } from '../load/load.service';
import { CreateQueryDto } from '../query/dto/create-query.dto';
import { QueryEntity } from '../query/entities/query.entity';
import { QueryService } from '../query/query.service';
import { TransformService } from '../transform/transform.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { PipelineEntity } from './entities/pipeline.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class PipelineService {
  constructor(
    @InjectRepository(PipelineEntity)
    private pipelineRepository: Repository<PipelineEntity>,
    private queryService: QueryService,
    private loadService: LoadService,
    private transformService: TransformService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  async create(createPipelineDto: CreatePipelineDto) {
    const { transformId, queryId, loadId, pipelineId, schedule } =
      createPipelineDto;

    let setPipelineId = pipelineId;
    if (!setPipelineId) {
      setPipelineId = randomUUID();
    }
    const res = (await this.queryService.findOne(queryId)) as CreateQueryDto;
    const queryEntity = new QueryEntity(res);
    const pipeline = new PipelineEntity({
      pipelineId: setPipelineId,
      query: queryEntity,
      transform: await this.transformService.findOne(transformId),
      load: await this.loadService.findOne(loadId),
      schedule,
    });

    const saved = await this.pipelineRepository.save(pipeline);
    if (schedule) {
      const job = this.createCronJob(saved.pipelineId, schedule);
      this.registerSchedule(job, saved.pipelineId);
    }
    return saved;
  }

  findAll() {
    return this.pipelineRepository.find({
      relations: ['query', 'transform', 'load'],
    });
  }

  findOne(id: string) {
    return this.pipelineRepository.find({
      where: { pipelineId: id },
      relations: ['query', 'transform', 'load'],
    });
  }
  createCronJob(id: string, schedule: string): CronJob {
    const job = new CronJob(
      schedule,
      this.executePipeline.bind(this, id),
      null,
      true,
    );
    return job;
  }
  registerSchedule(job: CronJob, id: string): void {
    this.schedulerRegistry.addCronJob(id, job);
    job.start();
  }

  async remove(id: string) {
    const found = await this.findOne(id);
    if (found?.length > 0) {
      const [pipeline] = found;
      if (pipeline.schedule) {
        const job = this.schedulerRegistry.getCronJob(pipeline.pipelineId);
        job.stop();
        this.schedulerRegistry.deleteCronJob(pipeline.pipelineId);
      }
    }
    const removed = this.pipelineRepository.remove({ pipelineId: id });

    return removed;
  }
  async executePipeline(id: string) {
    const [pipeline] = await this.findOne(id);
    if (pipeline) {
      PipelineEntity.executePipeline({
        pipelineEntity: pipeline,
        queryService: this.queryService,
        transformService: this.transformService,
        loadService: this.loadService,
      });
    }
  }
}
