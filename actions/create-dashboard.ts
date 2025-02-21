'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import * as zod from 'zod';

const CreateBoardSchema = zod.object({
  title: zod.string(),
});

export async function createBoard(formData: FormData) {
  const { title } = CreateBoardSchema.parse({ title: formData.get('title') });

  await db.board.create({
    data: {
      title,
    },
  });

  revalidatePath('/organization/org_2tIx6yGR10qPWpRYTv4vgQaaYdc');
}
export async function deleteBoard(id: string) {
  await db.board.delete({
    where: {
      id,
    },
  });

  revalidatePath('/organization/org_2tIx6yGR10qPWpRYTv4vgQaaYdc');
}
