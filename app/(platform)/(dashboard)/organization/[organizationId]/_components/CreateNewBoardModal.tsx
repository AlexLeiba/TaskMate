'use client';
import React, { useRef, useState } from 'react';
import { Info as InfoIcon } from 'lucide-react';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/modal-dialog';
import FormBoard from './formBoard';

function CreateNewBoardModal() {
  const [isLoadingCreateBoard, setIsLoadingCreateBoard] = useState(false);

  return (
    <Modal
      positionFooter={'horizontal-fill'}
      positionHeader={'left-aligned'}
      title={'New board'}
      description={''}
      triggerTitle={''}
      hideCancel
      hideConfirm
      customTrigger={
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
                className=' z-40 w-[220px]'
                dark={false}
                iconHelpTooltip={{
                  title:
                    'Free workspaces can have up to 10 open boards, for unlimited boards upgrade the plan!',
                  description: '',
                }}
              />
            </Tooltip>
          </TooltipProvider>
        </div>
      }
    >
      <FormBoard
        type='boards'
        setIsLoadingCreateBoard={setIsLoadingCreateBoard}
        isLoadingCreateBoard={isLoadingCreateBoard}
      />
    </Modal>
  );
}

export default CreateNewBoardModal;
