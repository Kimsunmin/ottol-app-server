import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { excelColArr, lottoSearchMapper } from './lotto.utils';
import { LottoResultRepository, LottoSearchRepository } from './lotto.repository';
import { ConfigService } from '@nestjs/config';
import { SelectLottoDto } from './dto/select-lotto.dto';
import * as cheerio from 'cheerio';
import { LottoResult } from './entitiy/lotto-result.entity';
import { LottoSearch } from './entitiy/lotto-search.entity';

@Injectable()
export class LottoService {
    constructor(
        private readonly httpService: HttpService,
        private readonly confingService: ConfigService,
        private readonly lottoResultRepository: LottoResultRepository,
        private readonly lottoSearchRepository: LottoSearchRepository,
    ) {}

    async getLottoByDrwNo(drwNoStart: number, drwNoEnd: number): Promise<LottoResult[]> {
        const data = await firstValueFrom(
            this.httpService.get(
                this.confingService.get<string>('LOTTO_API_BASE_URL'),
                {
                    params: {
                        method: this.confingService.get<string>('LOTTO_API_METHOD'),
                        gubun: this.confingService.get<string>('LOTTO_API_GUBUN'),
                        drwNoStart: drwNoStart,
                        drwNoEnd: drwNoEnd,
                    }
                }
            ).pipe(map(res => res.data))
        )

        return this.parserByHtml(data);
    }

    async setLotto(drwNoStart: number, drwNoEnd: number) {
        console.log(`excel_download_save... start:${drwNoStart}, end:${drwNoEnd}`);
        console.time('excel_download_save');
        const lottoResultList: LottoResult[] = await this.getLottoByDrwNo(drwNoStart, drwNoEnd);

        lottoResultList.forEach((val, i, arr) => {
            //lottoResult add
            this.createLottoResult(val)

            //LottoSearch add
            this.createLottoSearch(this.transData(val));
        })

        console.timeEnd('excel_download_save');
    }

    async find() {
        
    }

    async createLottoResult(lottoResult: LottoResult): Promise<LottoResult>{
        return await this.lottoResultRepository.save({...lottoResult})
    }

    async createLottoSearch(lottoSearch: LottoSearch[]): Promise<LottoSearch[]>{
        return await this.lottoSearchRepository.save(lottoSearch)
    }

    // lottoResult -> lottoSearch 데이터 변환
    transData(lottoResult: LottoResult): LottoSearch[] {
        const mapper = lottoSearchMapper;

        const keys = Object.keys(lottoResult);
        const lottoSearchList: LottoSearch[] = [];

        keys.forEach((val, i) => {
            if(mapper[val]){
                const tmp: any = {
                    drwNo: lottoResult.drwNo,
                    drwtNoType: mapper[val].drwtNoType,
                    acc: mapper[val].acc,
                    drwtNo: lottoResult[val]
                };

                lottoSearchList.push({...tmp});
            }
        });
        return lottoSearchList;
    }

    parserByHtml(htmlData: string): LottoResult[] {
        const html = cheerio.load(htmlData);

        const useData: LottoResult[] = [];

        const tr = html('tr');
        tr.each(function (i, el) {
            // 처음 2줄은 생략
            if(i > 2){
                const excelObj: any = {};

                html(this).children('td').filter(function() {
                    // 첫번째 당첨 연도 열 제외
                    return !html(this).attr('rowspan')
                }).each(function (i, el) {
                    const val = html(this).text();
                    
                    // --원, --등, 및 불필요 문자 제거
                    excelObj[excelColArr[i]] = val.replaceAll(new RegExp('\,|\�|[가-힣]', 'g'), '');
                })

                useData.push(excelObj);
            }
        })
        return useData;
    }

}
