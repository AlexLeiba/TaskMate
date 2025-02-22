'use client';
import { deleteBoard } from '@/actions/handle-dashboard';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/useAction';
import React from 'react';

type Props = {
  board: {
    id: string;
    title: string;
  };
};
function Board({ board }: Props) {
  const { execute } = useAction(deleteBoard);
  return (
    <div className='flex justify-between gap-4 items-center'>
      <p onClick={() => deleteBoard(board.id)}>Board name: {board.title}</p>
      <Button variant={'destructive'} onClick={() => execute(board.id)}>
        Delete
      </Button>
    </div>
  );
}

export default Board;
