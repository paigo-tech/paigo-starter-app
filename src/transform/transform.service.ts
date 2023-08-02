import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransformDto } from './dto/create-transform.dto';
import { UpdateTransformDto } from './dto/update-transform.dto';
import { TransformEntity } from './entities/transform.entity';

import * as fs from 'fs';

@Injectable()
export class TransformService {
  constructor(
    @InjectRepository(TransformEntity)
    private transformRepository: Repository<TransformEntity>,
  ) {}
  create(createTransformDto: CreateTransformDto) {
    const transform = new TransformEntity(createTransformDto);
    return this.transformRepository.save(transform);
  }
  writeFile({
    buffer,
    transformerId,
  }: {
    buffer: Buffer;
    transformerId: string;
  }) {
    const filePath = TransformEntity.getTransformerFilePath({ transformerId });
    // Create the file path if it doesn't exist
    const dir = filePath.substring(0, filePath.lastIndexOf('/'));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }
  executeTransform({ filePath, data }) {
    return TransformEntity.transformer({ filePath, data });
  }
  findAll() {
    return this.transformRepository.find();
  }

  async findOne(id: string) {
    const results = await this.transformRepository.findOneBy({
      transformId: id,
    });
    if (!results) {
      throw new NotFoundException(`Transform with ID "${id}" not found`);
    } else {
      return results;
    }
  }

  async update(id: string, updateTransformDto: UpdateTransformDto) {
    const foundTransform = await this.transformRepository.findOneBy({
      transformId: id,
    });
    if (!foundTransform) {
      throw new NotFoundException(`Transform with ID "${id}" not found`);
    } else {
      // Conditionally set all properties
      if (updateTransformDto.transformName) {
        foundTransform.transformName = updateTransformDto.transformName;
      }
      return this.transformRepository.save(foundTransform);
    }
  }

  async remove(id: string) {
    await this.transformRepository.delete({ transformId: id });
  }
}
