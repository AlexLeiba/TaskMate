'use client';
import { createBoard, State } from '@/actions/handle-dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { boardSchema } from '@/lib/schemas';
import { useAction } from '@/hooks/useAction';
import { Spacer } from '@/components/ui/spacer';

function FormBoard() {
  const { execute, loading, error, data } = useAction(createBoard);

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
      <div className='flex  gap-2 items-center  flex-col'>
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
