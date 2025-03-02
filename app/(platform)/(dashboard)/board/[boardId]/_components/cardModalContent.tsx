'use client';
import { copyCard, deleteCard, editCard } from '@/actions/action-card';
import { Button } from '@/components/ui/button';
import Dropdown from '@/components/ui/dropdown';
import Modal from '@/components/ui/modal-dialog';
import { Spacer } from '@/components/ui/spacer';
import { TextArea } from '@/components/ui/textArea';
import { Fetcher } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import { Check, Copy, Delete, Logs, MapPin } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEventListener } from 'usehooks-ts';

export function CardModalContent({
  cardId,
  listId,
}: {
  cardId: string;
  listId: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const params = useParams();
  const { boardId } = params;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: cardData } = useQuery({
    queryKey: ['card', cardId],
    queryFn: () => Fetcher(`/api/cards/${cardId}`),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      description: cardData?.description || '',
      status: cardData?.status || 'none',
    },
  });

  useEffect(() => {
    setValue('description', cardData?.description);
    textareaRef.current?.blur();
  }, [cardData]);

  async function onSubmit({ description }: { description: string }) {
    const response = await editCard({
      description,
      boardId: boardId as string,
      listId,
      cardId,
    });

    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.data) {
      toast.success('Card edited successfully');
    }
  }

  useEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(onSubmit)();
    }
  });

  async function handleDeleteCard() {
    setIsDeleteModalOpen(false);

    const response = await deleteCard(boardId as string, cardId, listId);

    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.data) {
      toast.success('Card deleted successfully');
    }
  }

  async function handleCopyCard() {
    const response = await copyCard(boardId as string, cardId, listId);

    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.data) {
      toast.success('Card copied successfully');
    }
  }
  return (
    <div className='w-full'>
      <div className='flex gap-2 w-full '>
        <MapPin />
        <p className='body-sm text-gray-500'>in list</p>
        <p className='body-md text-gray-700 underline'>
          {cardData?.list.title}
        </p>
      </div>

      <Spacer size={6} />

      <div className='flex w-full gap-8 justify-between items-end'>
        <div className='w-full'>
          <div className='flex gap-2'>
            <Logs />
            <p className='body-md font-medium'>Description</p>
          </div>
          <Spacer size={2} />
          <form className='w-full' action='' onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name='description'
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextArea
                  ref={textareaRef}
                  onChange={onChange}
                  value={value || ''}
                  rows={7}
                  autoFocus={false}
                  className='w-full'
                  placeholder='Type the description here...'
                  error={errors?.description?.message as string}
                />
              )}
            />

            {/* Remove the second Controller and Dropdown */}
          </form>
        </div>

        <div className='w-[200px]'>
          <Spacer size={3} />
          <div className='flex gap-2'>
            <Check />
            <p className='body-md font-medium'>Status</p>
          </div>
          <Spacer size={2} />
          <Controller
            name='status'
            control={control}
            defaultValue=''
            render={({ field: { onChange, value, ref } }) => (
              <Dropdown
                defaultValue={value}
                label=''
                options={[
                  { label: 'None', value: 'none', image: '' },
                  { label: 'Todo', value: 'todo', image: '/todo.png' },
                  {
                    label: 'Progress',
                    value: 'progress',
                    image: '/progress.png',
                  },
                  { label: 'Done', value: 'Done', image: '/check.png' },
                ]}
                onChange={onChange}
                value={value}
              />
            )}
          />
          <Spacer size={7} />
          <p className='body-md font-medium'>Actions</p>
          <Spacer size={2} />

          <div className='flex flex-col gap-2 '>
            <Button
              variant={'secondary'}
              className='w-full justify-start'
              onClick={handleCopyCard}
            >
              <Copy /> Copy
            </Button>
            <Button
              variant={'destructive'}
              className='w-full justify-start'
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Delete /> Delete
            </Button>
          </div>
        </div>
      </div>
      <Modal
        open={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCard}
        positionFooter={'horizontal-fill'}
        positionHeader={'left-aligned'}
        title={'Delete card'}
        description={`This action cannot be undone. Are you sure you want to delete  "${cardData?.title}" card?`}
        triggerTitle={''}
        customConfirmButtonText='Delete card'
      />
    </div>
  );
}
