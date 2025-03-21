'use client';
import { Fetcher } from '@/lib/fetcher';
import { Activity } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityList } from './activityList';
import { useOrganization } from '@clerk/nextjs';

type ActivityType = {
  cardId: string;
};

function ActivityFetcher({ cardId }: ActivityType) {
  const {
    data: activityData,
    isLoading: isActivityLoading,
    // refetch: refetchActivityData,
  } = useQuery<Activity[]>({
    queryKey: ['activity', cardId],
    queryFn: () => Fetcher(`/api/cards/${cardId}/activity`),
  });
  const { organization: activeOrganization } = useOrganization();
  return (
    <ActivityList
      organizationId={activeOrganization?.id}
      activitiesData={activityData || []}
      isActivityLoading={isActivityLoading}
    />
  );
}

export default ActivityFetcher;
