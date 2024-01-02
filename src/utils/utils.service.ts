import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class UtilsService {
  constructor(private httpService: HttpService) {}

  async callApiByGet(url: string, config: AxiosRequestConfig): Promise<string> {
    const getData: Observable<AxiosResponse<any, any>> = this.httpService.get(
      url,
      config,
    );

    const result = await firstValueFrom(getData.pipe(map((res) => res.data)));

    return result;
  }

  parserDrwNoByHtml(htmlData: string): number {
    if (htmlData === '') {
      return 0;
    }

    const html = cheerio.load(htmlData);

    const maxDrwNo = html(
      '#article > div:nth-child(2) > div > div.win_result > h4 > strong',
    ).text();

    return parseInt(maxDrwNo);
  }
}
