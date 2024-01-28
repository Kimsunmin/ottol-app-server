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

export class SelectLottoDto extends createZodDto(
  extendApi(CommonLottoSchema, { description: '로또 선택 번호' }),
) {}

export const CreateLottoSchema = extendApi(
  z.object({
    drwNoStart: extendApi(z.coerce.number().default(1), {
      description: 'Create lotto start drwNo',
      default: 1,
    }),
    drwNoEnd: extendApi(z.coerce.number().default(1), {
      description: 'Create lotto end drwNo',
      default: 1,
    }),
  }),
);

export type CreateLotto = z.infer<typeof CreateLottoSchema>;

export class CreateLottoDto extends createZodDto(
  extendApi(CreateLottoSchema, { description: '로또 결과 저장' }),
) {}
