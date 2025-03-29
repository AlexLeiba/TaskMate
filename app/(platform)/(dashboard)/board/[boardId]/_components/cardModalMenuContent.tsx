'use client';
import { copyCard, deleteCard, editCard } from '@/actions/action-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/modal-dialog';
import { Separator } from '@/components/ui/separator';
import { Spacer } from '@/components/ui/spacer';
import { Fetcher } from '@/lib/fetcher';
import { createCardSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Copy, Delete, Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export function CardModalMenuContent({
  cardId,
  listId,
  setIsCardModalOpen,
}: {
  cardId: string;
  listId: string;
  setIsCardModalOpen: (value: React.SetStateAction<boolean>) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const params = useParams();
  const { boardId } = params;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isCopySubmitting, setIsCopySubmitting] = useState(false);

  const { data: cardData } = useQuery({
    queryKey: ['card', cardId],
    queryFn: () => Fetcher(`/api/cards/${cardId}`),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      title: cardData?.title,
    },
  });

  useEffect(() => {
    setValue('title', cardData?.title);
    inputRef.current?.blur();
  }, [cardData]);

  async function onSubmit({ title }: { title: string }) {
    setIsCardModalOpen(false);
    const response = await editCard({
      title,
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

  async function handleDeleteCard() {
    setIsDeleteModalOpen(false);
    setIsCardModalOpen(false);

    const response = await deleteCard(boardId as string, cardId, listId);

    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.data) {
      toast.success('Card deleted successfully');
    }
  }

  async function handleCopyCard() {
    if (isCopySubmitting) return;
    setIsCopySubmitting(true);
    const response = await copyCard(boardId as string, cardId, listId);
    setIsCardModalOpen(false);

    if (response?.error) {
      toast.error(response?.error);
      setIsCopySubmitting(false);
    }
    if (response?.data) {
      toast.success('Card copied successfully');
      setIsCopySubmitting(false);
    }
  }
  return (
    <div className='' onClick={(e) => e.stopPropagation()}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        action='
        '
      >
        <Controller
          name='title'
          control={control}
          defaultValue={cardData?.title}
          render={({ field: { onChange, value } }) => (
            <Input
              autoFocus={false}
              disabled={!cardData?.title}
              onChange={onChange}
              ref={inputRef}
              onClick={(e) => e.stopPropagation()}
              label='Edit title'
              value={value || ''}
              placeholder='Type the new title here...'
              error={errors?.title?.message as string}
            />
          )}
        />
      </form>

      <Spacer size={3} />
      <p className='body-md font-semibold'>Actions</p>
      <Spacer size={2} />

      <div className='flex flex-col gap-2 '>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleCopyCard();
          }}
          variant={'ghost'}
          className='w-full justify-start hover:bg-gray-200'
        >
          {isCopySubmitting ? (
            <Loader className='animate-spin ' size={18} />
          ) : (
            <Copy />
          )}
          Copy
        </Button>
        <Separator />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteModalOpen(true);
          }}
          variant={'ghost'}
          className='w-full justify-start hover:bg-gray-200'
        >
          <Delete /> Delete
        </Button>

        {/* DELETE MODAL */}
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
    </div>
  );
}
