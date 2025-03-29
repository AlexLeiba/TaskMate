'use client';
import { createNewCardInList } from '@/actions/action-card';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textArea';
import { createCardSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Plus, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { RefObject, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

type Props = {
  listId: string;
  isEditingCard: boolean;
  textareaCardRef: React.RefObject<HTMLTextAreaElement | null>;
  disableEditingCard: () => void;
  enableEditingCard: () => void;
};

function CardForm({
  listId,
  isEditingCard,
  disableEditingCard,
  enableEditingCard,
}: Props) {
  const params = useParams();
  const boardId = params?.boardId;
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      title: '',
    },
  });

  const formCardRef = React.useRef<HTMLFormElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onKeyDownEvent(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      disableEditingCard();
      reset();
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      buttonRef.current?.click();
    }
  }

  useEventListener('keydown', onKeyDownEvent);
  useOnClickOutside(formCardRef as RefObject<HTMLElement>, disableEditingCard);

  async function onSubmit({ title }: { title: string }) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const response = await createNewCardInList(
      boardId as string,
      title,
      listId
    );

    if (response?.data) {
      disableEditingCard();
      reset();
      toast.success('Card was created successfully');
      setIsSubmitting(false);
    }
    if (response?.error) {
      reset();
      toast.error(response?.error);
      setIsSubmitting(false);
    }
  }

  function handleCloseEditingCard() {
    disableEditingCard();
    reset();
  }

  if (isEditingCard) {
    return (
      <form
        ref={formCardRef}
        className='m-1 py-0.5 px-1 space-y-4 text-white'
        onSubmit={(e) => e.preventDefault()}
      >
        <TextArea
          autoFocus
          label='Card title'
          {...register('title')}
          id='title'
          onKeyDown={() => {}}
          //   ref={textareaCardRef}
          placeholder='Type the title here...'
          error={errors.title?.message}
        />

        <div className='flex  gap-2 justify-between'>
          <Button
            ref={buttonRef}
            type='submit'
            variant={'secondary'}
            size={'sm'}
            className='justify-start '
            onClick={handleSubmit(onSubmit)}
          >
            Add
            {isSubmitting && <Loader className='animate-spin ' size={18} />}
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            className='justify-start hover:text-white/50 '
            onClick={handleCloseEditingCard}
          >
            <X />
          </Button>
        </div>
      </form>
    );
  }
  return (
    <div>
      <Button
        variant={'ghost'}
        size={'sm'}
        className='justify-start  font-semibold text-white hover:text-white/50 '
        onClick={enableEditingCard}
      >
        <Plus /> Add a card
      </Button>
    </div>
  );
}

export default CardForm;
