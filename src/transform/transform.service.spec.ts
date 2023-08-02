import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransformEntity } from './entities/transform.entity';
import { TransformService } from './transform.service';

describe('TransformService', () => {
  let service: TransformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransformService,
        {
          provide: getRepositoryToken(TransformEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TransformService>(TransformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
