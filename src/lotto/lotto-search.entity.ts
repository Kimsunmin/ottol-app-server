import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { LottoResultEntity } from './lotto-result.entity';

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

  static getMapper() {
    return {
      drwtNo1: {
        drwtNoType: 'drwt_no1',
        acc: 1,
      },
      drwtNo2: {
        drwtNoType: 'drwt_no2',
        acc: 1,
      },
      drwtNo3: {
        drwtNoType: 'drwt_no3',
        acc: 1,
      },
      drwtNo4: {
        drwtNoType: 'drwt_no4',
        acc: 1,
      },
      drwtNo5: {
        drwtNoType: 'drwt_no5',
        acc: 1,
      },
      drwtNo6: {
        drwtNoType: 'drwt_no6',
        acc: 1,
      },
      bnusNo: {
        drwtNoType: 'buns_no',
        acc: 10,
      },
    };
  }

  static transResultToSearch(
    lottoResult: LottoResultEntity,
  ): LottoSearchEntity[] {
    const mapper = this.getMapper();
    const keys = Object.keys(mapper);

    const lottoSearchList: any[] = keys.map((v) => {
      return {
        drwNo: lottoResult.drwNo,
        drwtNoType: mapper[v].drwtNoType,
        acc: mapper[v].acc,
        drwtNo: lottoResult[v],
      };
    });

    return lottoSearchList;
  }
}
