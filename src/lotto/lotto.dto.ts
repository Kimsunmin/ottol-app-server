import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';

export const LottoExelKeys = [
  'drwNo',
  'drwNoDate',
  'winnerRank1',
  'winPayRank1',
  'winnerRank2',
  'winPayRank2',
  'winnerRank3',
  'winPayRank3',
  'winnerRank4',
  'winPayRank4',
  'winnerRank5',
  'winPayRank5',
  'drwtNo1',
  'drwtNo2',
  'drwtNo3',
  'drwtNo4',
  'drwtNo5',
  'drwtNo6',
  'bnusNo',
] as const;

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
  }),
  {
    description: 'Common lotto selection numbers',
  },
);

export type CommonLotto = z.infer<typeof CommonLottoSchema>;

export const SelectLottoSchema = extendApi(
  CommonLottoSchema.superRefine((arg, ctx) => {
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
