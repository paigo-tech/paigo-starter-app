import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQueryDto } from './dto/create-query.dto';
import { ReadQueryResponse } from './dto/read-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { QueryEntity, QueryRunner } from './entities/query.entity';
import * as fs from 'fs';
@Injectable()
export class QueryService {
  queryRunner: QueryRunner;
  constructor(
    @InjectRepository(QueryEntity)
    private queryRepository: Repository<QueryEntity>,
  ) {
    this.queryRunner = new QueryRunner();
  }
  create(createQueryDto: CreateQueryDto): Promise<QueryEntity> {
    const query = new QueryEntity(createQueryDto);
    return this.queryRepository.save(query);
  }

  findAll(): Promise<QueryEntity[]> {
    return this.queryRepository.find();
  }

  writeFile({ buffer, queryId }: { buffer: Buffer; queryId: string }) {
    const filePath = QueryEntity.getQueryParserFilePath({ queryId });
    // Create the file path if it doesn't exist
    const dir = filePath.substring(0, filePath.lastIndexOf('/'));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  async findOne(id: string): Promise<ReadQueryResponse> {
    const queryEntity = await this.queryRepository.findOneBy({ queryId: id });
    if (!queryEntity) {
      throw new NotFoundException(`Query with ID "${id}" not found`);
    } else {
      return new ReadQueryResponse(queryEntity);
    }
  }

  async update(id: string, updateQueryDto: UpdateQueryDto) {
    const foundQuery = await this.queryRepository.findOneBy({ queryId: id });
    if (!foundQuery) {
      throw new NotFoundException(`Query with ID "${id}" not found`);
    } else {
      // Conditionally set all properties
      if (updateQueryDto.query) {
        foundQuery.query = updateQueryDto.query;
      }
      if (updateQueryDto.queryName) {
        foundQuery.queryName = updateQueryDto.queryName;
      }
      if (updateQueryDto.databaseParameters) {
        foundQuery.databaseParameters = JSON.stringify(
          updateQueryDto.databaseParameters,
        );
      }
      return this.queryRepository.save(foundQuery);
    }
  }

  async remove(id: string): Promise<void> {
    await this.queryRepository.delete({ queryId: id });
  }

  async executeQuery({ queryResponse }: { queryResponse: ReadQueryResponse }) {
    return QueryEntity.executeQuery({
      queryResponse,
      queryRunner: this.queryRunner,
    });
  }
}
