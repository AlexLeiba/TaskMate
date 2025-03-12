'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Fetcher } from '@/lib/fetcher';
import { editAssignCard } from '@/actions/action-card';
import { toast } from 'react-toastify';
import { Check, User } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@prisma/client';
import { cn } from '@/lib/utils';

type Props = {
  setIsAssignOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  cardData: Card;
  boardId: string;
  listId: string;
};

function AssignUserListContent({
  cardData,
  boardId,
  listId,
  setIsAssignOpenModal,
}: Props) {
  const { data: selectedOrganizationUsers } = useQuery({
    queryKey: ['getUsers', cardData.id],
    queryFn: () => Fetcher(`/api/getUsers`),
  });

  async function handleAssignCardToUser(user: {
    imageUrl: string;
    fullName: string;
    id: string;
  }) {
    setIsAssignOpenModal(false);

    const response = await editAssignCard({
      user: { fullName: user.fullName, imageUrl: user.imageUrl, id: user.id },
      boardId: boardId as string,
      listId: listId,
      cardId: cardData.id,
    });

    if (response?.data) {
      toast.success('Card was assigned successfully');
    }
    if (response?.error) {
      toast.error(response?.error);
    }
  }
  return (
    <>
      <div
        className={cn(
          cardData.assignedId === '' && 'bg-gray-800 text-white',
          'flex items-center justify-between gap-2  cursor-pointer  hover:bg-gray-400 hover:text-white h-8 py-6 px-2 rounded-md mt-2'
        )}
        onClick={() => {
          const userData = {
            imageUrl: '',
            fullName: '',
            id: '',
          };
          handleAssignCardToUser(userData);
        }}
      >
        <div className='flex gap-2 items-center'>
          <div className='w-8 h-8 flex justify-center items-center rounded-full bg-gray-400'>
            <User size={20} />
          </div>

          <p>{'No assignee'}</p>
        </div>
        {cardData.assignedId === '' && <Check />}
      </div>
      {/* @ts-ignore */}
      {selectedOrganizationUsers?.map((orgUserData, index) => {
        return (
          <div
            key={index}
            className={cn(
              orgUserData.id === cardData.assignedId &&
                'bg-gray-800 text-white',
              'flex items-center justify-between gap-2  cursor-pointer  hover:bg-gray-400 hover:text-white h-8 py-6 px-2 rounded-md mt-2'
            )}
            onClick={() => {
              const userData = {
                imageUrl: orgUserData.imageUrl,
                fullName: orgUserData.firstName + ' ' + orgUserData.lastName,
                id: orgUserData.id,
              };
              handleAssignCardToUser(userData);
            }}
          >
            <div className='flex gap-2 items-center'>
              {orgUserData.imageUrl ? (
                <Image
                  src={orgUserData.imageUrl}
                  alt={'user'}
                  width={30}
                  height={30}
                  className='rounded-full '
                />
              ) : (
                <div className='w-8 h-8 flex justify-center items-center rounded-full bg-gray-400'>
                  <User size={20} />
                </div>
              )}

              <p>{orgUserData.firstName + ' ' + orgUserData.lastName}</p>
            </div>
            {orgUserData.id === cardData.assignedId && <Check />}
          </div>
        );
      })}
    </>
  );
}

export default AssignUserListContent;
