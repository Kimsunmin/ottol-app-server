import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  NotImplementedException,
} from '@nestjs/common';
import { LottoService } from './lotto.service';
import { SelectLottoDto } from './lotto.dto';
import { PageOptionDto } from '../lotto/dto/page-option.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'lotto', version: '1' })
@ApiTags('Lotto 관련 API')
export class LottoController {
  constructor(private readonly lottoService: LottoService) {}

  @Get()
  @ApiOperation({
    summary: '로또 번호 추첨 목록 조회',
    description: '역대 로또 추첨 결과 목록 조회',
  })
  async readLotto() {
    throw new NotImplementedException();
  }

  @Get('user/history')
  @ApiOperation({
    summary: '사용자 로또 검색 목록 조회',
    description: '사용자가 로또를 검색한 목록 조회',
  })
  async readLottoSearchHistory() {
    throw new NotImplementedException();
  }

  @Get('find')
  @ApiOperation({
    summary: '로또 번호 당첨 결과 목록 조회 (OLD)',
    description: '사용자로 부터 입력받은 로또 번호에 따른 당첨 결과 목록 조회',
  })
  findLotto(@Query() selectLottoDto: PageOptionDto) {
    return {
      result: [
        {
          drw_no: 101,
          drwt_no1: 1,
          drwt_no2: 3,
          drwt_no3: 17,
          drwt_no4: 32,
          drwt_no5: 35,
          drwt_no6: 45,
          bnus_no: 8,
          drw_no_date: '2004.11.06',
          win_rank: 5,
          win_pay: '5000',
        },
        {
          drw_no: 91,
          drwt_no1: 1,
          drwt_no2: 21,
          drwt_no3: 24,
          drwt_no4: 26,
          drwt_no5: 29,
          drwt_no6: 42,
          bnus_no: 27,
          drw_no_date: '2004.08.28',
          win_rank: 5,
          win_pay: '5000',
        },
      ],
      meta: {
        itemCount: 2,
        pageCount: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  @Get('find/:year')
  @ApiOperation({
    summary: '출생년도에 따른 로또 번호 당첨 결과 조회 (OLD)',
    description:
      '사용자로 부터 입력받은 로또 번호와 출생년도에 따른 당첨 결과중 가장 큰 결과 1개를 조회',
  })
  findLottoByYear(
    @Query() selectLottoDto: SelectLottoDto,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return {
      result: {
        drw_no: 1106,
        drwt_no1: 1,
        drwt_no2: 3,
        drwt_no3: 4,
        drwt_no4: 29,
        drwt_no5: 42,
        drwt_no6: 45,
        bnus_no: 36,
        drw_no_date: '2024.02.10',
        win_rank: 1,
        win_pay: '2790462819',
      },
      meta: {
        year: 1998,
        age: 27,
        ageTwentyYear: 2016,
      },
    };
  }

  @Get('check')
  @ApiOperation({
    summary: '로또 번호 검색 결과 목록 조회 (NEW)',
    description: '사용자로 부터 입력받은 로또 번호에 따른 당첨 결과 목록 조회',
  })
  async checkLottoDrawResult(@Query() selectNumbers: SelectLottoDto) {
    return await this.lottoService.checkLottoDrawResult({ selectNumbers });
  }

  @Get('check/year/:year')
  @ApiOperation({
    summary: '로또 번호 검색 결과 조회 (NEW)',
    description:
      '사용자로 부터 입력받은 로또 번호와 출생년도에 따른 당첨 결과중 가장 큰 결과 1개를 조회',
  })
  @ApiParam({
    name: 'year',
    description: '출생년도',
    example: 1998,
  })
  async checkLottoDrawResultByYear(
    @Query() selectNumbers: SelectLottoDto,
    @Param('year') year: number,
  ) {
    return await this.lottoService.checkLottoDrawResultByYear({
      selectNumbers,
      year,
    });
  }
}
