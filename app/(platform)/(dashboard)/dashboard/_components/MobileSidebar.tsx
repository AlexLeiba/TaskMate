'use client';

import React, { useEffect, useState } from 'react';

import { useMobileSidebarStore } from '@/hooks/useMobileSidebarStore';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import Sidebar from './Sidebar';

function MobileSidebar() {
  const pathName = usePathname();
  const { onOpen, onClose, isOpen } = useMobileSidebarStore((state) => state);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathName, onClose]);

  if (!isMounted) return null;

  return (
    <div className=' md:hidden block'>
      <Menu
        onClick={onOpen}
        width={30}
        height={30}
        cursor={'pointer'}
        className=' h-8 w-8 hover:bg-gray-400 hover:text-white cursor-pointer'
      />

      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side={'left'} className='p-2 pt-10'>
          <SheetTitle></SheetTitle>

          <Sidebar storageKey={'t-sidebar-mobile-state'} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileSidebar;
