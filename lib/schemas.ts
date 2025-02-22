import * as zod from 'zod';

export const boardSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters'),
});
