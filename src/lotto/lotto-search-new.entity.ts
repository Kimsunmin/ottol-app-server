import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lotto_search_new' })
export class LottoSearchNewEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '고유 번호' })
  id: string;

  @Column({ comment: '로또 당첨 회차' })
  drawRound: number;

  @Column({ comment: '로또 당첨 번호' })
  drawNumber: number;

  @Column({ comment: '로또 당첨 번호별 가중치 (1~6: 1, 보너스: 10)' })
  acc: number;
}
