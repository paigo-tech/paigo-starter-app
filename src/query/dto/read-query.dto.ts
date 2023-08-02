import { QueryEntity } from '../entities/query.entity';
import { DatabaseParameters } from './create-query.dto';

export class ReadQueryResponse {
  queryId: string;
  query: string;
  queryName: string;
  databaseParameters: DatabaseParameters;
  databaseType: string;
  constructor(queryEntity: QueryEntity) {
    this.queryId = queryEntity.queryId;
    this.query = queryEntity.query;
    this.queryName = queryEntity.queryName;
    this.databaseType = queryEntity.databaseType;
    if (queryEntity.databaseParameters) {
      this.databaseParameters = JSON.parse(queryEntity.databaseParameters);
    }
  }
}
