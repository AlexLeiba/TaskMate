'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  copyCard,
  deleteCard,
  editAssignCard,
  editCard,
  editPriorityCard,
} from '@/actions/action-card';
import { Button } from '@/components/ui/button';
import Dropdown from '@/components/ui/dropdown';
import Modal from '@/components/ui/modal-dialog';
import { Spacer } from '@/components/ui/spacer';
import { Fetcher } from '@/lib/fetcher';
import {
  Attachments as AttachmentsType,
  Card as CardType,
} from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Check,
  Copy,
  Delete,
  Edit,
  Logs,
  MapPin,
  UserRoundCog,
  UserRoundPlus,
  Wifi,
  X,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { cardPrioritiesOptions } from './cardItem';
import { DescriptionSkeleton } from './descriptionSkeleton';
import { AssignToSkeleton } from './assignToSkeleton';
import Image from 'next/image';
import { format } from 'date-fns';
import { useOrganization } from '@clerk/nextjs';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { cn } from '@/lib/utils';
import { CardContentActionTabs } from '@/components/CardContentActionTabs/CardContentActionTabs';

export function CardModalContent({
  cardId,
  listId,
}: {
  cardId: string;
  listId: string;
}) {
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

  const textEditorRef = useRef<ReactQuill | null>(null);

  const [textEditorFocused, setTextEditorFocused] = useState(false);

  // const { organization: activeOrganization } = useOrganization();

  const queryClient = useQueryClient();

  const {
    data: cardData,
    isLoading: isCardLoading,
    refetch: refetchCardData,
  } = useQuery<
    CardType & { list: { title: string } } & { attachments: AttachmentsType[] }
  >({
    queryKey: ['card', cardId],
    queryFn: () => Fetcher(`/api/cards/${cardId}`),
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
    formState: { isDirty },
    setValue,
  } = useForm({
    defaultValues: {
      description: cardData?.description || '',
    },
  });

  useEffect(() => {
    // textEditorRef.current?.blur();

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
    // textEditorRef.current?.blur();
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
      refetchCardData();
      // refetchActivityData();

      // textEditorRef.current?.blur();
    }
  }

  // useEventListener('keydown', (e) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     handleSubmit(onSubmit)();
  //   }
  // });

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

  function CreatedAndUpdatedDateSkeleton() {
    return (
      <div className='h-11 w-full rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse'></div>
    );
  }

  function handleOpenTextEditor() {
    setTextEditorFocused(true);
    if (textEditorRef?.current) {
      textEditorRef?.current.focus(); // Focus the editor
    }
  }

  function handleSaveDescriptionChanges() {
    handleSubmit(onSubmit)();
    setTextEditorFocused(false);
  }

  function handleCloseTextEditor() {
    setTextEditorFocused(false);
  }

  return (
    <div>
      <div>
        {/* IN LIST INFORMATION */}
        <div className='flex w-full gap-8'>
          <div className='w-full'>
            <div className='flex gap-2 w-full justify-between '>
              <div className='flex gap-2 items-center '>
                <MapPin />
                <p className='body-sm text-gray-500 dark:text-gray-300'>
                  in list
                </p>
                <p className='body-md text-gray-700 underline dark:text-gray-300'>
                  {cardData?.list.title}
                </p>
              </div>
            </div>
            {/* // DESCRIPTION ACTION BUTTONS  */}
            <Spacer size={6} />
            <div className='flex gap-2'>
              <div className='flex justify-between w-full'>
                <div className='flex gap-2'>
                  <Logs />
                  <p className='body-md font-semibold'>Description</p>
                </div>
                {textEditorFocused ? (
                  <div className='flex gap-4'>
                    <div title='Close description editor'>
                      <X
                        size={18}
                        className=' hover:opacity-80'
                        cursor={'pointer'}
                        onClick={() => handleCloseTextEditor()}
                      />
                    </div>
                    <div
                      className='cursor-pointer text-green-600 hover:opacity-80'
                      title='Save changes'
                      onClick={handleSaveDescriptionChanges}
                    >
                      <Check size={18} />
                    </div>
                  </div>
                ) : (
                  <div title='Edit description'>
                    <Edit
                      cursor={'pointer'}
                      onClick={handleOpenTextEditor}
                      className='text-green-600 hover:opacity-80'
                      size={18}
                    />
                  </div>
                )}
              </div>
            </div>
            <Spacer size={2} />
            {/* DESCRIPTION SKELETON */}
            {isCardLoading ? (
              <>
                <DescriptionSkeleton />
              </>
            ) : (
              <div className='flex '>
                {/* DESCRIPTION EDITOR */}
                {textEditorFocused ? (
                  <form
                    className='w-full  relative'
                    action=''
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <Controller
                      name='description'
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <ReactQuill
                          ref={textEditorRef}
                          readOnly={isCardLoading}
                          className='w-full  text-baseline-950 dark:text-white min-h-[240px] max-h-[280px] overflow-y-auto rounded-md '
                          value={value}
                          onChange={onChange}
                          theme={'snow'}
                          placeholder='Write description here...'
                        />
                      )}
                    />
                  </form>
                ) : cardData?.description ? (
                  // DESCRIPTION HTML
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenTextEditor();
                    }}
                    className={cn(
                      'html-content ',
                      ' w-full min-h-[240px] max-h-[280px] overflow-y-auto rounded-b px-[15px] py-6 bg-gray-200  dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-300 cursor-pointer transition-all  '
                    )}
                    dangerouslySetInnerHTML={{
                      __html: cardData?.description,
                    }}
                  ></div>
                ) : (
                  <>
                    <Spacer size={2} />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTextEditor();
                      }}
                      className='rounded-b px-[15px]  dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-300 h-[240px] w-full cursor-pointer transition-all '
                    >
                      <p className='text-gray-500 body-xs '>
                        No description provided...
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            <Spacer size={7} />

            {/* // ACTIVITIES/COMMENTS/ATTACHMENTS - TABS */}
            <CardContentActionTabs
              cardId={cardId}
              listId={listId}
              cardAttachments={cardData?.attachments || []}
              isCardLoading={isCardLoading}
              refetchCardData={refetchCardData}
            />
            {/* )} */}
          </div>
          <div>
            {/* REPORTER */}
            <div>
              <div className='flex gap-2 items-center'>
                <UserRoundCog />
                <p className='body-md font-semibold'>Reporter</p>
              </div>
              <Spacer size={2} />
              <div className='flex gap-2 items-center '>
                <div className='flex flex-col items-start justify-start w-[35px]'>
                  {cardData?.reporterImageUrl && (
                    <Image
                      width={30}
                      height={30}
                      src={cardData?.reporterImageUrl}
                      className='rounded-full'
                      alt={cardData?.reporterName}
                    />
                  )}
                </div>

                <div>
                  <p className='body-xs font-semibold inline mr-2'>
                    {cardData?.reporterName}
                  </p>
                </div>
              </div>
            </div>

            <Spacer size={7} />
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

              {/* COPY DELETE BUTTONS */}
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

              {/* CREATED AND UPDATED DATE */}
              <Spacer size={7} />
              {cardData && cardData.createdAt && cardData.updatedAt ? (
                <div className='flex justify-between  w-full'>
                  <div className='text-right w-full'>
                    <p className='body-xs text-gray-500 '>
                      <strong className='mr-1'>Created: </strong>
                      {format(
                        new Date(cardData.createdAt),
                        'MMM d, yyy'
                      )} at {format(new Date(cardData.createdAt), 'hh:mm a')}
                    </p>
                    <Spacer size={2} />
                    <p className='body-xs text-gray-500'>
                      <strong className='mr-1'>Updated: </strong>
                      {format(
                        new Date(cardData.createdAt),
                        'MMM d, yyy'
                      )} at {format(new Date(cardData.updatedAt), 'hh:mm a')}
                    </p>
                  </div>
                </div>
              ) : (
                CreatedAndUpdatedDateSkeleton()
              )}
            </div>
          </div>
        </div>
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
