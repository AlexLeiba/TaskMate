'use client';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useAuth, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function Navbar() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  const currentPath = pathname.split('/')[1];

  return (
    <div className='fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-slate-100 flex items-center'>
      <div className='max-w-screen-2xl mx-auto  flex items-center justify-between w-full'>
        <Logo />

        <div className='space-x-4  flex items-center justify-between '>
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              {currentPath === 'sign-in' && (
                <Button size={'sm'}>
                  <Link href='/sign-up'>Sign Up for Free</Link>
                </Button>
              )}

              {currentPath === 'sign-up' && (
                <Button size={'sm'} variant={'outline'}>
                  <Link href={`/sign-in`}>Sign in</Link>
                </Button>
              )}

              {currentPath !== 'sign-in' && currentPath !== 'sign-up' && (
                <>
                  <Button size={'sm'} variant={'outline'}>
                    <Link href={`/sign-in`}>Sign in</Link>
                  </Button>
                  <Button size={'sm'}>
                    <Link href='/sign-up'>Sign Up for Free</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
