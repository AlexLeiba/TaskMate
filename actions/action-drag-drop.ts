'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Card, List } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function updateListOrder(
  reorderedListItems: List[],
  boardId: string,
  listId: string
) {
  const { orgId } = await auth();

  //   Check if org exists
  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

  let updatedLists;
  try {
    // Check if list exists

    const list = db.list.findUnique({
      where: {
        id: listId,
        boardId: boardId,
        board: {
          orgId: orgId,
        },
      },
      include: {
        cards: true,
      },
    });

    if (!list) {
      return {
        error: 'List not found',
        data: null,
      };
    }

    //  Update list order of all LISTS

    const reorderedListsInDB = reorderedListItems.map((list) => {
      return db.list.update({
        where: {
          id: list.id,
          boardId: boardId,
          board: {
            orgId: orgId,
          },
        },
        data: {
          order: list.order,
        },
      });
    });

    updatedLists = await db.$transaction(reorderedListsInDB);
  } catch (error: any) {
    return {
      error: error.message || 'Error on changing list order, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: updatedLists,
    error: null,
  };
}

export async function updateCardOrder(
  newReorderedCards: Card[],
  boardId: string
) {
  const { orgId } = await auth();

  //   Check if org exists
  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

  let updatedCards;
  try {
    const reorderedCardsInDb = newReorderedCards.map((card) => {
      return db.card.update({
        where: {
          id: card.id,
          list: {
            // id: card.listId,
            board: {
              orgId: orgId,
            },
          },
        },
        // change the data of the card: update the card order + update card listId // in case the card is moved to other listId it will automatically update the listId be changed
        data: {
          order: card.order,
          listId: card.listId,
        },
      });
    });

    updatedCards = await db.$transaction(reorderedCardsInDb);
  } catch (error: any) {
    return {
      error: error.message || 'Error on changing list order, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: updatedCards,
    error: null,
  };
}
