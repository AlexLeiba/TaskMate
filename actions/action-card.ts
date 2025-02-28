'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createNewCardInList(
  boardId: string,
  title: string,
  listId: string
) {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

  let newCard;
  try {
    // Will prevent creating a list if the board doesn't exist
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId: orgId,
      },
    });

    if (!board) {
      return {
        error: 'Board not found',
      };
    }
    //

    // Check if list exists
    const currentList = await db.list.findUnique({
      where: {
        id: listId,
        boardId: boardId,
        board: {
          orgId: orgId,
        },
      },
      select: {
        //include cards
        cards: true,
      },
    });

    if (!currentList) {
      return {
        error: 'List not found, please try again',
        data: null,
      };
    }

    const lastCardFromTheList = await db.card.findFirst({
      where: { listId: listId },
      orderBy: { order: 'desc' },
      select: { order: true }, //return only 'order' value
    });

    const newCardOrder =
      (lastCardFromTheList && lastCardFromTheList?.order + 1) || 1;

    newCard = db.card.create({
      data: {
        listId: listId,
        title: title,
        order: newCardOrder,
      },
    });
  } catch (error: any) {
    return {
      error: error.message || 'Error on creating card, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: newCard,
    error: null,
  };
}
export async function editListTitle(
  boardId: string,
  title: string,
  listId: string
) {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

  let list;
  try {
    // Will prevent creating a list if the board doesn't exist
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId: orgId,
      },
    });

    if (!board) {
      return {
        error: 'Board not found',
      };
    }
    //

    const isListExist = await db.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!isListExist) {
      return {
        error: 'List not found',
      };
    }

    list = await db.list.update({
      where: {
        id: listId,
        boardId: boardId,
        board: {
          orgId: orgId,
        },
      },
      data: {
        title: title,
      },
    });

    if (!list) {
      return {
        error: 'Error on editing list title, please try again',
        data: null,
      };
    }
  } catch (error: any) {
    return {
      error: error.message || 'Error on editing list title, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: list,
    error: null,
  };
}
