'use client';
import { Activity } from '@prisma/client';
import { Loader, MessageCircle, Plus, X } from 'lucide-react';
import React from 'react';
import { Spacer } from '../ui/spacer';
import { format } from 'date-fns';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Fetcher } from '@/lib/fetcher';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textArea';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCommentInCardSchema } from '@/lib/schemas';
import {
  createCommentInCard,
  deleteCommentInCard,
} from '@/actions/action-card';
import { toast } from 'react-toastify';
import { useEventListener } from 'usehooks-ts';
import { CommentsSkeleton } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/commentsSkeleton';

type ActivityType = {
  cardId: string;
  listId: string;
};

export function Comments({ cardId, listId }: ActivityType) {
  const [isAddingComment, setIsAddingComment] = React.useState(false);
  const formCardRef = React.useRef<HTMLFormElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function onKeyDownEvent(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      reset();
      setIsAddingComment(false);
    }
  }

  useEventListener('keydown', onKeyDownEvent);

  const params = useParams();
  const boardId = params?.boardId;
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(createCommentInCardSchema),
    defaultValues: {
      text: '',
    },
  });

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    refetch: refetchActivityData,
  } = useQuery<Activity[]>({
    queryKey: ['comments', cardId],
    queryFn: () => Fetcher(`/api/cards/${cardId}/comments`),
  });

  async function onSubmit({ text }: { text: string }) {
    setIsSubmitting(true);
    const response = await createCommentInCard(
      boardId as string,
      text,
      listId,
      cardId
    );

    if (response?.data) {
      reset();
      toast.success('The comment was created successfully');
      setIsAddingComment(false);
      refetchActivityData();
      setIsSubmitting(false);
    }
    if (response?.error) {
      reset();
      toast.error(response?.error);
      setIsSubmitting(false);
    }
    setIsSubmitting(false);
  }

  function handleCloseEditingCard() {
    reset();
    setIsAddingComment(false);
  }

  async function handleDeleteComment(commentId: string) {
    setIsSubmitting(true);
    const response = await deleteCommentInCard(
      boardId as string,
      listId,
      cardId,
      commentId
    );

    if (response?.data) {
      // disableEditingCard();
      reset();
      toast.success('The comment was deleted successfully');
      setIsAddingComment(false);
      refetchActivityData();
      setIsSubmitting(false);
    }
    if (response?.error) {
      reset();
      toast.error(response?.error);
      setIsSubmitting(false);
    }
    setIsSubmitting(false);
  }
  return (
    <div className=' flex items-start gap-x-3 w-full'>
      <div className=' w-full'>
        <div className='flex gap-2'>
          {isSubmitting ? (
            <Loader className='animate-spin ' />
          ) : (
            <MessageCircle />
          )}

          <div className='flex justify-between w-full'>
            <div className='flex gap-2 items-center'>
              <p className='body-md font-semibold'>Comments</p>
              <p className='text-gray-400'>{commentsData?.length}</p>
            </div>
            {isAddingComment ? (
              <div title='Close comment'>
                <X
                  cursor={'pointer'}
                  size={18}
                  className='justify-start hover:opacity-80'
                  onClick={handleCloseEditingCard}
                />
              </div>
            ) : (
              <div title='Add comment'>
                <Plus
                  cursor={'pointer'}
                  size={18}
                  className='text-green-600 hover:opacity-80'
                  onClick={() => setIsAddingComment(true)}
                />
              </div>
            )}
          </div>
        </div>

        {isAddingComment ? (
          <>
            <Spacer size={1} />
            <form
              ref={formCardRef}
              className='m-1 py-0.5 px-1 space-y-1 dark:text-white h-[80px]'
              onSubmit={(e) => e.preventDefault()}
            >
              <div className='flex  gap-2 justify-between items-end relative'>
                <div className='mr-16 w-full'>
                  <TextArea
                    rows={1}
                    autoFocus
                    label='Your comment'
                    {...register('text')}
                    id='text'
                    onKeyDown={() => {}}
                    //   ref={textareaCardRef}
                    placeholder='Type the comment here...'
                    error={errors.text?.message}
                  />
                </div>
                <Button
                  ref={buttonRef}
                  type='submit'
                  variant={'secondary'}
                  size={'sm'}
                  className='justify-start absolute bottom-0 right-0 '
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader className='animate-spin ' size={18} />
                  ) : (
                    'Send'
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <Spacer size={3} />
            <div className=' overflow-y-auto h-[80px] pr-2'>
              {isCommentsLoading ? (
                <CommentsSkeleton />
              ) : commentsData && commentsData.length > 0 ? (
                commentsData.map((data: any) => {
                  return (
                    <div className='flex gap-2 items-center mb-2' key={data.id}>
                      <div>
                        <div className='flex flex-col items-start justify-start w-[35px]'>
                          {data.userImage && (
                            <Image
                              width={30}
                              height={30}
                              src={data.userImage}
                              className='rounded-full'
                              alt={data.userName}
                            />
                          )}
                        </div>
                      </div>

                      <div className='w-full'>
                        <div className='flex gap-2 items-center w-full justify-between'>
                          <p className='body-xs font-bold  text-gray-400 mr-2'>
                            {data.userName}
                          </p>
                          <div title='Delete comment'>
                            <X
                              onClick={() => {
                                !isSubmitting && handleDeleteComment(data.id);
                              }}
                              role='button'
                              tabIndex={0}
                              className='text-red-500 hover:opacity-80 cursor-pointer'
                              size={18}
                            />
                          </div>
                        </div>
                        <p key={data.id} className='body-md inline'>
                          {data.text}
                        </p>

                        <p className='body-xs text-gray-500'>
                          {format(new Date(data.createdAt), 'MMM d, yyy')} at{' '}
                          {format(new Date(data.createdAt), 'hh:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className='body-xs mb-2  text-gray-500'>
                  No comments provided.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
