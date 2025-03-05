import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ENTITY_TYPE } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  params: {
    cardId: Promise<string>;
  }
) {
  const cardId = await params.cardId;
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new Response('Unauthorized', { status: 401 });
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
      take: 5,
    });

    return NextResponse.json(activityLogs);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
