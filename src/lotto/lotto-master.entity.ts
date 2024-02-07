import { LottoDetailEntity } from '@/lotto/lotto-detail.entity';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

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

  @Column({ comment: '보너스 당첨 번호' })
  bnus: number;
}

@Entity({ name: 'lotto_master' })
export class LottoMasterEntity extends BaseEntity {
  @PrimaryColumn({ comment: '로또 회차' })
  drwNo: number;

  @Column({ comment: '로또 추첨 일자' })
  drwNoDate: string;

  @Column(() => Numbers, { prefix: 'number' })
  numbers: Numbers;

  @OneToMany(() => LottoDetailEntity, (detail) => detail.win)
  detail: LottoDetailEntity;
}
