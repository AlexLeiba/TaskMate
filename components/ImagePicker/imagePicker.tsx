import { unsplash } from '@/lib/unsplash';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { DEFAULT_IMAGES } from '@/consts/images';
import { useFormContext } from 'react-hook-form';

type Props = {
  id: string;
};

function ImagePicker({ id }: Props) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const [images, setImages] = React.useState<Array<Record<string, any>>>([]);
  console.log('🚀 ~ ImagePicker ~ images:', images);

  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedImageId, setSelectedImageId] = React.useState<string | null>(
    null
  );

  async function fetchImages() {
    setIsLoading(true);
    setSelectedImageId(null);
    setValue('image', '');
    try {
      const result = await unsplash.photos.getRandom({
        collectionIds: ['317099'], //ids of a specific collection from library
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

  function handleImageClick(image: Record<string, any>) {
    if (!isLoading) {
      setSelectedImageId(image.id);

      // Add image to the form , to get data on submit action
      setValue(
        'image',
        `${image.id}|${image.urls.thumb}|${image.urls.full}|${
          image.links.html
        }|${
          image.location?.name
            ? image.location?.name
            : image.location?.country
            ? image.location?.country
            : image.user?.name
        }`
      );
    }
  }

  return (
    <div className='flex gap-2 flex-wrap'>
      {!isLoading
        ? images.map((image, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  handleImageClick(image);
                }}
                className={cn(
                  'relative',
                  isLoading && ' hover:opacity-90 cursor-auto',
                  selectedImageId === image.id &&
                    'border-2 border-white   transition-all',
                  'relative rounded-md cursor-pointer aspect-video group hover:opacity-90 transition bg-muted w-[135px] h-24  z-10'
                )}
              >
                <Image
                  fill
                  src={image?.urls?.regular}
                  alt={'unsplash image'}
                  className={cn(
                    selectedImageId === image.id &&
                      'opacity-40 group-hover:opacity-100',
                    'object-cover w-full h-full rounded-sm '
                  )}
                />
                <div
                  className={cn(
                    'w-full',
                    selectedImageId === image.id
                      ? 'opacity-100 rounded-sm bg-gray-600/60 p-1'
                      : 'opacity-0 group-hover:opacity-100 rounded-sm bg-gray-600/40 p-1',
                    ' absolute bottom-0  left-0 text-white z-20 '
                  )}
                >
                  {image.location?.name ? (
                    <p className='body-xs'>{image.location.name}</p>
                  ) : image.location.country ? (
                    <p className='body-xs'>{image.location.country}</p>
                  ) : (
                    <p className='body-xs'>Author: {image.user?.name}</p>
                  )}
                </div>
              </div>
            );
          })
        : imageSkeleton()}
      <p className='body-xs text-red-500'>{errors?.image?.message as string}</p>

      <div className='w-full flex justify-end'>
        <Button size={'sm'} onClick={handleRefetchImages} disabled={isLoading}>
          {isLoading ? (
            <div className=' flex items-center justify-center'>
              <Loader2 className='w-5 h-5 animate-spin text-white' />
            </div>
          ) : (
            <RefreshCcw size={20} />
          )}
        </Button>
      </div>
    </div>
  );
}

export default ImagePicker;
