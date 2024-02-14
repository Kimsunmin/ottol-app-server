import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SelectLottoDto } from './lotto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LottoSearchHisoryEntity } from '@/lotto/lotto-search-history.entity';
import { DhlotteryService } from '@/ext/dhlottery/dhlottery.service';
import { LottoDrawInfoEntity } from '@/lotto/lotto-draw-info.entity';
import { LottoDrawResultEntity } from '@/lotto/lotto-draw-result.entity';
import { LottoSearchEntity } from '@/lotto/lotto-search.entity';

@Injectable()
export class LottoService {
  constructor(
    private readonly dhlotteryService: DhlotteryService,

    @InjectRepository(LottoSearchHisoryEntity)
    private readonly lottoSearchHistoryRepository: Repository<LottoSearchHisoryEntity>,

    @InjectRepository(LottoDrawInfoEntity)
    private readonly lottoDrawInfoRepository: Repository<LottoDrawInfoEntity>,

    @InjectRepository(LottoDrawResultEntity)
    private readonly lottoDrawResultRepository: Repository<LottoDrawResultEntity>,

    @InjectRepository(LottoSearchEntity)
    private readonly lottoSearchRepository: Repository<LottoSearchEntity>,
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

    const newLottoDrawInfo = getLottoResult.map((result) => {
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

      return this.lottoDrawInfoRepository.create({
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

    await this.lottoDrawInfoRepository.save(newLottoDrawInfo, {
      reload: false,
    });

    const newLottoDrawResult = getLottoResult
      .map((result) => {
        return new Array(5)
          .fill({ draw: { drawRound: result.drwNo } })
          .map((detail, i) => {
            const winRank = i + 1;

            detail.winRank = winRank;
            detail.winNumber = result[`winnerRank${winRank}`];
            detail.winAmount = result[`winPayRank${winRank}`];

            return this.lottoDrawResultRepository.create(detail);
          })
          .flat();
      })
      .flat();

    await this.lottoDrawResultRepository.save(newLottoDrawResult, {
      reload: false,
    });

    const newLottoSearch = newLottoDrawInfo
      .map((lottoDrawInfo) => {
        const keys = Object.keys(lottoDrawInfo.drawNumbers);

        return keys
          .map((key) => {
            const acc = key === 'bnus' ? 10 : 1;
            const { drawRound, drawNumbers } = lottoDrawInfo;

            return this.lottoSearchRepository.create({
              drawRound: drawRound,
              drawNumber: drawNumbers[key],
              acc,
            });
          })
          .flat();
      })
      .flat();

    await this.lottoSearchRepository.save(newLottoSearch, { reload: false });
  }

  async readSavedLastDrawRound() {
    const result = (await this.lottoDrawInfoRepository
      .createQueryBuilder('info')
      .select('MAX(info.draw_round)', 'drawRound')
      .getRawOne()) as { drawRound: number | null };

    const { drawRound } = result;
    if (!drawRound) {
      return 0;
    }

    return drawRound;
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
        .from('lotto_search', 'search')
        .where('search.draw_number IN (:...numbers)', { numbers })
        .groupBy('search.draw_round')
        .having(
          'sum(search.acc) > 14 or (sum(search.acc) > 2 and sum(search.acc) < 7)',
        );
    };

    return query;
  }

  async checkLottoDrawResult(dto: { selectNumbers: SelectLottoDto }) {
    const { selectNumbers } = dto;
    const searchQuery = this.getLottoSearchQuery(selectNumbers);

    const query = this.lottoDrawInfoRepository
      .createQueryBuilder('info')
      .innerJoin(searchQuery, 'search', 'info.draw_round = search.draw_round')
      .leftJoinAndSelect(
        'info.drawResults',
        'result',
        'result.win_rank = search.win_rank',
      );

    const result = await query.getMany();
    return result;
  }

  async checkLottoDrawResultByYear(dto: {
    selectNumbers: SelectLottoDto;
    year: number;
  }) {
    const { selectNumbers, year } = dto;
    const searchQuery = this.getLottoSearchQuery(selectNumbers);

    const query = this.lottoDrawInfoRepository
      .createQueryBuilder('info')
      .innerJoin(searchQuery, 'search', 'info.draw_round = search.draw_round')
      .leftJoinAndSelect(
        'info.drawResults',
        'result',
        'result.win_rank = search.win_rank',
      )
      .where('info.draw_date >= :year', { year: year })
      .orderBy('result.win_Amount', 'DESC')
      .addOrderBy('info.draw_round', 'DESC')
      .limit(1);

    const result = await query.getOne();

    const newSearchHistory = this.lottoSearchHistoryRepository.create({
      drawNumbers: {
        '1': result.drawNumbers[1],
        '2': result.drawNumbers[2],
        '3': result.drawNumbers[3],
        '4': result.drawNumbers[4],
        '5': result.drawNumbers[5],
        '6': result.drawNumbers[6],
      },
      drawResult: result.drawResults[0],
    });
    this.lottoSearchHistoryRepository.save(newSearchHistory);

    return result;
  }
}
