'use client';
import React, { useEffect, useState } from 'react';

import ListItem from './listItem';
import { Card, List } from '@prisma/client';
import AddListForm from './addListForm';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { updateCardOrder, updateListOrder } from '@/actions/action-drag-drop';
import { toast } from 'react-toastify';

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

export default function ListContainer({ listData, boardId }: Props) {
  const [orderedListData, setOrderedListData] = useState(listData); //for optimistic mutation When drag and drop changing order of lists

  useEffect(() => {
    setOrderedListData(listData);
  }, [listData]);

  //////////////////DRAG AND DROP FUNCTIONS ///////////////////
  async function onDragEnd(result: any) {
    const { destination, source, type } = result;

    if (!source.droppableId || !destination.droppableId) {
      return console.log(
        '🚀 ~ \n\n\n\n\n\n DroppableId is not defined',
        source.droppableId,
        destination.droppableId
      );
    }

    if (!destination) {
      return;
    }
    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    //MOVE A LIST
    if (type === 'list') {
      const reorderedListItems = reorderDraggableContent(
        orderedListData,
        source.index,
        destination.index
      ).map((item, index) => ({ ...item, order: index })); //change the roder of the list by changing the 'order' value
      setOrderedListData(reorderedListItems);

      // SERVER ACTIONS | UPDATE LIST ORDER IN DB
      const response = await updateListOrder(
        reorderedListItems,
        boardId,
        source.droppableId
      );

      if (response.error) {
        toast.error(response.error);
      }
      if (response.data) {
        toast.success('List reordered');
      }
    }

    // MOVE A CARD
    if (type === 'card') {
      let newOrderedListData = [...orderedListData];

      //SOURCE AND DESTINATION LIST -> to know where to move the card (which list)
      // Source
      const sourceList = newOrderedListData.find(
        (list) => list.id === source.droppableId
      );

      // Destination
      const destList = newOrderedListData.find(
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
          sourceList.cards, //in this aray or cards
          source.index, //take this index and
          destination.index //and change to this destination
        );

        //once the indexes were changed of the selected cards ABOVE, change the order of the rest of cards
        newReorderedInSourceListCards.forEach((card, index) => {
          card.order = index;
        });

        // update the cards in the source list
        sourceList.cards = newReorderedInSourceListCards;

        setOrderedListData(newOrderedListData);

        // SERVER ACTIONS | UPDATE CARD ORDER IN DB
        const response = await updateCardOrder(
          newReorderedInSourceListCards,
          boardId
        );

        if (response.error) {
          toast.error(response.error);
        }
        if (response.data) {
          toast.success('Card reordered');
        }
        return;
      }

      //IF MOVED CARD TO A DIFFERENT LIST
      if (source.droppableId !== destination.droppableId) {
        // Finb the moved card and assign to it the new List id ('destination;).

        // Change the list id of the card/ RESULT is the object of the deleted element/ NOW WE CAN CHANGE ITS LIST ID
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        movedCard.listId = destination.droppableId;

        // Once the card got new ListId, add the card to the destination list INDEX
        destList.cards.splice(destination.index, 0, movedCard);

        // Update the order of cards in the destination list
        destList.cards.forEach((card, index) => {
          card.order = index;
        });
        //

        // Change the order of cards in the source list, ONCE one card was removed from it
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedListData(newOrderedListData);

        // SERVER ACTIONS | UPDATE CARD ORDER IN DB
        const response = await updateCardOrder(destList.cards, boardId);

        if (response.error) {
          toast.error(response.error);
        }
        if (response.data) {
          toast.success('Card reordered');
        }
      }
    }
  }

  /* RENDER LISTS */

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='lists' type='list' direction='horizontal'>
        {(provided) => {
          return (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='flex gap-6 w-full'
            >
              {/* <div className='flex-shrink-0 w-1' /> */}
              {orderedListData.map((list, index) => (
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
