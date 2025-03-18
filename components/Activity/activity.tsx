import { Activity } from '@prisma/client';
import { Activity as ActivityIcon } from 'lucide-react';
import React from 'react';
import { Spacer } from '../ui/spacer';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

type ActivityType = {
  items: Activity[] | undefined;
  organizationId?: string;
};

export function ActivityList({ items, organizationId }: ActivityType) {
  return (
    <div className=' flex items-start gap-x-3 w-full'>
      <ActivityIcon />

      <div className='mb-2 w-full'>
        <div className='flex justify-between w-full'>
          <p className='body-md font-semibold'>Activity</p>
          {organizationId && (
            <div>
              <Link
                href={`/organization/${organizationId}/activity?page=1'`}
                className='underline'
              >
                <p className='body-md font-semibold'>All activities</p>
              </Link>
            </div>
          )}
        </div>
        <Spacer size={3} />
        <ol className='mb-2 '>
          {items && items.length > 0 ? (
            items.map((data) => {
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
            <p className='body-sm mb-3'>No activity yet</p>
          )}
        </ol>
      </div>
    </div>
  );
}
