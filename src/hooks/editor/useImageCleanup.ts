import { useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/supabaseClient'

export const useImageCleanup = (uploadedImages: string[], setUploadedImages: React.Dispatch<React.SetStateAction<string[]>>) => {
  const isCleaningUp = useRef(false);
  const supabase = createClient();

  const cleanupImages = useCallback(async () => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;
    
    for (const imageUrl of uploadedImages) {
      const path = imageUrl.split('/').pop();
      if (path) {
        const { error } = await supabase.storage
          .from('posts')
          .remove([path]);
        if (error) {
          console.error('Error deleting image:', error);
        }
      }
    }
    
    setUploadedImages([]);
    isCleaningUp.current = false;
  }, [uploadedImages, setUploadedImages, supabase]);

  const cleanupUnusedImages = useCallback(async (usedImages: string[]) => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;

    const unusedImages = uploadedImages.filter(url => !usedImages.includes(url));
    
    if (unusedImages.length > 0) {
      for (const imageUrl of unusedImages) {
        const path = imageUrl.split('/').pop();
        if (path) {
          const { error } = await supabase.storage
            .from('posts')
            .remove([path]);
          if (error) {
            console.error('Error deleting unused image:', error);
          }
        }
      }
      
      setUploadedImages(prev => prev.filter(url => usedImages.includes(url)));
    }

    isCleaningUp.current = false;
  }, [uploadedImages, setUploadedImages, supabase]);

  return { cleanupImages, cleanupUnusedImages };
}