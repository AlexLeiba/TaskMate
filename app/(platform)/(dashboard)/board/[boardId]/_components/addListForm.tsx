'use client';
import React from 'react';
import ListWrapper from './listWrapper';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListSchema } from '@/lib/schemas';
import { addNewListTitle } from '@/actions/action-board';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

function AddListForm() {
  const params = useParams();
  const boardId = params?.boardId;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      title: '',
    },
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [listValue, setListValue] = React.useState('');

  function handleEnableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  function handleDisableEditing() {
    setIsEditing(false);
    reset();
  }

  function handleOnKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleDisableEditing();
    }
    if (e.key === 'Enter' && formRef.current) {
      handleSubmit(onSubmit);
    }
  }

  async function onSubmit({ title }: { title: string }) {
    console.log('handleSubmit', title);

    const response = await addNewListTitle(boardId as string, title);

    if (response?.data) {
      handleDisableEditing();
      toast.success('A new list was created successfully');
    }
    if (response?.error) {
      toast.error(response?.error);
    }

    handleDisableEditing();
  }

  useEventListener('keydown', handleOnKeyDown);
  useEventListener('keydown', handleOnKeyDown);
  // @ts-ignore
  useOnClickOutside(formRef, handleDisableEditing); // Will check if clicked outside of the form then fire the Disabled fn to unfocus

  // When edit is enabled we will turn Add a list Button into Input
  if (isEditing) {
    return (
      <ListWrapper>
        <div className='w-full p-3 rounded-md shadow-md bg-white flex  gap-2 items-end relative'>
          <form
            action=''
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            className='w-full  flex  gap-2 items-end'
          >
            <Input
              autoFocus
              label='Add new list'
              className=' transition-all h-[30px]'
              {...register('title')}
              placeholder='Type list title..'
              error={errors.title?.message}
            />
            <Button
              className='h-[30px]'
              size={'sm'}
              variant={'secondary'}
              type='submit'
              onClick={handleSubmit(onSubmit)}
            >
              <Plus />
            </Button>
          </form>
          <X
            size={20}
            cursor={'pointer'}
            className='absolute top-2 right-2'
            onClick={handleDisableEditing}
          />
        </div>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <Button
        onClick={handleEnableEditing}
        className='w-full hover:bg-white/70 bg-white text-left justify-start'
        variant={'ghost'}
      >
        <Plus />
        <p>Add a list</p>
      </Button>
    </ListWrapper>
  );
}

export default AddListForm;
