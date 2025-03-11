import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { Label } from './label';
import { Info } from 'lucide-react';

export const textAreaVariants = cva(
  [
    'transition-all',
    'rounded-lg px-3 py-2 ',
    'bg-white font-normal text-black',
    'flex w-full border border-gray-200 ',
    'placeholder:text-gray-400',
    'disabled:cursor-not-allowed  disabled:bg-gray-300 disabled:border-gray-100 disabled:text-gray-400',

    // focus
    // remove default behaviour in browsers
    'focus-within:outline-0',
    'focus:ring-[1px] focus-within:border-sky-100 focus-within:ring-sky-100 focus-within:placeholder:text-transparent',
  ],
  {
    variants: {
      size: {
        medium: 'body-base placeholder:body-base  ',
        small: 'body-sm placeholder:body-sm  ',
      },
      autocomplete: {
        true: 'pointer-events-none bg-gray-300 border-gray-400',
      },
      hasError: {
        true: 'border-red-500  focus-visible:border focus-within:border-red-500 ring-red-500 focus-visible:ring-[1px] focus-within:ring-red-500',
      },
    },
  }
);

export type TextAreaProps = {
  error?: string | boolean;
  label?: string;
  hintText?: string;
  darkTooltip?: boolean;
  mandatory?: boolean;
  autocomplete?: boolean;
  iconHelpTooltip?: {
    title: string;
    description: string;
  };
} & VariantProps<typeof textAreaVariants> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>;

/**
 * TextArea component
 *
 * @param className - string: classes to be passed to component
 * @param hintText - string: the hint text to display below the component
 * @param iconHelpTooltip - object: the tooltip configuration for the icon
 * @param label - string: the label to be passed to component
 * @param error - string | undefined: the error message to display below the component
 * @param darkTooltip -  boolean | undefined: whether to use a dark theme for the tooltip
 * @param size - 'medium' | null: determines the size of the component
 * @param mandatory - boolean: whether the field is mandatory
 * @param autocomplete - boolean: whether the input is read only , the prop is written in lowercase to avoid overwriting the autoComplete prop of the input component
 */

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      hintText,
      error,
      darkTooltip,
      size = 'medium',
      mandatory,
      autocomplete,
      iconHelpTooltip,
      ...props
    },
    ref
  ) => {
    return (
      <div className='relative w-full'>
        <Label
          className={cn(
            error && 'text-red-500',
            size === 'small' ? 'body-xs' : 'body-sm',
            autocomplete && 'text-gray-400'
          )}
          htmlFor={props.name}
        >
          {label}
          {mandatory && (
            <span
              className={cn(
                error ? 'text-red-500' : 'text-sky-500',
                size === 'small' ? 'body-xs' : 'body-sm'
              )}
            >
              {' '}
              *
            </span>
          )}
        </Label>
        <div className='h-[2px]' />
        <div className='relative'>
          <textarea
            readOnly={autocomplete}
            rows={props.rows || 3}
            className={cn(
              textAreaVariants({
                size,
                className,
                autocomplete,
                hasError: !!error,
              }),

              iconHelpTooltip?.title && 'pr-10'
            )}
            ref={ref}
            {...props}
          />
          {/* ICON HELP TEXT TOOLTIP */}
          {iconHelpTooltip?.title && (
            <TooltipProvider delayDuration={250} disableHoverableContent>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    size={20}
                    className={cn([
                      'z-20 cursor-help',
                      'absolute right-2 top-1/2 -translate-y-1/2',
                      'text-gray-300 stroke-[1.5px]',
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
        {hintText && !error && (
          <p
            className={cn(
              'body-xs text-black mt-[2px]',
              autocomplete && 'text-gray-500'
            )}
          >
            {hintText}
          </p>
        )}
        {error && (
          <p className={cn('body-xs text-red-500 mt-[2px]')}>{error}</p>
        )}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';

export { TextArea };
