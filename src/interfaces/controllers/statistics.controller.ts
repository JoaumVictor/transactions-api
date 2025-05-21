import { Controller, Get, HttpCode } from '@nestjs/common';
import { GetStatisticsUseCase } from 'src/application/use-cases/get-statistics.use-case';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly getStatisticsUseCase: GetStatisticsUseCase) {}

  @Get()
  @HttpCode(200)
  get() {
    return this.getStatisticsUseCase.execute();
  }
}
