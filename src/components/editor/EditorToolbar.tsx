import React, { useState, useRef } from 'react';
import styles from './EditorToolbar.module.scss';
import { 
  Bold, Italic, Underline, Strikethrough, Pilcrow, Heading1, Heading2, 
  List, ListOrdered, Code, Quote, Link, Image, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo
} from 'lucide-react';

interface EditorToolbarProps {
  editor: any;
  onImageUpload: (file: File) => Promise<string>;
}

interface ToolbarButton {
  icon: React.ElementType;
  command: () => void;
  isActive: boolean;
  label: string;
}

const ToggleGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`${styles.toggle_group} ${className || ''}`}>{children}</div>
);

const ToggleGroupItem: React.FC<{ value: string; onClick: () => void; isActive: boolean; children: React.ReactNode; onMouseEnter: () => void; onMouseLeave: () => void }> = 
  ({ value, onClick, isActive, children, onMouseEnter, onMouseLeave }) => (
  <button
    className={`${styles.toggle_group_item} ${isActive ? styles.active : ''}`}
    onClick={onClick}
    data-state={isActive ? 'on' : 'off'}
    value={value}
    type="button"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </button>
);

const FontSizeDropdown: React.FC<{ editor: any }> = ({ editor }) => {
  const fontSizes = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'];

  return (
    <div className={styles.font_size_dropdown}>
      <select
        onChange={(e) => {
          const size = e.target.value;
          editor.chain().focus().setNode('paragraph', {
            style: `font-size: ${size}`,
          }).run();
        }}
        value={editor.getAttributes('paragraph').style?.fontSize || ''}
      >
        <option value="">기본</option>
        {fontSizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};


const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, onImageUpload }) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) {
    return null;
  }

  const formatButtons: ToolbarButton[] = [
    { icon: Bold, command: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), label: '굵게' },
    { icon: Italic, command: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), label: '기울임' },
    { icon: Underline, command: () => editor.chain().focus().toggleUnderline().run(), isActive: editor.isActive('underline'), label: '밑줄' },
    { icon: Strikethrough, command: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive('strike'), label: '취소선' },
  ];

  const blockButtons: ToolbarButton[] = [
    { 
      icon: Pilcrow, 
      command: () => {
        editor.chain().focus().setParagraph().run(); 
      }, 
      isActive: editor.isActive('paragraph'), 
      label: '단락' 
    },
    { 
      icon: Heading1, 
      command: () => {
        editor.chain().focus().toggleHeading({ level: 1 }).run(); 
      }, 
      isActive: editor.isActive('heading', { level: 1 }), 
      label: '제목 1' 
    },
    { 
      icon: Heading2, 
      command: () => {
        editor.chain().focus().toggleHeading({ level: 2 }).run(); 
      }, 
      isActive: editor.isActive('heading', { level: 2 }), 
      label: '제목 2' 
    },
  ];
  
  const listButtons: ToolbarButton[] = [
    { icon: List, command: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), label: '글머리 기호' },
    { icon: ListOrdered, command: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), label: '번호 매기기' },
  ];

  const alignButtons: ToolbarButton[] = [
    { icon: AlignLeft, command: () => editor.chain().focus().setTextAlign('left').run(), isActive: editor.isActive({ textAlign: 'left' }), label: '왼쪽 정렬' },
    { icon: AlignCenter, command: () => editor.chain().focus().setTextAlign('center').run(), isActive: editor.isActive({ textAlign: 'center' }), label: '가운데 정렬' },
    { icon: AlignRight, command: () => editor.chain().focus().setTextAlign('right').run(), isActive: editor.isActive({ textAlign: 'right' }), label: '오른쪽 정렬' },
  ];

  const renderButtonGroup = (buttons: ToolbarButton[]) => (
    <ToggleGroup>
      {buttons.map(({ icon: Icon, command, isActive, label }) => (
        <ToggleGroupItem
          key={label}
          value={label}
          onClick={command}
          isActive={isActive}
          onMouseEnter={() => setShowTooltip(label)}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <Icon />
          {showTooltip === label && <span className={styles.tooltip}>{label}</span>}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await onImageUpload(file);
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    }
  };

  return (
    <div className={styles.toolbar}>
      {renderButtonGroup(formatButtons)}
      <ToggleGroup>
        <div 
          className={styles.color_picker_wrapper}
          onMouseEnter={() => setShowTooltip('폰트 컬러')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <input
            type="color"
            onInput={(event) => {
              const target = event.target as HTMLInputElement; 
              editor.chain().focus().setColor(target.value).run();
            }}
            value={editor.getAttributes('textStyle').color}
            data-testid="setColor"
            className={styles.input_color}
          />
          {showTooltip === '폰트 컬러' && <span className={styles.tooltip}>폰트 컬러</span>}
        </div>
      </ToggleGroup>
      <div className={styles.separator} />
      {renderButtonGroup(blockButtons)}
      <ToggleGroup>
        <div
          className={styles.font_size_wrapper}
          onMouseEnter={() => setShowTooltip('폰트 크기')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <FontSizeDropdown editor={editor} />
          {showTooltip === '폰트 크기' && <span className={styles.tooltip}>폰트 크기</span>}
        </div>
      </ToggleGroup>
      <div className={styles.separator} />
      {renderButtonGroup(listButtons)}
      <div className={styles.separator} />
      {renderButtonGroup(alignButtons)}
      <div className={styles.separator} />
      <ToggleGroup>
        <ToggleGroupItem
          value="codeBlock"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          onMouseEnter={() => setShowTooltip('코드 블록')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <Code />
          {showTooltip === '코드 블록' && <span className={styles.tooltip}>코드 블록</span>}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          onMouseEnter={() => setShowTooltip('인용구')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <Quote />
          {showTooltip === '인용구' && <span className={styles.tooltip}>인용구</span>}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="link"
          onClick={() => {
            const url = window.prompt('URL을 입력하세요:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive('link')}
          onMouseEnter={() => setShowTooltip('링크')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <Link />
          {showTooltip === '링크' && <span className={styles.tooltip}>링크</span>}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="image"
          onClick={() => fileInputRef.current?.click()}
          isActive={false}
          onMouseEnter={() => setShowTooltip('이미지')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <Image />
          {showTooltip === '이미지' && <span className={styles.tooltip}>이미지</span>}
        </ToggleGroupItem>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </ToggleGroup>
      <div className={styles.separator} />
      <ToggleGroup>
        <ToggleGroupItem
          value="undo"
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          onMouseEnter={() => setShowTooltip('실행 취소')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <Undo />
          {showTooltip === '실행 취소' && <span className={styles.tooltip}>실행 취소</span>}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="redo"
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          onMouseEnter={() => setShowTooltip('다시 실행')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <Redo />
          {showTooltip === '다시 실행' && <span className={styles.tooltip}>다시 실행</span>}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default EditorToolbar;