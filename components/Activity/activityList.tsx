'use client';
import { Activity } from '@prisma/client';
import { Activity as ActivityIcon } from 'lucide-react';
import React from 'react';
import { Spacer } from '../ui/spacer';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Fetcher } from '@/lib/fetcher';
import { ActivitiesSkeleton } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/activitiesSkeleton';
import { cn } from '@/lib/utils';

type ActivityType = {
  organizationId?: string;
  activitiesData: Activity[];
  isActivityLoading: boolean;
};

export function ActivityList({
  organizationId,
  activitiesData,
  isActivityLoading,
}: ActivityType) {
  // fetch activities when is selected

  return (
    <>
      {isActivityLoading ? (
        <ActivitiesSkeleton />
      ) : (
        <>
          <div className=' flex items-start gap-x-3 w-full'>
            <div className=' w-full'>
              <div className='flex justify-between w-full'>
                <div className='flex gap-2'>
                  <ActivityIcon />
                  <div className='flex gap-2 items-center'>
                    <p className='body-md font-semibold'>Activities</p>
                    <p className='text-gray-400'>{activitiesData?.length}</p>
                  </div>
                </div>
                {organizationId && (
                  <div>
                    <Link
                      href={`/organization/${organizationId}/activity?page=1`}
                      className='underline'
                    >
                      <p className='body-sm font-semibold'>All activities</p>
                    </Link>
                  </div>
                )}
              </div>
              <Spacer size={3} />
              <div
                className={cn(
                  organizationId
                    ? 'h-[80px] overflow-y-auto pr-2'
                    : ' overflow-y-auto  pr-2'
                )}
              >
                {activitiesData && activitiesData.length > 0 ? (
                  activitiesData.map((data) => {
                    return (
                      <div
                        className='flex gap-2 items-center mb-3'
                        key={data.id}
                      >
                        <div>
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
                        </div>

                        <div>
                          <p className='body-xs font-semibold inline mr-2'>
                            {data.userName}
                          </p>
                          <p key={data.id} className='body-sm inline'>
                            {data.entityTitle}
                          </p>

                          <p className='body-xs text-gray-500'>
                            <strong className='mr-4'>
                              Board: {data.boardTitle}
                            </strong>
                            {format(new Date(data.createdAt), 'MMM d, yyy')} at{' '}
                            {format(new Date(data.createdAt), 'hh:mm a')}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className='body-xs mb-3  text-gray-500'>
                    No activities yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
