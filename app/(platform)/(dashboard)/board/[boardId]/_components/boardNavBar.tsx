'use client';

import { type Board as BoardType } from '@prisma/client';

export function BoardNavBar({ board }: { board: BoardType }) {
  return (
    <div className='bg-black/80 text-white px-3 py-2'>
      <p>{board?.title}</p>
    </div>
  );
}
