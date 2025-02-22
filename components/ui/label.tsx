'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const labelVariants = cva('body-md font-medium truncate text-text-base');

/**
 * Label component
 *
 * @param asChild - boolean by default false: change the default rendered element for the one passed as a child, merging their props and behavior
 * @param className - string: classes to be passed to component
 * @param htmlFor - string: the id of the element the label is associated with
 *
 * [Radix label](https://www.radix-ui.com/primitives/docs/components/label)
 */

const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
