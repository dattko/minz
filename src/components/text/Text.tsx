import React from 'react';
import styles from './Text.module.scss';

type FontSize = 'xs' | 'sm' | 'm' | 'lg' | 'xl';

interface TextProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  children: React.ReactNode;
  className?: string;
  color?: string;
  fontSize?: FontSize;
}

const Text: React.FC<TextProps> = ({ variant, children, color, fontSize = 'm', className }) => {
  const Component = variant;
  return (
    <Component 
      className={`
        ${styles[variant]} 
        ${color && styles[color]} 
        ${fontSize && styles[`fontSize-${fontSize}`]} 
        ${className || ''}
      `}
    >
      {children}
    </Component>
  );
};

export default Text;
