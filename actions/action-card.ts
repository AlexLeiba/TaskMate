'use server';
import cloudinary from '@/lib/cloudinary';
import { createActivityLog } from '@/lib/createActivityLog';
import { db } from '@/lib/db';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ACTIONS, ENTITY_TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function deleteAttachmentInCard(
  boardId: string,
  listId: string,
  cardId: string,
  attachmentId: string
) {
  const { orgId, userId } = await auth();

  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

  if (!userId) {
    return {
      error: 'User not found',
      data: null,
    };
  }

  let deletedAttachment;
  try {
    // Will prevent creating a list if the board doesn't exist
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId: orgId,
      },
      select: {
        title: true,
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
        //include title
        title: true,
      },
    });

    if (!currentList) {
      return {
        error: 'List not found, please try again',
        data: null,
      };
    }

    const currentCard = await db.card.findUnique({
      where: {
        id: cardId,
        listId: listId,
      },
      select: {
        title: true,
        id: true,
      },
    });

    if (!currentCard) {
      return {
        error: 'Card not found',
        data: null,
      };
    }

    deletedAttachment = await db.attachments.delete({
      where: {
        id: attachmentId,
        listId: listId,
        cardId: cardId,
        orgId: orgId,
      },
    });

    // Activity
    await createActivityLog({
      entityId: currentCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.DELETE,
      entityTitle: `Deleted an attachment in the List: '${currentList.title}' from the Card: '${currentCard.title}' `,
      boardTitle: board.title,
    });
  } catch (error: any) {
    return {
      error: error.message || 'Error on deleting attachment, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: deletedAttachment,
    error: null,
  };
}

export async function createCommentInCard(
  boardId: string,
  text: string,
  listId: string,
  cardId: string
) {
  const { orgId, userId } = await auth();
  const user = await currentUser();

  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

  if (!userId && !user) {
    return {
      error: 'User not found',
      data: null,
    };
  }

  let newComment;
  try {
    // Will prevent creating a list if the board doesn't exist
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId: orgId,
      },
      select: {
        title: true,
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
        title: true,
      },
    });

    if (!currentList) {
      return {
        error: 'List not found, please try again',
        data: null,
      };
    }

    const currentCard = await db.card.findUnique({
      where: {
        id: cardId,
        listId: listId,
      },
      select: {
        title: true,
        id: true,
      },
    });

    if (!currentCard) {
      return {
        error: 'Card not found',
        data: null,
      };
    }

    newComment = await db.comments.create({
      data: {
        listId: listId,
        text: text,
        cardId: cardId,
        orgId: orgId,
        userId: userId,
        userName: user?.fullName || 'User Name',
        userImage: user?.imageUrl || '',
        createdAt: new Date(),
      },
    });

    // Activity
    await createActivityLog({
      entityId: currentCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.CREATE,
      entityTitle: `Added a comment in the List: '${currentList.title}' to the Card: '${currentCard.title}' `,
      boardTitle: board.title,
    });
  } catch (error: any) {
    return {
      error: error.message || 'Error on creating a comment, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: newComment,
    error: null,
  };
}
export async function deleteCommentInCard(
  boardId: string,
  listId: string,
  cardId: string,
  commentId: string
) {
  const { orgId, userId } = await auth();
  const user = await currentUser();

  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

  if (!userId && !user) {
    return {
      error: 'User not found',
      data: null,
    };
  }

  let deletedComment;
  try {
    // Will prevent creating a list if the board doesn't exist
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId: orgId,
      },
      select: {
        title: true,
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
        title: true,
      },
    });

    if (!currentList) {
      return {
        error: 'List not found, please try again',
        data: null,
      };
    }

    const currentCard = await db.card.findUnique({
      where: {
        id: cardId,
        listId: listId,
      },
      select: {
        title: true,
        id: true,
      },
    });

    if (!currentCard) {
      return {
        error: 'Card not found',
        data: null,
      };
    }

    deletedComment = await db.comments.delete({
      where: {
        id: commentId,
        cardId: cardId,
        orgId: orgId,
        listId: listId,
      },
    });

    // Activity
    await createActivityLog({
      entityId: currentCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.DELETE,
      entityTitle: `Deleted a comment from the Card: '${currentCard.title}' in the List: '${currentList.title}'`,
      boardTitle: board.title,
    });
  } catch (error: any) {
    return {
      error: error.message || 'Error on creating card, please try again',
      data: null,
    };
  }

  revalidatePath(`/board/${boardId}`); // revalidate the path to update the cache

  return {
    data: deletedComment,
    error: null,
  };
}
export async function createNewCardInList(
  boardId: string,
  title: string,
  listId: string
) {
  const { orgId, userId } = await auth();
  const user = await currentUser();

  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }

  if (!userId && !user) {
    return {
      error: 'User not found',
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
        assignedId: '',
        assignedName: '',
        assignedImageUrl: '',
        priority: 'none',
        reporterId: user?.id || '',
        reporterName: user?.fullName || 'Name',
        reporterImageUrl: user?.imageUrl || '',
      },
    });

    // Activity
    await createActivityLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.CREATE,
      entityTitle: `Created Card: '${newCard.title}' `,
      boardTitle: board.title,
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
      entityTitle: `Updated List title from '${isListExist.title}' to '${title}'`,
      boardTitle: board.title,
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
  const user = await currentUser();

  if (!orgId) {
    return {
      error: 'Organization not found',
      data: null,
    };
  }
  if (!user) {
    return {
      error: 'User not found',
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
        assignedId: '',
        assignedName: '',
        assignedImageUrl: '',
        priority: 'none',
        reporterId: user.id,
        reporterName: user?.fullName || 'Name',
        reporterImageUrl: user.imageUrl || '',
      },
    });

    // Activity
    await createActivityLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.UPDATE,
      entityTitle: `Copied Card: '${cardToBeCopied.title}'`,
      boardTitle: board.title,
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
      select: {
        attachments: true,
        title: true,
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

    // DELETE ALL IMAGES OF THE DELETED CARD FROM CLOUDINARY
    const imagesPublicIdsOfTheDeletedCard = cardToBeDeleted?.attachments?.map(
      (attachment) => attachment.publicId
    );

    if (imagesPublicIdsOfTheDeletedCard.length > 0) {
      await cloudinary.api.delete_resources(imagesPublicIdsOfTheDeletedCard);
    }

    // Activity
    await createActivityLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.DELETE,
      entityTitle: `Deleted Card: '${cardToBeDeleted.title}'`,
      boardTitle: board.title,
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
      entityTitle: `Updated ${
        title
          ? `title of Card: '${editedCard.title}', from "${editedCard.title}" to "${title}"`
          : `description of Card: '${editedCard.title}`
      } `,
      boardTitle: board.title,
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
export async function editPriorityCard({
  priority,
  boardId,
  listId,
  cardId,
}: {
  priority: string;
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
        priority: priority,
        order: editedCard.order,
      },
    });

    // Activity
    await createActivityLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.UPDATE,
      entityTitle: `Updated priority of Card: '${editedCard.title}' from '${editedCard.priority}' to '${priority}'`,
      boardTitle: board.title,
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
export async function editAssignCard({
  user,
  boardId,
  listId,
  cardId,
}: {
  user: { fullName: string; imageUrl: string; id: string };
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
        assignedImageUrl: user.imageUrl,
        assignedName: user.fullName,
        assignedId: user.id,
        order: editedCard.order,
      },
    });

    // Activity
    await createActivityLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTIONS.UPDATE,
      entityTitle: `Assigned Card: '${editedCard.title}' to '${user.fullName}'`,
      boardTitle: board.title,
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
