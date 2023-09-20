import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { SelectLottoDto } from './lotto/dto/select-lotto.dto';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import * as cheerio from 'cheerio'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly httpService:HttpService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
 