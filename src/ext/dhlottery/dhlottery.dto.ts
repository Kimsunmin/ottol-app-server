import * as z from 'zod';

export const DhlotteryLottoResultSchema = z.object({
  drwNo: z.coerce.number(),
  drwNoDate: z.string().describe('yyyy.mm.dd'),
  winnerRank1: z.coerce.number(),
  winPayRank1: z.coerce.number(),
  winnerRank2: z.coerce.number(),
  winPayRank2: z.coerce.number(),
  winnerRank3: z.coerce.number(),
  winPayRank3: z.coerce.number(),
  winnerRank4: z.coerce.number(),
  winPayRank4: z.coerce.number(),
  winnerRank5: z.coerce.number(),
  winPayRank5: z.coerce.number(),
});

export type DhlotteryLottoResult = z.infer<typeof DhlotteryLottoResultSchema>;
