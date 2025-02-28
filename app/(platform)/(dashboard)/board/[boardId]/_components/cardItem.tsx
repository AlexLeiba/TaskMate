import { Card } from '@prisma/client';
import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

function CardItem({ data, index }: { data: Card; index: number }) {
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
            className='p-2 bg-white/90 rounded-md mb-2 w-full hover:ring-1 hover:ring-gray-500 hover:bg-white/70 shadow-md cursor-pointer'
          >
            {data.title}
          </div>
        );
      }}
    </Draggable>
  );
}

export default CardItem;
