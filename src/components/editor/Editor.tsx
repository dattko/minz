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
      HardBreak,
      Text,
      Underline,
      Dropcursor,
      TextStyle,
      Color,
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
    content: '<p>Hello World! 🌎️</p>',
    immediatelyRender: false,
  })

  return (
    <div className={styles.editor}>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className={styles.editor__content} />
    </div>
  )
}

export default Tiptap