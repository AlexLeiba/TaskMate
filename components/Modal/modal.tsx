'use client';
import { PopoverClose } from '@radix-ui/react-popover';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Spacer } from '../ui/spacer';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  children?: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  isOpen?: boolean;
  onClose?: () => void;
  sideOffset?: number;
  title?: string;
  description?: string;
  content?: React.ReactNode;
  contentClassName?: string;
  closeRef?: React.RefObject<HTMLButtonElement | null> | undefined;
};

export function Modal({
  children,
  side = 'bottom',
  align = 'start',
  isOpen,
  sideOffset,
  title,
  description,
  content,
  contentClassName,
  closeRef,
  onClose,
}: Props) {
  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          ' bg-gray-100  text-gray-900 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded p-3',
          contentClassName
        )}
      >
        <p className='body-xl font-semibold'>{title}</p>
        <Spacer size={2} />
        {description && (
          <>
            <p className='body-sm'>{description}</p>
            <Spacer size={6} />
          </>
        )}

        {/* CONTENT */}
        {content}

        {/* CLOSE BUTTON */}
        <PopoverClose
          asChild
          ref={closeRef}
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
        >
          <Button
            size={'sm'}
            variant={'ghost'}
            className='absolute top-2 right-2'
          >
            <X size={20} />
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
}
