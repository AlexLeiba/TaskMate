import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const POSTS_PER_PAGE = 10;
export async function GET(req: NextRequest) {
  const { userId, orgId } = await auth();

  const { searchParams } = new URL(req.url);

  const page: number =
    (await parseInt(searchParams.get('page') as string)) || 1;

  try {
    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const activityData = await db.activity.findMany({
      where: {
        orgId: orgId,
      },

      orderBy: {
        createdAt: 'desc',
      },
      take: POSTS_PER_PAGE,
      skip: POSTS_PER_PAGE * (page - 1),
    });

    return NextResponse.json(activityData);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 400 });
  }
}
