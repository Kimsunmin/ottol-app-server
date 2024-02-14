import { LottoDrawResultEntity } from '@/lotto/lotto-draw-result.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

class Numbers {
  @Column({ comment: '당첨 번호 1' })
  1: number;

  @Column({ comment: '당첨 번호 2' })
  2: number;

  @Column({ comment: '당첨 번호 3' })
  3: number;

  @Column({ comment: '당첨 번호 4' })
  4: number;

  @Column({ comment: '당첨 번호 5' })
  5: number;

  @Column({ comment: '당첨 번호 6' })
  6: number;
}

@Entity({ name: 'lotto_search_history' })
export class LottoSearchHisoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '고유 번호' })
  id: number;

  @Column(() => Numbers, { prefix: 'number' })
  drawNumbers: Numbers;

  @ManyToOne(() => LottoDrawResultEntity)
  drawResult: LottoDrawResultEntity;
}
