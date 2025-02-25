'use client';
import { createBoard } from '@/actions/action-dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boardSchema } from '@/lib/schemas';
import { toast } from 'react-toastify';
import ImagePicker from '@/components/ImagePicker/imagePicker';
import { useRouter } from 'next/navigation';

function FormBoard({ type }: { type: 'header' | 'boards' }) {
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
    setValue,
    reset,
  } = formMethods;

  async function onSubmit(formData: { title: string; image: string }) {
    const { title, image } = formData;

    handleCreateBoard({ title, image });
  }

  async function handleCreateBoard({
    title,
    image,
  }: {
    title: string;
    image: string;
  }) {
    const result = await createBoard({ title, image });

    if (result?.data) {
      if (type === 'header') {
        toast.success('Board created successfully');
        reset();
        // @ts-ignore
        router.push(`/board/${result.data?.id}`);
      } else {
        toast.success('Board created successfully');
        reset();
      }
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className='flex  gap-2 items-center justify-start  flex-col'>
        {/* IMAGE PICKER */}
        <FormProvider {...formMethods}>
          <ImagePicker id='image' />
        </FormProvider>

        <Input
          {...register('title')}
          label='Create a board'
          error={errors?.title?.message}
        />

        <Button
          onClick={handleSubmit(onSubmit)}
          type='submit'
          className='w-full'
        >
          Create
        </Button>
      </div>
    </form>
  );
}

export default FormBoard;
