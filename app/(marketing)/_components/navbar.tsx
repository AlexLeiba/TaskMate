'use client';
import Logo from '@/components/logo';
import ThemeToggle from '@/components/ThemeToggle';
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
    <div className='fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-slate-100 dark:bg-gray-800 flex items-center z-40'>
      <div className='max-w-screen-2xl mx-auto  flex items-center justify-between w-full'>
        <div className='flex items-center gap-6'>
          <Logo />

          <ThemeToggle />
        </div>

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
                <Button
                  size={'sm'}
                  variant={'outline'}
                  className='dark:bg-white dark:text-black bg-black text-white '
                >
                  <Link href={`/sign-in`}>Sign in</Link>
                </Button>
              )}

              {currentPath !== 'sign-in' && currentPath !== 'sign-up' && (
                <>
                  <Button
                    size={'sm'}
                    variant={'outline'}
                    className='dark:bg-white dark:text-black bg-black text-white '
                  >
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
