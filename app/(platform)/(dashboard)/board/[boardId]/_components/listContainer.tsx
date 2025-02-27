'use client';
import React, { useEffect, useState } from 'react';

import ListItem from './listItem';
import { List } from '@prisma/client';
import AddListForm from './addListForm';
import { Dot } from 'lucide-react';
import ListOptions from './listOptions';

type Props = {
  listData: List[];
  boardId: string;
};
export default function ListContainer({ listData }: Props) {
  const [orderedData, setOrderedData] = useState(listData); //for optimistic mutation When drag and drop changing order of lists

  useEffect(() => {
    setOrderedData(listData);
  }, [listData]);

  {
    /* Render lists */
  }
  return (
    <ol className='flex gap-6 '>
      {/* <div className='flex-shrink-0 w-1' /> */}
      {orderedData.map((list, index) => (
        <ListItem data={list} index={index} key={index} />
      ))}

      {/* Add a new COLUMN list BUTTON */}
      <AddListForm />
      {/*  */}
    </ol>
  );
}
