import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { decode } from 'iconv-lite';
import * as cheerio from 'cheerio';
import {
  DhlotteryLottoResult,
  DhlotteryLottoResultSchema,
} from '@/ext/dhlottery/dhlottery.dto';

@Injectable()
export class DhlotteryService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private parseLottoResult(htmlString: string): DhlotteryLottoResult[] {
    const html = cheerio.load(htmlString);
    const lottoResultList: DhlotteryLottoResult[] = [];

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

      const keys = DhlotteryLottoResultSchema.keyof().options;
      const tmp = {};
      html(el)
        .children('td')
        .each((i, el) => {
          const value = html(el)
            .text()
            .replaceAll(new RegExp(',|�|[가-힣]', 'g'), '');

          tmp[keys[i]] = value;
        });

      const lottoResult = DhlotteryLottoResultSchema.parse(tmp);
      lottoResultList.push(lottoResult);
    });

    return lottoResultList;
  }

  async getLottoResult(
    drwNoStart: number,
    drwNoEnd: number,
  ): Promise<DhlotteryLottoResult[]> {
    const baseURL = this.configService.get<string>('DHLOTTERY_BASE_URL');
    const params = {
      method: 'allWinExel',
      gubun: 'byWin',
      drwNoStart,
      drwNoEnd,
    };

    const response = await firstValueFrom(
      this.httpService
        .request({
          baseURL,
          params,
          url: '/gameResult.do',
          method: 'GET',
          responseType: 'arraybuffer',
          responseEncoding: 'binary',
        })
        .pipe(map((res) => decode(Buffer.concat([res.data]), 'euc-kr'))),
    );

    const result = this.parseLottoResult(response);
    return result;
  }

  private parseCurrentDrwNo(htmlString: string): number {
    const html = cheerio.load(htmlString);

    const cssSelecter =
      '#article > div:nth-child(2) > div > div.win_result > h4 > strong' as const;
    const lastDrwNo = html(cssSelecter).text();
    return parseInt(lastDrwNo);
  }

  async getCurrentDrwNo(): Promise<number> {
    const baseURL = this.configService.get<string>('DHLOTTERY_BASE_URL');
    const params = {
      method: 'byWin',
    };

    const response = await firstValueFrom(
      this.httpService
        .request({
          baseURL,
          params,
          url: '/gameResult.do',
          method: 'GET',
          responseType: 'arraybuffer',
          responseEncoding: 'binary',
        })
        .pipe(map((res) => decode(Buffer.concat([res.data]), 'euc-kr'))),
    );

    const result = this.parseCurrentDrwNo(response);
    return result;
  }
}
