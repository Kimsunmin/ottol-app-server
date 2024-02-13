import { LottoService } from '@/lotto/lotto.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { catchError, firstValueFrom, map } from 'rxjs';
import * as cheerio from 'cheerio';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { LottoResultEntity } from '@/lotto/lotto-result.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LottoSearchEntity } from '@/lotto/lotto-search.entity';
import { LottoResultSchema } from '@/lotto/lotto.dto';
import { CommonLottoSchema } from '@/common/common-lotto.dto';

@Injectable()
export class LottoTaskService {
  constructor(
    private readonly lottoService: LottoService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,

    @InjectRepository(LottoResultEntity)
    private readonly lottoResultRepository: Repository<LottoResultEntity>,

    @InjectRepository(LottoSearchEntity)
    private readonly lottoSearchRepository: Repository<LottoSearchEntity>,
  ) {}

  @Cron('0 50 20 * * 6') // 매주 토요일 20시 50분 마다 실행
  async updateLotto() {
    const drwNoStart = (await this.lottoService.readLastDrwNo()) + 1;
    const drwNoEnd = Math.max(drwNoStart, await this.getLastDrwNo());

    await this.createLotto(drwNoStart, drwNoEnd);
  }

  async createLotto(drwNoStart: number, drwNoEnd: number) {
    console.log(`excel_download_save... start:${drwNoStart}, end:${drwNoEnd}`);
    console.time('excel_download_save');

    const lottoResultList = await this.getLottoResult({
      drwNoStart,
      drwNoEnd,
    });

    const lottoSearchList = lottoResultList
      .map((result) => this.lottoResultToSearch(result))
      .flat();

    if (lottoResultList.length !== lottoSearchList.length / 7) {
      throw new ConflictException('');
    }

    const lottoResultSaveResult = await this.saveLottoResult(lottoResultList);
    await this.saveLottoSearch(lottoSearchList);

    console.timeEnd('excel_download_save');
    return lottoResultSaveResult;
  }

  private lottoResultToSearch(
    lottoResult: LottoResultEntity,
  ): LottoSearchEntity[] {
    const { drwNo } = lottoResult;
    const keys = CommonLottoSchema.keyof().options;

    return keys.map((val) => {
      return this.lottoSearchRepository.create({
        drwNo,
        drwtNoType: val,
        drwtNo: lottoResult[val],
        acc: val === 'bnusNo' ? 10 : 1,
      });
    });
  }

  async saveLottoResult(lottoResult: LottoResultEntity[]) {
    return await this.lottoResultRepository.save(lottoResult);
  }

  async saveLottoSearch(lottoSearch: LottoSearchEntity[]) {
    return await this.lottoSearchRepository.save(lottoSearch);
  }

  async getLottoResult(dto: { drwNoStart: number; drwNoEnd: number }) {
    const lottoResult = await firstValueFrom(
      this.httpService
        .get(this.configService.get<string>('LOTTO_API_BASE_URL'), {
          params: {
            method: 'allWinExel',
            gubun: 'byWin',
            drwNoStart: dto.drwNoStart,
            drwNoEnd: dto.drwNoEnd,
          },
        })
        .pipe(
          map((res) => this.htmlToLottoResult(res.data)),
          catchError((err) => {
            throw err;
          }),
        ),
    );

    return lottoResult;
  }

  private htmlToLottoResult(htmlString: string) {
    const html = cheerio.load(htmlString);
    const lottoResultList: LottoResultEntity[] = [];

    const tr = html('tr');
    tr.each((i, el) => {
      // 처음 2줄은 생략
      if (i <= 2) {
        return;
      }

      const firstChildren = html(el).children('td').first().attr();
      // 첫번째 컬럼에 연도데이터는 제거
      if (firstChildren?.rowspan) {
        html(el).children('td').first().remove();
      }

      const keys = LottoResultSchema.keyof().options;
      const tmp = {};
      html(el)
        .children('td')
        .each((i, el) => {
          const value = html(el)
            .text()
            .replaceAll(new RegExp(',|�|[가-힣]', 'g'), '');

          tmp[keys[i]] = value;
        });
      const lottoResult = this.lottoResultRepository.create(tmp);
      lottoResultList.push(lottoResult);
    });

    return lottoResultList;
  }

  async getLastDrwNo() {
    const result = await firstValueFrom(
      this.httpService
        .get(this.configService.get<string>('LOTTO_API_BASE_URL'), {
          params: {
            method: 'byWin',
          },
        })
        .pipe(
          map((res) => {
            const html = cheerio.load(res.data);

            const lastDrwNoCssSelector =
              '#article > div:nth-child(2) > div > div.win_result > h4 > strong' as const;
            const lastDrwNo = html(lastDrwNoCssSelector).text();
            return parseInt(lastDrwNo);
          }),
          catchError((err) => {
            throw err;
          }),
        ),
    );

    if (!result) {
      throw new NotFoundException('DrwNo not found');
    }

    return result;
  }
}
