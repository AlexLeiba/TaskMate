'use client';
import React, { useEffect, useState } from 'react';

import ListItem from './listItem';
import { Card, List } from '@prisma/client';
import AddListForm from './addListForm';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

export function reorderDraggableContent<T>(
  listData: T[],
  startIndex: number,
  endIndex: number
) {
  const result = Array.from(listData);
  const [removed] = result.splice(startIndex, 1); //remove 1 element with index: startIndex
  result.splice(endIndex, 0, removed); //add 1 element at index : endIndex

  return result;
}

type ListWithCardsType = List & { cards: Card[] };

type Props = {
  listData: ListWithCardsType[];
  boardId: string;
};

export default function ListContainer({ listData }: Props) {
  const [orderedData, setOrderedData] = useState(listData); //for optimistic mutation When drag and drop changing order of lists

  useEffect(() => {
    setOrderedData(listData);
  }, [listData]);

  function onDragEnd(result: any) {
    const { destination, source, type } = result;

    // if (!source.droppableId || !destination.droppableId) {
    //   return console.log(
    //     '🚀 ~ \n\n\n\n\n\n DroppableId is not defined',
    //     source.droppableId,
    //     destination.droppableId
    //   );
    // }

    if (!destination) {
      return;
    }
    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log('🚀 ~ \n\n\n\n\n\n Same position');
      return;
    }

    //MOVE A LIST
    if (type === 'list') {
      console.log(
        '\n\n\n\nID:',
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
      const listItems = reorderDraggableContent(
        orderedData,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, order: index }));
      setOrderedData(listItems);

      // TODO: add server actions
    }

    // MOVE A CARD
    if (type === 'card') {
      let newOrderedCardData = [...orderedData];

      //Source and Destination list -> to know where to move the card
      const sourceList = newOrderedCardData.find(
        (list) => list.id === source.droppableId
      );

      const destList = newOrderedCardData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // check if cards exist on source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // check if cards exist on destination list
      if (!destList.cards) {
        destList.cards = [];
      }

      //move the card in the same list
      if (source.droppableId === destination.droppableId) {
        const newReorderedInSourceListCards = reorderDraggableContent(
          sourceList.cards,
          source.index,
          destination.index
        );

        newReorderedInSourceListCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = newReorderedInSourceListCards;

        setOrderedData(newOrderedCardData);

        // TODO, add server actions
        return;
      }

      // move the card to a different list

      if (source.droppableId !== destination.droppableId) {
        // Finb the moved card and assign to it the new List id ('destination;).

        const [movedCard] = sourceList.cards.splice(source.index, 1);
        movedCard.listId = destination.droppableId;

        // Add the card to the destination list

        destList.cards.splice(destination.index, 0, movedCard);

        // Change the order of cards in the source list
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update the order of cards in the destination list
        destList.cards.forEach((card, index) => {
          card.order = index;
        });
        //

        setOrderedData(newOrderedCardData);

        // TODO, add server actions
      }
    }
  }

  {
    /* Render lists */
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='lists' type='list' direction='horizontal'>
        {(provided, snapshot) => {
          console.log('🚀=>>>>>> ~ ListContainer ~ snapshot:', snapshot);
          return (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='flex gap-6 w-full'
            >
              {/* <div className='flex-shrink-0 w-1' /> */}
              {orderedData.map((list, index) => (
                <ListItem data={list} index={index} key={list.id} />
              ))}

              {provided.placeholder}
              {/* Add a new COLUMN list BUTTON */}
              <AddListForm />
              {/*  */}
            </ol>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}
