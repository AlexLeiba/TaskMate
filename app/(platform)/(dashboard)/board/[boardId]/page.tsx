import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import ListContainer from './_components/listContainer';

async function BoardIdPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { orgId } = await auth();

  const paramsData = await params;

  if (!orgId || !paramsData.boardId) {
    return redirect('/select-org');
  }

  const lists = await db?.list?.findMany({
    where: {
      boardId: paramsData.boardId,
      board: {
        orgId: orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });
  console.log('🚀 ~ lists:', lists);

  if (!lists) {
    return notFound();
  }
  return (
    <div className='h-full overflow-y-auto'>
      <ListContainer listData={lists} boardId={paramsData.boardId} />
    </div>
  );
}

export default BoardIdPage;
