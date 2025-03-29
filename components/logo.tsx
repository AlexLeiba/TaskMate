import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Logo({
  props,
  type,
}: {
  props?: React.HTMLAttributes<HTMLDivElement>;
  type?: 'header';
}) {
  return (
    <Link href={'/'}>
      <div
        className={cn(
          type === 'header' ? 'hidden md:flex' : 'flex',
          'hover:opacity-75 transition  gap-x-1  items-center ',
          props?.className
        )}
      >
        <Image
          className='md:hidden w-12 h-6'
          src={'/logo/logo.webp'}
          alt='logo'
          width={30}
          height={30}
        />
        <Image
          src={'/logo/whole-logo-light.webp'}
          alt='logo'
          width={120}
          height={30}
          className='dark:hidden hidden md:block '
        />
        <Image
          className=' hidden md:dark:block '
          src={'/logo/whole-logo-dark.webp'}
          alt='logo'
          width={120}
          height={30}
        />
        {/* <p className='font-bold '>TaskMate</p> */}
      </div>
    </Link>
  );
}

export default Logo;
