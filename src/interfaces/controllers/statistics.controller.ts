import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetStatisticsUseCase } from 'src/application/use-cases/get-statistics.use-case';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly getStatisticsUseCase: GetStatisticsUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Obter estatísticas das transações nos últimos 60 segundos',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso.',
    schema: {
      example: {
        count: 10,
        sum: 1234.56,
        avg: 123.45,
        min: 12.34,
        max: 456.78,
      },
    },
  })
  get() {
    return this.getStatisticsUseCase.execute();
  }
}
