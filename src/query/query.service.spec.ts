import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryEntity } from './entities/query.entity';
import { QueryService } from './query.service';

describe('QueryService', () => {
  let service: QueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryService,
        {
          provide: getRepositoryToken(QueryEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<QueryService>(QueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
