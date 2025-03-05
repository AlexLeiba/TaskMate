'use client';
import { Card, List } from '@prisma/client';
import React, { useRef } from 'react';
import ListHeader from './listHeader';
import ListOptions from './listOptions';
import { Ellipsis } from 'lucide-react';
import { Modal as ModalDropdown } from '@/components/Modal/modal';
import Modal from '@/components/ui/modal-dialog';
import CardForm from './cardForm';
import { cn } from '@/lib/utils';
import CardItem from './cardItem';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { CardModalContent } from './cardModalContent';

export type ListWithCardsType = List & { cards: Card[] };

function ListItem({ data, index }: { data: ListWithCardsType; index: number }) {
  const [cardModalOpen, setCardModalOpen] = React.useState(false);
  // List header
  const [isEditingListHeader, setIsEditingListHeader] = React.useState(false);
  const closeModalOnSubmitRef = useRef<HTMLButtonElement>(null);

  // List card
  const [isEditingCard, setIsEditingCard] = React.useState(false);
  const textareaCardRef = useRef<HTMLTextAreaElement>(null);

  function handleDisableEditingCard() {
    setIsEditingCard(false);
  }

  function handleEnableEditingCard() {
    setIsEditingCard(true);
    textareaCardRef.current?.focus();
  }

  function handleEnableEditingListHeader() {
    setIsEditingListHeader(true);
  }

  return (
    <Draggable draggableId={data.id.toString()} index={index}>
      {(provided) => {
        return (
          <li
            {...provided.draggableProps}
            ref={provided.innerRef}
            className='shrink-0 h-full w-[270px] select-none mb-2'
          >
            <div
              {...provided.dragHandleProps} //by grabbind this handle we can drag the list
              className='w-full rounded-md shadow-md  bg-black/80 p-2 relative'
            >
              {/* RENDER LIST ITEM */}
              {/* List Title and Handle change title form */}
              <ListHeader
                data={data}
                setIsEditing={setIsEditingListHeader}
                isEditing={isEditingListHeader}
              />

              {/* RENDER CARDS
               */}
              <Droppable
                droppableId={data.id.toString()}
                type='card'
                direction='vertical'
              >
                {(provided) => {
                  return (
                    <ol
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        '  py-0.5 gap-y-2',
                        data?.cards.length > 0 ? 'mt-2' : 'mt-0'
                      )}
                    >
                      {data.cards.map((card, index) => (
                        <Modal
                          open={cardModalOpen}
                          onOpenChange={() => setCardModalOpen(false)}
                          key={card.id}
                          positionFooter={'horizontal-fill'}
                          positionHeader={'left-aligned'}
                          title={card.title}
                          description={''}
                          triggerTitle={''}
                          onConfirm={() => {}}
                          hideCancel
                          hideConfirm
                          customTrigger={
                            // RENDERED CARDS LIST
                            <CardItem
                              listId={data.id}
                              data={card}
                              index={index}
                              key={card.id}
                              onClick={() => setCardModalOpen(true)}
                            />
                          }
                        >
                          <CardModalContent cardId={card.id} listId={data.id} />
                        </Modal>
                      ))}
                      {provided.placeholder}

                      {/* <Modal
                        open={isDeleteModalOpen}
                        onOpenChange={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDeleteList}
                        positionFooter={'horizontal-fill'}
                        positionHeader={'left-aligned'}
                        title={'Delete list'}
                        description={`This action cannot be undone. Are you sure you want to delete  "${cardData?.title}" card?`}
                        triggerTitle={''}
                        customConfirmButtonText='Delete list'
                      /> */}
                    </ol>
                  );
                }}
              </Droppable>

              {/* CARD MODAL */}
              {/* <CardModalContent
                cardModalOpen={cardModalOpen}
                setCardModalOpen={setCardModalOpen}
              /> */}

              {/* ADD CARD FORM */}
              {!isEditingListHeader && (
                <>
                  <CardForm
                    listId={data.id}
                    isEditingCard={isEditingCard}
                    textareaCardRef={textareaCardRef}
                    disableEditingCard={handleDisableEditingCard}
                    enableEditingCard={handleEnableEditingCard}
                  />

                  {/* List options settings modal */}
                  <ModalDropdown
                    closeRef={closeModalOnSubmitRef}
                    align='end'
                    title='List Options'
                    content={
                      <ListOptions
                        enableEditingCard={handleEnableEditingCard}
                        data={data}
                        listId={data.id}
                        closeRef={closeModalOnSubmitRef}
                        handleEnableEditingListHeader={
                          handleEnableEditingListHeader
                        }
                      />
                    }
                  >
                    <div className=' text-white absolute top-1 right-2  cursor-pointer rounded-full p-1  hover:bg-white/60 transition-all '>
                      <Ellipsis size={20} />
                    </div>
                  </ModalDropdown>
                </>
              )}
            </div>
          </li>
        );
      }}
    </Draggable>
  );
}

export default ListItem;
