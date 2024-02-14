import { LottoDrawInfoEntity } from '@/lotto/lotto-draw-info.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'lotto_draw_result' })
export class LottoDrawResultEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '고유 번호' })
  id: number;

  @ManyToOne(
    () => LottoDrawInfoEntity,
    (lottoDrawInfo) => lottoDrawInfo.drawResults,
  )
  @JoinColumn({ name: 'draw_round' })
  draw: Relation<LottoDrawInfoEntity>;

  @Column({ comment: '로또 당첨 등수' })
  winRank: number;

  @Column({ comment: '로또 당첨 수' })
  winNumber: number;

  @Column({ comment: '로또 당첨 금액', type: 'bigint' })
  winAmount: number;
}
