import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { SelectLottoDto } from './lotto/dto/select-lotto.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
 