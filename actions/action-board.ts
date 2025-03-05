'use server';

import { createActivityLog } from '@/lib/createActivityLog';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ACTIONS, ENTITY_TYPE } from '@prisma/client';
import { error } from 'console';
import { revalidatePath } from 'next/cache';

export async function editBoardTitle(boardId: string, title: string) {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

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

  try {
    await db.board.update({
      where: {
        id: boardId,
      },
      data: {
        title: title,
      },
    });

    // Activity
    await createActivityLog({
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTIONS.UPDATE,
      entityTitle: `The Board: '${board.title}' title was updated`,
    });
  } catch (error: any) {
    return {
      error: error.message,
      data: null,
    };
  }

  revalidatePath(`/board/${board.id}`); // revalidate the path to update the cache

  return {
    data: board,
  };
}

export async function addNewListTitle(boardId: string, title: string) {
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

    //
    // Will get the last order from the current board To know where to add the new list ( after the last one from the current list)
    const lastListFromCurrentBoard = await db.list.findFirst({
      where: {
        boardId: boardId,
      },
      orderBy: {
        order: 'desc', // desc will order from the last / asc-> would order from the first
      },
      select: {
        order: true, //will return only 'order' data
      },
    });

    const lastOrderedList =
      (lastListFromCurrentBoard && lastListFromCurrentBoard?.order + 1) || 1;
    //

    list = await db.list.create({
      data: {
        boardId: boardId,
        title: title,
        order: lastOrderedList,
      },
    });

    if (!list) {
      return {
        error: 'Error on creating list, please try again',
        data: null,
      };
    }

    // Activity
    await createActivityLog({
      entityId: board.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTIONS.CREATE,
      entityTitle: `New List: '${list.title}' was created`,
    });
  } catch (error: any) {
    return {
      error: error.message || 'Error on creating list, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: list,
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
      entityId: board.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTIONS.UPDATE,
      entityTitle: `The List: '${list.title}'  title was updated`,
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

export async function deleteList(boardId: string, listId: string) {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

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

  const list = await db.list.findUnique({
    where: {
      id: listId,
      boardId: boardId,
      board: {
        orgId: orgId,
      },
    },
  });

  if (!list) {
    return {
      error: 'List not found',
    };
  }

  try {
    await db.list.delete({
      where: {
        id: listId,
        boardId: boardId,
        board: {
          orgId: orgId,
        },
      },
    });

    // Activity
    await createActivityLog({
      entityId: board.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTIONS.DELETE,
      entityTitle: `The List: '${list.title}' was deleted`,
    });
  } catch (error: any) {
    return {
      error: error.message || 'Error on deleting list, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: list,
    error: null,
  };
}

export async function copyList(boardId: string, listId: string) {
  const { orgId } = await auth();

  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

  let newList;

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

    const listToCopyData = await db.list.findUnique({
      where: {
        id: listId,
        boardId: boardId,
        board: {
          orgId: orgId,
        },
      },
      include: {
        cards: true, //To copy the list with cards included
      },
    });

    if (!listToCopyData) {
      return {
        error: 'List not found',
      };
    }

    // Check order of the last list in the board
    const lastListOrdered = await db.list.findFirst({
      where: {
        boardId: boardId,
      },
      orderBy: {
        order: 'desc',
      },
      select: {
        order: true, //to return the order value only
      },
    });

    if (!lastListOrdered) {
      return {
        error: 'Error on copying list, please try again',
        data: null,
      };
    }

    const newOrder = (lastListOrdered && lastListOrdered?.order + 1) || 1;

    if (!lastListOrdered) {
      return {
        error: 'Error on copying list, please try again',
        data: null,
      };
    }

    // CREATE NEW COPY LIST
    newList = await db.list.create({
      data: {
        boardId: boardId,
        title: listToCopyData.title + ' - Copy',
        order: newOrder,
        cards: {
          createMany: {
            //copy cards as well
            data: listToCopyData.cards.map((card) => ({
              title: card.title,
              description: card.description ? card.description : '',
              order: card.order,
            })),
          },
        },
      },
      include: {
        cards: true, //To copy the list with cards included
      },
    });

    // Activity
    await createActivityLog({
      entityId: board.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTIONS.UPDATE,
      entityTitle: `The List: '${listToCopyData.title}' was copied`,
    });
  } catch (error: any) {
    return {
      error: error.message || 'Error to copy list, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: newList,
    error: null,
  };
}
