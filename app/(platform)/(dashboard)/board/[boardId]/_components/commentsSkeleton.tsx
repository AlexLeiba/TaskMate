import React from 'react';

export function CommentsSkeleton() {
  return (
    <>
      <div className='flex gap-2 items-center '>
        <div className='flex flex-col items-start justify-start w-[30px] rounded-full bg-gray-300 h-[30px] animate-pulse'></div>

        <div className='w-[300px] h-[60px] rounded-md bg-gray-300 animate-pulse'></div>
      </div>
    </>
  );
}
