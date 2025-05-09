import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { BoardNavBar } from './_components/boardNavBar';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const paramsData = await params;

  const { orgId } = await auth();

  if (!orgId || !paramsData.boardId) {
    return {
      title: 'Board',
    };
  }

  const board = await db.board.findUnique({
    where: {
      id: paramsData.boardId,
      orgId: orgId,
    },
  });

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
    <div
      className='relative w-full h-[calc(100vh-56px)] bg-no-repeat bg-cover bg-center '
      //Background Image Board
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      {/* Background Dark Board */}
      <div className='absolute inset-0 bg-black/40'></div>
      {/*  */}

      {/* Board nav bar */}
      <BoardNavBar board={board} />
      {/*  */}

      <main className='pt-16 w-full h-full  md:max-w-screen-2xl  px-4   mx-auto  relative'>
        {children}
      </main>
    </div>
  );
}

export default BoardIdLayout;
