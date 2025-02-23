'use server';

// server actions allows to mutate the server components

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

export async function createBoard(title: string) {
  try {
    await db.board.create({
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      data: '',
      error: 'Error creating board',
    };
  }

  revalidatePath('/organization/org_2tIx6yGR10qPWpRYTv4vgQaaYdc'); // revalidate the path to update the cache
  redirect('/organization/org_2tIx6yGR10qPWpRYTv4vgQaaYdc'); // redirect to the same page
}

export async function deleteBoard(id: string) {
  try {
    await db.board.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      data: '',
      error: 'Error deleting board',
    };
  }

  revalidatePath('/organization/org_2tIx6yGR10qPWpRYTv4vgQaaYdc');
  redirect('/organization/org_2tIx6yGR10qPWpRYTv4vgQaaYdc'); // redirect to the same page
}
