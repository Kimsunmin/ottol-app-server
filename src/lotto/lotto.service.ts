import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { Lotto, ReturnValue } from './lotto.model';

@Injectable()
export class LottoService {
    constructor(private readonly httpService: HttpService) {}

    private readonly url = 'http://www.dhlottery.co.kr/common.do';

    async findOne(drwNo: number): Promise<Lotto> {
        const find = await firstValueFrom(
            this.httpService.get(this.url,{
                params: {
                    method: 'getLottoNumber',
                    drwNo: drwNo,
                }
            })
            .pipe(map( res => res.data ))
        )

        return find
    }

    async findAll() {
        let num = 1080;

        const lottoList: Lotto[] = [];

        while(true){
            console.log(num);
            const find: Lotto = await this.findOne(num++);

            if(find.returnValue === ReturnValue.FAIL){
                num -= 2;
                break;
            }else {
                lottoList.push(find)
            }
            console.log(`lottoList size -> ${lottoList.length}`)
        }
        console.log(num);
        return this.findOne(num);
    }
}
