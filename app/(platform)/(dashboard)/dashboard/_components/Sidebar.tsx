'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, Plus } from 'lucide-react';
import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion } from '@/components/ui/accordion';
import { useLocalStorage } from 'usehooks-ts';
import AccordionNavItem, { OrganizationType } from './AccordionNavItem';
import { Spacer } from '@/components/ui/spacer';
import ThemeToggle from '@/components/ThemeToggle';

type Props = {
  storageKey: string;
};
function Sidebar({ storageKey = 'default-sidebar-state' }: Props) {
  // To persist data between renders
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  const { organization: activeOrganization, isLoaded: isLoadedOrganization } =
    useOrganization();

  const { userMemberships, isLoaded: isLoadedMemberships } =
    useOrganizationList({
      userMemberships: {
        // infinite: true,
        limit: 100,
        orderBy: {
          createdAt: 'desc',
        },
      },
    });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }

      return acc;
    },
    []
  );
  //gonna turn {"123": true, "456": false} to ["123", "456"] ( to only array of expanded ids)

  function handleExpand(id: string) {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  const skeletonData = new Array(2).fill(0);

  if (
    !isLoadedOrganization ||
    !isLoadedMemberships ||
    userMemberships.isLoading
  ) {
    return (
      <div className='font-medium  flex  px-4 py-4  h-[calc(100vh-80px)] flex-col'>
        <div className='flex justify-between  w-full '>
          <p className=' font-bold'>Workspaces</p>

          <Link href={'/select-org'}>
            <Button variant={'ghost'} size={'sm'} className='h-7'>
              <Plus />
            </Button>
          </Link>
        </div>

        {/* SKELETON */}
        <Skeleton>
          <Spacer size={8} />
          <div className='flex flex-col gap-4 '>
            {skeletonData.map((_, index) => (
              <div
                key={index}
                className='flex  items-center h-[30px] w-full justify-between p-1.5'
              >
                <div className='flex gap-2 items-center'>
                  <div className='w-[30px] h-[30px] rounded-md bg-gray-400' />

                  <div className='w-[110px] h-[15px] rounded-md bg-gray-400' />
                </div>

                <ChevronDown className='h-4 w-4 text-gray-400' />
              </div>
            ))}
          </div>
        </Skeleton>
      </div>
    );
  }

  return (
    <>
      <div className='font-medium  flex  px-4 py-4  h-[calc(100vh-155px)] flex-col'>
        <div className='flex justify-between  w-full '>
          <div className='flex flex-col'>
            <div className='md:hidden '>
              <ThemeToggle />
              <Spacer size={6} />
            </div>
            <div className='flex justify-between  w-full '>
              <p className=' font-bold'>Workspaces</p>
              <Link href={'/select-org'}>
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  className='h-7 dark:hover:text-gray-300'
                >
                  <Plus />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Spacer size={3} />

        <Accordion
          type='multiple'
          defaultValue={defaultAccordionValue}
          className='space-y-2 w-full'
        >
          {userMemberships.data?.map(({ organization }, index) => (
            <AccordionNavItem
              key={index}
              isActive={activeOrganization?.id === organization.id}
              organization={organization as OrganizationType}
              isExpanded={expanded[organization.id]}
              onExpand={handleExpand}
            />
          ))}
        </Accordion>
      </div>
    </>
  );
}

export default Sidebar;
