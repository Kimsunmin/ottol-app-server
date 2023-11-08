import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import * as cheerio from 'cheerio';

@Entity()
export class LottoResult extends BaseEntity{
    @PrimaryColumn()
    drwNo: number				// 로또회차

    @Column({comment: '날짜'})
    drwNoDate: string			// 날짜
    
    @Column({type: 'bigint'})
    winPayRank1: number		    // 1등 상금액
    
    @Column()
    winnerRank1: number		    // 1등 당첨인원
            
    @Column({type: 'bigint'})
    winPayRank2: number		    // 2등 상금액
    
    @Column()
    winnerRank2: number		    // 2등 당첨인원
        
    @Column({type: 'bigint'})
    winPayRank3: number		    // 3등 상금액
    
    @Column()
    winnerRank3: number		    // 3등 당첨인원
        
    @Column({type: 'bigint'})
    winPayRank4: number		    // 4등 상금액
    
    @Column()
    winnerRank4: number		    // 4등 당첨인원
        
    @Column({type: 'bigint'})
    winPayRank5: number		    // 5등 상금액
    
    @Column()
    winnerRank5: number		    // 5등 당첨인원

    @Column()
    drwtNo1: number				// 로또번호 1
    
    @Column()
    drwtNo2: number				// 로또번호 2
    
    @Column()
    drwtNo3: number				// 로또번호 3
    
    @Column()
    drwtNo4: number				// 로또번호 4
    
    @Column()
    drwtNo5: number				// 로또번호 5
    
    @Column()
    drwtNo6: number				// 로또번호 6
    
    @Column()
    bnusNo: number				// 로또 보너스 번호
    
    static parserByHtml(htmlData: string): LottoResult[] {
        const html = cheerio.load(htmlData);
    
        const useData: LottoResult[] = [];

        const excelColArr = [
            'drwNo', 'drwNoDate', 
            'winnerRank1', 'winPayRank1', 
            'winnerRank2', 'winPayRank2',
            'winnerRank3', 'winPayRank3', 
            'winnerRank4', 'winPayRank4', 
            'winnerRank5', 'winPayRank5', 
            'drwtNo1', 'drwtNo2', 'drwtNo3', 'drwtNo4', 'drwtNo5', 'drwtNo6', 'bnusNo'];
    
        const tr = html('tr');
        tr.each(function (i, el) {
            // 처음 2줄은 생략
            if(i > 2){
                const excelObj: any = {};
                //const excelColArr = Object.keys(LottoResult.prototype);
                //console.log(excelColArr);

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