import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const PageOption = extendApi(
  z.object({
    order: extendApi(z.enum(['ASC', 'DESC']).default('DESC'), {
      description: '정렬 방식',
    }),
    page: extendApi(z.coerce.number().min(1).default(1), {
      description: '페이지 번호',
    }),
    size: extendApi(z.coerce.number().min(1).max(50).default(5), {
      description: '한 페이지에 보여질 건수',
    }),
  }),
);
