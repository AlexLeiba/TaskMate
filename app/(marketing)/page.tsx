import { Button } from '@/components/ui/button';
import { Spacer } from '@/components/ui/spacer';
import { CheckCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function MarketingPage() {
  return (
    <div className='bg-gradient-to-b from-black to-sky-500 h-screen'>
      <div className=' flex justify-center items-center flex-col mx-auto max-w-screen-2xl px-4 text-gray-200'>
        <Spacer size={12} />

        <div className=' flex  items-center justify-center gap-12 '>
          <div className='flex-1'>
            <h4>
              TaskMate is a friendly task manager which helps easily to bring
              your tasks and teammates together.
            </h4>

            <Spacer size={6} />
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

            <Spacer size={4} />
            <div className='flex gap-4'>
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
              width={300}
              height={250}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketingPage;
