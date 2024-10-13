'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import styles from './Editor.module.scss'
import EditorToolbar from './EditorToolbar'
import { uploadImage } from '@/lib/action/imageAction'
import { useImageCleanup } from '@/hooks/editor/useImageCleanup'
import { editorExtensions } from './editorExtensions'

const Tiptap = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { cleanupImages, cleanupUnusedImages } = useImageCleanup(uploadedImages, setUploadedImages);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    try {
      const base64 = await fileToBase64(file);
      const fileData = { name: file.name, type: file.type, size: file.size, base64 };
      const imageUrl = await uploadImage(fileData);
      setUploadedImages(prev => [...prev, imageUrl]);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image: ', error);
      alert(error instanceof Error ? error.message : '이미지 업로드 중 오류가 발생했습니다.');
      throw error;
    }
  }, []);

  const editor = useEditor({
    extensions: editorExtensions,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();
      const usedImages = new Set<string>();
      JSON.stringify(content, (_, value) => {
        if (typeof value === 'object' && value !== null && 'src' in value) {
          usedImages.add(value.src as string);
        }
        return value;
      });
      cleanupUnusedImages(Array.from(usedImages));
    },
  })

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (uploadedImages.length > 0) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [uploadedImages]);

  useEffect(() => {
    return () => {
      if (uploadedImages.length > 0) cleanupImages();
    };
  }, [cleanupImages, uploadedImages]);

  return (
    <div className={styles.editor}>
      <EditorToolbar editor={editor} onImageUpload={handleImageUpload}/>
      <EditorContent editor={editor} className={styles.editor__content} />
    </div>
  )
}

export default Tiptap