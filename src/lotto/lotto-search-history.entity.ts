import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lotto_search_history' })
export class LottoSearchHisoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '고유 번호' })
  id: number;

  @Column({ comment: '사용자 입력 1번째 입력 번호' })
  drwtNo1: number;

  @Column({ comment: '사용자 입력 2번째 입력 번호' })
  drwtNo2: number;

  @Column({ comment: '사용자 입력 3번째 입력 번호' })
  drwtNo3: number;

  @Column({ comment: '사용자 입력 4번째 입력 번호' })
  drwtNo4: number;

  @Column({ comment: '사용자 입력 5번째 입력 번호' })
  drwtNo5: number;

  @Column({ comment: '사용자 입력 6번째 입력 번호' })
  drwtNo6: number;

  @Column({ comment: '사용자 당첨 회차' })
  drwNo: number;

  @Column({ comment: '사용자 당첨 등수' })
  winRank: number;

  @Column({ type: 'bigint', comment: '사용자 당첨 금액' })
  winPay: number;
}
