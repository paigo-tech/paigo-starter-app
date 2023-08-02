import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoadEntity } from './entities/load.entity';
import { LoadController } from './load.controller';
import { LoadService } from './load.service';

describe('LoadController', () => {
  let controller: LoadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoadController],
      providers: [
        LoadService,
        {
          provide: getRepositoryToken(LoadEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<LoadController>(LoadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
