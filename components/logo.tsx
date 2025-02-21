import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Logo(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Link href={'/'}>
      <div
        className={cn(
          'hover:opacity-75 transition  gap-x-1  items-center hidden md:flex',
          props.className
        )}
      >
        <Image src={'/logo.png'} alt='logo' width={30} height={30} />
        <p className='font-bold '>TaskMate</p>
      </div>
    </Link>
  );
}

export default Logo;
