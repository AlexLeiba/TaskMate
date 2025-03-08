'use client';
import { useQuery } from '@tanstack/react-query';
import { Fetcher } from '@/lib/fetcher';
import React, { useEffect, useState } from 'react';
import { editAssignCard } from '@/actions/action-card';
import { toast } from 'react-toastify';
import { Modal } from '@/components/Modal/modal';
import { Check, User, UserRoundPlus } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@prisma/client';
import { cn } from '@/lib/utils';

export function AssignCardUserList({
  card,
  listId,
  boardId,
}: {
  card: Card;
  listId: string;
  boardId: string;
}) {
  const [isAssignOpenModal, setIsAssignOpenModal] = useState(false);

  const [selectAssignUser, setSelectAssignUser] = useState<{
    imageUrl: string;
    fullName: string;
    id: string;
  }>({
    imageUrl: '',
    fullName: 'No assignee',
    id: '',
  });

  const { data: selectedOrganizationUsers } = useQuery({
    queryKey: ['getUsers', card.id],
    queryFn: () => Fetcher(`/api/getUsers`),
  });

  useEffect(() => {
    const selectedUser = selectedOrganizationUsers?.find((data: any) => {
      return data.id === card.assignedId;
    });

    if (selectedUser) {
      setSelectAssignUser(selectedUser);
    }
  }, [selectedOrganizationUsers]);

  async function handleAssignCardToUser(user: {
    imageUrl: string;
    fullName: string;
    id: string;
  }) {
    setIsAssignOpenModal(false);
    setSelectAssignUser(user);

    const response = await editAssignCard({
      user: { fullName: user.fullName, imageUrl: user.imageUrl, id: user.id },
      boardId: boardId as string,
      listId: listId,
      cardId: card.id,
    });

    if (response?.data) {
      toast.success('Card was assigned successfully');
    }
    if (response?.error) {
      toast.error(response?.error);
    }
  }
  return (
    <div>
      <Modal
        contentClassName='w-[220px]  '
        onClose={() => setIsAssignOpenModal(!isAssignOpenModal)}
        title='Assign'
        isOpen={isAssignOpenModal}
        content={
          <>
            <div
              className={cn(
                selectAssignUser.id === '' && 'bg-gray-800 text-white',
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
              {selectAssignUser.id === '' && <Check />}
            </div>
            {/* @ts-ignore */}
            {selectedOrganizationUsers?.map((data, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    data.id === selectAssignUser.id && 'bg-gray-800 text-white',
                    'flex items-center justify-between gap-2  cursor-pointer  hover:bg-gray-400 hover:text-white h-8 py-6 px-2 rounded-md mt-2'
                  )}
                  onClick={() => {
                    const userData = {
                      imageUrl: data.imageUrl,
                      fullName: data.firstName + ' ' + data.lastName,
                      id: data.id,
                    };
                    handleAssignCardToUser(userData);
                  }}
                >
                  <div className='flex gap-2 items-center'>
                    {data.imageUrl ? (
                      <Image
                        src={data.imageUrl}
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

                    <p>{data.firstName + ' ' + data.lastName}</p>
                  </div>
                  {data.id === selectAssignUser.id && <Check />}
                </div>
              );
            })}
          </>
        }
      >
        <div className='cursor-pointer hover:bg-gray-800 hover:text-white  transition-all rounded-full w-7 h-7 flex justify-center items-center'>
          {selectAssignUser.id ? (
            selectAssignUser.imageUrl ? (
              <Image
                src={selectAssignUser.imageUrl}
                alt={'assigned-user'}
                width={20}
                height={20}
                className='rounded-full '
                onClick={(e) => {
                  setIsAssignOpenModal(true);
                  e.stopPropagation();
                }}
              />
            ) : (
              <div className='w-5 h-5 flex justify-center items-center rounded-full bg-gray-400'>
                <User size={15} />
              </div>
            )
          ) : (
            <UserRoundPlus
              size={15}
              onClick={(e) => {
                setIsAssignOpenModal(true);
                e.stopPropagation();
              }}
              className=''
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
