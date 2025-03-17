'use client';
import Logo from '@/components/logo';
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function Footer() {
  const pathname = usePathname();

  const hiddenListOfPaths = ['board'];
  const currentPath = pathname.split('/')[1];
  return (
    <div
      className='relative w-full h-24 px-4  border-t shadow-sm bg-slate-100 dark:bg-gray-800 flex items-center z-50'
      style={{ display: hiddenListOfPaths.includes(currentPath) ? 'none' : '' }}
    >
      <div className=' max-w-screen-2xl mx-auto  flex items-center justify-between w-full'>
        <Logo />

        <div className='flex gap-8'>
          <Link href={'/about'}>
            <p className='font-bold'>About</p>
          </Link>
          <div className='  flex items-center justify-between '>
            <div className=' flex  gap-4   text-center items-center justify-center '>
              <Link href={'https://github.com/AlexLeiba'} target='_blank'>
                <div className='flex gap-2 dark:text-white items-center'>
                  <p>Github</p>
                  <Github size={20} cursor={'pointer'} />{' '}
                </div>
              </Link>

              <Link href={'mailto:leiba.alexandru@gmail.com'} target='_blank'>
                <div className='flex gap-2 dark:text-white items-center'>
                  <p>Gmail</p>
                  <Mail size={20} cursor={'pointer'} />{' '}
                </div>
              </Link>

              <Link
                target='_blank'
                href={
                  'https://www.linkedin.com/in/alex-leiba-9205801ba?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
                }
              >
                <div className='flex gap-2 dark:text-white items-center'>
                  <p>Linkedin</p>

                  <Linkedin size={20} cursor={'pointer'} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
