import React, { useCallback, useState, useEffect, useRef } from 'react'
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'

const ResizeImage: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
}) => {
  const [isResizing, setIsResizing] = useState(false)
  const [initialX, setInitialX] = useState(0)
  const [initialWidth, setInitialWidth] = useState(0)
  const [currentWidth, setCurrentWidth] = useState(node.attrs.width)
  const imageRef = useRef<HTMLImageElement>(null)
  const resizeFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const setInitialImageSize = () => {
      if (imageRef.current) {
        const img = imageRef.current;
        if (!node.attrs.width) {
          const newWidth = img.naturalWidth;
          updateAttributes({ width: newWidth });
          setInitialWidth(newWidth);
          setCurrentWidth(newWidth);
        } else {
          setInitialWidth(parseInt(node.attrs.width, 10));
          setCurrentWidth(parseInt(node.attrs.width, 10));
        }
      }
    };

    if (imageRef.current?.complete) {
      setInitialImageSize();
    } else {
      imageRef.current?.addEventListener('load', setInitialImageSize);
    }

    return () => {
      imageRef.current?.removeEventListener('load', setInitialImageSize);
    };
  }, [node.attrs.width, updateAttributes]);

  const onMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsResizing(true)
    setInitialX(event.clientX)
    setInitialWidth(imageRef.current?.offsetWidth || parseInt(node.attrs.width, 10) || 0)
  }, [node.attrs.width])

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!isResizing) return

    if (resizeFrameRef.current) {
      cancelAnimationFrame(resizeFrameRef.current)
    }

    resizeFrameRef.current = requestAnimationFrame(() => {
      const diff = event.clientX - initialX
      const newWidth = Math.max(100, initialWidth + diff) // 최소 너비를 100px로 설정
      setCurrentWidth(newWidth)
    })
  }, [isResizing, initialX, initialWidth])

  const onMouseUp = useCallback(() => {
    setIsResizing(false)
    if (resizeFrameRef.current) {
      cancelAnimationFrame(resizeFrameRef.current)
    }
    updateAttributes({ width: currentWidth })
    editor.commands.focus()
  }, [editor, currentWidth, updateAttributes])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [isResizing, onMouseMove, onMouseUp])

  return (
    <NodeViewWrapper className="resizable-image" draggable="true" data-drag-handle>
      <img
        ref={imageRef}
        src={node.attrs.src}
        alt={node.attrs.alt}
        title={node.attrs.title}
        width={currentWidth}
        style={{ 
          display: 'block', 
          width: currentWidth ? `${currentWidth}px` : 'auto', 
          height: 'auto',
          transition: isResizing ? 'none' : 'width 0.3s ease-out'
        }}
      />
      <div
        className="resize-handle"
        onMouseDown={onMouseDown}
        style={{ cursor: 'ew-resize' }}
      />
    </NodeViewWrapper>
  )
}

export default ResizeImage