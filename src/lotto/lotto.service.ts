import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SelectLottoDto } from './dto/select-lotto.dto';
import { LottoResult } from './entitiy/lotto-result.entity';
import { LottoSearch } from './entitiy/lotto-search.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from '../utils/utils.service';
import { PageOptionDto } from '../lotto/dto/page-option.dto';
import { PageMetaDto } from '../lotto/dto/page-meta.dto';
import { PageDto } from '../lotto/dto/page.dto';
import * as cheerio from 'cheerio';
import { catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class LottoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly confingService: ConfigService,
    private readonly utilsService: UtilsService,

    @InjectRepository(LottoResult)
    private readonly lottoResultRepository: Repository<LottoResult>,

    @InjectRepository(LottoSearch)
    private readonly lottoSearchRepository: Repository<LottoSearch>,
  ) {}

  async saveLotto(drwNoStart: number, drwNoEnd: number) {
    console.log(`excel_download_save... start:${drwNoStart}, end:${drwNoEnd}`);
    console.time('excel_download_save');

    const lottoResultList = await this.readLottoResult({
      drwNoStart,
      drwNoEnd,
    });

    const lottoSearchList = lottoResultList
      .map((result) => LottoSearch.transResultToSearch(result))
      .flat();

    if (lottoResultList.length !== lottoSearchList.length / 7) {
      throw new ConflictException('');
    }

    const lottoResultSaveResult = await this.saveLottoResult(lottoResultList);
    await this.saveLottoSearch(lottoSearchList);

    console.timeEnd('excel_download_save');
    return lottoResultSaveResult;
  }

  async readLottoResult(dto: { drwNoStart: number; drwNoEnd: number }) {
    const getLottoResultHtml = await firstValueFrom(
      this.httpService
        .get(this.confingService.get<string>('LOTTO_API_BASE_URL'), {
          params: {
            method: 'allWinExel',
            gubun: 'byWin',
            drwNoStart: dto.drwNoStart,
            drwNoEnd: dto.drwNoEnd,
          },
        })
        .pipe(
          map((res) => res.data),
          catchError((err) => {
            throw err;
          }),
        ),
    );

    const lottoResult = LottoResult.parserByHtml(getLottoResultHtml);
    return lottoResult;
  }

  async saveLottoResult(lottoResult: LottoResult[]) {
    return await this.lottoResultRepository.save(lottoResult);
  }

  async saveLottoSearch(lottoSearch: LottoSearch[]) {
    return await this.lottoSearchRepository.save(lottoSearch);
  }

  async find(select: PageOptionDto): Promise<PageDto<any>> {
    const find = this.findQuery(select);
    find
      .orderBy('win_pay', select.order)
      .offset(select.offset)
      .limit(select.size);

    const itemCount = await find.getCount();
    const result = await find.getRawMany();
    const pageMetaDto = new PageMetaDto(select, itemCount);

    if (pageMetaDto.page > pageMetaDto.pageCount || pageMetaDto.page < 1) {
      throw new NotFoundException(`Page ${select.page} is not found`);
    }

    return new PageDto(result, pageMetaDto);
  }

  async findByYear(select: SelectLottoDto, year: number) {
    const nowYear = new Date().getFullYear();
    const age = nowYear - year;
    const ageTwentyYear = nowYear + (19 - age);
    const searchYear = 19 > age ? year : ageTwentyYear;

    const find = this.findQuery(select);
    find
      .orderBy('win_pay', 'DESC')
      .where('result.drw_no_date >= :year', { year: searchYear })
      .limit(1);

    const result = await find.getRawOne();
    return {
      result: result,
      meta: {
        year: year,
        age: age,
        ageTwentyYear: ageTwentyYear,
      },
    };
  }

  findQuery(select: SelectLottoDto): SelectQueryBuilder<LottoResult> {
    /**
     * 임의로 로또 당첨 번호 1~6번은 1의 가중치 보너스 번호는 10의 가중치를 부여한다.
     * 가중치에 따라 1등~5등을 판단
     * acc : 6 -> 1등
     * acc : 15 -> 2등
     * acc : 5 -> 3등
     * acc : 4 -> 4등
     * acc : 3 -> 5등
     */
    const subQuery = (subQuery: SelectQueryBuilder<any>) => {
      return subQuery
        .select('search.drw_no', 'drw_no')
        .addSelect('sum(search.acc)', 'rank')
        .from('lotto_search', 'search')
        .where('search.drwt_no IN (:...nums)', {
          nums: [
            select.drwtNo1,
            select.drwtNo2,
            select.drwtNo3,
            select.drwtNo4,
            select.drwtNo5,
            select.drwtNo6,
          ],
        })
        .groupBy('search.drw_no')
        .having(
          'sum(search.acc) > 14 or (sum(search.acc) > 2 and sum(search.acc) < 7)',
        );
    };

    const find = this.lottoResultRepository
      .createQueryBuilder('result')
      .select([
        'result.drw_no',
        'result.drwt_no1',
        'result.drwt_no2',
        'result.drwt_no3',
        'result.drwt_no4',
        'result.drwt_no5',
        'result.drwt_no6',
        'result.bnus_no',
        'result.drw_no_date',
        `case 
                    when search.rank = 6 then 1
                    when search.rank = 15 then 2
                    when search.rank = 5 then 3
                    when search.rank = 4 then 4
                    when search.rank = 3 then 5
                end AS win_rank`,
        `case 
                    when search.rank = 6 then result.win_pay_rank1
                    when search.rank = 15 then result.win_pay_rank2
                    when search.rank = 5 then result.win_pay_rank3
                    when search.rank = 4 then result.win_pay_rank4
                    when search.rank = 3 then result.win_pay_rank5
                end AS win_pay`,
      ])
      .innerJoin(subQuery, 'search', 'result.drw_no = search.drw_no');

    return find;
  }

  async readLastDrwNo(): Promise<number> {
    const readDrwNo = await this.lottoResultRepository.find({
      select: {
        drwNo: true,
      },
      order: {
        drwNo: 'DESC',
      },
      take: 1,
    });

    const lastDrwNo = readDrwNo[0]?.drwNo ?? 0;
    return lastDrwNo;
  }

  async readAllLottoCount() {
    return await this.lottoResultRepository.count();
  }

  async readLastDrwNoByWeb() {
    const data = await firstValueFrom(
      this.httpService
        .get(this.confingService.get<string>('LOTTO_API_BASE_URL'), {
          params: {
            method: 'byWin',
          },
        })
        .pipe(
          map((res) => res.data),
          catchError((err) => {
            throw err;
          }),
        ),
    );

    if (data === '') {
      throw new NotFoundException('DrwNo not found');
    }

    const html = cheerio.load(data);

    const lastDrwNoCssSelector =
      '#article > div:nth-child(2) > div > div.win_result > h4 > strong' as const;
    const lastDrwNo = html(lastDrwNoCssSelector).text();

    return parseInt(lastDrwNo);
  }
}
