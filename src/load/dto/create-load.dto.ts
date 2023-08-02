export enum LoadType {
  'LOG' = 'LOG',
  'PAIGO_API' = 'PAIGO_API',
}

export class PaigoAPILoadParameters {
  clientId: string;
  clientSecret: string;
  url: string;
}
export class LocalLogLoadParameters {
  message: string;
}
export type LoadParameters = PaigoAPILoadParameters | LocalLogLoadParameters;

export class CreateLoadDto {
  loadId?: string;
  loadName?: string;
  loadType: LoadType;
  loadParameters: LoadParameters;
}
