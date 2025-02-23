import { unsplash } from '@/lib/unsplash';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { DEFAULT_IMAGES } from '@/consts/images';

type Props = {
  id: string;
  errors?: Record<string, string[] | undefined>;
};

function ImagePicker({ id, errors }: Props) {
  const [images, setImages] = React.useState<Array<Record<string, any>>>([]);
  console.log('🚀 ~ ImagePicker ~ images:', images);

  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedImageId, setSelectedImageId] = React.useState<string | null>(
    null
  );

  async function fetchImages() {
    setIsLoading(true);
    try {
      const result = await unsplash.photos.getRandom({
        collectionIds: ['317099'],
        count: 9,
      });

      if (result && result.response) {
        const fetchedImages = result.response as Array<Record<string, any>>;
        setImages(fetchedImages);
      } else {
        throw new Error('Error fetching images');
      }
    } catch (error: any) {
      setImages(DEFAULT_IMAGES as Array<Record<string, any>>);
      return toast.error('Error fetching new images, please try again later');
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchImages();
  }, []);

  function handleRefetchImages() {
    fetchImages();
  }

  //   if (isLoading)
  //     return (
  //       <div className='p-6 flex items-center justify-center'>
  //         <Loader2 className='w-6 h-6 animate-spin text-sky-600' />
  //       </div>
  //     );

  // SKELETON
  const skeletonData = Array(9).fill(0);

  function imageSkeleton() {
    return (
      <>
        {skeletonData.map((_, index) => {
          return (
            <div
              key={index}
              className={cn(
                'rounded-md bg-gray-200 animate-pulse  relative cursor-pointer aspect-video group hover:opacity-50 transition bg-muted w-[135px] h-24  z-10'
              )}
            />
          );
        })}
      </>
    );
  }

  return (
    <div className='flex gap-2 flex-wrap'>
      {!isLoading
        ? images.map((image, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  !isLoading && setSelectedImageId(image.id);
                }}
                className={cn(
                  isLoading && ' hover:opacity-50 cursor-auto',
                  selectedImageId === image.id &&
                    'border-4 border-white  opacity-80 transition-all',
                  'relative rounded-md cursor-pointer aspect-video group hover:opacity-50 transition bg-muted w-[135px] h-24  z-10'
                )}
              >
                <Image
                  fill
                  src={image?.urls?.regular}
                  alt={'unsplash image'}
                  className='object-cover w-full h-full rounded-sm '
                />
              </div>
            );
          })
        : imageSkeleton()}

      <div className='w-full flex justify-end'>
        <Button size={'sm'} onClick={handleRefetchImages}>
          <RefreshCcw size={20} />
        </Button>
      </div>
    </div>
  );
}

export default ImagePicker;
