import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function MarketingPage() {
  return (
    <div className=' flex justify-center items-center flex-col mx-auto max-w-2xl gap-8 mt-24'>
      <div className=' flex items-center justify-center flex-col gap-8 text-center'>
        <div className=' flex items-center border shadow-sm p-2 rounded-full bg-amber-100 text-amber-900 gap-1'>
          <CheckCircleIcon className='h-6 w-6 ' />
          <p className=' body-sm font-semibold'>TaskMate</p>
        </div>

        <h5 className=' text-center text-neutral-900 '>
          TaskMate is your friendly solution for managing your tasks.
        </h5>

        <div className=' bg-gradient-to-r from-fuchsia-600 to-pink-600 py-2 px-4 rounded-md '>
          <p className='body-xl text-amber-100'>Work forward.</p>
        </div>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
          adipisci eaque unde, repudiandae quod consequatur dicta non, quae,
          perspiciatis eligendi saepe! Necessitatibus magnam, voluptas quam
          pariatur ea quaerat obcaecati expedita!
        </p>
      </div>

      <div className='flex gap-4'>
        <Link href={'/sign-up'}>
          <Button>Sign up for free</Button>
        </Link>
        <Link href={'/sing-in'}>
          <Button variant={'outline'}>Login</Button>
        </Link>
      </div>
    </div>
  );
}

export default MarketingPage;
