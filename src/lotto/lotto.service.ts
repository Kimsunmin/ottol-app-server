import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { ReturnValue } from './lotto-return-value.enum';
import { Lotto } from './lotto.entity';
import { LottoRepository } from './lotto.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LottoService {
    constructor(
        private readonly httpService: HttpService,
        private readonly confingService: ConfigService,
        private readonly lottoRepository: LottoRepository,
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

    async create(lotto: Lotto): Promise<Lotto>{
        const res: Lotto = await this.lottoRepository.save({
            ...lotto
        })
        
        return res
    }

    async init(drwNo: number = 1) {
        let firstDrwNo = drwNo;

        console.time('init_time');
        while(true) {
            const find: Lotto = await this.getLottoByDrwNo(firstDrwNo++);
            
            if(find) {
                await this.create(find);
            } else {
                break;
            }

            if (firstDrwNo % 100 === 0) console.log(`drwNo : ${firstDrwNo} save`);
        }
        console.timeEnd('init_time');
    }

    
}
