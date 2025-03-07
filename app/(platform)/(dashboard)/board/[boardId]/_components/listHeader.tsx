'use client';
import { Card, List } from '@prisma/client';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Archive,
  Check,
  Circle,
  CircleCheck,
  Clock,
  Clock4,
  Plus,
  SearchCode,
  Wifi,
  WifiHigh,
  WifiLow,
  X,
} from 'lucide-react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListSchema } from '@/lib/schemas';
import { editListTitle } from '@/actions/action-board';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Modal } from '@/components/Modal/modal';

function ListHeader({
  data,
  isEditing,
  setIsEditing,
}: {
  data: List & { cards: Card[] };
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
      title: data.title,
    },
  });

  const formRef = React.useRef<HTMLFormElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

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
    const response = await editListTitle(boardId as string, title, data.id);

    if (response?.data) {
      handleDisableEditing();
      toast.success('List name was edited successfully');
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

  const listStatusOptions = [
    {
      label: 'Todo',
      value: 'todo',
      icon: <Circle />,
    },
    {
      label: 'In Progress',
      value: 'in-progress',
      icon: <Clock4 />,
    },
    {
      label: 'In Review',
      value: 'in-review',
      icon: <SearchCode />,
    },
    {
      label: 'Done',
      value: 'done',
      icon: <CircleCheck />,
    },
    {
      label: 'Backlog',
      value: 'backlog',
      icon: <Archive />,
    },
  ];

  if (isEditing) {
    return (
      <div
        className='body-sm font-semibold flex justify-between items-end gap-x-2  relative z-20'
        onClick={handleEnableEditing}
      >
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className='w-full  flex  gap-1  items-end justify-between'
        >
          <div className='flex flex-col text-white'>
            <Input
              label='Edit list title'
              autoFocus
              className=' transition-all h-[30px] px-2  outline-none rounded-md '
              {...register('title')}
              placeholder='New list title...'
              error={errors.title?.message}
            />
          </div>
          <Button
            className='h-[30px]'
            size={'sm'}
            variant={'outline'}
            type='submit'
            onClick={handleSubmit(onSubmit)}
          >
            <Plus />
          </Button>
        </form>
        <X
          size={20}
          cursor={'pointer'}
          className='absolute top-0 right-0'
          onClick={handleDisableEditing}
        />
      </div>
    );
  }

  return (
    <div className='text-white body-sm  flex  items-center gap-x-2 cursor-text py-2 pr-6'>
      <div className='flex items-start gap-x-2'>
        {/* STATUS SELECTOR */}
        <Modal
          contentClassName='w-[170px]  '
          title='Status'
          content={
            <>
              {listStatusOptions.map((data, index) => {
                return (
                  <div
                    key={index}
                    className='flex items-center justify-start gap-x-2 cursor-pointer mb-1 hover:bg-gray-300 h-4 py-4 px-2 rounded-md'
                    onClick={() => {
                      console.log(data.value);
                    }}
                  >
                    {data.icon}
                    <p>{data.label}</p>
                  </div>
                );
              })}
            </>
          }
        >
          <div>
            <div
              role='button'
              className='mt-px rounded-full border-2 border-white w-3 h-3 flex justify-center items-center hover:border-gray-400 text-white p-2'
            />
          </div>
        </Modal>
        {/*  */}

        <div role='button' onClick={handleEnableEditing}>
          <p className='body-md font-semibold line-clamp-2 '>{data.title}</p>
        </div>
        <p className='body-md text-gray-400 px-2'>{data?.cards?.length} </p>
      </div>
    </div>
  );
}

export default ListHeader;
