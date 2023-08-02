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
import { UpdatePipelineDto } from './dto/update-pipeline.dto';
import { PipelineEntity } from './entities/pipeline.entity';

@Injectable()
export class PipelineService {
  constructor(
    @InjectRepository(PipelineEntity)
    private pipelineRepository: Repository<PipelineEntity>,
    private queryService: QueryService,
    private loadService: LoadService,
    private transformService: TransformService,
  ) {}
  async create(createPipelineDto: CreatePipelineDto) {
    const { transformId, queryId, loadId, pipelineId } = createPipelineDto;
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
    });
    return this.pipelineRepository.save(pipeline);
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

  update(id: string, updatePipelineDto: UpdatePipelineDto) {
    return `This action updates a #${id} pipeline`;
  }

  remove(id: string) {
    return this.pipelineRepository.remove({ pipelineId: id });
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
