import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Spacer } from '@/components/ui/spacer';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { User, Info as InfoIcon } from 'lucide-react';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/Modal/modal';
import { db } from '@/lib/db';
import FormBoard from './_components/formBoard';
import Board from './_components/board';
import Info from './_components/info';

async function OrganizationPage({}: // params,
{
  params: { organizationId: Promise<string> };
}) {
  const { orgId } = await auth();

  if (!orgId) {
    return redirect('/select-org');
  }

  const boards = await db?.board?.findMany({
    where: {
      orgId: orgId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className='flex flex-col gap-4 w-full'>
      <Spacer size={2} />
      {/* Current board top info */}
      <Info />
      <Separator />

      {/* Your boards */}
      <div>
        <div className='inline-flex flex-col gap-4'>
          <div className='flex gap-x-2 items-center'>
            <User />
            <p className='body-lg font-bold'>Your boards</p>
          </div>

          {/* BOARDS LIST */}
          <div className=' grid grid-cols-2 sm:gid-cols-3 lg:grid-cols-4 gap-4'>
            {boards?.map((board) => (
              <Board board={board} key={board.id} />
            ))}
            <Modal
              contentClassName='w-[450px] bg-gray-300'
              title='Create a board'
              description=''
              sideOffset={-40}
              side='top'
              content={<FormBoard type='boards' />}
            >
              <div
                role='button'
                className='inline-flex pl-3 pr-12 py-3 h-28 bg-gray-200 relative rounded-md hover:opacity-80'
              >
                <div className='flex flex-col'>
                  Create new board
                  <p className='body-xs text-gray-600'>10 remaining</p>
                </div>
                <TooltipProvider delayDuration={250}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon
                        size={20}
                        className={cn([
                          'z-20 cursor-help',
                          'absolute right-2 top-1/2 -translate-y-1/2',
                          'text-gray-400',
                          'right-3',
                        ])}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      dark={false}
                      iconHelpTooltip={{
                        title:
                          'Free workspaces can have up to 5 open boards, for unlimited boards upgrade the plan!',
                        description: '',
                      }}
                    />
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationPage;
