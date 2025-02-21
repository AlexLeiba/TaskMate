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
  console.log('🚀 ~ pathName:', pathName);

  const isCurrentPath = pathName.split('/')[3];

  const routesData = [
    {
      label: 'Boards',
      icon: <Layout className='w-4 h-4 mr-2' />,
      link: `/organization/${organization.id}`,
    },
    {
      label: 'Activity',
      icon: <Activity className='w-4 h-4 mr-2' />,
      link: `/organization/${organization.id}/activity`,
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
  return (
    <AccordionItem value={organization.id} className='border-none'>
      {/* TRIGGER */}
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          isActive && !isExpanded && 'bg-sky-500/20 text-sky-800',
          '!w-full',
          'flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-700/10 transition text-start no-underline hover:no-underline'
        )}
      >
        <div
          className={cn(
            isActive && !isExpanded && 'text-sky-800',
            'flex items-center gap-x-2 font-bold'
          )}
        >
          <div className='relative h-[30px] w-[30px]'>
            <Image fill src={organization.imageUrl} alt={organization.name} />
          </div>
          <p className='body-sm f'>{organization.name}</p>
        </div>
      </AccordionTrigger>
      {/* CONTENT */}
      <AccordionContent className='pt-1 '>
        {routesData.map((data, index) => {
          return (
            <div
              onClick={() => handleClick(data.link)}
              className={cn(
                !isCurrentPath &&
                  data.label.toLocaleLowerCase() === 'boards' &&
                  'bg-sky-500/20 text-sky-700',
                isCurrentPath &&
                  isCurrentPath === data.label.toLocaleLowerCase() &&
                  'bg-sky-500/20',
                'flex  flex-col   justify-center hover:bg-gray-200 rounded-md cursor-pointer'
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
