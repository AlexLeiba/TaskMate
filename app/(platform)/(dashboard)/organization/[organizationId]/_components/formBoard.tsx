'use client';
import { createBoard } from '@/actions/action-dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boardSchema } from '@/lib/schemas';
import { toast } from 'react-toastify';
import ImagePicker from '@/components/ImagePicker/imagePicker';
import { useRouter } from 'next/navigation';
import { useEventListener } from 'usehooks-ts';
import { Spacer } from '@/components/ui/spacer';
import { Loader } from 'lucide-react';

function FormBoard({
  type,
  closeModalOnSubmitRef,
  isLoadingCreateBoard,
  setIsLoadingCreateBoard,
}: {
  type: 'header' | 'boards';
  closeModalOnSubmitRef?: React.RefObject<HTMLButtonElement | null>;
  setIsLoadingCreateBoard?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingCreateBoard?: boolean;
}) {
  const [selectedImageId, setSelectedImageId] = React.useState<string | null>(
    null
  );

  const router = useRouter();
  const formMethods = useForm({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: '',
      image: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = formMethods;

  async function onSubmit(formData: { title: string; image: string }) {
    const { title, image } = formData;

    handleCreateBoard({ title, image });

    closeModalOnSubmitRef?.current?.click();
  }

  async function handleCreateBoard({
    title,
    image,
  }: {
    title: string;
    image: string;
  }) {
    setIsLoadingCreateBoard?.(true);
    const result = await createBoard({ title, image });

    if (result?.data) {
      if (type === 'header') {
        toast.success('Board created successfully');
        reset();
        setSelectedImageId?.(null);
        // @ts-ignore
        router.push(`/board/${result.data?.id}`);
        setIsLoadingCreateBoard?.(false);
      } else {
        toast.success('Board created successfully');
        reset();
        setIsLoadingCreateBoard?.(false);
        setSelectedImageId?.(null);
      }
    }
  }

  useEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit);
    }
  });

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className='flex  gap-2 items-center justify-start  flex-col'>
        {/* IMAGE PICKER */}
        <FormProvider {...formMethods}>
          <ImagePicker
            type={type}
            setSelectedImageId={setSelectedImageId}
            selectedImageId={selectedImageId}
          />
        </FormProvider>

        <Input
          className='w-full'
          {...register('title')}
          label='Board title'
          error={errors?.title?.message}
        />

        <Button
          disabled={isLoadingCreateBoard}
          onClick={handleSubmit(onSubmit)}
          type='submit'
          className='w-full'
        >
          Create
          {isLoadingCreateBoard && (
            <div>
              <Loader className=' animate-spin' />
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}

export default FormBoard;
