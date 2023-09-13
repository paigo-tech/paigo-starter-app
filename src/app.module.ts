import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QueryModule } from './query/query.module';
import { TransformModule } from './transform/transform.module';
import { LoadModule } from './load/load.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineModule } from './pipeline/pipeline.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    QueryModule,
    TransformModule,
    LoadModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/db.sqlite3',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    PipelineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
