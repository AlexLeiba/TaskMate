import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Label } from './label';
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from './tooltip';
import { Eye, EyeOff, Info } from 'lucide-react';

export const inputVariants = cva(
  [
    'rounded-lg',
    'font-normal',
    'transition-all',
    'flex w-full border border-gray-600 ',
    'bg-white text-gray-900',
    'placeholder:text-gray-400',
    'disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed disabled:text-gray-400',
    // remove default behaviour in browsers
    'focus-within:outline-0',
    'focus-within:border-blue-500 ',
    'focus:ring-[1px] focus-within:ring-blue-500',
    'focus-within:placeholder:text-transparent',
  ],
  {
    variants: {
      size: {
        medium: 'body-base placeholder:body-base h-10 pl-4 pr-3',
        small: ' body-sm placeholder:body-sm h-8 pl-2 pr-2',
      },
      autocomplete: {
        true: 'pointer-events-none bg-gray-200 border-gray-300 ',
      },
      hasError: {
        true: 'border-red-500  focus-visible:border focus-within:border-red-500 ring-red-500  focus-visible:ring-[1px] focus-within:ring-blue-500',
      },
    },
  }
);

export type InputProps = {
  label?: string;
  error?: string;
  hintText?: string;
  iconHelpTooltip?: {
    title?: string;
    description?: string;
  };
  iconLeft?: React.JSX.Element;
  iconRight?: React.JSX.Element;
  darkTooltip?: boolean;
  mandatory?: boolean;
  autocomplete?: boolean;
  onRightIconClick?: () => void;
} & VariantProps<typeof inputVariants> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> &
  Pick<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

/**
 * A customizable input component.
 *
 * @component
 * @example
 * // Usage:
 * <Input
 *   label="Username"
 *   hintText="Enter your username"
 *   iconLeft={<Icon name="user" />}
 *   error="Invalid username"
 *   size="medium"
 *   type="text"
 *   darkTooltip={false}
 *   onRightIconClick={() => console.log('Right icon clicked')}
 *   name="username"
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 * />
 *
 * @param className - string: classes to be passed to component
 * @param label - string: the label for the input
 * @param hintText - string: the hint text to display below the input
 * @param iconHelpTooltip - object: the tooltip configuration for the icon
 * @param iconLeft - reactNode: the icon to display on the left side of the input
 * @param iconRight - reactNode: the icon to display on the right side of the input
 * @param error - string: the error message to display below the input
 * @param size - string: the size of the input. Possible values: 'small', 'medium', 'large'
 * @param type - string: the type of the input. Possible values: 'text', 'password', 'email', 'number', 'search', etc
 * @param darkTooltip - boolean: whether to use a dark theme for the tooltip
 * @param onRightIconClick - function: the callback function to be called when the right icon is clicked
 * @param name - string: the name attribute of the input
 * @param value - string: the value of the input
 * @param onChange - function: (value: RPNInput.Country) => void: the callback function to be called when the input value changes
 * @param mandatory - boolean: whether the field is mandatory
 * @param autocomplete - boolean: whether the input is read only , the prop is written in lowercase to avoid overwriting the autoComplete prop of the input component
 *
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      hintText,
      iconHelpTooltip,
      iconLeft,
      iconRight,
      error,
      size = 'medium',
      type = 'text',
      darkTooltip,
      mandatory,
      autocomplete,
      onRightIconClick,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    return (
      <div className='relative w-full'>
        {label && (
          <Label
            className={cn(
              error && 'text-red-500',
              autocomplete && 'text-gray-400',
              size === 'small' ? 'body-xs' : 'body-sm'
            )}
            htmlFor={props.name}
          >
            {label}
            {mandatory && (
              <span
                className={cn(
                  error ? 'text-red-500' : 'text-gray-900',
                  size === 'small' ? 'body-xs' : 'body-sm'
                )}
              >
                {' '}
                *
              </span>
            )}
          </Label>
        )}
        <div className='h-0.5' />

        {/* ICON LEFT */}
        <div className='relative flex'>
          {iconLeft && (
            <div
              className={cn([
                'absolute top-1/2 flex -translate-y-1/2',
                size === 'small' ? 'pl-2' : 'pl-3',
              ])}
            >
              {React.cloneElement(iconLeft, {
                className: cn([
                  iconLeft.props.className,
                  'text-gray-900 stroke-[1.5px]',
                  'size-5',
                  props.disabled || autocomplete
                    ? 'text-gray-400'
                    : 'text-gray-400',
                ]),
              })}
            </div>
          )}
          <input
            readOnly={autocomplete}
            type={isPasswordVisible ? 'text' : type}
            className={cn(
              inputVariants({
                size,
                className,
                autocomplete,
                hasError: !!error,
              }),

              !!iconHelpTooltip?.title || !!iconRight || type === 'password'
                ? size === 'small'
                  ? 'pr-8'
                  : 'pr-10'
                : '',
              iconLeft
                ? size === 'small'
                  ? 'pl-8'
                  : 'pl-10'
                : size === 'small'
                ? 'pl-2'
                : 'pl-3'
            )}
            ref={ref}
            {...props}
          />
          {/* ICON RIGHT */}
          {iconRight && type !== 'password' && (
            <>
              {React.cloneElement(iconRight, {
                className: cn([
                  iconRight.props.className,
                  'size-5 stroke-[1.5px]',
                  'text-gray-400',
                  'absolute top-1/2 -translate-y-1/2',
                  !!iconHelpTooltip?.title
                    ? size === 'small'
                      ? 'right-8'
                      : 'right-10'
                    : size === 'small'
                    ? 'right-2'
                    : 'right-3',
                  props.disabled || autocomplete
                    ? 'cursor-not-allowed '
                    : 'cursor-pointer',
                ]),
                onClick: () => {
                  if (onRightIconClick) {
                    onRightIconClick();
                  }
                },
              })}
            </>
          )}
          {/*ICON EYE PASSWORD */}
          {type === 'password' &&
            (isPasswordVisible ? (
              <EyeOff
                onClick={() => setIsPasswordVisible(false)}
                size={20}
                className={cn([
                  'size-5',
                  'absolute top-1/2 -translate-y-1/2',
                  !!iconHelpTooltip?.title
                    ? size === 'small'
                      ? 'right-8'
                      : 'right-10'
                    : size === 'small'
                    ? 'right-2'
                    : 'right-3',
                  props.disabled
                    ? 'text-gray-400 pointer-events-none'
                    : 'text-text-gray-400 cursor-pointer',
                  autocomplete && 'text-gray-400 pointer-events-none',
                ])}
              />
            ) : (
              <Eye
                onClick={() => setIsPasswordVisible(true)}
                size={20}
                className={cn([
                  'size-5',
                  'absolute top-1/2 -translate-y-1/2',
                  !!iconHelpTooltip?.title
                    ? size === 'small'
                      ? 'right-8'
                      : 'right-10'
                    : size === 'small'
                    ? 'right-2'
                    : 'right-3',

                  props.disabled
                    ? 'text-gray-400 pointer-events-none'
                    : 'text-gray-400 cursor-pointer',
                  autocomplete && 'text-gray-400 pointer-events-none',
                ])}
              />
            ))}

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
        {!!hintText && !error && (
          <p
            className={cn(
              'body-xs text-gray-900 mt-[2px]',
              autocomplete && 'text-gray-400'
            )}
          >
            {hintText}
          </p>
        )}
        {error && (
          <p className={cn('body-xs text-red-500 mt-[2px] font-normal')}>
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
