export enum DatabaseType {
  MYSQL = 'mysql',
  INFLUXDB = 'influxdb',
}
export class InfluxDatabaseParameters {
  version?: string;
  url?: string;
  token?: string;
  org?: string;
}
export class MysqlDatabaseParameters {
  version?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
}
export type DatabaseParameters =
  | MysqlDatabaseParameters
  | InfluxDatabaseParameters
  | Record<string, any>;

export class CreateQueryDto {
  query: string;
  queryName?: string;
  databaseParameters: DatabaseParameters;
  databaseType: DatabaseType;
  queryId?: string;
  customQueryParser?: string;
}
