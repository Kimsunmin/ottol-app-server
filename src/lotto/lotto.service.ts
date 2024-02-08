import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SelectLottoDto } from './lotto.dto';
import { LottoResultEntity } from './lotto-result.entity';
import { LottoSearchEntity } from './lotto-search.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionDto } from '../lotto/dto/page-option.dto';
import { PageMetaDto } from '../lotto/dto/page-meta.dto';
import { PageDto } from '../lotto/dto/page.dto';
import { LottoSearchHisoryEntity } from '@/lotto/lotto-search-history.entity';
import { DhlotteryService } from '@/ext/dhlottery/dhlottery.service';
import { LottoMasterEntity } from '@/lotto/lotto-master.entity';
import { LottoDetailEntity } from '@/lotto/lotto-detail.entity';
import { LottoSearchNewEntity } from '@/lotto/lotto-search-new.entity';

@Injectable()
export class LottoService {
  constructor(
    private readonly dhlotteryService: DhlotteryService,

    @InjectRepository(LottoResultEntity)
    private readonly lottoResultRepository: Repository<LottoResultEntity>,

    @InjectRepository(LottoSearchEntity)
    private readonly lottoSearchRepository: Repository<LottoSearchEntity>,

    @InjectRepository(LottoSearchHisoryEntity)
    private readonly lottoSearchHistoryRepository: Repository<LottoSearchHisoryEntity>,

    @InjectRepository(LottoMasterEntity)
    private readonly lottoMasterRepository: Repository<LottoMasterEntity>,

    @InjectRepository(LottoDetailEntity)
    private readonly lottoDetailRepository: Repository<LottoDetailEntity>,

    @InjectRepository(LottoSearchNewEntity)
    private readonly lottoSearchNewRepository: Repository<LottoSearchNewEntity>,
  ) {}

  async read(select: PageOptionDto): Promise<PageDto<any>> {
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

  async readByYear(select: SelectLottoDto, year: number) {
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

    this.lottoSearchHistoryRepository.save(
      this.lottoSearchHistoryRepository.create({
        ...select,
        drwNo: result.drw_no,
        winRank: result.win_rank,
        winPay: result.win_pay,
      }),
    );

    return {
      result: result,
      meta: {
        year: year,
        age: age,
        ageTwentyYear: ageTwentyYear,
      },
    };
  }

  findQuery(select: SelectLottoDto): SelectQueryBuilder<LottoResultEntity> {
    /**
     * 임의로 로또 당첨 번호 1~6번은 1의 가중치 보너스 번호는 10의 가중치를 부여한다.
     * 가중치에 따라 1등~5등을 판단
     * acc : 6 -> 1등
     * acc : 15 -> 2등
     * acc : 5 -> 3등
     * acc : 4 -> 4등
     * acc : 3 -> 5등
     */
    const selectNumbers = [...Object.values(select)] as number[];
    const subQuery = (subQuery: SelectQueryBuilder<any>) => {
      return subQuery
        .select('search.drw_no', 'drw_no')
        .addSelect('sum(search.acc)', 'rank')
        .from('lotto_search', 'search')
        .where('search.drwt_no IN (:...nums)', {
          nums: selectNumbers,
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

  // 새로 변경될 코드
  async createLotto(drwNoStart: number, drwNoEnd: number) {
    const getLottoResult = await this.dhlotteryService.getLottoResult(
      drwNoStart,
      drwNoEnd,
    );

    const newLottoMaster = getLottoResult.map((result) => {
      const {
        drwNo,
        drwNoDate,
        drwtNo1,
        drwtNo2,
        drwtNo3,
        drwtNo4,
        drwtNo5,
        drwtNo6,
        bnusNo,
      } = result;

      return this.lottoMasterRepository.create({
        drwNo,
        drwNoDate,
        numbers: {
          1: drwtNo1,
          2: drwtNo2,
          3: drwtNo3,
          4: drwtNo4,
          5: drwtNo5,
          6: drwtNo6,
          bnus: bnusNo,
        },
      });
    });

    await this.lottoMasterRepository.save(newLottoMaster, { reload: false });

    const newLottoDetail = getLottoResult
      .map((result) => {
        return new Array(5)
          .fill({ drwNo: result.drwNo })
          .map((detail, i) => {
            const winRank = i + 1;

            detail.winRank = winRank;
            detail.winNumber = result[`winnerRank${winRank}`];
            detail.winAmount = result[`winPayRank${winRank}`];

            return this.lottoDetailRepository.create(detail);
          })
          .flat();
      })
      .flat();

    await this.lottoDetailRepository.save(newLottoDetail, { reload: false });

    const newLottoSearch = newLottoMaster
      .map((master) => {
        const keys = Object.keys(master.numbers);

        return keys
          .map((key) => {
            const acc = key === 'bnus' ? 10 : 1;
            const { drwNo, numbers } = master;

            return this.lottoSearchNewRepository.create({
              drwNo,
              number: numbers[key],
              acc,
            });
          })
          .flat();
      })
      .flat();

    await this.lottoSearchNewRepository.save(newLottoSearch, { reload: false });
  }

  async readLottoSearch(selectNumbers: SelectLottoDto) {
    const numbers = [...Object.values(selectNumbers)] as number[];

    const result = await this.lottoSearchNewRepository
      .createQueryBuilder('search')
      .select('search.drw_no', 'drwNo')
      .addSelect(
        `case 
          when sum(search.acc) = 6 then 1
          when sum(search.acc) = 15 then 2
          when sum(search.acc) = 5 then 3
          when sum(search.acc) = 4 then 4
          when sum(search.acc) = 3 then 5
          end AS "winRank"`,
      )
      .where('search.number IN (:...numbers)', { numbers })
      .groupBy('search.drw_no')
      .having(
        'sum(search.acc) > 14 or (sum(search.acc) > 2 and sum(search.acc) < 7)',
      )
      .orderBy('sum(search.acc)', 'DESC')
      .addOrderBy('search.drw_no', 'DESC')
      .getRawMany();

    return result as { drwNo: number; winRank: number }[];
  }

  async readLottoMaster(searchList: { drwNo: number; winRank: number }[]) {
    const result = await Promise.all(
      searchList.map(async (search) => {
        const { drwNo, winRank } = search;

        return await this.lottoMasterRepository.find({
          relations: {
            details: true,
          },
          where: {
            drwNo,
            details: {
              winRank,
            },
          },
        });
      }),
    );

    return result;
  }
}
