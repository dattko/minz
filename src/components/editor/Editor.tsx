'use client'
import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import styles from './Editor.module.scss'
import EditorToolbar from './EditorToolbar'
import Blockquote from '@tiptap/extension-blockquote'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import HardBreak from '@tiptap/extension-hard-break'
import OrderedList from '@tiptap/extension-ordered-list'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CodeBlock from '@tiptap/extension-code-block'
import History from '@tiptap/extension-history'
import { FontSize } from './FontSizeExtension'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Heading,
      BulletList,
      ListItem,
      OrderedList,
      Link,
      Image,
      Blockquote,
      History,
      HardBreak,
      Text,
      Underline,
      Dropcursor,
      TextStyle,
      Color,
      CodeBlock,
      FontSize.configure(),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    immediatelyRender: false,
  })

  const handleImageUpload = async (file: File): Promise<string> => {
    // 여기에 실제 이미지 업로드 로직을 구현합니다.
    // 예: FormData를 사용하여 서버에 파일 업로드
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const { imageUrl } = await response.json();
    return imageUrl;
  };

  return (
    <div className={styles.editor}>
      <EditorToolbar editor={editor} onImageUpload={handleImageUpload}/>
      <EditorContent editor={editor} className={styles.editor__content} />
    </div>
  )
}

export default Tiptap