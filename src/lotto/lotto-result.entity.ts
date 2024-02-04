import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'lotto_result' })
export class LottoResultEntity extends BaseEntity {
  @PrimaryColumn({
    comment: '로또 추첨 회차',
  })
  drwNo: number; // 로또회차

  @Column({ comment: '로또 추첨 일자' })
  drwNoDate: string; // 날짜

  @Column({ type: 'bigint', comment: '1등 당첨 금액' })
  winPayRank1: number; // 1등 상금액

  @Column({ comment: '1등 당첨 인원' })
  winnerRank1: number; // 1등 당첨인원

  @Column({ type: 'bigint', comment: '2등 당첨 금액' })
  winPayRank2: number; // 2등 상금액

  @Column({ comment: '2등 당첨 인원' })
  winnerRank2: number; // 2등 당첨인원

  @Column({ type: 'bigint', comment: '3등 당첨 금액' })
  winPayRank3: number; // 3등 상금액

  @Column({ comment: '3등 당첨 인원' })
  winnerRank3: number; // 3등 당첨인원

  @Column({ type: 'bigint', comment: '4등 당첨 금액' })
  winPayRank4: number; // 4등 상금액

  @Column({ comment: '4등 당첨 인원' })
  winnerRank4: number; // 4등 당첨인원

  @Column({ type: 'bigint', comment: '5등 당첨 금액' })
  winPayRank5: number; // 5등 상금액

  @Column({ comment: '5등 당첨 인원' })
  winnerRank5: number; // 5등 당첨인원

  @Column({ comment: '로또 1번째 추첨 번호' })
  drwtNo1: number; // 로또번호 1

  @Column({ comment: '로또 2번째 추첨 번호' })
  drwtNo2: number; // 로또번호 2

  @Column({ comment: '로또 3번째 추첨 번호' })
  drwtNo3: number; // 로또번호 3

  @Column({ comment: '로또 4번째 추첨 번호' })
  drwtNo4: number; // 로또번호 4

  @Column({ comment: '로또 5번째 추첨 번호' })
  drwtNo5: number; // 로또번호 5

  @Column({ comment: '로또 6번째 추첨 번호' })
  drwtNo6: number; // 로또번호 6

  @Column({ comment: '로또 보너스 추첨 번호' })
  bnusNo: number; // 로또 보너스 번호
}
