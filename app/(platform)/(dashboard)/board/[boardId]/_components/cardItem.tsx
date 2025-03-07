'use client';
import { Card } from '@prisma/client';
import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Ellipsis } from 'lucide-react';
import { Modal } from '@/components/Modal/modal';
import { CardModalMenuContent } from './cardModalMenuContent';

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
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => {
        return (
          <div
            onClick={
              // e.stopPropagation();
              onClick
            }
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            tabIndex={0}
            role='button'
            className='relative px-2 py-3 bg-white/90 rounded-md mb-2 w-full hover:ring-1 hover:ring-gray-500 hover:bg-white/70 shadow-md !cursor-pointer'
          >
            {data.title}

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
                className='absolute top-1 right-1 cursor-pointer hover:bg-gray-300  transition-all rounded-full w-7 h-7 p-1'
              />
            </Modal>
          </div>
        );
      }}
    </Draggable>
  );
}

export default CardItem;
