import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class LottoSearch extends BaseEntity{
    @PrimaryColumn()
    drwNo: number				// 로또 회차

    @Column()
    drwtNoType: string          // 로또 번호 정보[1,2,3,4,5,6,보너스]
    
    @Column()
    acc: number		            // 로또 번호 정보별 가중치
    
    @Column()
    drwtNo: number		        // 당첨 번호
               
}