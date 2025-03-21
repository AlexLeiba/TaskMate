'use client';
import { ImageDown, ImageIcon, Loader, Plus, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Spacer } from '../ui/spacer';
import Image from 'next/image';
import { useOrganization } from '@clerk/nextjs';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { toast } from 'react-toastify';
import { Attachments as AttachmentsType } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { deleteAttachmentInCard } from '@/actions/action-card';

type ActivityType = {
  attachments: AttachmentsType[];
  cardId: string;
  listId: string;
  refetchCardData: () => void;
};

export function Attachments({
  attachments,
  cardId,
  listId,
  refetchCardData,
}: ActivityType) {
  const params = useParams();
  const { boardId } = params;
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);

  // HANDLE FILE UPLOAD
  function handleFileUploadClick() {
    uploadFileRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (file) {
      setUploadImageLoading(true);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
          const base64Image = reader.result as string;

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload-image`,
            {
              method: 'POST',
              body: JSON.stringify({
                file: base64Image,
                cardId,
                listId,
                boardId,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          const responseData = await response.json();

          if (responseData.status === 200) {
            setPreviewImageUrl(responseData.url);
            toast.success('File uploaded successfully');
            refetchCardData();
            setUploadImageLoading(false);
          }

          if (responseData.error) {
            throw new Error('Error uploading image');
          }
        };
      } catch (error: any) {
        toast.error(error.message);

        setUploadImageLoading(false);
      }
    }
  }
  // fetch attachments here based on list id cardid and orgId
  const { organization: activeOrganization } = useOrganization();

  async function handleDeleteAttachment(attachmentId: string) {
    const response = await deleteAttachmentInCard(
      boardId as string,
      listId,
      cardId,
      attachmentId
    );

    if (response?.data) {
      toast.success('File deleted successfully');
      refetchCardData();
    }
    if (response?.error) {
      toast.error(response?.error);
    }
  }
  return (
    <div className=' flex attachments-start gap-x-3 w-[430px]'>
      <div className=' w-full'>
        <div className='flex justify-between w-full'>
          <div className='flex gap-2'>
            <ImageIcon />

            <div className='flex gap-2 items-center'>
              <p className='body-md font-semibold'>Attachments</p>
              <p className='text-gray-400'>{attachments?.length}</p>
            </div>
          </div>
          <div className='flex gap-4'>
            <div title='Download all attachments'>
              <ImageDown
                cursor={'pointer'}
                size={18}
                className='text-green-600 hover:opacity-80'
              />
            </div>

            <div title='Add attachment'>
              {uploadImageLoading ? (
                <Loader className=' animate-spin' size={18} />
              ) : (
                <Plus
                  role='button'
                  onClick={() => handleFileUploadClick()}
                  cursor={'pointer'}
                  size={18}
                  className='text-green-600 hover:opacity-80'
                />
              )}
              <input
                type='file'
                ref={uploadFileRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
        <Spacer size={3} />

        <div className='flex gap-2 overflow-y-auto h-[80px]'>
          {attachments && attachments?.length > 0 ? (
            attachments?.map((file, index) => {
              console.log('🚀 ~ attachments?.map ~ file:', file);
              return (
                <div
                  className='flex gap-2 items-center flex-wrap mb-5 mt-1'
                  key={index}
                >
                  <div className='relative flex flex-col items-start justify-start w-[70px] border dark:border-white/20 border-gray-300 rounded-md'>
                    {file.value && (
                      <Image
                        width={70}
                        height={50}
                        src={file.value}
                        className='rounded-md h-11 w-full object-contain'
                        alt={'attached-image'}
                      />
                    )}
                    <div
                      role='button'
                      onClick={() => handleDeleteAttachment(file.id)}
                      tabIndex={0}
                      title='Delete image'
                      className='absolute -right-1 -top-1 size-4 cursor-pointer rounded-full bg-red-500 text-white flex justify-center items-center'
                    >
                      <X size={15} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className='body-xs mb-2  text-gray-500'>
              No attachments provided.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
