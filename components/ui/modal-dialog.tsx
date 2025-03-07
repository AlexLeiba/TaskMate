'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Props = {
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
  positionFooter: 'horizontal-fill' | 'vertical-fill' | 'horizontal-group';
  positionHeader: 'left-aligned' | 'center-aligned' | 'horizontal-left-aligned';
  title: string;
  description: string;
  customConfirmButtonText?: string;
  customCancelButtonText?: string;
  triggerTitle: string;
  iconHeader?: React.JSX.Element;
  iconLinkButton?: React.JSX.Element;
  children?: React.ReactNode;
  customCheckboxText?: string;
  customLinkButtonText?: string;
  classNameTriggerButton?: string;
  customTrigger?: React.JSX.Element;
  open?: boolean;
  hideCancel?: boolean;
  hideConfirm?: boolean;
  disabledConfirmButton?: boolean;

  onConfirm?: () => void;
  onCancel?: () => void;
  onLinkButton?: () => void;
  onCheckbox?: (checked: boolean) => void;
  onOpenChange?: (open: boolean) => void;
};

/**
 * Modal component that renders a modal with customizable header, footer, and content.
 *
 * @param props {Object} props - The properties object.
 * @param confirmButtonVariant {'primary' | 'destructive' | 'secondary'} [props.confirmButtonVariant='primary'] - The variant of the confirm button.
 * @param cancelButtonVariant {'primary' | 'destructive' | 'secondary'} [props.cancelButtonVariant='secondary'] - The variant of the cancel button.
 * @param positionFooter {'horizontal-fill' | 'vertical-fill' | 'horizontal-group'} props.positionFooter - The position of the footer.
 * @param positionHeader {'left-aligned' | 'center-aligned' | 'horizontal-left-aligned'} props.positionHeader - The position of the header.
 * @param title {string} props.title - The title of the modal.
 * @param description {string} props.description - The description of the modal.
 * @param customConfirmButtonText {string} [props.customConfirmButtonText] - Custom text for the confirm button.
 * @param customCancelButtonText {string} [props.customCancelButtonText] - Custom text for the cancel button.
 * @param triggerTitle {string} props.triggerTitle - The title of the trigger button.
 * @param iconHeader {React.JSX.Element} [props.iconHeader] - Icon to be displayed in the header.
 * @param iconLinkButton {React.JSX.Element} [props.iconLinkButton] - Icon to be displayed in the link button.
 * @param children {React.ReactNode} [props.children] - The content to be displayed inside the modal.
 * @param customCheckboxText {string} [props.customCheckboxText] - Custom text for the checkbox.
 * @param customLinkButtonText {string} [props.customLinkButtonText] - Custom text for the link button.
 * @param classNameTriggerButton {string} [props.classNameTriggerButton] - Custom class name for the trigger button.
 * @param onConfirm {() => void} props.onConfirm - Callback function to handle confirm action.
 * @param onCancel {() => void} [props.onCancel] - Callback function to handle cancel action.
 * @param onLinkButton {() => void} [props.onLinkButton] - Callback function to handle link button action.
 * @param onCheckbox {(checked: boolean) => void} [props.onCheckbox] - Callback function to handle checkbox action.
 *
 * @returns {JSX.Element} The rendered Modal component.
 */

function Modal({
  disabledConfirmButton,
  open,
  title,
  description,
  confirmButtonVariant = 'secondary',
  cancelButtonVariant = 'secondary',
  positionFooter = 'horizontal-fill',
  positionHeader = 'left-aligned',
  children,
  iconHeader,
  iconLinkButton,
  customConfirmButtonText,
  customCancelButtonText,
  triggerTitle,
  customCheckboxText,
  customLinkButtonText,
  classNameTriggerButton,
  customTrigger,
  hideCancel,
  hideConfirm,
  onOpenChange,
  onConfirm,
  onCancel,
  onLinkButton,
  onCheckbox,
}: Props) {
  const [_open, _setOpen] = useState(open);

  const handleOpenStateChange = (open: boolean) => {
    onOpenChange?.(open);
    _setOpen(open);
  };

  useEffect(() => {
    _setOpen(open);
  }, [open]);

  return (
    <Dialog open={_open} onOpenChange={handleOpenStateChange}>
      <DialogTrigger
        className={!customTrigger ? cn(classNameTriggerButton) : ''}
        asChild={!!customTrigger}
      >
        {customTrigger ? customTrigger : triggerTitle}
      </DialogTrigger>

      <DialogContent
        className={cn(
          'bg-slate-100 z-50 min-w-[300px] overflow-auto rounded-lg border-none p-0',
          (!!children || !!onCheckbox) && 'lg:w-[760px]'
        )}
        type={'modal'}
      >
        <DialogHeader
          title={title}
          position={positionHeader}
          description={description}
          icon={iconHeader}
        />

        {children && (
          <div className='px-4 pb-4 pt-0 lg:px-6 lg:pb-6 lg:pt-2'>
            {children}
          </div>
        )}

        {!hideConfirm && !hideCancel && (
          <DialogFooter
            disabledConfirmButton={disabledConfirmButton}
            iconLinkButton={iconLinkButton}
            className='p-4 lg:pt-6'
            customConfirmButtonText={customConfirmButtonText}
            customCancelButtonText={customCancelButtonText}
            customCheckboxText={customCheckboxText}
            customLinkButtonText={customLinkButtonText}
            position={positionFooter}
            onConfirm={onConfirm}
            onCancel={() => {
              handleOpenStateChange(false);
              onCancel?.();
            }}
            hideCancel={hideCancel}
            hideConfirm={hideConfirm}
            confirmButtonVariant={confirmButtonVariant}
            cancelButtonVariant={cancelButtonVariant}
            onLinkButton={onLinkButton}
            onCheckbox={onCheckbox}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
