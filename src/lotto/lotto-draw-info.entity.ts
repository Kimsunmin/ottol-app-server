import { LottoDrawResultEntity } from '@/lotto/lotto-draw-result.entity';
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

@Entity({ name: 'lotto_draw_info' })
export class LottoDrawInfoEntity extends BaseEntity {
  @PrimaryColumn({ comment: '로또 회차' })
  drawRound: number;

  @Column({ comment: '로또 추첨 일자' })
  drawDate: string;

  @Column(() => Numbers, { prefix: 'number' })
  drawNumbers: Numbers;

  @OneToMany(
    () => LottoDrawResultEntity,
    (lottoDrawResult) => lottoDrawResult.draw,
  )
  drawResults: LottoDrawResultEntity[];
}
