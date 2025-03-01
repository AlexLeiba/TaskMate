import { Card } from '@prisma/client';
import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Ellipsis } from 'lucide-react';

function CardItem({
  data,
  index,
  onClick,
}: {
  data: Card;
  index: number;
  onClick: () => void;
}) {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            tabIndex={0}
            role='button'
            className='relative px-2 py-3 bg-white/90 rounded-md mb-2 w-full hover:ring-1 hover:ring-gray-500 hover:bg-white/70 shadow-md cursor-pointer'
          >
            {data.title}

            <Ellipsis
              onClick={onClick}
              className='absolute top-1 right-1 cursor-pointer hover:bg-gray-300  transition-all rounded-full w-7 h-7 p-1'
            />
          </div>
        );
      }}
    </Draggable>
  );
}

export default CardItem;
