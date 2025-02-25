import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { toast } from 'react-toastify';
import { BoardNavBar } from './_components/boardNavBar';

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const paramsData = await params;

  const { orgId } = await auth();

  if (!orgId || !paramsData.boardId) {
    return {
      title: 'Board',
    };
  }

  let board = {} as any;
  try {
    board = await db.board.findUnique({
      where: {
        id: paramsData.boardId,
        orgId: orgId,
      },
    });
  } catch (error: any) {
    console.log('Board not found', error.message);
  }

  if (!board) {
    return {
      title: 'Board',
    };
  }

  return {
    title: board?.title || 'Board',
  };
}

async function BoardIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ boardId: string }>;
}) {
  const { orgId } = await auth();

  const paramsData = await params;

  if (!paramsData.boardId) {
    return console.log('boardId not found');
  }

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
    <div className='h-full'>
      <BoardNavBar board={board} />

      <main className='h-full'>{children}</main>
    </div>
  );
}

export default BoardIdLayout;
