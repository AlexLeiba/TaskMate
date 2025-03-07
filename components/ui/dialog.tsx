'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { cn } from '@/lib/utils';
import { Button } from './button';
import { X } from 'lucide-react';
import { Checkbox } from './checkbox';

/**
 * Dialog component
 *
 * @param defaultOpen - boolean: the open state of the dialog when it is initially rendered
 * @param open - boolean: the controlled open state of the dialog, must be used with onOpenChange
 * @param onOpenChange - function: (open: boolean) => void: event handler called when the open state of the dialog changes
 * @param modal - boolean by default true: when set to true, interaction with outside elements will be disabled and only dialog content will be visible to screen readers
 *
 * [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */

const Dialog = DialogPrimitive.Root;

/**
 * DialogTrigger component
 *
 * @param asChild - boolean by default false: change the default rendered element for the one passed as a child, merging their props and behavior
 * @param [data-state] - 'open' | 'closed'
 *
 * [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */

const DialogTrigger = DialogPrimitive.Trigger;

/**
 * DialogPortal component
 *
 * @param forceMount - boolean: used to force mounting when more control is needed
 * @param container - jsxElemnt: specify a container element to portal the content into
 *
 * [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */

const DialogPortal = DialogPrimitive.Portal;

/**
 * DialogClose component
 *
 * @param asChild - boolean by default false: change the default rendered element for the one passed as a child, merging their props and behavior
 *
 * [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */

const DialogClose = DialogPrimitive.Close;

/**
 * DialogOverlay component
 *
 * @param className - string: classes to be passed to component
 * @param asChild - boolean by default false: change the default rendered element for the one passed as a child, merging their props and behavior
 * @param forceMount - boolean: used to force mounting when more control is needed
 * @param [data-state] - 'open' | 'closed'
 *
 * [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'bg-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 opacity-80',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * DialogContent component
 *
 * @param className - string: classes to be passed to component
 * @param children - ReactNode: children to be passed to component
 * @param asChild - boolean by default false: change the default rendered element for the one passed as a child, merging their props and behavior
 * @param forceMount - boolean: used to force mounting when more control is needed
 * @param onOpenAutoFocus - function: (event: Event) => void: event handler called when focus moves into the component after opening
 * @param onCloseAutoFocus - function: (event: Event) => void: event handler called when focus moves to the trigger after closing
 * @param onEscapeKeyDown - function: (event: KeyboardEvent) => void: event handler called when the escape key is down
 * @param onPointerDownOutside - function: (event: PointerDownOutsideEvent) => void: event handler called when a pointer event occurs outside the bounds of the component
 * @param onInteractOutside -function: (event: React.FocusEvent | MouseEvent | TouchEvent) => void: event handler called when a pointer event occurs outside the bounds of the component
 * @param [data-state] - 'open' | 'closed'
 *
 * [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    type?: 'modal';
  }
>(({ className, children, type, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'shadow-10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] bg-slate-100 fixed left-[50%] top-[50%] z-50 w-[400px] translate-x-[-50%] translate-y-[-50%] space-y-4 border p-6 duration-200',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        onClick={(e) => e.stopPropagation()}
        className={cn([
          'absolute -top-2 right-2',
          'text-black ring-offset-background  flex size-8 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none',
        ])}
      >
        <X
          size={20}
          className={cn(type === 'modal' && 'text-text-base', 'z-20')}
        />
        <span className='sr-only'>Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * DialogHeader component
 *
 * @param className - string: classes to be passed to component
 *
 * [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */

const DialogHeader = ({
  className,
  icon,
  position = 'left-aligned',
  title,
  variant = 'baseline',
  description,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, 'position'> & {
  icon?: React.JSX.Element;
  position: 'left-aligned' | 'center-aligned' | 'horizontal-left-aligned';
  title: string;
  variant?: 'baseline' | 'accent' | 'destructive';
  description: string;
  customConfirmButtonText?: string;
  customCancelButtonText?: string;
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 px-4 pt-4 lg:px-6 lg:pt-6',
        position === 'center-aligned' && 'items-center text-center',
        position === 'horizontal-left-aligned' && 'flex-row items-start',
        className
      )}
      {...props}
    >
      <div className='flex flex-col gap-2'>
        {icon && (
          <div
            className={cn(
              'bg-gray-400 size-12',
              'flex flex-shrink-0 items-center justify-center rounded-full',
              variant === 'destructive' && 'bg-red-500',
              variant === 'accent' && 'bg-sky-500'
            )}
          >
            {React.cloneElement(icon, {
              className: cn(
                icon.props.className,
                'text-text-base text-[20px]  stroke-[1.5]',
                variant === 'destructive' && 'text-text-error',
                variant === 'accent' && 'text-text-accent'
              ),
            })}
          </div>
        )}
        <div className={cn('mr-8 flex flex-col gap-1')}>
          <DialogPrimitive.DialogTitle
            // overwritten the classNames of text (body-lg) because didn't wotk applying directly  (body-lg) as a className
            className={
              '!text-[16px] font-semibold !leading-[24px] lg:!text-[18px] lg:!leading-[28px]'
            }
          >
            {title}
          </DialogPrimitive.DialogTitle>
          <DialogPrimitive.Description className={'text-text-light body-sm'}>
            {description}
          </DialogPrimitive.Description>
        </div>
      </div>
    </div>
  );
};
DialogHeader.displayName = 'DialogHeader';

/**
 * DialogFooter component
 *
 * @param className - string: classes to be passed to component
 *
 * [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */

const DialogFooter = ({
  className,
  customConfirmButtonText,
  customCancelButtonText,
  position = 'horizontal-fill',
  confirmButtonVariant = 'secondary',
  cancelButtonVariant = 'secondary',
  customCheckboxText,
  customLinkButtonText,
  iconLinkButton,
  hideCancel,
  hideConfirm,
  disabledConfirmButton = false,
  onConfirm,
  onCancel,
  onLinkButton,
  onCheckbox,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  position: 'horizontal-fill' | 'vertical-fill' | 'horizontal-group';
  confirmButtonVariant?:
    | 'destructive'
    | 'secondary'
    | 'link'
    | 'outline'
    | 'ghost'
    | 'default';
  cancelButtonVariant?:
    | 'destructive'
    | 'secondary'
    | 'link'
    | 'outline'
    | 'ghost'
    | 'default';
  customConfirmButtonText?: string;
  customCancelButtonText?: string;
  customCheckboxText?: string;
  customLinkButtonText?: string;
  iconLinkButton?: React.JSX.Element;
  hideCancel?: boolean;
  hideConfirm?: boolean;
  disabledConfirmButton?: boolean;

  onCancel?: () => void;
  onConfirm?: () => void;
  onLinkButton?: () => void;
  onCheckbox?: (checked: boolean) => void;
}) => {
  const [checked, setChecked] = React.useState(false);
  return (
    <div
      className={cn([
        'flex w-full ',
        position === 'horizontal-group' && [
          (onCheckbox || onLinkButton) && 'justify-between sm:gap-4 md:gap-4',
          'flex justify-end sm:flex-col-reverse sm:items-start md:flex-col-reverse md:items-start lg:items-center',
        ],

        className,
      ])}
      {...props}
    >
      {position === 'horizontal-group' && (onCheckbox || onLinkButton) && (
        <div className='flex w-full justify-between gap-4 lg:justify-start'>
          {onCheckbox && (
            <Checkbox
              className={cn('text-text-accent')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onCheckbox?.(!checked), setChecked(!checked);
                }
              }}
              label={customCheckboxText}
              checked={checked}
              onCheckedChange={() => {
                onCheckbox?.(!checked), setChecked(!checked);
              }}
            />
          )}
          {onLinkButton && (
            <Button
              className={cn('text-text-accent')}
              onClick={onLinkButton}
              variant={'secondary'}
            >
              {customLinkButtonText}
            </Button>
          )}
        </div>
      )}

      <div
        className={cn(
          'flex w-full items-center justify-between gap-4',

          position === 'horizontal-group' && [
            'flex-col-reverse lg:w-1/2 lg:flex-row',
          ],

          position === 'vertical-fill' && 'w-full flex-col-reverse',
          position === 'horizontal-fill' &&
            'w-full flex-col-reverse lg:flex-row',

          hideCancel && 'justify-end'
        )}
      >
        {!hideCancel && (
          <Button
            variant={cancelButtonVariant}
            className='w-full'
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
          >
            {customCancelButtonText || 'Cancel'}
          </Button>
        )}
        {!hideConfirm && (
          <Button
            disabled={disabledConfirmButton}
            className={cn('w-full', hideCancel && 'w-1/2')}
            variant={'destructive'}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm?.();
            }}
          >
            {customConfirmButtonText || 'Confirm'}
          </Button>
        )}
      </div>
    </div>
  );
};
DialogFooter.displayName = 'DialogFooter';

/**
 * DialogTitle component
 *
 * @param asChild - boolean by default false: change the default rendered element for the one passed as a child, merging their props and behavior
 * @param className - string: classes to be passed to component
 *
 * [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * DialogDescription component
 *
 * @param asChild - boolean by default false: change the default rendered element for the one passed as a child, merging their props and behavior
 * @param className - string: classes to be passed to component
 *
 * [Radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
 */

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-baseline-300 text-sm', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
};
