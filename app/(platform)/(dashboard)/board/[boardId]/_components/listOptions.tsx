'use client';
import { copyList, deleteList } from '@/actions/action-board';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal-dialog';
import { Separator } from '@/components/ui/separator';
import { List } from '@prisma/client';
import { Copy, Delete, Plus } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

function ListOptions({
  data,
  closeRef,
}: {
  data: List;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function handleDeleteList() {
    setIsDeleteModalOpen(false);
    console.log('handleDeleteList');
    const response = await deleteList(data.boardId, data.id);

    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.data) {
      toast.success('List deleted successfully');

      // On success will trigger the dropdown Options menu to close
      closeRef?.current?.click();
    }
  }

  async function handleCopyList() {
    const response = await copyList(data.boardId, data.id);

    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.data) {
      toast.success('List was copied successfully');

      // On success will trigger the dropdown Options menu to close
      closeRef?.current?.click();
    }
  }

  return (
    <div className='flex flex-col justify-start items-start gap-2'>
      <Button
        className='w-full text-s justify-start hover:bg-gray-300'
        variant={'ghost'}
      >
        <Plus /> Add card
      </Button>

      <Button
        onClick={handleCopyList}
        className='w-full justify-start hover:bg-gray-300'
        variant={'ghost'}
      >
        <Copy /> Copy list
      </Button>

      <Separator />

      <Modal
        open={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteList}
        positionFooter={'horizontal-fill'}
        positionHeader={'left-aligned'}
        title={'Delete list'}
        description={`This action cannot be undone. Are you sure you want to delete  "${data.title}" list?`}
        triggerTitle={''}
      />

      <Button
        onClick={() => setIsDeleteModalOpen(true)}
        className='w-full justify-start hover:bg-gray-300'
        variant={'ghost'}
      >
        <Delete /> Delete list
      </Button>
    </div>
  );
}

export default ListOptions;
