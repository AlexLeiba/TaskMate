'use client';
import { Card } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {
  Check,
  Ellipsis,
  UserRoundPlus,
  Wifi,
  WifiHigh,
  WifiLow,
} from 'lucide-react';
import { Modal } from '@/components/Modal/modal';
import { CardModalMenuContent } from './cardModalMenuContent';
import { cn } from '@/lib/utils';
import { editAssignCard, editPriorityCard } from '@/actions/action-card';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Fetcher } from '@/lib/fetcher';
import { AssignCardUserList } from './assignCardUserList';

const cardPrioritiesOptions = [
  {
    label: 'None',
    value: 'none',
    icon: <div className='w-4 h-4 flex justify-center items-center'>...</div>,
  },
  {
    label: 'Urgent',
    value: 'urgent',
    icon: (
      <div className='w-5 h-5 bg-red-400 rounded-sm flex justify-center items-center'>
        !
      </div>
    ),
  },
  {
    label: 'High',
    value: 'high',
    icon: <Wifi size={20} className='text-red-500' />,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: <WifiHigh size={20} className='text-yellow-500' />,
  },
  {
    label: 'Low',
    value: 'low',
    icon: <WifiLow size={20} className='text-green-500' />,
  },
];

function CardItem({
  data,
  index,
  listId,
  onClick,
}: {
  data: Card;
  index: number;
  listId: string;
  onClick: () => void;
}) {
  const params = useParams();
  const boardId = params?.boardId;

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const [isPrioritiesOpenModal, setIsPrioritiesOpenModal] = useState(false);
  const [selectPriority, setSelectPriority] = useState<{
    label: string;
    value: string;
    icon: React.JSX.Element;
  }>({
    label: '',
    value: '',
    icon: <>...</>,
  });

  useEffect(() => {
    const selectedPriority = cardPrioritiesOptions.find(
      (priority) => priority.value === data.priority
    );
    if (!selectedPriority) return;
    setSelectPriority(selectedPriority);
  }, []);

  async function handleAddCardPriority(priority: {
    label: string;
    value: string;
    icon: React.JSX.Element;
  }) {
    setSelectPriority(priority);

    const response = await editPriorityCard({
      priority: priority.value,
      boardId: boardId as string,
      listId,
      cardId: data.id,
    });

    if (response?.data) {
      toast.success('Card priority was edited successfully');
    }
    if (response?.error) {
      toast.error(response?.error);
    }
  }

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => {
        return (
          // CARD
          <div
            onClick={onClick}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            tabIndex={0}
            role='button'
            className='relative min-h-12 p-2 bg-white/70 rounded-md mb-2 w-full hover:ring-1 hover:ring-gray-500 hover:bg-white/80 shadow-md !cursor-pointer flex justify-between items-start flex-col'
          >
            <p className='pr-6 pb-1'>{data.title}</p>
            {/* ELLIPSIS */}
            <Modal
              onClose={() => setIsCardModalOpen(!isCardModalOpen)}
              title='Card Options'
              isOpen={isCardModalOpen}
              content={
                <CardModalMenuContent cardId={data.id} listId={listId} />
              }
            >
              <Ellipsis
                onClick={(e) => {
                  setIsCardModalOpen(true);
                  e.stopPropagation();
                }}
                className='absolute top-2 right-2 cursor-pointer hover:bg-gray-800 hover:text-white transition-all rounded-full w-7 h-7 p-1'
              />
            </Modal>

            <div className='flex justify-between w-full'>
              {/* PRIORITIES */}
              <Modal
                contentClassName='w-[170px]  '
                onClose={() => setIsPrioritiesOpenModal(!isPrioritiesOpenModal)}
                title='Priority'
                isOpen={isPrioritiesOpenModal}
                content={
                  <>
                    {cardPrioritiesOptions.map((data, index) => {
                      return (
                        <div
                          key={index}
                          className={cn(
                            selectPriority.value === data.value &&
                              'bg-gray-800 text-white',
                            'flex items-center justify-start gap-x-4 cursor-pointer mb-1 hover:bg-gray-400 hover:text-white h-4 py-4 px-2 rounded-md'
                          )}
                          onClick={() => {
                            handleAddCardPriority(data);

                            setIsPrioritiesOpenModal(false);
                          }}
                        >
                          <div>
                            <div className='flex justify-center items-center gap-x-2'>
                              <div>{data.icon}</div>
                              <p>{data.label}</p>
                            </div>
                          </div>
                          {selectPriority.value === data.value && <Check />}
                        </div>
                      );
                    })}
                  </>
                }
              >
                <div
                  role='button'
                  onClick={(e) => {
                    setIsPrioritiesOpenModal(true);
                    e.stopPropagation();
                  }}
                  className='w-6 h-6 rounded-md border-[2px] bg-gray-800 border-white hover:border-gray-300 flex justify-center items-center'
                >
                  <div className='text-white flex justify-center items-center'>
                    {selectPriority.icon}
                  </div>
                </div>
              </Modal>

              {/* ASSIGN TASK */}
              <AssignCardUserList
                card={data}
                listId={listId}
                boardId={boardId as string}
              />
            </div>
          </div>
        );
      }}
    </Draggable>
  );
}

export default CardItem;
