'use server';
import { createActivityLog } from '@/lib/createActivityLog';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ACTIONS, ENTITY_TYPE } from '@prisma/client';
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

    newCard = await db.card.create({
      data: {
        listId: listId,
        title: title,
        order: newCardOrder,
      },
    });

    // Activity
    await createActivityLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.CREATE,
      entityTitle: `created Card: '${newCard.title}' `,
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

    // Activity
    await createActivityLog({
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTIONS.UPDATE,
      entityTitle: `updated List title from '${isListExist.title} to ${title}'`,
    });
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

export async function copyCard(
  boardId: string,
  cardId: string,
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

    const cardToBeCopied = await db.card.findUnique({
      where: {
        id: cardId,
        listId: listId,
      },
    });

    if (!cardToBeCopied) {
      return {
        error: 'Card not found',
        data: null,
      };
    }

    newCard = await db.card.create({
      data: {
        listId: listId,
        title: cardToBeCopied.title + ' - Copy',
        description: cardToBeCopied.description,
        order: newCardOrder,
      },
    });

    // Activity
    await createActivityLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.UPDATE,
      entityTitle: `copied Card: '${cardToBeCopied.title}'`,
    });
  } catch (error: any) {
    return {
      error: error.message || 'Error on copying card, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: newCard,
    error: null,
  };
}

export async function deleteCard(
  boardId: string,
  cardId: string,
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
    });

    if (!currentList) {
      return {
        error: 'List not found, please try again',
        data: null,
      };
    }

    const cardToBeDeleted = await db.card.findUnique({
      where: {
        id: cardId,
        listId: listId,
      },
    });

    if (!cardToBeDeleted) {
      return {
        error: 'Card not found',
        data: null,
      };
    }

    newCard = await db.card.delete({
      where: {
        id: cardId,
        listId: listId,
      },
    });

    // Activity
    await createActivityLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.DELETE,
      entityTitle: `deleted Card: '${cardToBeDeleted.title}'`,
    });
  } catch (error: any) {
    return {
      error: error.message || 'Error on deleting card, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: newCard,
    error: null,
  };
}

export async function editCard({
  title,
  description,
  boardId,
  listId,
  cardId,
}: {
  title?: string;
  description?: string;
  boardId: string;
  listId: string;
  cardId: string;
}) {
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
    });

    if (!currentList) {
      return {
        error: 'List not found, please try again',
        data: null,
      };
    }

    const editedCard = await db.card.findUnique({
      where: {
        id: cardId,
        listId: listId,
      },
    });

    if (!editedCard) {
      return {
        error: 'Card not found',
        data: null,
      };
    }

    newCard = await db.card.update({
      where: {
        id: cardId,
        listId: listId,
      },
      data: {
        listId: listId,
        title: title ? title : editedCard.title,
        description: description ? description : editedCard.description,
        order: editedCard.order,
      },
    });

    // Activity
    await createActivityLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.UPDATE,
      entityTitle: `updated ${title ? 'title' : 'description'} of Card: '${
        editedCard.title
      } '`,
    });
  } catch (error: any) {
    return {
      error: error.message || 'Error on editing card, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: newCard,
    error: null,
  };
}
