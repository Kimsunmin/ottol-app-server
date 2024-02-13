import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { LottoService } from './lotto.service';
import { SelectLottoDto } from './lotto.dto';
import { PageOptionDto } from '../lotto/dto/page-option.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'lotto', version: '1' })
@ApiTags('Lotto 관련 API')
export class LottoController {
  constructor(private readonly lottoService: LottoService) {}

  @Get()
  @ApiOperation({
    summary: '로또 번호 당첨 결과 목록 조회 (NEW)',
    description: '사용자로 부터 입력받은 로또 번호에 따른 당첨 결과 목록 조회',
  })
  async readLotto(@Query() selectNumbers: SelectLottoDto) {
    return await this.lottoService.readLottoDrawResult({ selectNumbers });
  }

  @Get('find')
  @ApiOperation({
    summary: '로또 번호 당첨 결과 목록 조회 (OLD)',
    description: '사용자로 부터 입력받은 로또 번호에 따른 당첨 결과 목록 조회',
  })
  findLotto(@Query() selectLottoDto: PageOptionDto) {
    return {
      result: [],
      meta: {
        itemCount: 0,
        pageCount: null,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  @Get('year/:year?')
  @ApiOperation({
    summary: '로또 번호 당첨 결과 조회 (NEW)',
    description:
      '사용자로 부터 입력받은 로또 번호와 출생년도에 따른 당첨 결과중 가장 큰 결과 1개를 조회',
  })
  async readLottoByUserYear(
    @Query() selectNumbers: SelectLottoDto,
    @Param('year') year?: number,
  ) {
    return await this.lottoService.readLottoDrawResultByYear({
      selectNumbers,
      year,
    });
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
      result: [],
      meta: {
        year: 1998,
        age: 27,
        ageTwentyYear: 2016,
      },
    };
  }
}
