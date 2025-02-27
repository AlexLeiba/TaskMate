'use client';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function Footer() {
  const pathname = usePathname();

  const hiddenListOfPaths = ['board'];
  const currentPath = pathname.split('/')[1];
  return (
    <div
      className='fixed bottom-0 w-full h-24 px-4 border-t shadow-sm bg-slate-100 flex items-center'
      style={{ display: hiddenListOfPaths.includes(currentPath) ? 'none' : '' }}
    >
      <div className='md:max-w-screen-2xl  flex items-center justify-between w-full'>
        <Logo />

        <div className='space-x-4  flex items-center justify-between '>
          <Button size={'sm'} variant={'ghost'}>
            <Link href='/privacy-policy'>Privacy Policy</Link>
          </Button>
          <Button size={'sm'} variant={'ghost'}>
            <Link href='/terms-of-service'>Terms of Service</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
