import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Put,
} from '@nestjs/common';
import { QueryService } from './query.service';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Post()
  create(@Body() createQueryDto: CreateQueryDto) {
    return this.queryService.create(createQueryDto);
  }

  @Get()
  findAll() {
    return this.queryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queryService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateQueryDto: UpdateQueryDto) {
    return this.queryService.update(id, updateQueryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queryService.remove(id);
  }

  @Post(':id/execute')
  async execute(@Param('id') id: string) {
    const queryResponse = await this.queryService.findOne(id);
    return this.queryService.executeQuery({ queryResponse });
  }

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1024 * 100 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.queryService.writeFile({
      buffer: file.buffer,
      queryId: id,
    });
  }
}
