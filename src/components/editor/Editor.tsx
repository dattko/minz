'use client'
import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import styles from './Editor.module.scss'
import EditorToolbar from './EditorToolbar'
import { editorExtensions } from './editorExtensions'

interface LocalImage {
  id: string;
  file: File;
  url: string;
}

const Tiptap = forwardRef((props, ref) => {
  const [localImages, setLocalImages] = useState<LocalImage[]>([]);

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const id = Math.random().toString(36).substr(2, 9);
    const url = URL.createObjectURL(file);
    setLocalImages(prev => [...prev, { id, file, url }]);
    return url;
  }, []);

  const editor = useEditor({
    extensions: editorExtensions,
    immediatelyRender: false,
  })

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() || '',
    getLocalImages: () => localImages.map(img => ({
      url: img.url,
      file: img.file
    })),
    setContent: (content: string) => {
      editor?.commands.setContent(content);
    }
  }));

  return (
    <div className={styles.editor}>
      <EditorToolbar editor={editor} onImageUpload={handleImageUpload}/>
      <EditorContent editor={editor} className={styles.editor__content} />
    </div>
  )
})

Tiptap.displayName = 'Tiptap';

export default Tiptap;