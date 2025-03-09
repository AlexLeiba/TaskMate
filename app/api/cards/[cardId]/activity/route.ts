import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ENTITY_TYPE } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  params: {
    params: Promise<{ cardId: string }>;
  }
) {
  const { cardId } = await params.params;

  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const cardData = await db?.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!cardData) {
      throw new Error('Not found');
    }

    const activityLogs = await db?.activity?.findMany({
      where: {
        entityId: cardId,
        orgId: orgId,
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    return NextResponse.json(activityLogs);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
