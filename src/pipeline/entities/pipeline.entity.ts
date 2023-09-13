import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { LoadEntity } from '../../load/entities/load.entity';
import { LoadService } from '../../load/load.service';
import { ReadQueryResponse } from '../../query/dto/read-query.dto';
import { QueryEntity } from '../../query/entities/query.entity';
import { QueryService } from '../../query/query.service';
import { TransformEntity } from '../../transform/entities/transform.entity';
import { TransformService } from '../../transform/transform.service';

export class Pipeline {}

@Entity()
export class PipelineEntity {
  static async executePipeline({
    pipelineEntity,
    queryService,
    transformService,
    loadService,
  }: {
    pipelineEntity: PipelineEntity;
    queryService: QueryService;
    transformService: TransformService;
    loadService: LoadService;
  }) {
    const { query, transform, load } = pipelineEntity;
    const readQueryRes = new ReadQueryResponse(query);
    const queryResult = await queryService.executeQuery({
      queryResponse: readQueryRes,
    });
    let loadInput = queryResult;
    if (transform) {
      loadInput = await transformService.executeTransform({
        filePath: TransformEntity.getTransformerFilePath({
          transformerId: transform.transformId,
        }),
        data: queryResult,
      });
    }
    await loadService.execute({
      loadId: load.loadId,
      data: loadInput,
    });
  }

  constructor(pipelineEntity: PipelineEntity) {
    if (pipelineEntity) {
      this.pipelineId = pipelineEntity.pipelineId;
      this.query = pipelineEntity.query;
      this.transform = pipelineEntity.transform;
      this.load = pipelineEntity.load;
      this.schedule = pipelineEntity.schedule;
    }
  }
  @PrimaryColumn()
  pipelineId!: string;

  @ManyToOne((type) => QueryEntity, (query) => query.queryId)
  query?: QueryEntity;

  @ManyToOne((type) => TransformEntity, (transform) => transform.transformId)
  transform?: TransformEntity;

  @ManyToOne((type) => LoadEntity, (load) => load.loadId)
  load?: LoadEntity;

  @Column({ nullable: true })
  schedule?: string;
}
