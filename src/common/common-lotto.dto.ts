import { extendApi } from '@anatine/zod-openapi';
import * as z from 'zod';

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
