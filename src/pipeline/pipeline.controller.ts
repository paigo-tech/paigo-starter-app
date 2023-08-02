import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

@Controller('pipeline')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Post()
  create(@Body() createPipelineDto: CreatePipelineDto) {
    return this.pipelineService.create(createPipelineDto);
  }
  @Post(':id/execute')
  execute(@Param('id') id: string) {
    return this.pipelineService.executePipeline(id);
  }

  @Get()
  findAll() {
    return this.pipelineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pipelineService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePipelineDto: UpdatePipelineDto,
  ) {
    return this.pipelineService.update(id, updatePipelineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pipelineService.remove(id);
  }
}
