import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@Inject('Logger') private readonly logger: Logger) {}

  @Get()
  @ApiOperation({ summary: 'Verifica se o serviço está ativo' })
  @ApiResponse({ status: 200, description: 'Serviço ativo e funcionando.' })
  check() {
    this.logger.log('Verificando se o serviço está ativo');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
