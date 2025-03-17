'use client';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Activity, CreditCard, Layout, Settings } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export type OrganizationType = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};
type NavItemType = {
  isActive: boolean;
  organization: OrganizationType;
  isExpanded: boolean;
  onExpand: (id: string) => void;
};
function AccordionNavItem({
  isActive,
  organization,
  isExpanded,
  onExpand,
}: NavItemType) {
  const router = useRouter();
  const pathName = usePathname();

  const isCurrentPath = pathName.split('/')[3];
  console.log('🚀 ~ isCurrentPath:', isCurrentPath);

  const routesData = [
    {
      label: 'Boards',
      icon: <Layout className='w-4 h-4 mr-2' />,
      link: `/organization/${organization.id}`,
    },
    {
      label: 'Activity',
      icon: <Activity className='w-4 h-4 mr-2' />,
      link: `/organization/${organization.id}/activity?page=1`,
    },
    {
      label: 'Settings',
      icon: <Settings className='w-4 h-4 mr-2' />,
      link: `/organization/${organization.id}/settings`,
    },
    {
      label: 'Billing',
      icon: <CreditCard className='w-4 h-4 mr-2' />,
      link: `/organization/${organization.id}/billing`,
    },
  ];

  function handleClick(link: string) {
    router.push(link);
  }

  function handleCurrentSelectedPath(path: string) {
    if (isCurrentPath === path && isActive) {
      return true;
    } else if (path === 'boards' && isActive && !isCurrentPath) {
      return true;
    }
    return false;
  }
  return (
    <AccordionItem value={organization.id} className='border-none'>
      {/* TRIGGER */}
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          isActive && 'bg-sky-500/20 text-sky-800 dark:text-gray-300',
          '!w-full',
          'flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-700/10 transition text-start no-underline hover:no-underline dark:text-white'
        )}
      >
        <div
          className={cn(
            isActive && 'text-sky-800 dark:text-white',

            'flex items-center gap-x-2 font-bold'
          )}
        >
          <div className='relative h-[30px] w-[30px] dark:bg-gray-300 rounded-md'>
            <Image fill src={organization.imageUrl} alt={organization.name} />
          </div>
          <p className='body-sm f'>{organization.name}</p>
        </div>
      </AccordionTrigger>
      {/* CONTENT */}
      <AccordionContent className='pt-1 dark:text-black'>
        {routesData.map((data, index) => {
          if (data.label === 'Billing') return;

          return (
            <div
              onClick={() => handleClick(data.link)}
              className={cn(
                handleCurrentSelectedPath(data.label.toLocaleLowerCase())
                  ? 'text-sky-700'
                  : 'bg-slate-100 dark:bg-transparent dark:text-white',

                'flex  flex-col   justify-center  hover:opacity-50 d rounded-md cursor-pointer'
              )}
              key={index}
            >
              <div className='flex items-center gap-x-2 p-2  pl-8'>
                {data.icon}
                <p>{data.label}</p>
              </div>
            </div>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}

export default AccordionNavItem;
