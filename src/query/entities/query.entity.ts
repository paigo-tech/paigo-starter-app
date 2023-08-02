import { randomUUID } from 'crypto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import {
  CreateQueryDto,
  DatabaseParameters,
  DatabaseType,
  InfluxDatabaseParameters,
} from '../dto/create-query.dto';
import { InfluxDB, QueryApi } from '@influxdata/influxdb-client';
import { ReadQueryResponse } from '../dto/read-query.dto';
export class QueryRunner {
  influxQueryAPI?: Record<string, QueryApi>;
  constructor() {
    this.influxQueryAPI = {};
  }

  executeMysqlQuery({
    query,
    databaseParameters,
  }: {
    query: string;
    databaseParameters: DatabaseParameters;
  }) {
    throw new Error('MYSQL database type not implemented');
  }

  executeInfluxdbQuery({
    query,
    databaseParameters,
    queryId,
  }: {
    query: string;
    databaseParameters: InfluxDatabaseParameters;
    queryId: string;
  }) {
    if (this.influxQueryAPI && this.influxQueryAPI[queryId]) {
      return this.influxQueryAPI[queryId].collectRows(query);
    } else {
      const influxClient = new InfluxDB({
        url: databaseParameters.url,
        token: databaseParameters.token,
      });
      this.influxQueryAPI[queryId] = influxClient.getQueryApi(
        databaseParameters.org,
      );
      return this.influxQueryAPI[queryId].collectRows(query);
    }
  }
  clearDatabaseConnection({
    id,
    databaseType,
  }: {
    id: string;
    databaseType: DatabaseType;
  }) {
    if (databaseType === DatabaseType.INFLUXDB) {
      delete this.influxQueryAPI[id];
    }
  }
}

@Entity()
export class QueryEntity {
  constructor(queryDto: CreateQueryDto) {
    if (queryDto) {
      this.queryId = queryDto.queryId || randomUUID();
      this.query = queryDto.query;
      this.queryName = queryDto.queryName;
      this.databaseParameters = JSON.stringify(queryDto.databaseParameters);
      this.databaseType = queryDto.databaseType;
    }
  }
  @PrimaryColumn()
  queryId!: string;

  @Column()
  query: string;

  @Column()
  databaseParameters: string;
  @Column()
  databaseType: string;
  @Column()
  queryName: string;

  static executeQuery({
    queryResponse,
    queryRunner,
  }: {
    queryResponse: ReadQueryResponse;
    queryRunner: QueryRunner;
  }) {
    const databaseParameters = queryResponse.databaseParameters;
    const query = queryResponse.query;
    const databaseType = queryResponse.databaseType;
    const queryId = queryResponse.queryId;
    switch (databaseType) {
      case DatabaseType.MYSQL:
        throw new Error('MYSQL database type not implemented');
      case DatabaseType.INFLUXDB:
        return queryRunner.executeInfluxdbQuery({
          query,
          databaseParameters,
          queryId,
        });
      default:
        throw new Error('Unsupported database type');
    }
  }
}
