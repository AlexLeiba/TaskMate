'use client';
import { createBoard, State } from '@/actions/handle-dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boardSchema } from '@/lib/schemas';
import { useAction } from '@/hooks/useAction';
import { toast } from 'react-toastify';
import ImagePicker from '@/components/ImagePicker/imagePicker';

function FormBoard() {
  const { execute, error } = useAction(createBoard, {
    onSuccess: () => {
      toast.success('Board created successfully');
    },
    onError: () => {
      toast.error('Error creating board');
    },
  });
  console.log('🚀 ~ FormBoard ~ error:', error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      title: '',
    },
  });

  async function onSubmit(formData: { title: string }) {
    const { title } = formData;

    execute(title);
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className='flex  gap-2 items-center justify-start  flex-col'>
        {/* IMAGE PICKER */}
        <ImagePicker id='image' />

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
