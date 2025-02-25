'use client';
import { deleteBoard } from '@/actions/action-dashboard';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal-dialog';
import { type Board } from '@prisma/client';
import { Info, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function Board({ board }: Board | any) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();

  async function handleDeleteBoard(boardId: string) {
    const result = await deleteBoard(boardId);
    if (result?.data) {
      toast.success('Board deleted successfully');
    }
  }

  return (
    <>
      <div
        className='flex justify-between gap-4 items-center cursor-pointer  w-full  h-28 rounded-md overflow-hidden group '
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/board/${board.id}`);
        }}
      >
        <div className='relative w-full h-full z-40 py-2 pl-2 pr-9'>
          {board.imageThumbUrl && (
            <Image
              fill
              src={board.imageThumbUrl}
              alt={board.title}
              className='w-full h-full object-cover '
            />
          )}

          <p className='z-20 absolute top-0 left-0 body-sm text-white font-semibold line-clamp-3 pl-2 pr-9 py-2 overflow-hidden h-[78px]'>
            {board.title}
          </p>

          <Button
            size={'sm'}
            variant={'ghost'}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModalOpen(true);
            }}
            className='w-4 h-6 rounded-full bg-white/50 flex justify-center items-center absolute top-2 right-2 z-20'
          >
            <X className='' />
          </Button>

          {deleteModalOpen && (
            <Modal
              open={deleteModalOpen}
              onOpenChange={() => setDeleteModalOpen(!deleteModalOpen)}
              classNameTriggerButton='text-text-base rounded border-none p-2 shadow'
              triggerTitle=''
              iconHeader={<Info size={20} />}
              // iconLinkButton={<IconSettings />}
              positionFooter='horizontal-group'
              positionHeader='center-aligned'
              title={'Delete board'}
              description={
                'Deliting the board  will permanently erase all the information is associated with it. Are you sure you want to continue?'
              }
              onConfirm={() => {
                handleDeleteBoard(board.id);
              }}
              // onCheckbox={(v) => console.log('checkbox value', v)}
              // onLinkButton={() => console.log('settings clicked')}
              customConfirmButtonText='Confirm '
              customCancelButtonText='Cancel'
            >
              {/* BODY MODAL HERE */}
            </Modal>
          )}

          <div className='absolute inset-0 bg-black/30 group-hover:bg-black/50 transition' />
        </div>
      </div>
    </>
  );
}

export default Board;
