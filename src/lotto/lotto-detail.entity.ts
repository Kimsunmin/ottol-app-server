import { LottoMasterEntity } from '@/lotto/lotto-master.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'lotto_detail' })
export class LottoDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '고유 번호' })
  id: number;

  @ManyToOne(() => LottoMasterEntity, (master) => master.details)
  master: Relation<LottoMasterEntity>;

  @Column({ comment: '로또 당첨 등수' })
  winRank: number;

  @Column({ comment: '로또 당첨 수' })
  winNumber: number;

  @Column({ comment: '로또 당첨 금액', type: 'bigint' })
  winAmount: number;
}
