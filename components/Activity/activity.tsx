import { Activity } from '@prisma/client';
import { Activity as ActivityIcon } from 'lucide-react';
import React from 'react';
import { Spacer } from '../ui/spacer';
import { format } from 'date-fns';
import Image from 'next/image';

type ActivityType = {
  items: Activity[] | undefined;
};

export function ActivityList({ items }: ActivityType) {
  console.log('🚀 ~ ActivityList ~ items:', items);
  return (
    <div className=' flex items-start gap-x-3 w-full'>
      <ActivityIcon />

      <div className='mb-2'>
        <p className='body-md font-semibold'>Activity</p>
        <Spacer size={3} />
        <ol className='mb-2 '>
          {items && items.length > 0 ? (
            items.map((data) => {
              console.log('🚀 ~ items.map ~ data:', data);
              return (
                <div className='flex gap-2 items-center mb-3' key={data.id}>
                  <div className='flex flex-col items-start justify-start w-[35px]'>
                    {data.userImage && (
                      <Image
                        width={30}
                        height={30}
                        src={data.userImage}
                        className='rounded-full'
                        alt={data.userName}
                      />
                    )}
                  </div>

                  <div>
                    <p className='body-xs font-semibold inline mr-2'>
                      {data.userName}
                    </p>
                    <p key={data.id} className='body-sm inline'>
                      {data.entityTitle}
                    </p>

                    <p className='body-xs text-gray-500'>
                      <strong className='mr-4'>Board: {data.boardTitle}</strong>
                      {format(new Date(data.createdAt), 'MMM d, yyy')} at{' '}
                      {format(new Date(data.createdAt), 'hh:mm a')}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className='body-sm'>No activity yet</p>
          )}
        </ol>
      </div>
    </div>
  );
}
