import * as zod from 'zod';

export const boardSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters'),
  image: zod.string().min(3, 'Image is required'),
});

export const createListSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters'),
});
export const createCardSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters'),
});
export const createCommentInCardSchema = zod.object({
  text: zod.string().min(3, 'Title must be at least 2 characters'),
});
