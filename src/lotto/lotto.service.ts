import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { ReturnValue, excelColArr } from './lotto-return-value.enum';
import { Lotto } from './entitiy/lotto.entity';
import { LottoRepository, LottoResultRepository } from './lotto.repository';
import { ConfigService } from '@nestjs/config';
import { SelectLottoDto } from './dto/select-lotto.dto';
import * as cheerio from 'cheerio';
import { LottoResult } from './entitiy/lotto-result.entity';

@Injectable()
export class LottoService {
    constructor(
        private readonly httpService: HttpService,
        private readonly confingService: ConfigService,
        private readonly lottoRepository: LottoRepository,
        private readonly lottoResultRepository: LottoResultRepository,
    ) {}

    async getLottoByDrwNo(drwNo: number): Promise<Lotto> {
        const {returnValue, ...find } = await firstValueFrom(
            this.httpService.get(
                this.confingService.get<string>('LOTTO_API_BASE_URL'),
                {
                    params: {
                        method: this.confingService.get('LOTTO_API_METHOD'),
                        drwNo: drwNo,
                    }
            })
            .pipe(map( res => res.data ))
        )

        return returnValue === ReturnValue.SUCCESS ? find : undefined;
    } 

    async getLottoByDrwNo2(drwNoStart: number, drwNoEnd: number): Promise<LottoResult[]> {
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

        const html = cheerio.load(data);

        const useData: LottoResult[] = [];

        const tr = html('tr');
        tr.each(function (i, el) {
            // 처음 2줄은 생략
            if(i > 2){
                const excelObj: any = {};

                html(this).children('td').filter(function() { return !html(this).attr('rowspan')}).each(function (i, el) {
                    const val = html(this).text();
                    excelObj[excelColArr[i]] = val.replaceAll(new RegExp('\,|\�|[가-힣]', 'g'), '');
                })
                useData.push(excelObj);
            }
        })
        return useData;
    }

    async setLotto(drwNoStart: number, drwNoEnd: number) {
        console.time('excel_download_save');
        const lottoResultList: LottoResult[] = await this.getLottoByDrwNo2(drwNoStart, drwNoEnd);

        lottoResultList.forEach((val, i, arr) => {
            this.lottoResultRepository.save({...val});
        })

        console.timeEnd('excel_download_save');
    }

    async create(lotto: Lotto): Promise<Lotto>{
        const res: Lotto = await this.lottoRepository.save({
            ...lotto
        })
        
        return res
    }

    async init(drwNo: number = 1) {
        console.log(`init() method start by DrwNo: ${drwNo}`)
        let firstDrwNo = drwNo;

        console.time('init_time');
        while(true) {
            let find: Lotto = undefined;
            try {
                find = await this.getLottoByDrwNo(firstDrwNo);
                
                if(!find) break;

                await this.create(find);

                if (firstDrwNo % 100 === 0) console.log(`drwNo : ${firstDrwNo} save`);

            } catch (error) {
                //const retryDrwNo = firstDrwNo + 1;

                //console.timeEnd('init_time');
                console.log(`ERROR: ${error} last save DrwNo: ${firstDrwNo-1} retry DrwNo: ${firstDrwNo-1}`);
                firstDrwNo -= 1;
                //await this.init(retryDrwNo);
            }

            firstDrwNo += 1;
        }
        console.timeEnd('init_time');
    }

    async find(selectLottoDto: SelectLottoDto): Promise<Lotto[]> {
        const findList: Lotto[] = await this.lottoRepository.find({
            where: {
                drwtNo1: selectLottoDto.drwtNo1,
                drwtNo2: selectLottoDto.drwtNo2,
                drwtNo3: selectLottoDto.drwtNo3,
                drwtNo4: selectLottoDto.drwtNo4,
                drwtNo5: selectLottoDto.drwtNo5,
                drwtNo6: selectLottoDto.drwtNo6,
            }
        });

        return findList;
    }

}
