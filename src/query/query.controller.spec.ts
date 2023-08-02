import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryEntity } from './entities/query.entity';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';

describe('QueryController', () => {
  let controller: QueryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueryController],
      providers: [
        QueryService,
        {
          provide: getRepositoryToken(QueryEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<QueryController>(QueryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
