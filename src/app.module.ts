import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryModule } from './query/query.module';
import { TransformModule } from './transform/transform.module';
import { LoadModule } from './load/load.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineModule } from './pipeline/pipeline.module';

@Module({
  imports: [
    QueryModule,
    TransformModule,
    LoadModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PipelineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
