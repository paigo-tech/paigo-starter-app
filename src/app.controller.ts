import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('HealthCheck')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ operationId: 'Health Check' })
  @Get()
  getHealthCheck() {
    return this.appService.getHealthCheck();
  }
}
