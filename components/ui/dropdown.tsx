'use client';

import React, { useRef, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spacer } from './spacer';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from './tooltip';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Label } from './label';
import { InfoIcon } from 'lucide-react';

type Props = {
  value?: string;
  defaultValue?: string;
  label: string;
  options: Array<{
    label: string;
    value: string;
    image?: string;
  }>;
  type?: 'input' | 'search';
  size?: 'small' | 'medium';
  hintText?: string;
  iconHelpTooltip?: {
    title?: string;
    description?: string;
  };
  leftIcon?: React.JSX.Element;
  rightIcon?: React.JSX.Element;
  darkTooltip?: boolean;
  mandatory?: boolean;
  disabled?: boolean;
  error?: string;
  autocomplete?: boolean;
  searchPlaceholder?: string;

  onChange: (value: string) => void;
};

/**
 * Dropdown component that renders a customizable dropdown menu with optional search functionality.
 *
 * @param label - The label for the dropdown.
 * @param options - The options for the dropdown, each option is an object with title, slug, image.
 * @param type  'input | search' - The type of the dropdown, either 'input' or 'search'.
 * @param size 'small | medium' - The size of the dropdown, either 'small' or 'medium'.
 * @param hintText - The hint text displayed below the dropdown.
 * @param iconHelpText - The help text displayed in the tooltip icon.
 * @param iconHelpTextTitle - The title for the help text tooltip.
 * @param leftIcon - The icon displayed on the left side of the dropdown.
 * @param rightIcon - The icon displayed on the right side of the dropdown.
 * @param darkTooltip - Whether the tooltip should have a dark theme.
 * @param mandatory - Whether the dropdown is mandatory.
 * @param disabled - Whether the dropdown is disabled.
 * @param error - The error message displayed below the dropdown.
 * @param autocomplete - Read only state for the dropdown.
 * @param searchPlaceholder - The placeholder text for the search input.
 * @param onHandleChange - The function to handle the change event of the dropdown.
 *
 * @returns {JSX.Element} The rendered Dropdown component.
 */

function Dropdown({
  value,
  defaultValue,
  options,
  label,
  leftIcon,
  iconHelpTooltip,
  size = 'medium',
  darkTooltip = false,
  mandatory,
  disabled,
  hintText,
  error,
  autocomplete,

  type,
  onChange,
}: Props) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleFocus = () => {
    // Re-focus the input when options update
    if (searchInputRef.current) {
      searchInputRef.current?.focus();
    }
  };

  return (
    <div className='flex w-full flex-col'>
      <div
        className={cn(
          disabled || autocomplete
            ? 'text-gray-500'
            : error
            ? 'text-red-500'
            : 'text-text-base'
        )}
      >
        {label && (
          <Label
            className={cn(
              error && 'text-red-500',
              autocomplete && 'text-gray-500',
              size === 'small' ? 'body-xs' : 'body-sm'
            )}
            htmlFor={label}
          >
            {label}
            {mandatory && (
              <span
                className={cn(
                  error ? 'text-red-500' : 'text-text-accent',
                  size === 'small' ? 'body-xs' : 'body-sm'
                )}
              >
                {' '}
                *
              </span>
            )}
          </Label>
        )}

        {/* ICON HELP TEXT TOOLTIP */}
        {iconHelpTooltip?.title && (
          <TooltipProvider delayDuration={250} disableHoverableContent>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon
                  size={20}
                  className={cn([
                    'z-20 cursor-help',
                    'text-gray-400',
                    size === 'small' ? 'right-2' : 'right-3',
                  ])}
                />
              </TooltipTrigger>
              <TooltipContent
                dark={darkTooltip}
                iconHelpTooltip={iconHelpTooltip}
              />
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className='h-0.5' />
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={(e) => {
          onChange(e);
        }}
        disabled={disabled}
      >
        <SelectTrigger
          autocomplete={autocomplete}
          error={!!error}
          size={size}
          tabIndex={autocomplete ? -1 : 0}
        >
          <div
            className={cn(
              size === 'small' ? 'gap-1.5' : 'gap-2',
              'flex items-center'
            )}
          >
            {leftIcon && (
              <span className=''>
                {React.cloneElement(leftIcon, {
                  className: `${
                    leftIcon.props.className
                  } stroke-[1.5px]  size-5  ${
                    disabled || autocomplete ? 'text-gray-400' : 'text-white'
                  } `,
                })}
              </span>
            )}

            <SelectValue placeholder={'Select'} />
          </div>
        </SelectTrigger>
        <SelectContent size={size}>
          {options.map((category, index) => {
            return (
              <SelectItem
                value={category.value}
                key={index}
                size={size}
                onKeyDown={handleFocus}
              >
                <div className='flex items-center gap-2'>
                  {category.image && (
                    <Image
                      className='w-5 h-5 object-cover'
                      src={category.image}
                      alt='image'
                      width={24}
                      height={24}
                    />
                  )}

                  {category.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {!!hintText && !error && (
        <p
          className={cn(
            disabled || autocomplete ? 'text-gray-400' : 'text-white',
            'body-xs mt-0.5'
          )}
        >
          {hintText}
        </p>
      )}
      {error && (
        <p className={cn('body-xs text-red-500 mt-0.5 font-normal')}>{error}</p>
      )}
    </div>
  );
}

export default Dropdown;
