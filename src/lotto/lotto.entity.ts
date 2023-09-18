import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Lotto extends BaseEntity{
    @PrimaryColumn()
    drwNo: number				// 로또회차

    @Column()
    drwNoDate: string			// 날짜
    
    @Column({type: 'bigint'})
    totSellamnt: number			// 총상금액
    
    @Column({type: 'bigint'})
    firstWinamnt: number		// 1등 상금액
    
    @Column()
    firstPrzwnerCo: number		// 1등 당첨인원
    
    @Column({type: 'bigint', nullable: true})
    firstAccumamnt: number      // ?
    
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