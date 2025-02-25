'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';
import { Label } from './label';

/**
 * Checkbox component.
 *
 * @component
 * The component receives both label and customLabel props, but only one of them can be used at a time.
 * CustomLabel is a ReactNode, so it can be used to render any custom content. It is recommended to use a paragraph tag to wrap the custom content.
 * The styling for the customLabel is already done in the component, so it is not necessary to add any additional styling unless if you want to override the default styling.
 *
 * If both label and customLabel are provided, customLabel has precedence over label.
 */
const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label?: string;
    customLabel?: React.ReactNode;
    helpText?: string;
    error?: string;
  }
>(
  (
    {
      className,
      label,
      customLabel,
      helpText,
      name,
      error,
      onChange,
      ...props
    },
    ref
  ) => (
    <div className='items-top group flex gap-3'>
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          // accessibility
          'focus-visible:ring-surface-accent focus-visible:ring-2 focus-visible:ring-offset-2',
          'data-[state=unchecked]:border-border-base data-[state=checked]:bg-surface-accent lg:hover:border-surface-accent data-[state=checked]:text-text-inverted size-5 shrink-0 rounded focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:border-2',
          className
        )}
        disabled={props.disabled}
        {...props}
        onChange={onChange}
      >
        <CheckboxPrimitive.Indicator
          className={cn('flex items-center justify-center text-current')}
        >
          <span className='sr-only'>Check</span>
          {props.checked === true ? (
            <span>
              <svg
                width='8'
                height='6'
                viewBox='0 0 8 6'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M6.99852 0C7.26415 0 7.51805 0.105286 7.70555 0.292786C7.87743 0.464966 7.98094 0.694031 7.99657 0.937073C8.01122 1.18011 7.93797 1.42035 7.78856 1.61273L7.70555 1.70673L3.70555 5.70673C3.53368 5.87891 3.30419 5.98236 3.06102 5.99762C2.81786 6.01294 2.57762 5.93903 2.38524 5.78973L2.29149 5.70673L0.29149 3.70673C0.111803 3.52679 0.00828715 3.28534 0.000474651 3.03137C-0.00733785 2.7774 0.0815293 2.53003 0.249498 2.33948C0.331529 2.24615 0.430162 2.16992 0.538561 2.11353C0.651842 2.05481 0.775865 2.0177 0.904772 2.00537C1.1577 1.98126 1.41063 2.05432 1.6118 2.20978L1.70555 2.29279L2.99852 3.58478L6.29149 0.292786C6.47899 0.105286 6.7329 0 6.99852 0Z'
                  fill='#FFFFFF'
                />
              </svg>
            </span>
          ) : (
            <div className='flex size-3 items-center justify-center rounded'>
              <div className='bg-text-inverted h-0.5 w-2 rounded-full' />
            </div>
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <div className='flex flex-col items-start gap-1'>
        {customLabel ? (
          <Slot className='text-text-base font-medium'>{customLabel}</Slot>
        ) : label ? (
          <Label
            htmlFor={name}
            className={cn(
              props.disabled && 'text-text-base cursor-not-allowed font-medium'
            )}
          >
            {label}
          </Label>
        ) : null}
        {error ? (
          <p className={cn('text-text-error body-xs')}>{error}</p>
        ) : helpText ? (
          <p
            className={cn(
              'text-text-light body-xs',
              props.disabled && 'text-text-disabled cursor-not-allowed'
            )}
          >
            {helpText}
          </p>
        ) : null}
      </div>
    </div>
  )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
