import { z } from 'zod';
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

export class SelectLottoDto extends createZodDto(
  extendApi(SelectLottoSchema, { description: '로또 선택 번호' }),
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