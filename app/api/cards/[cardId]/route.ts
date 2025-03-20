import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const { cardId } = await params;
  const { userId, orgId } = await auth();

  try {
    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const card = await db.card.findUnique({
      where: {
        id: cardId,
        list: {
          board: {
            orgId: orgId,
          },
        },
      },
      include: {
        list: {
          select: {
            title: true, //return list with only title in it
          },
        },
        attachments: {
          select: {
            values: true,
          },
        },
      },
    });

    return NextResponse.json(card);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 400 });
  }
}
