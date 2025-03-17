import { Button } from '@/components/ui/button';
import { Spacer } from '@/components/ui/spacer';
import { CheckCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function MarketingPage() {
  return (
    <>
      <div className='bg-gradient-to-b from-sky-600  to-transparent h-[600px]'>
        <div className=' flex justify-center items-center flex-col mx-auto max-w-screen-2xl px-4 text-gray-200'>
          <Spacer size={24} />

          <div className=' flex  items-center justify-center gap-12 '>
            <div className='flex-1 flex flex-col gap-8'>
              <h4>
                TaskMate is a friendly task manager which helps easily to bring
                your tasks and teammates together.
              </h4>
              <div className='flex '>
                <Link href={'/sign-up'}>
                  <Button variant={'secondary'}>Sign up for free</Button>
                </Link>
              </div>
            </div>

            <div className='flex-1 relative'>
              <Spacer size={8} />

              <Image
                src={'/landing/organization.webp'}
                alt='organization'
                className='object-fill rounded-md '
                width={750}
                height={400}
              />
              {/* </div> */}

              <Image
                src={'/landing/drag-drop-done.webp'}
                alt='organization'
                className='object-fill rounded-md absolute top-[15%] right-0 rotate-6'
                width={350}
                height={100}
              />

              <Image
                src={'/landing/create-board.webp'}
                alt='organization'
                className='object-fill rounded-md absolute top-[65%] right-0 rotate-6'
                width={250}
                height={250}
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
          <p>• Invite team members to your board , and start collaborating.</p>
          <Spacer size={6} />
          <div className='flex gap-4 w-full justify-center items-center'>
            <Link href={'/sign-up'}>
              <Button variant={'secondary'}>Sign up for free</Button>
            </Link>
          </div>
        </div>
      </div>
      <Spacer size={24} />
    </>
  );
}

export default MarketingPage;
