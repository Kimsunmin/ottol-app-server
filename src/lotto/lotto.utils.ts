import * as cheerio from 'cheerio';
import { LottoResult } from './entitiy/lotto-result.entity';
import { LottoSearch } from './entitiy/lotto-search.entity';

export enum ReturnValue {
    SUCCESS = 'success',
    FAIL = 'fail',
}
// 엑셀 컬럼명 배열
export const excelColArr = [
    'drwNo', 'drwNoDate', 
    'winnerRank1', 'winPayRank1', 
    'winnerRank2', 'winPayRank2',
    'winnerRank3', 'winPayRank3', 
    'winnerRank4', 'winPayRank4', 
    'winnerRank5', 'winPayRank5', 
    'drwtNo1', 'drwtNo2', 'drwtNo3', 'drwtNo4', 'drwtNo5', 'drwtNo6', 'bnusNo'];

export const lottoSearchMapper = {
    drwtNo1: {
        drwtNoType: 'drwt_no1',
        acc: 1
    },
    drwtNo2: {
        drwtNoType: 'drwt_no2',
        acc: 1
    },
    drwtNo3: {
        drwtNoType: 'drwt_no3',
        acc: 1
    },
    drwtNo4: {
        drwtNoType: 'drwt_no4',
        acc: 1
    },
    drwtNo5: {
        drwtNoType: 'drwt_no5',
        acc: 1
    },
    drwtNo6: {
        drwtNoType: 'drwt_no6',
        acc: 1
    },
    bnusNo: {
        drwtNoType: 'buns_no',
        acc: 10
    }
};


// lottoResult -> lottoSearch 데이터 변환
export function transData(lottoResult: LottoResult): LottoSearch[] {
    const mapper = lottoSearchMapper;

    const keys = Object.keys(mapper);

    const lottoSearchList: any[] = keys.map(v => {
            return {
                drwNo: lottoResult.drwNo,
                drwtNoType: mapper[v].drwtNoType,
                acc: mapper[v].acc,
                drwtNo: lottoResult[v]
            }
    });

    return lottoSearchList;
}

export function parserByHtml(htmlData: string): LottoResult[] {
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

export function parserGetMaxDrwNo(htmlData: string): number {

    if(htmlData === ''){
        return 0;
    }

    const html = cheerio.load(htmlData);

    const maxDrwNo = html('#article > div:nth-child(2) > div > div.win_result > h4 > strong').text();

    return parseInt(maxDrwNo);
}