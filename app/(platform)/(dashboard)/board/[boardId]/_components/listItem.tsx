'use client';
import { List } from '@prisma/client';
import React, { useRef } from 'react';
import ListHeader from './listHeader';
import ListOptions from './listOptions';
import { Ellipsis } from 'lucide-react';
import { Modal } from '@/components/Modal/modal';

function ListItem({ data }: { data: List; index: number }) {
  const [isEditing, setIsEditing] = React.useState(false);

  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <li className='shrink-0 h-full w-[250px] select-none mb-2'>
      <div className='w-dull rounded-md shadow-md  bg-white/80 p-2 relative'>
        <ListHeader
          data={data}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />

        {!isEditing && (
          <>
            <Modal
              closeRef={closeRef}
              align='end'
              title='Options'
              content={<ListOptions data={data} closeRef={closeRef} />}
            >
              <div className=' absolute top-1 right-2  cursor-pointer rounded-full p-1  hover:bg-white/60 transition-all '>
                <Ellipsis size={20} />
              </div>
            </Modal>
          </>
        )}
      </div>
    </li>
  );
}

export default ListItem;
