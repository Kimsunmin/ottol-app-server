import { Injectable, NotFoundException } from '@nestjs/common';
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

    @InjectRepository(LottoSearchHisoryEntity)
    private readonly lottoSearchHistoryRepository: Repository<LottoSearchHisoryEntity>,

    @InjectRepository(LottoMasterEntity)
    private readonly lottoMasterRepository: Repository<LottoMasterEntity>,

    @InjectRepository(LottoDetailEntity)
    private readonly lottoDetailRepository: Repository<LottoDetailEntity>,

    @InjectRepository(LottoSearchNewEntity)
    private readonly lottoSearchNewRepository: Repository<LottoSearchNewEntity>,
  ) {}

  private getTwentyYear(year: number) {
    const nowYear = new Date().getFullYear();
    const age = nowYear - year;
    const ageTwentyYear = nowYear + (19 - age);
    const searchYear = 19 > age ? year : ageTwentyYear;
    return searchYear;
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
        drawRound: drwNo,
        drawDate: drwNoDate,
        drawNumbers: {
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
          .fill({ draw: { drawRound: result.drwNo } })
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
        const keys = Object.keys(master.drawNumbers);

        return keys
          .map((key) => {
            const acc = key === 'bnus' ? 10 : 1;
            const { drawRound: drwNo, drawNumbers: numbers } = master;

            return this.lottoSearchNewRepository.create({
              drawRound: drwNo,
              drawNumber: numbers[key],
              acc,
            });
          })
          .flat();
      })
      .flat();

    await this.lottoSearchNewRepository.save(newLottoSearch, { reload: false });
  }

  async readSavedLastDrawRound() {
    const result = (await this.lottoMasterRepository
      .createQueryBuilder('master')
      .select('MAX(master.draw_round)', 'drawRound')
      .getRawOne()) as { drawRound: number | null };

    const { drawRound } = result;
    if (!drawRound) {
      return 0;
    }

    return drawRound;
  }

  async readLottoSearch(selectNumbers: SelectLottoDto) {
    const numbers = [...Object.values(selectNumbers)] as number[];

    const result = await this.lottoSearchNewRepository
      .createQueryBuilder('search')
      .select('search.draw_round', 'drawRound')
      .addSelect(
        `case 
          when sum(search.acc) = 6 then 1
          when sum(search.acc) = 15 then 2
          when sum(search.acc) = 5 then 3
          when sum(search.acc) = 4 then 4
          when sum(search.acc) = 3 then 5
          end AS "winRank"`,
      )
      .where('search.draw_number IN (:...numbers)', { numbers })
      .groupBy('search.draw_round')
      .having(
        'sum(search.acc) > 14 or (sum(search.acc) > 2 and sum(search.acc) < 7)',
      )
      .orderBy('sum(search.acc)', 'DESC')
      .addOrderBy('search.draw_round', 'DESC')
      .getRawMany();

    return result as { drawRound: number; winRank: number }[];
  }

  private getLottoSearchQuery(selectNumbers: SelectLottoDto) {
    const numbers = [...Object.values(selectNumbers)] as number[];

    const query = (subQuery: SelectQueryBuilder<any>) => {
      return subQuery
        .select('search.draw_round')
        .addSelect(
          `case 
          when sum(search.acc) = 6 then 1
          when sum(search.acc) = 15 then 2
          when sum(search.acc) = 5 then 3
          when sum(search.acc) = 4 then 4
          when sum(search.acc) = 3 then 5
          end AS "win_rank"`,
        )
        .from('lotto_search_new', 'search')
        .where('search.draw_number IN (:...numbers)', { numbers })
        .groupBy('search.draw_round')
        .having(
          'sum(search.acc) > 14 or (sum(search.acc) > 2 and sum(search.acc) < 7)',
        );
    };

    return query;
  }

  async readLottoDrawResult(dto: {
    selectNumbers: SelectLottoDto;
    year?: number;
  }) {
    const { selectNumbers, year } = dto;
    const searchQuery = this.getLottoSearchQuery(selectNumbers);

    const query = this.lottoMasterRepository
      .createQueryBuilder('master')
      .innerJoin(searchQuery, 'search', 'master.draw_round = search.draw_round')
      .leftJoinAndSelect(
        'master.drawResults',
        'result',
        'result.win_rank = search.win_rank',
      );

    const result = await query.getMany();
    return result;
  }

  async readLottoDrawResultByYear(dto: {
    selectNumbers: SelectLottoDto;
    year: number;
  }) {
    const { selectNumbers, year } = dto;
    const searchQuery = this.getLottoSearchQuery(selectNumbers);

    const query = this.lottoMasterRepository
      .createQueryBuilder('master')
      .innerJoin(searchQuery, 'search', 'master.draw_round = search.draw_round')
      .leftJoinAndSelect(
        'master.drawResults',
        'result',
        'result.win_rank = search.win_rank',
      )
      .where('master.draw_date >= :year', { year: year })
      .orderBy('result.win_Amount', 'DESC')
      .addOrderBy('master.draw_round', 'DESC')
      .limit(1);

    const result = await query.getOne();

    const newSearchHistory = this.lottoSearchHistoryRepository.create({
      ...selectNumbers,
      drwNo: result.drawRound,
      winPay: result.drawResults[0].winAmount,
      winRank: result.drawResults[0].winRank,
    });
    this.lottoSearchHistoryRepository.save(newSearchHistory);

    return result;
  }
}
