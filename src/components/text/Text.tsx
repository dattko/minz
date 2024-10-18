import React from 'react';
import styles from './Text.module.scss';

type FontSize = 'xs' | 'sm' | 'm' | 'lg' | 'xl';

interface TextProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  children: React.ReactNode;
  className?: string;
  color?: string;
  fontSize?: FontSize;
  underline?: boolean;
  ellipsis?: boolean;
}

const Text: React.FC<TextProps> = ({ variant, children, color, fontSize = 'm', underline, ellipsis, className }) => {
  const Component = variant;
  return (
    <Component 
      className={`
        ${styles[variant]} 
        ${color && styles[color]} 
        ${variant === 'p' && fontSize && styles[`fontSize-${fontSize}`]} 
        ${underline && styles.underline}
        ${ellipsis && styles.ellipsis}
        ${className || ''}
      `}
    >
      {children}
    </Component>
  );
};

export default Text;
