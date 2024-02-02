import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'lotto_search' })
export class LottoSearchEntity extends BaseEntity {
  @PrimaryColumn({ comment: '로또 회차' })
  drwNo: number; // 로또 회차

  @Column({ comment: '로또 번호 정보 타입' })
  drwtNoType: string; // 로또 번호 정보[1,2,3,4,5,6,보너스]

  @Column()
  acc: number; // 로또 번호 정보별 가중치

  @PrimaryColumn()
  drwtNo: number; // 당첨 번호
}
