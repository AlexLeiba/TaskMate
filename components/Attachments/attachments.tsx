'use client';
import { ImageDown, ImageIcon, Loader, Plus } from 'lucide-react';
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

type ActivityType = {
  attachments: AttachmentsType;
  cardId: string;
  listId: string;
};

export function Attachments({ attachments, cardId, listId }: ActivityType) {
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
          }

          if (responseData.error) {
            throw new Error('Error uploading image');
          }
        };
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setUploadImageLoading(false);
      }
    }
  }
  // fetch attachments here based on list id cardid and orgId
  const { organization: activeOrganization } = useOrganization();
  return (
    <div className=' flex attachments-start gap-x-3 w-full'>
      <ImageIcon />

      <div className='mb-2 w-full'>
        <div className='flex justify-between w-full'>
          <p className='body-md font-semibold'>Attachments</p>
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

        <div>
          {previewImageUrl && (
            <Image
              width={60}
              height={40}
              src={previewImageUrl}
              className='rounded-md'
              alt={'preview-uploaded-image'}
            />
          )}
        </div>
        <div className='flex gap-2'>
          {attachments && attachments?.values.length > 0 ? (
            attachments?.values.map((image, index) => {
              return (
                <div className='flex gap-2 items-center flex-wrap' key={index}>
                  <div className='flex flex-col items-start justify-start w-[60px]'>
                    {image && (
                      <Image
                        width={60}
                        height={40}
                        src={image}
                        className='rounded-md'
                        alt={'attached-image'}
                      />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className='body-xs mb-3  text-gray-500'>
              No attachments provided.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
