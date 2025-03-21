'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Fetcher } from '@/lib/fetcher';
import { Activity } from '@prisma/client';
import { ActivityList } from '@/components/Activity/activityList';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spacer } from '@/components/ui/spacer';

const POSTS_PER_PAGE = 10;
function Activities() {
  const params = useSearchParams();
  const route = useRouter();

  const { data: activitiesData, isLoading: isActivityLoading } = useQuery<
    Activity[]
  >({
    queryKey: ['activity', 'all-activities', Number(params.get('page'))],
    queryFn: () =>
      Fetcher(`/api/all-activities?page=${Number(params.get('page'))}`),
  });

  const currentPageParam = params.get('page');

  function handleChangePage(direction: 'next' | 'prev') {
    if (direction === 'next') {
      route.push(`?page=${Number(currentPageParam) + 1}`);
      return;
    }
    if (direction === 'prev') {
      route.push(`?page=${Number(currentPageParam) - 1}`);
      return;
    }
  }

  return (
    <div className='w-full overflow-y-auto'>
      <ActivityList
        activitiesData={activitiesData || []}
        isActivityLoading={isActivityLoading}
      />

      <div className='flex justify-between items-center w-full'>
        <Button
          variant={'outline'}
          disabled={Number(currentPageParam) === 1}
          onClick={() => handleChangePage('prev')}
        >
          <ChevronLeft />
        </Button>

        <Button
          onClick={() => handleChangePage('next')}
          variant={'outline'}
          disabled={activitiesData && activitiesData?.length < POSTS_PER_PAGE}
        >
          <ChevronRight />
        </Button>
      </div>
      <Spacer size={32} />
    </div>
  );
}

export default Activities;
