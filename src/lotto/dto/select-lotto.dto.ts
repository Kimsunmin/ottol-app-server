import * as z from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';

const SelectLottoSchema = extendApi(
  z
    .object({
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
    })
    .superRefine((arg, ctx) => {
      const drwtNoArr = Object.values(arg);
      for (const selectDrwtNo of drwtNoArr) {
        const duplicatedCount = drwtNoArr.filter(
          (drwtNo) => selectDrwtNo === drwtNo,
        ).length;

        if (duplicatedCount > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Selected lotto numbers cannot be dulicated',
            fatal: true,
            path: [selectDrwtNo],
          });

          return z.NEVER;
        }
      }
    }),
  {
    description: 'Select lotto numbers by user',
  },
);

export type SelectLotto = z.infer<typeof SelectLottoSchema>;

export class SelectLottoDto extends createZodDto(SelectLottoSchema) {}
