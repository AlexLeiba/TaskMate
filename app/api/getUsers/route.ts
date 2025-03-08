// pages/api/getUsers.ts

import { auth, clerkClient } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { orgId, userId } = await auth();

  if (!orgId || !userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Fetch users by organization ID

    const users = await (
      await clerkClient()
    ).users.getUserList({
      organizationId: [orgId],
    });

    return NextResponse.json(users.data);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 400 });
  }
}
