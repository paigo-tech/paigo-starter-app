import { OmitType } from '@nestjs/swagger';
import { CreateQueryDto } from './create-query.dto';

export class UpdateQueryDto extends OmitType(CreateQueryDto, ['queryId']) {}
