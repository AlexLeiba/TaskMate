import cloudinary from '@/lib/cloudinary';
import { createActivityLog } from '@/lib/createActivityLog';
import { db } from '@/lib/db';
import { currentUser, auth } from '@clerk/nextjs/server';
import { ACTIONS, ENTITY_TYPE } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const user = await currentUser();
  const { orgId } = await auth();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 });
  }

  if (!orgId) {
    return NextResponse.json(
      { error: 'Organization not found' },
      { status: 400 }
    );
  }

  //file - base64imageFile
  const body = await req.json();
  if (!body) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
  const { file, cardId, listId, boardId } = body;

  const board = await db.board.findUnique({
    where: {
      id: boardId,
    },
  });

  const currentList = await db.list.findUnique({
    where: {
      id: listId,
    },
  });

  const card = await db.card.findUnique({
    where: {
      id: cardId,
      listId: listId,
    },
  });

  try {
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 400 });
    }

    if (!currentList) {
      return NextResponse.json({ error: 'List not found' }, { status: 400 });
    }

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 400 });
    }

    // upload image to cloudinary and get the result
    const result = await cloudinary.uploader.upload(file, {
      folder: 'task-manager',
      use_filename: true,
      unique_filename: false,
    });
    console.log('🚀 ~ POST ~ result:\n\n\n', result);

    if (result) {
      const prevAttachment = await db.attachments.findFirst({
        where: {
          cardId,
          listId,
        },
      });

      if (prevAttachment && prevAttachment.values.length > 0) {
        await db.attachments.updateMany({
          where: {
            listId: listId,
            cardId: cardId,
          },
          data: {
            values: [...prevAttachment.values, result.secure_url],
            userId: user.id,
            userName: user.fullName || 'Name',
            userImage: user.imageUrl,
            listId: listId,
            cardId: cardId,
            orgId: orgId,
          },
        });
        // Activity
        await createActivityLog({
          entityId: prevAttachment.id,
          entityType: ENTITY_TYPE.CARD,
          action: ACTIONS.DELETE,
          entityTitle: `Added an image to the Card: '${card.title}' in the List: '${currentList.title}'`,
          boardTitle: board.title,
        });
      } else {
        const createdAttachment = await db.attachments.create({
          data: {
            values: [result.secure_url],
            userId: user.id,
            userName: user.fullName || 'Name',
            userImage: user.imageUrl,
            listId: listId,
            cardId: cardId,
            orgId: orgId,
          },
        });

        // Activity
        await createActivityLog({
          entityId: createdAttachment.id,
          entityType: ENTITY_TYPE.CARD,
          action: ACTIONS.DELETE,
          entityTitle: `Added an image to the Card: '${card.title}' in the List: '${currentList.title}'`,
          boardTitle: board.title,
        });
      }
    }

    return NextResponse.json({
      status: 200,
      success: true,
      url: result.secure_url,
      result,
    });
  } catch (error: any) {
    console.log('🚀 ~ POST ~ error:\n\n\n\n\n', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
