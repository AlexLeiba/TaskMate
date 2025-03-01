'use client';
import { Button } from '@/components/ui/button';
import { Spacer } from '@/components/ui/spacer';
import { TextArea } from '@/components/ui/textArea';
import { Fetcher } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import { Copy, Delete, Locate, LocateIcon, Logs, MapPin } from 'lucide-react';
import React from 'react';

export function CardModalContent({ cardId }: { cardId: string }) {
  const { data: cardData } = useQuery({
    queryKey: ['card', cardId],
    queryFn: () => Fetcher(`/api/cards/${cardId}`),
  });
  return (
    <div className=''>
      <div className='flex gap-2 items-end '>
        <MapPin />
        <p className='body-sm text-gray-500'>in list</p>
        <p className='body-md text-gray-700 underline'>
          {cardData?.list.title}
        </p>
      </div>

      <Spacer size={6} />
      <div className='flex gap-2'>
        <Logs />
        <p className='body-lg font-semibold'>Description</p>
      </div>
      <Spacer size={2} />
      <TextArea placeholder='Type the description here...' />

      <Spacer size={6} />
      <p className='body-lg font-semibold'>Actions</p>
      <Spacer size={2} />

      <div className='flex flex-col gap-2 '>
        <Button className='w-full justify-start'>
          <Copy /> Copy
        </Button>
        <Button className='w-full justify-start'>
          <Delete /> Delete
        </Button>
      </div>
    </div>
  );
}
