import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { CommonLottoSchema } from '@/common/common-lotto.dto';

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
  {
    description: '로또 크롤링 데이터 타입',
  },
);

export type LottoResult = z.infer<typeof LottoResultSchema>;
