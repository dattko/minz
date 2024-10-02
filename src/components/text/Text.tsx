import React from 'react';
import styles from './Text.module.scss';

interface TextProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  children: React.ReactNode;
  className?: string;
}

const Text: React.FC<TextProps> = ({ variant, children, className }) => {
  const Component = variant;
  return (
    <span className={styles.text__wrap}>
      <Component className={`${styles[variant]} ${className || ''}`}>
        {children}
    </Component>
    </span>
  );
};

export default Text;