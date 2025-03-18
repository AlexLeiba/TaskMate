'use client';
import React, { useState } from 'react';
import { copyList, deleteList } from '@/actions/action-board';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal-dialog';
import { Separator } from '@/components/ui/separator';
import { List } from '@prisma/client';
import { Copy, Delete, Edit, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

function ListOptions({
  data,
  closeRef,
  enableEditingCard,
  handleEnableEditingListHeader,
}: {
  data: List;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  listId: string;
  enableEditingCard: () => void;
  handleEnableEditingListHeader: () => void;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function handleDeleteList() {
    setIsDeleteModalOpen(false);

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

  function handleOpenCreateCard() {
    enableEditingCard();
    // will trigger the dropdown Options menu to close
    closeRef?.current?.click();
  }

  return (
    <div className='flex flex-col justify-start items-start gap-2'>
      <Button
        onClick={handleEnableEditingListHeader}
        className='w-full text-s justify-start hover:bg-gray-400 hover:text-white'
        variant={'ghost'}
      >
        <Edit /> Edit list title
      </Button>
      <Button
        onClick={handleOpenCreateCard}
        className='w-full text-s justify-start hover:bg-gray-400 hover:text-white'
        variant={'ghost'}
      >
        <Plus /> Add card
      </Button>

      <Button
        onClick={handleCopyList}
        className='w-full justify-start hover:bg-gray-400 hover:text-white'
        variant={'ghost'}
      >
        <Copy /> Copy list
      </Button>

      <Separator />
      <Button
        onClick={() => setIsDeleteModalOpen(true)}
        className='w-full justify-start hover:bg-gray-400 hover:text-white'
        variant={'ghost'}
      >
        <Delete /> Delete list
      </Button>

      {/* DELETE MODAL */}
      <Modal
        open={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteList}
        positionFooter={'horizontal-fill'}
        positionHeader={'left-aligned'}
        title={'Delete list'}
        description={`This action cannot be undone. Are you sure you want to delete  "${data.title}" list?`}
        triggerTitle={''}
        customConfirmButtonText='Delete list'
      />
    </div>
  );
}

export default ListOptions;
