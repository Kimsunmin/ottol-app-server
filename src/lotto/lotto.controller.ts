import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LottoService } from './lotto.service';
import { SelectLottoDto } from './dto/select-lotto.dto';
import { PageOptionDto } from '../lotto/dto/page-option.dto';

@Controller({ path: 'lotto', version: '1' })
export class LottoController {
  constructor(private readonly lottoService: LottoService) {}

  @Get('/create')
  async create(
    @Query('drwNoStart') drwNoStart = 1,
    @Query('drwNoEnd') drwNoEnd = 1,
  ) {
    if (drwNoEnd === 1) {
      drwNoEnd = await this.lottoService.readLastDrwNoByWeb();
    }
    const result = await this.lottoService.saveLotto(drwNoStart, drwNoEnd);

    return result;
  }

  @Get('/update')
  @Cron('0 50 20 * * 6') // 매주 토요일 20시 50분 마다 실행
  async update(@Query('drwNo') drwNo: number) {
    const drwNoStart = (await this.lottoService.readLastDrwNo()) + 1;
    const drwNoEnd = Math.max(
      drwNoStart,
      await this.lottoService.readLastDrwNoByWeb(),
    );

    const result = await this.lottoService.saveLotto(drwNoStart, drwNoEnd);
    return result;
  }

  @Get('/find')
  @UsePipes(new ValidationPipe({ transform: true }))
  findLotto(@Query() selectLottoDto: PageOptionDto) {
    return this.lottoService.find(selectLottoDto);
  }

  @Get('/find/:year')
  @HttpCode(200)
  findLottoByYear(
    @Query() selectLottoDto: SelectLottoDto,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.lottoService.findByYear(selectLottoDto, year);
  }
}
