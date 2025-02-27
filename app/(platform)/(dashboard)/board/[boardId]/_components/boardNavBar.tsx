'use client';

import { editBoardTitle } from '@/actions/action-board';
import { Modal } from '@/components/Modal/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spacer } from '@/components/ui/spacer';

import { type Board as BoardType } from '@prisma/client';
import { Edit, Ellipsis, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function BoardNavBar({ board }: { board: BoardType }) {
  const [titleValue, setTitleValue] = useState(board.title);
  const [isOpen, setIsOpen] = useState(false);
  async function handleEditTitle() {
    try {
      const response = await editBoardTitle(board.id, titleValue);

      if (response.error) {
        throw new Error(response.error);
      }

      toast.success('Board title updated successfully');
    } catch (error: any) {
      toast.error(error);
    } finally {
      setTitleValue('');
      setIsOpen(false);
    }
  }
  return (
    <div className='bg-black/50  text-white  py-3 w-full fixed top-14 z-20 flex items-center gap-2  justify-between  '>
      <div className=' md:max-w-screen-2xl    mx-auto w-full px-4 flex justify-between'>
        {/* <div className='flex gap-6 items-center w-full'> */}
        <div className='flex gap-4 items-center'>
          <p className='text-white z-20'>{board?.title}</p>
          <Modal
            title={'Change board title'}
            description={'The title should be at least 3 characters long'}
            content={
              <>
                <Input
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  placeholder={'Enter new title'}
                />
                <Spacer size={2} />
                <Button
                  className='w-full'
                  onClick={handleEditTitle}
                  disabled={titleValue.length < 3}
                >
                  Save
                </Button>
              </>
            }
          >
            <Ellipsis
              cursor={'pointer'}
              width={15}
              height={15}
              className='text-white z-20'
            />
          </Modal>
        </div>

        <div className='flex gap-4 items-center'>
          <Link href={`/`}>
            <X size={20} className='text-white z-20' />
          </Link>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
