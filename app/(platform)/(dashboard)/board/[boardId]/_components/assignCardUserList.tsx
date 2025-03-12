'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/Modal/modal';
import { User, UserRoundPlus } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@prisma/client';
import AssignUserListContent from './assignUserListContent';

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

  return (
    <div>
      <Modal
        contentClassName='w-[220px]  '
        onClose={() => setIsAssignOpenModal(!isAssignOpenModal)}
        title='Assign'
        isOpen={isAssignOpenModal}
        content={
          <AssignUserListContent
            cardData={card}
            listId={listId}
            boardId={boardId}
            setIsAssignOpenModal={setIsAssignOpenModal}
          />
        }
      >
        <div className='cursor-pointer hover:bg-gray-800 hover:text-white  transition-all rounded-full w-7 h-7 flex justify-center items-center'>
          {card.assignedId ? (
            card.assignedImageUrl ? (
              <Image
                src={card.assignedImageUrl}
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
