'use client';
import { Card, List } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Archive,
  Check,
  Circle,
  CircleCheck,
  Clock4,
  Loader,
  Plus,
  SearchCode,
  X,
} from 'lucide-react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListSchema } from '@/lib/schemas';
import { editListStatus, editListTitle } from '@/actions/action-board';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Modal } from '@/components/Modal/modal';
import { cn } from '@/lib/utils';

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
  const [selectStatus, setSelectStatus] = useState<{
    label: string;
    value: string;
    icon: React.JSX.Element;
  }>({
    label: 'Todo',
    value: 'todo',
    icon: <Circle />,
  });
  const [isPrioritiesOpenModal, setIsPrioritiesOpenModal] = useState(false);
  const [isTitleSubmitting, setIsTitleSubmitting] = useState(false);

  useEffect(() => {
    const selectedStatus = listStatusOptions.find(
      (status) => status.value === data.status
    );
    if (!selectedStatus) return;
    setSelectStatus(selectedStatus);
  }, []);

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
    if (isTitleSubmitting) return;
    setIsTitleSubmitting(true);
    const response = await editListTitle(boardId as string, title, data.id);

    if (response?.data) {
      handleDisableEditing();
      toast.success('List name was edited successfully');
      setIsTitleSubmitting(false);
    }
    if (response?.error) {
      toast.error(response?.error);
      setIsTitleSubmitting(false);
    }

    handleDisableEditing();
  }

  async function handleAddListStatus(status: {
    label: string;
    value: string;
    icon: React.JSX.Element;
  }) {
    setSelectStatus(status);

    const response = await editListStatus(
      boardId as string,
      status.value,
      data.id
    );

    if (response?.data) {
      toast.success('List status was edited successfully');
    }
    if (response?.error) {
      toast.error(response?.error);
    }
  }

  useEventListener('keydown', handleOnKeyDown);
  useEventListener('keydown', handleOnKeyDown);
  // @ts-ignore
  useOnClickOutside(formRef, handleDisableEditing); // Will check if clicked outside of the form then fire the Disabled fn to unfocus

  // When edit is enabled we will turn Add a list Button into Input
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
            {isTitleSubmitting ? (
              <Loader className='animate-spin ' size={18} />
            ) : (
              <Plus />
            )}
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
          contentClassName='w-[200px]  '
          onClose={() => setIsPrioritiesOpenModal(!isPrioritiesOpenModal)}
          title='List Status'
          isOpen={isPrioritiesOpenModal}
          content={
            <>
              {listStatusOptions.map((data, index) => {
                return (
                  <div
                    key={index}
                    className={cn(
                      selectStatus.value === data.value &&
                        'bg-gray-800 text-white',
                      'flex items-center justify-start gap-x-4 cursor-pointer mb-1 hover:bg-gray-400 hover:text-white h-4 py-4 px-2 rounded-md'
                    )}
                    onClick={() => {
                      handleAddListStatus(data);

                      setIsPrioritiesOpenModal(false);
                    }}
                  >
                    <div>
                      <div className='flex justify-center items-center gap-x-2 '>
                        <div>{data.icon}</div>
                        <p>{data.label}</p>
                      </div>
                    </div>
                    {selectStatus.value === data.value && <Check />}
                  </div>
                );
              })}
            </>
          }
        >
          <div
            role='button'
            onClick={(e) => {
              setIsPrioritiesOpenModal(true);
              e.stopPropagation();
            }}
            className='  flex justify-center items-center'
          >
            <div className='text-white hover:text-gray-400 flex justify-center items-center'>
              {selectStatus.icon}
            </div>
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
