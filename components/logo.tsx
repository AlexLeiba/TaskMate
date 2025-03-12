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
        <Image src={'/logo.png'} alt='logo' width={30} height={30} />
        <p className='font-bold '>TaskMate</p>
      </div>
    </Link>
  );
}

export default Logo;
