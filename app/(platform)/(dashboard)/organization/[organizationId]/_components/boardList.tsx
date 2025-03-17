import { Info, User } from 'lucide-react';
import React from 'react';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/Modal/modal';
import FormBoard from './formBoard';
import Board from './board';

async function BoardList({
  boards,
}: {
  boards: { id: string; title: string }[];
}) {
  return (
    <div className='inline-flex flex-col gap-4'>
      <div className='flex gap-x-2 items-center'>
        <User />
        <p className='body-lg font-bold'>Your boards</p>
      </div>

      <Modal
        contentClassName='w-[450px] bg-gray-300'
        title='Create a board'
        description='sasas'
        sideOffset={5}
        side='right'
        content={<FormBoard type='boards' />}
      >
        <div
          role='button'
          className='inline-flex pl-3 pr-12 py-3 bg-gray-200 relative rounded-md hover:opacity-80 dark:text-black'
        >
          <div className='flex flex-col'>
            Create new board
            <p className='body-xs text-gray-600'>10 remaining</p>
          </div>
          <TooltipProvider delayDuration={250}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
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

      <div className='flex-col gap-3 inline-flex ml-6'>
        {boards?.map((board) => (
          <Board board={board} key={board.id} />
        ))}
      </div>
    </div>
  );
}

export default BoardList;
