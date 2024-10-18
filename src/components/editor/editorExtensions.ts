import { Extensions } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Blockquote from '@tiptap/extension-blockquote'
import CustomParagraph from '@/components/layouts/CustomParagraph'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import HardBreak from '@tiptap/extension-hard-break'
import OrderedList from '@tiptap/extension-ordered-list'
import Dropcursor from '@tiptap/extension-dropcursor'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CodeBlock from '@tiptap/extension-code-block'
import History from '@tiptap/extension-history'
import { FontSize } from './FontSizeExtension'
import { Image } from './resizeImage/resize'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'


export const editorExtensions: Extensions = [
  Document,
  CustomParagraph,
  Bold,
  Italic,
  Strike,
  Heading,
  BulletList,
  ListItem,
  OrderedList,
  Blockquote,
  History,
  HardBreak.configure({
    keepMarks: false,
    HTMLAttributes: {
      class: 'my-custom-class',
    },
  }),
  Text,
  Underline,
  Dropcursor.configure({
    color: 'black',
    width: 2,
    class: 'drop-cursor',
  }),
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
]



