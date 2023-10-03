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
import { SelectQueryBuilder } from 'typeorm';

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

    async find(select: SelectLottoDto) {

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
                .where('search.drwt_no IN (:...nums)',{ nums:[select.drwtNo1, select.drwtNo2, select.drwtNo3, select.drwtNo4, select.drwtNo5, select.drwtNo6,] })
                .groupBy('search.drw_no')
                .having('sum(search.acc) > 14 or (sum(search.acc) > 2 and sum(search.acc) < 7)')
        }

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
            .innerJoin(subQuery, 'search', 'result.drw_no = search.drw_no')
            .orderBy('win_pay', 'DESC')

        return await find.getRawMany();
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
