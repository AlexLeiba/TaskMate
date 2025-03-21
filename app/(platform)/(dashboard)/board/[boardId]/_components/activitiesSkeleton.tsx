import { Spacer } from '@/components/ui/spacer';
import { ActivityIcon } from 'lucide-react';
import React from 'react';

export function ActivitiesSkeleton() {
  return (
    <>
      <div className='flex gap-2 '>
        <ActivityIcon />
        <p className='body-md font-semibold'>Activities</p>
      </div>
      <Spacer size={3} />
      <div className='flex gap-2 items-center mb-4 '>
        <div className='flex flex-col items-start justify-start w-[30px] rounded-full bg-gray-300 h-[30px] animate-pulse'></div>

        <div className='w-[300px] h-10 rounded-md bg-gray-300 animate-pulse'></div>
      </div>
    </>
  );
}
