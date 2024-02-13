import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

// 기본 로또 선택 번호 6개
export const CommonLottoSchema = extendApi(
  z.object({
    drwtNo1: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 1',
      example: 1,
    }),
    drwtNo2: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 2',
      example: 3,
    }),
    drwtNo3: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 3',
      example: 4,
    }),
    drwtNo4: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 4',
      example: 29,
    }),
    drwtNo5: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 5',
      example: 42,
    }),
    drwtNo6: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto number 6',
      example: 45,
    }),
    bnusNo: extendApi(z.coerce.number().min(1).max(45), {
      description: 'Select lotto bnus number',
      example: 36,
    }),
  }),
  {
    description: 'Common lotto selection numbers',
  },
);

export type CommonLotto = z.infer<typeof CommonLottoSchema>;
