import { Button } from '@/components/ui/button';
import { Spacer } from '@/components/ui/spacer';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function MarketingPage() {
  return (
    <div className=' bg-gradient-to-b from-sky-600  to-transparent w-full'>
      <div className='mx-auto max-w-screen-2xl px-4'>
        <div className=' min-h-[600px]'>
          <div className=' flex justify-center items-center flex-col  text-gray-200'>
            <Spacer size={24} />

            <div className=' flex  items-center justify-center lg:gap-12 sm:gap-6 md:gap-6 md:flex-row lg:flex-row  flex-col'>
              <div className='flex-1 flex flex-col gap-8'>
                <h4>
                  TaskMate is a friendly task manager which helps easily to
                  bring your tasks and teammates together.
                </h4>
                <div className='flex '>
                  <Link href={'/sign-up'} title='Sign Up'>
                    <Button variant={'secondary'}>Sign up for free</Button>
                  </Link>
                </div>
              </div>

              <div className='flex-1 relative flex flex-col gap-8'>
                <Spacer sm={2} md={8} lg={8} />

                <Image
                  src={'/landing/organization.webp'}
                  alt='organization dashboard'
                  className='object-fill rounded-md '
                  width={750}
                  height={400}
                />

                <Image
                  src={'/landing/drag-drop-done.webp'}
                  alt='dashboard cards and lists'
                  className='object-fill rounded-md md:absolute  top-[15%] right-0 md:rotate-6 w-full md:w-[350px]'
                  width={350}
                  height={100}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-center items-center text-center w-full pt-16 body-lg font-semibold'>
          <div>
            <p>
              • Easy to use, simple to understand, with powerful tools and more.
            </p>
            <Spacer size={6} />
            <p>
              • Make your board look unique and friendly by adding background
              images.
            </p>
            <Spacer size={6} />
            <p>
              • Create Lists , Tasks and Subtasks, and assign them to your team
              members.
            </p>
            <Spacer size={6} />
            <p>
              • Invite team members to your board , and start collaborating.
            </p>
            <Spacer size={6} />
            <div className='flex gap-4 w-full justify-center items-center'>
              <Link href={'/sign-up'} title='Sign Up'>
                <Button variant={'secondary'}>Sign up for free</Button>
              </Link>
            </div>
          </div>
        </div>
        <Spacer size={24} />
      </div>
    </div>
  );
}

export default MarketingPage;
