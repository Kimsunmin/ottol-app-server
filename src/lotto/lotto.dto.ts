import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';

// 기본 로또 선택 번호 6개
export const CommonLottoSchema = extendApi(
  z.object({
    drwtNo1: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 1',
    }),
    drwtNo2: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 2',
    }),
    drwtNo3: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 3',
    }),
    drwtNo4: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 4',
    }),
    drwtNo5: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 5',
    }),
    drwtNo6: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 6',
    }),
    bnusNo: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto bnus number',
    }),
  }),
  {
    description: 'Common lotto selection numbers',
  },
);

export type CommonLotto = z.infer<typeof CommonLottoSchema>;

export const SelectLottoSchema = extendApi(
  CommonLottoSchema.omit({ bnusNo: true }).superRefine((arg, ctx) => {
    const selectLottoNumbers = Object.values(arg);
    const duplicateNumbers = selectLottoNumbers.filter((lottoNumber, index) => {
      return index !== selectLottoNumbers.indexOf(lottoNumber);
    });

    if (duplicateNumbers.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Lotto numbers cannot be duplicated',
        path: duplicateNumbers,
      });
    }
  }),
  { description: '로또 선택 번호' },
);

export class SelectLottoDto extends createZodDto(SelectLottoSchema) {}

export const LottoResultSchema = extendApi(
  z
    .object({
      drwNo: extendApi(z.coerce.number(), { description: '로또 추첨 회차' }),
      drwNoDate: extendApi(z.coerce.number(), {
        description: '로또 추첨 회차',
      }),
      winnerRank1: extendApi(z.coerce.number(), {
        description: '1등 당첨 인원',
      }),
      winPayRank1: extendApi(z.coerce.number(), {
        description: '1등 당첨 금액',
      }),
      winnerRank2: extendApi(z.coerce.number(), {
        description: '2등 당첨 인원',
      }),
      winPayRank2: extendApi(z.coerce.number(), {
        description: '2등 당첨 금액',
      }),
      winnerRank3: extendApi(z.coerce.number(), {
        description: '3등 당첨 인원',
      }),
      winPayRank3: extendApi(z.coerce.number(), {
        description: '3등 당첨 금액',
      }),
      winnerRank4: extendApi(z.coerce.number(), {
        description: '4등 당첨 인원',
      }),
      winPayRank4: extendApi(z.coerce.number(), {
        description: '4등 당첨 금액',
      }),
      winnerRank5: extendApi(z.coerce.number(), {
        description: '5등 당첨 인원',
      }),
      winPayRank5: extendApi(z.coerce.number(), {
        description: '5등 당첨 금액',
      }),
    })
    .merge(CommonLottoSchema),
);

export type LottoResult = z.infer<typeof LottoResultSchema>;
