'use client';
import { useOrganization } from '@clerk/nextjs';
import { CreditCard } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

function Info() {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <div className='flex items-center gap-x-4'>
      <div className='w-[60px] h-[60px] relative dark:bg-gray-300 rounded-md'>
        {organization?.imageUrl && (
          <Image
            fill
            src={organization.imageUrl}
            alt='Logo'
            className='rounded-full'
          />
        )}
      </div>
      <div>
        <p>{organization?.name}</p>
        <div className='flex gap-x-2 items-center'>
          <CreditCard size={20} className='text-gray-400' />
          <p className='body-xs text-gray-600'>Free</p>
        </div>
      </div>
    </div>
  );
}

export default Info;
