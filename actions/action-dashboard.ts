'use server';

import cloudinary from '@/lib/cloudinary';
import { createActivityLog } from '@/lib/createActivityLog';
// server actions allows to mutate the server components

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ACTIONS, ENTITY_TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

export async function createBoard(data: { title: string; image: string }) {
  const { orgId, userId } = await auth();

  if (!orgId || !userId) {
    throw new Error('Unauthorized');
  }

  const { title, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split('|');

  let board;

  try {
    if (
      !imageId ||
      !imageThumbUrl ||
      !imageFullUrl ||
      !imageLinkHTML ||
      !imageUserName
    ) {
      return {
        data: '',
        error: 'Missing image credentials, please try again with a new image',
      };
    }

    board = await db.board.create({
      data: {
        title: title,
        imageId: imageId,
        imageFullUrl: imageFullUrl,
        imageThumbUrl: imageThumbUrl,
        imageUserName: imageUserName,
        imageLinkHTML: imageLinkHTML,
        orgId: orgId,
      },
    });

    // Activity
    await createActivityLog({
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTIONS.CREATE,
      entityTitle: `Created a new Board: '${board.title}'`,
      boardTitle: board.title,
    });

    if (board.id) {
      revalidatePath(`/board/${board.id}`);
      return {
        data: board,
        error: null,
      };
    }
  } catch (error: any) {
    return {
      data: null,
      error: { message: error },
    };
  }

  revalidatePath(`/board/${board.id}`); // revalidate the path to update the cache
  // redirect('/org_2tIx6yGR10qPWpRYTv4vgQaaYdc'); // redirect to the same page
}

export async function deleteBoard(id: string) {
  try {
    const board = await db.board.findUnique({
      where: {
        id,
      },
      select: {
        lists: {
          select: {
            cards: {
              select: {
                attachments: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      return {
        data: '',
        error: 'Board not found',
      };
    }

    const result = await db.board.delete({
      where: {
        id,
      },
    });

    if (result) {
      // DELETE ALL IMAGES OF THE DELETED BOARD FROM CLOUDINARY
      const imagesPublicIdsOfTheDeletedBoard = [''];

      board?.lists?.forEach((list) =>
        list.cards?.forEach((card) =>
          card.attachments?.forEach((attachment) => {
            imagesPublicIdsOfTheDeletedBoard.push(attachment.publicId);
          })
        )
      );

      if (imagesPublicIdsOfTheDeletedBoard.length > 0) {
        await cloudinary.api.delete_resources(imagesPublicIdsOfTheDeletedBoard);
      }

      revalidatePath(`/board/${id}`);

      // Activity
      await createActivityLog({
        entityId: id,
        entityType: ENTITY_TYPE.BOARD,
        action: ACTIONS.DELETE,
        entityTitle: `Deleted Board: '${result.title}'`,
        boardTitle: result.title,
      });

      return {
        data: 'Board deleted successfully',
        error: null,
      };
    }
  } catch (error) {
    return {
      data: '',
      error: 'Error deleting board',
    };
  }

  revalidatePath(`/board/${id}`);
}
