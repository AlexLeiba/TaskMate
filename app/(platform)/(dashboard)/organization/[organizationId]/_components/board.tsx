'use client';
import { deleteBoard } from '@/actions/create-dashboard';
import { Button } from '@/components/ui/button';
import React from 'react';

type Props = {
  board: {
    id: string;
    title: string;
  };
};
function Board({ board }: Props) {
  return (
    <div className='flex justify-between'>
      <p onClick={() => deleteBoard(board.id)}>Board name: {board.title}</p>
      <Button onClick={() => deleteBoard(board.id)}>Delete</Button>
    </div>
  );
}

export default Board;
