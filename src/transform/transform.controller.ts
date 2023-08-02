import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { TransformService } from './transform.service';
import { CreateTransformDto } from './dto/create-transform.dto';
import { UpdateTransformDto } from './dto/update-transform.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request } from 'express';
import { ExecuteTransformDto } from './dto/execute-transform.dto';
import { TransformEntity } from './entities/transform.entity';

@Controller('transform')
export class TransformController {
  constructor(private readonly transformService: TransformService) {}

  @Post()
  create(@Body() createTransformDto: CreateTransformDto) {
    return this.transformService.create(createTransformDto);
  }

  @Get()
  findAll() {
    return this.transformService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transformService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransformDto: UpdateTransformDto,
  ) {
    return this.transformService.update(id, updateTransformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transformService.remove(id);
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
    return this.transformService.writeFile({
      buffer: file.buffer,
      transformerId: id,
    });
  }
  @Post(':id/execute')
  @UseInterceptors(FileInterceptor('file'))
  async executeTransform(
    @Param('id') id: string,
    @Body() executeTransformDto: ExecuteTransformDto,
  ) {
    await this.findOne(id);
    return this.transformService.executeTransform({
      filePath: TransformEntity.getTransformerFilePath({ transformerId: id }),
      data: executeTransformDto.data,
    });
  }
}
