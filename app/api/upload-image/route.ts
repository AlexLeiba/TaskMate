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
    select: {
      title: true,
      id: true,
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
      await db.attachments.create({
        data: {
          publicId: result.public_id,
          format: result.format,
          value: result.secure_url,
          userId: user.id,
          userName: user.fullName || 'User Name',
          userImage: user.imageUrl || '',
          listId: listId,
          cardId: cardId,
          orgId: orgId,
        },
      });

      // Activity
      await createActivityLog({
        entityId: card.id,
        entityType: ENTITY_TYPE.CARD,
        action: ACTIONS.DELETE,
        entityTitle: `Added an image to the Card: '${card.title}' in the List: '${currentList.title}'`,
        boardTitle: board.title,
      });
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
export async function DELETE(req: NextRequest, res: NextResponse) {
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
  const { attachmentIds } = body;
  console.log('🚀 ~ DELETE ~ attachmentIds:\n\n\n', attachmentIds);

  try {
    // if (
    //   !attachmentsAsArray ||
    //   !Array.isArray(attachmentsAsArray) ||
    //   attachmentsAsArray.length === 0
    // ) {
    //   return NextResponse.json(
    //     { error: 'No attachment ids provided' },
    //     {
    //       status: 400,
    //     }
    //   );
    // }
    // upload image to cloudinary and get the result
    // on deleting a board/card/list -< map throu all images and delete them or better use     const result = await cloudinary.api.delete_resources(attachmentIds);
    const result = await cloudinary.uploader.destroy(attachmentIds);
    console.log('🚀 ~ DELETE ~ result:\n\n\n\n', result);

    return NextResponse.json({
      status: 200,
      success: true,
      result,
    });
  } catch (error: any) {
    console.log('🚀 ~ DELETE ATTACHMENT ~ error:\n\n\n\n\n', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
