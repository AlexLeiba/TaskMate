'use client';

import { editBoardTitle } from '@/actions/action-board';
import { Modal } from '@/components/Modal/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spacer } from '@/components/ui/spacer';

import { type Board as BoardType } from '@prisma/client';
import { Ellipsis, Loader, X } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useEventListener } from 'usehooks-ts';

export function BoardNavBar({ board }: { board: BoardType }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [titleValue, setTitleValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTitleSubmitting, setIsTitleSubmitting] = useState(false);
  async function handleEditTitle() {
    if (isTitleSubmitting) return;
    setIsTitleSubmitting(true);
    try {
      const response = await editBoardTitle(board.id, titleValue);

      if (response.error) {
        throw new Error(response.error);
      }

      toast.success('Board title updated successfully');
      setTitleValue('');
      setIsTitleSubmitting(false);
    } catch (error: any) {
      toast.error(error);
      setIsTitleSubmitting(false);
    } finally {
      setTitleValue('');
      setIsOpen(false);
      setIsTitleSubmitting(false);
    }
  }

  useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
    if (e.key === 'Enter' && titleValue.length > 2) {
      handleEditTitle();
    }
  });

  return (
    <div className='bg-black/50  text-white  py-3 w-full fixed top-14 z-20 flex items-center gap-2  justify-between  '>
      <div className=' md:max-w-screen-2xl    mx-auto w-full px-4 flex justify-between'>
        <div className='flex gap-4 items-center'>
          <p className='text-white z-20 font-semibold body-xl'>
            {board?.title}
          </p>
          <Modal
            onClose={() => setIsOpen(!isOpen)}
            isOpen={isOpen}
            title={'Change board title'}
            description={'The title should be at least 3 characters long'}
            content={
              <>
                <Input
                  ref={inputRef}
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
                  {isTitleSubmitting && (
                    <Loader className='animate-spin ' size={18} />
                  )}
                </Button>
              </>
            }
          >
            <Ellipsis
              onClick={() => setIsOpen(true)}
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
    </div>
  );
}
