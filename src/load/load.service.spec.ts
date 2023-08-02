import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoadEntity } from './entities/load.entity';
import { LoadService } from './load.service';

describe('LoadService', () => {
  let service: LoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoadService,
        {
          provide: getRepositoryToken(LoadEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LoadService>(LoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
