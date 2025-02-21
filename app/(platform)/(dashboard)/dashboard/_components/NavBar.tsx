'use client';
import React from 'react';
// import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import MobileSidebar from './MobileSidebar';
import Logo from '@/components/logo';

export function Navbar() {
  // const { isSignedIn } = useAuth();

  return (
    <div className='fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-slate-100 flex items-center'>
      {/* Mobile sidebar */}
      <MobileSidebar />
      {/*  */}
      <div className='md:max-w-screen-2xl  flex items-center justify-between w-full mx-auto'>
        <div className='flex gap-4 items-center h-[30px]'>
          <Logo />
          <Button size={'sm'} className='rounded-full w-8 h-8  md:w-auto '>
            <span className='md:block lg:block hidden '>Create</span>
            <Plus className='lg:hidden md:hidden' />
          </Button>

          <div>
            <OrganizationSwitcher
              hidePersonal
              afterCreateOrganizationUrl={'/organization/:id'}
              afterSelectOrganizationUrl={'/organization/:id'}
              afterLeaveOrganizationUrl='/select-org'
              appearance={{
                elements: {
                  rootBox: {
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  },

                  popoverBox: {
                    width: '100%',
                    maxWidth: 'auto',
                  },
                },
              }}
            />
          </div>
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
  );
}
