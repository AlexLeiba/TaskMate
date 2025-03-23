import cloudinary from '@/lib/cloudinary';
import { createActivityLog } from '@/lib/createActivityLog';
import { db } from '@/lib/db';
import { currentUser, auth } from '@clerk/nextjs/server';
import { ACTIONS, ENTITY_TYPE } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

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
    const result = await cloudinary.api.delete_resources(attachmentIds);
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
