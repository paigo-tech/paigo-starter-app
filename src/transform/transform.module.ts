import { Module } from '@nestjs/common';
import { TransformService } from './transform.service';
import { TransformController } from './transform.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransformEntity } from './entities/transform.entity';

@Module({
  controllers: [TransformController],
  providers: [TransformService],
  imports: [TypeOrmModule.forFeature([TransformEntity])],
  exports: [TransformService],
})
export class TransformModule {}
