import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { LoadEntity } from './entities/load.entity';

@Injectable()
export class LoadService {
  constructor(
    @InjectRepository(LoadEntity)
    private loadRepository: Repository<LoadEntity>,
  ) {}
  create(createLoadDto: CreateLoadDto) {
    const entity = new LoadEntity(createLoadDto);
    return this.loadRepository.save(entity);
  }

  findAll() {
    return this.loadRepository.find();
  }

  async findOne(id: string) {
    const results = this.loadRepository.findOneBy({ loadId: id });
    if (!results) {
      throw new NotFoundException(`Load with ID "${id}" not found`);
    }
    return results;
  }

  async update(id: string, updateLoadDto: UpdateLoadDto) {
    const foundLoad = await this.loadRepository.findOneBy({ loadId: id });
    if (!foundLoad) {
      throw new NotFoundException(`Load with ID "${id}" not found`);
    } else {
      // Conditionally set all properties
      if (updateLoadDto.loadName) {
        foundLoad.loadName = updateLoadDto.loadName;
      }
      if (updateLoadDto.loadType !== foundLoad?.loadType) {
        throw new BadRequestException(`Load type cannot be changed`);
      }
      if (updateLoadDto.loadParameters) {
        foundLoad.loadParameters = JSON.stringify(updateLoadDto.loadParameters);
      }

      return this.loadRepository.save(foundLoad);
    }
  }
  async execute({ loadId, data }: { loadId: string; data: any }) {
    const loadEntity = await this.loadRepository.findOneBy({ loadId });
    if (!loadEntity) {
      throw new NotFoundException(`Load with ID "${loadId}" not found`);
    }
    await LoadEntity.loadData({ loadEntity, data });
  }

  async remove(id: string) {
    await this.loadRepository.delete({ loadId: id });
  }
}
