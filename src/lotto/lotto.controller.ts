import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LottoService } from './lotto.service';
import { SelectLottoDto } from './dto/select-lotto.dto';
import { PageOptionDto } from '../lotto/dto/page-option.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'lotto', version: '1' })
@ApiTags('Lotto 데이터 저장 및 검색')
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
  findLotto(@Query() selectLottoDto: PageOptionDto) {
    return this.lottoService.find(selectLottoDto);
  }

  @Get('/find/:year')
  @ApiOperation({
    summary: '출생년도에 따른 로또 번호 당첨 결과 조회',
  })
  findLottoByYear(
    @Query() selectLottoDto: SelectLottoDto,
    @Param('year', ParseIntPipe) year: number,
  ) {
    console.log(selectLottoDto);
    return this.lottoService.findByYear(selectLottoDto, year);
  }
}
