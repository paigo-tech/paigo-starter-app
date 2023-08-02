import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransformEntity } from './entities/transform.entity';
import { TransformController } from './transform.controller';
import { TransformService } from './transform.service';

describe('TransformController', () => {
  let controller: TransformController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransformController],
      providers: [
        TransformService,
        {
          provide: getRepositoryToken(TransformEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TransformController>(TransformController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
