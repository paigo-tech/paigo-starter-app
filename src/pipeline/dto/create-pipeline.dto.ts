export class CreatePipelineDto {
  pipelineId?: string;
  queryId: string;
  transformId?: string;
  loadId: string;
  schedule?: string;
}
