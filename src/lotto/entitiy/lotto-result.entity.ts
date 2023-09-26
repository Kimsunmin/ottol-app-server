import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { LottoSearch } from "./lotto-search.entity";

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
    
}