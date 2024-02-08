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
    summary: '로또 번호 당첨 결과 목록 조회',
    description: '사용자로 부터 입력받은 로또 번호에 따른 당첨 결과 목록 조회',
  })
  findLotto(@Query() selectLottoDto: PageOptionDto) {
    return this.lottoService.read(selectLottoDto);
  }

  @Get('year/:year')
  @ApiOperation({
    summary: '출생년도에 따른 로또 번호 당첨 결과 조회',
    description:
      '사용자로 부터 입력받은 로또 번호와 출생년도에 따른 당첨 결과중 가장 큰 결과 1개를 조회',
  })
  findLottoByYear(
    @Query() selectLottoDto: SelectLottoDto,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.lottoService.readByYear(selectLottoDto, year);
  }

  @Get('test')
  @ApiOperation({
    summary: '로또 번호 당첨 결과 목록 조회',
    description: '사용자로 부터 입력받은 로또 번호에 따른 당첨 결과 목록 조회',
  })
  async findLotto2(@Query() selectLottoDto: SelectLottoDto) {
    const searchList = await this.lottoService.readLottoSearch(selectLottoDto);
    return await this.lottoService.readLottoMaster(searchList);
  }
}
