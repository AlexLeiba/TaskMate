import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

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

  const board = await db?.board?.findUnique({
    where: {
      id: paramsData.boardId,
      orgId: orgId,
    },
  });

  if (!board) {
    return notFound();
  }
  return (
    <div
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      className='h-full w-full relative bg-no-repeat bg-cover bg-center'
    >
      <div className='absolute inset-0 bg-black/40'></div>
      BoardIdPage
    </div>
  );
}

export default BoardIdPage;
