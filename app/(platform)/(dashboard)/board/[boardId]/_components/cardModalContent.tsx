'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  copyCard,
  deleteCard,
  editAssignCard,
  editCard,
  editPriorityCard,
} from '@/actions/action-card';
import { ActivityList } from '@/components/Activity/activity';
import { Button } from '@/components/ui/button';
import Dropdown from '@/components/ui/dropdown';
import Modal from '@/components/ui/modal-dialog';
import { Spacer } from '@/components/ui/spacer';
import { TextArea } from '@/components/ui/textArea';
import { Fetcher } from '@/lib/fetcher';
import { Activity, Card } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, Delete, Logs, MapPin, UserRoundPlus, Wifi } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEventListener } from 'usehooks-ts';
import { cardPrioritiesOptions } from './cardItem';
import { DescriptionSkeleton } from './descriptionSkeleton';
import { ActivitiesSkeleton } from './activitiesSkeleton';
import { AssignToSkeleton } from './assignToSkeleton';

export function CardModalContent({
  cardId,
  listId,
}: {
  cardId: string;
  listId: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const params = useParams();
  const { boardId } = params;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectPriority, setSelectPriority] = useState<{
    label: string;
    value: string;
    icon: React.JSX.Element;
  }>({
    label: '',
    value: '',
    icon: <>...</>,
  });
  const queryClient = useQueryClient();

  const { data: cardData, isLoading: isCardLoading } = useQuery<
    Card & { list: { title: string } }
  >({
    queryKey: ['card', cardId],
    queryFn: () => Fetcher(`/api/cards/${cardId}`),
  });
  const { data: activityData, isLoading: isActivityLoading } = useQuery<
    Activity[]
  >({
    queryKey: ['activity', cardId],
    queryFn: () => Fetcher(`/api/cards/${cardId}/activity`),
  });

  const { data: selectedOrganizationUsers, isLoading: isOrganizationLoading } =
    useQuery({
      queryKey: ['getUsers', cardId],
      queryFn: () => Fetcher(`/api/getUsers`),
    });

  const [organizationUsers, setOrganizationUsers] = useState<
    {
      image: string;
      label: string;
      id: string;
      value: string;
    }[]
  >([
    {
      image: '',
      label: 'No assignee',
      id: '',
      value: 'No assignee',
    },
  ]);

  const [selectAssignUser, setSelectAssignUser] = useState<{
    image: string;
    label: string;
    id: string;
    value: string;
  }>({
    image: '',
    label: 'No assignee',
    id: '',
    value: 'no-assignee',
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      description: cardData?.description || '',
    },
  });

  useEffect(() => {
    textareaRef.current?.blur();

    setValue('description', cardData?.description as string);

    // INITIAL STATE OF PRIORITY
    if (cardData?.priority) {
      const priorityData = cardPrioritiesOptions.find(
        (priority) => priority.value === cardData?.priority
      );
      priorityData?.value && setSelectPriority(priorityData);
    }
  }, [cardData, cardId, boardId]);

  useEffect(() => {
    // INITIAL STATE OF ASSIGN TASK
    const users = [
      {
        image: '',
        label: 'No assignee',
        id: '',
        value: 'no-assignee',
      },
    ];

    selectedOrganizationUsers &&
      selectedOrganizationUsers.map((data: any) => {
        const userData = {
          image: data.imageUrl,
          label: data.firstName + ' ' + data.lastName,
          id: data.id,
          value: data.id,
        };
        users.push(userData);
      });
    setOrganizationUsers(users);

    // DEFAULT ASSIGNED
    if (cardData?.assignedId) {
      const userData = {
        image: cardData?.assignedImageUrl,
        label: cardData?.assignedName,
        id: cardData?.assignedId,
        value: cardData?.assignedId,
      };
      setSelectAssignUser(userData);
    }
    textareaRef.current?.blur();
  }, [selectedOrganizationUsers]);

  async function onSubmit({ description }: { description: string }) {
    if (!isDirty) return;
    const response = await editCard({
      description,
      boardId: boardId as string,
      listId,
      cardId,
    });

    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.data) {
      toast.success('Card edited successfully');

      queryClient.invalidateQueries({ queryKey: ['activity', cardId] });

      textareaRef.current?.blur();
    }
  }

  useEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(onSubmit)();
    }
  });

  // SERVER ACTIONS
  async function handleDeleteCard() {
    setIsDeleteModalOpen(false);

    const response = await deleteCard(boardId as string, cardId, listId);

    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.data) {
      toast.success('Card deleted successfully');
    }
  }

  async function handleCopyCard() {
    const response = await copyCard(boardId as string, cardId, listId);

    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.data) {
      queryClient.invalidateQueries({ queryKey: ['activity', cardId] });
      toast.success('Card copied successfully');
    }
  }

  async function handleAssignCardToUser(userId: string) {
    const selectedUser =
      userId === 'no-assignee'
        ? {
            image: '',
            label: '',
            id: '',
            value: '',
          }
        : organizationUsers.find((data: any) => {
            return data.id === userId;
          });

    if (!selectedUser) {
      return;
    }

    setSelectAssignUser(selectedUser);

    const response = await editAssignCard({
      user: {
        fullName: selectedUser.label,
        imageUrl: selectedUser.image,
        id: selectedUser.id,
      },
      boardId: boardId as string,
      listId,
      cardId,
    });

    if (response?.error) {
      toast.error(response?.error);
    }
    if (response?.data) {
      queryClient.invalidateQueries({ queryKey: ['getUsers', cardId] });
      toast.success('Card was assigned successfully');
    }
  }
  async function handleAddCardPriority(value: string) {
    const selectedPriorityData = cardPrioritiesOptions.find(
      (priority) => priority.value === value
    );

    selectedPriorityData?.value && setSelectPriority(selectedPriorityData);

    const response = await editPriorityCard({
      priority: value,
      boardId: boardId as string,
      listId,
      cardId,
    });

    if (response?.data) {
      toast.success('Card priority was edited successfully');
    }
    if (response?.error) {
      toast.error(response?.error);
    }
  }

  return (
    <div>
      {/* LIST LOCATION */}
      <div className='flex gap-2 w-full '>
        <MapPin />
        <p className='body-sm text-gray-500'>in list</p>
        <p className='body-md text-gray-700 underline'>
          {cardData?.list.title}
        </p>
      </div>

      <Spacer size={6} />

      <div>
        {/* DESCRIPTION */}
        <div className='flex w-full gap-8'>
          <div className='w-full'>
            <div className='flex gap-2'>
              <Logs />
              <p className='body-md font-semibold'>Description</p>
            </div>
            <Spacer size={2} />
            {isCardLoading ? (
              <DescriptionSkeleton />
            ) : (
              <div className='flex gap-4'>
                <form
                  className='w-full ml-8'
                  action=''
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Controller
                    name='description'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextArea
                        ref={textareaRef}
                        onChange={onChange}
                        value={value || ''}
                        rows={7}
                        autoFocus={false}
                        className='w-full'
                        placeholder='Type the description here...'
                        error={errors?.description?.message as string}
                      />
                    )}
                  />

                  {/* Remove the second Controller and Dropdown */}
                </form>
              </div>
            )}
          </div>
          <div>
            {/* ASSIGNED */}
            <div className='w-[250px]'>
              <div className='flex gap-2 items-center'>
                <UserRoundPlus />
                <p className='body-md font-semibold'>Assigne to</p>
              </div>
              <Spacer size={2} />

              {isOrganizationLoading ? (
                <AssignToSkeleton />
              ) : (
                <Dropdown
                  label=''
                  options={organizationUsers}
                  onChange={(v) => handleAssignCardToUser(v)}
                  value={selectAssignUser.value}
                />
              )}
            </div>
            {/* PRIORITY */}
            <Spacer size={7} />
            <div className='w-[250px]'>
              <div className='flex gap-2 items-center'>
                <Wifi />
                <p className='body-md font-semibold'>Priority</p>
              </div>
              <Spacer size={2} />

              <Dropdown
                label=''
                options={cardPrioritiesOptions}
                onChange={(v) => handleAddCardPriority(v)}
                value={selectPriority.value}
              />

              <Spacer size={7} />
              <p className='body-md font-medium'>Actions</p>
              <Spacer size={2} />

              <div className='flex  gap-2 '>
                <Button
                  variant={'secondary'}
                  className='w-full justify-start'
                  onClick={handleCopyCard}
                >
                  <Copy /> Copy
                </Button>
                <Button
                  variant={'destructive'}
                  className='w-full justify-start'
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Delete /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVITY */}
        <Spacer size={6} />
        {isActivityLoading ? (
          <ActivitiesSkeleton />
        ) : (
          <ActivityList items={activityData} />
        )}
      </div>

      {/* DELETE CARD MODAL */}
      {isDeleteModalOpen && (
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
      )}
    </div>
  );
}
