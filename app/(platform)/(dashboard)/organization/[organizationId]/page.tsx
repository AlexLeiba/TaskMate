import { db } from '@/lib/db';
import React from 'react';
import Board from './_components/board';
import { createBoard } from '@/actions/handle-dashboard';
import FormBoard from './_components/formBoard';
import Info from './_components/info';
import { Separator } from '@/components/ui/separator';
import BoardList from './_components/boardList';

async function OrganizationPage({}: // params,
{
  params: { organizationId: Promise<string> };
}) {
  // const boards = await db.board.findMany();

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* <FormBoard />

      {boards.map((board) => (
        <Board board={board} key={board.id} />
      ))} */}
      <Info />
      <Separator />

      <div>
        <BoardList />
      </div>
    </div>
  );
}

export default OrganizationPage;
