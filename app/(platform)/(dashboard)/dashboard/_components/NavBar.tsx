'use client';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { Loader, Plus } from 'lucide-react';
import MobileSidebar from './MobileSidebar';
import Logo from '@/components/logo';
import { Modal } from '@/components/Modal/modal';
import FormBoard from '../../organization/[organizationId]/_components/formBoard';
import ThemeToggle from '@/components/ThemeToggle';

export function Navbar() {
  const closeModalOnSubmitRef = useRef<HTMLButtonElement>(null);
  const [isLoadingCreateBoard, setIsLoadingCreateBoard] = useState(false);
  return (
    <div className='fixed top-0 w-full h-14 px-4   border-b shadow-sm bg-slate-100 flex items-center z-50 dark:bg-gray-800'>
      <div className='flex   gap-2 items-center justify-start'>
        <Logo />
        {/* Mobile sidebar */}
        <MobileSidebar />
      </div>
      {/*  */}
      <div className='md:max-w-screen-2xl px-4  flex items-center justify-between w-full mx-auto'>
        <div className='flex gap-4 items-center h-[30px]'>
          {/* <Logo /> */}
          <div className='hidden md:block'>
            <ThemeToggle />
          </div>
        </div>

        <div className='flex items-center gap-6'>
          <Modal
            closeRef={closeModalOnSubmitRef}
            contentClassName='lg:w-[450px] w-[305px] bg-gray-300 '
            title='New board'
            description=''
            sideOffset={5}
            side='top'
            content={
              <FormBoard
                setIsLoadingCreateBoard={setIsLoadingCreateBoard}
                isLoadingCreateBoard={isLoadingCreateBoard}
                type='header'
                closeModalOnSubmitRef={closeModalOnSubmitRef}
              />
            }
          >
            <Button
              disabled={isLoadingCreateBoard}
              size={'sm'}
              className='rounded-full w-8 h-8  md:w-auto '
            >
              <span className='md:block lg:block hidden'>Create</span>
              {isLoadingCreateBoard && (
                <div>
                  <Loader className=' animate-spin' />
                </div>
              )}
              <Plus className='lg:hidden md:hidden' />
            </Button>
          </Modal>

          <div className='hidden md:block '>
            <OrganizationSwitcher
              hidePersonal
              afterCreateOrganizationUrl={'/organization/:id'}
              afterSelectOrganizationUrl={'/organization/:id'}
              afterLeaveOrganizationUrl='/select-org'
              appearance={{
                elements: {
                  organizationSwitcherTriggerIcon: 'dark:text-white',
                  avatarBox: 'dark:bg-gray-300',

                  organizationSwitcherPopoverActions: 'text-black',
                  organizationPreview: 'text-black',
                  organizationPreviewMainIdentifier: 'dark:text-white',
                },
              }}
            />
          </div>

          <div className='space-x-4  flex items-center justify-between '>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: '30px',
                    height: '30px',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
