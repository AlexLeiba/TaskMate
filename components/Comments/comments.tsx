import { Activity } from '@prisma/client';
import {
  Activity as ActivityIcon,
  ChartArea,
  MessageCircle,
  Plus,
} from 'lucide-react';
import React from 'react';
import { Spacer } from '../ui/spacer';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useOrganization } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { Fetcher } from '@/lib/fetcher';

type ActivityType = {
  cardId: string;
  listId: string;
};

export function Comments({ cardId, listId }: ActivityType) {
  const { organization: activeOrganization } = useOrganization();
  // fetch all comments here/ when user selects this component only to fetch data based on orgId,listID and CarId

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    // refetch: refetchActivityData,
  } = useQuery<Activity[]>({
    queryKey: ['comments', cardId],
    queryFn: () => Fetcher(`/api/cards/${cardId}/comments`),
  });

  function handleWriteComment() {
    console.log('🚀 ~ handleWriteComment ~ comments:', commentsData);
  }
  return (
    <div className=' flex items-start gap-x-3 w-full'>
      <MessageCircle />

      <div className='mb-2 w-full'>
        <div className='flex justify-between w-full'>
          <p className='body-md font-semibold'>Comments</p>
          <Plus
            cursor={'pointer'}
            size={18}
            className='text-green-600 hover:opacity-80'
          />
        </div>
        <Spacer size={3} />
        <ol className='mb-2 '>
          {commentsData && commentsData.length > 0 ? (
            commentsData.map((data: any) => {
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
                    <p key={data.id} className='body-md inline'>
                      {data.text}
                    </p>

                    <p className='body-xs text-gray-500'>
                      {format(new Date(data.createdAt), 'MMM d, yyy')} at{' '}
                      {format(new Date(data.createdAt), 'hh:mm a')}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className='body-xs mb-3  text-gray-500'>No comments provided.</p>
          )}
        </ol>
      </div>
    </div>
  );
}
