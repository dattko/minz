import { useCallback, useRef } from 'react'
import { deleteImage } from '@/lib/action/imageAction'

export const useImageCleanup = (uploadedImages: string[], setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>) => {
  const isCleaningUp = useRef(false);

  const cleanupImages = useCallback(async () => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;
    
    for (const imageUrl of uploadedImages) {
      try {
        await deleteImage(imageUrl);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    setUploadedImages([]);
    isCleaningUp.current = false;
  }, [uploadedImages, setUploadedImages]);

  const cleanupUnusedImages = useCallback(async (usedImages: string[]) => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;

    const unusedImages = uploadedImages.filter(url => !usedImages.includes(url));
    
    for (const imageUrl of unusedImages) {
      try {
        await deleteImage(imageUrl);
      } catch (error) {
        console.error('Error deleting unused image:', error);
      }
    }
    
    setUploadedImages(usedImages);
    isCleaningUp.current = false;
  }, [uploadedImages, setUploadedImages]);

  return { cleanupImages, cleanupUnusedImages };
}