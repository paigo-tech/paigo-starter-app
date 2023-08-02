import { randomUUID } from 'crypto';
import * as path from 'path';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { CreateTransformDto } from '../dto/create-transform.dto';

export class Transform {}

@Entity()
export class TransformEntity {
  static transformer({
    filePath,
    data,
  }: {
    data: Array<any> | Record<string, any>;
    filePath: string;
  }): any {
    //eslint-disable-next-line @typescript-eslint/no-var-requires
    const functionCode = require(filePath);
    return functionCode.handler(data);
  }
  static getTransformerFilePath({ transformerId }): string {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      transformerId + '.js',
    );
    return filePath;
  }
  constructor(createTransformDto: CreateTransformDto) {
    if (createTransformDto) {
      this.transformId = createTransformDto.transformId || randomUUID();
      this.transformName = createTransformDto.transformName;
    }
  }
  @PrimaryColumn()
  transformId!: string;

  @Column()
  transformName: string;
}
