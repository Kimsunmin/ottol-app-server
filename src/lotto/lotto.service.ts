import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SelectQueryBuilder } from 'typeorm';
import { map, firstValueFrom, catchError } from 'rxjs';
import { parserByHtml, transData, parserGetMaxDrwNo } from './lotto.utils';
import { LottoResultRepository, LottoSearchRepository } from './lotto.repository';
import { SelectLottoDto } from './dto/select-lotto.dto';
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

        return parserByHtml(data);
    }

    async setLotto(drwNoStart: number, drwNoEnd: number) {
        console.log(`excel_download_save... start:${drwNoStart}, end:${drwNoEnd}`);
        console.time('excel_download_save');
        const lottoResultList: LottoResult[] = await this.getLottoByDrwNo(drwNoStart, drwNoEnd);

        lottoResultList.forEach((val, i, arr) => {
            //lottoResult add
            this.createLottoResult(val)

            //LottoSearch add
            this.createLottoSearch(transData(val));
        })

        console.timeEnd('excel_download_save');
        return {
            drwNoStart: lottoResultList[0].drwNo,
            drwNoEnd: lottoResultList[lottoResultList.length-1].drwNo,
            saveCount: lottoResultList.length
        }
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
    
    async findMaxDrwNo(): Promise<number> {
        const maxDrwNo = await this.lottoResultRepository.find({
            take: 1,
            order: {
                drwNo: 'DESC'
            }
        });

        // html데이터 필요
        const maxDrwNoByWeb = parserGetMaxDrwNo('');
         

        return Math.max(maxDrwNo[0].drwNo, maxDrwNoByWeb);
    }

    async createLottoResult(lottoResult: LottoResult): Promise<LottoResult>{
        return await this.lottoResultRepository.save({...lottoResult});
    }

    async createLottoSearch(lottoSearch: LottoSearch[]): Promise<LottoSearch[]>{ 
        return await this.lottoSearchRepository.save(lottoSearch);
    }

    
}
