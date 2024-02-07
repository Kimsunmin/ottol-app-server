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
  drwtNo1: z.coerce.number(),
  drwtNo2: z.coerce.number(),
  drwtNo3: z.coerce.number(),
  drwtNo4: z.coerce.number(),
  drwtNo5: z.coerce.number(),
  drwtNo6: z.coerce.number(),
  bnusNo: z.coerce.number(),
});

export type DhlotteryLottoResult = z.infer<typeof DhlotteryLottoResultSchema>;
