import { db } from '@/lib/db';
import React from 'react';
import Board from './_components/board';
import { createBoard } from '@/actions/create-dashboard';

async function OrganizationPage({}: // params,
{
  params: { organizationId: Promise<string> };
}) {
  // const { orgId, userId } = await auth();

  // const paramsData = await params.organizationId;

  const boards = await db.board.findMany();

  return (
    <div className='flex flex-col gap-4 '>
      <form action={createBoard}>
        <input
          type='text'
          id='title'
          name='title'
          placeholder='Title'
          required
        />
      </form>

      {boards.map((board) => (
        <Board board={board} key={board.id} />
      ))}
    </div>
  );
}

export default OrganizationPage;
